"""
recalculate.py — AUTOMATON Nightly Recalculation Script
Runs via GitHub Actions on a nightly cron.
Uses the Perplexity Sonar Pro API to search for latest AI news
and update job automation estimates.

Required environment variable:
  PERPLEXITY_API_KEY — your Perplexity API key
"""

import json
import os
import re
import sys
from datetime import datetime, timedelta

import requests

PERPLEXITY_API_KEY = os.environ.get("PERPLEXITY_API_KEY")
if not PERPLEXITY_API_KEY:
    print("ERROR: PERPLEXITY_API_KEY not set")
    sys.exit(1)

API_URL = "https://api.perplexity.ai/chat/completions"
MODEL = "sonar-pro"

HEADERS = {
    "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
    "Content-Type": "application/json",
}

# ------------------------------------------------------------------
# Step 1: Search for latest AI news across multiple angles
# ------------------------------------------------------------------

SEARCH_QUERIES = [
    {
        "role": "user",
        "content": (
            "What are the most significant AI announcements from the past 24 hours? "
            "Focus on: new model releases from OpenAI, Anthropic, Google DeepMind, xAI, Meta AI; "
            "major capability benchmarks or breakthroughs; and enterprise AI product launches. "
            "Be specific about what changed and why it matters."
        ),
    },
    {
        "role": "user",
        "content": (
            "What are the latest developments in AI replacing white-collar jobs in the past 24 hours? "
            "Focus on: layoff announcements tied to AI automation, companies replacing workers with AI, "
            "new AI tools for accounting, legal, coding, writing, consulting, or other knowledge work. "
            "Include any new reports from McKinsey, Goldman Sachs, WEF, or similar organizations."
        ),
    },
    {
        "role": "user",
        "content": (
            "What AI regulation or policy developments happened in the past 24 hours? "
            "Focus on: new AI legislation, executive orders, EU AI Act enforcement actions, "
            "FDA approvals for AI medical devices, or any regulatory changes that would speed up "
            "or slow down AI adoption in the workplace."
        ),
    },
]


def search_perplexity(messages: list[dict]) -> str:
    """Call Perplexity Sonar Pro for a single search query."""
    payload = {
        "model": MODEL,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are a research assistant tracking AI industry developments. "
                    "Provide specific, factual information with dates and sources. "
                    "Focus on developments from the past 24 hours."
                ),
            },
            *messages,
        ],
    }
    resp = requests.post(API_URL, headers=HEADERS, json=payload, timeout=60)
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"]


def gather_news() -> str:
    """Run all search queries and combine results."""
    results = []
    for i, query in enumerate(SEARCH_QUERIES, 1):
        print(f"  Searching ({i}/{len(SEARCH_QUERIES)})...")
        try:
            result = search_perplexity([query])
            results.append(result)
        except Exception as e:
            print(f"  Warning: Search {i} failed: {e}")
            results.append("")
    return "\n\n---\n\n".join(results)


# ------------------------------------------------------------------
# Step 2: Read current job data from app.js
# ------------------------------------------------------------------

JOBS_RE = re.compile(
    r"const JOBS\s*=\s*\[", re.MULTILINE
)


def read_current_jobs(app_js_path: str) -> list[dict]:
    """Extract the JOBS array from app.js."""
    with open(app_js_path, "r") as f:
        content = f.read()

    # Find the JOBS array and extract it as JSON-like text
    match = JOBS_RE.search(content)
    if not match:
        raise ValueError("Could not find JOBS array in app.js")

    # Find the matching closing bracket
    start = match.start()
    # Find 'const JOBS = '
    arr_start = content.index("[", start)
    depth = 0
    arr_end = arr_start
    for i in range(arr_start, len(content)):
        if content[i] == "[":
            depth += 1
        elif content[i] == "]":
            depth -= 1
            if depth == 0:
                arr_end = i + 1
                break

    raw = content[arr_start:arr_end]

    # Convert JS object notation to valid JSON
    # Add quotes around unquoted keys
    raw = re.sub(r'(\s)(\w+)(\s*:)', r'\1"\2"\3', raw)
    # Handle trailing commas before ] or }
    raw = re.sub(r",(\s*[}\]])", r"\1", raw)
    # Handle escaped quotes inside strings — replace \" with a placeholder
    raw = raw.replace('\\"', "<<ESCAPED_QUOTE>>")
    # Now parse
    raw = raw.replace("<<ESCAPED_QUOTE>>", '\\"')

    try:
        jobs = json.loads(raw)
    except json.JSONDecodeError:
        # If direct parse fails, use Perplexity to extract
        print("  Warning: Direct JSON parse failed, using fallback extraction")
        jobs = extract_jobs_with_llm(content)

    return jobs


def extract_jobs_with_llm(app_js_content: str) -> list[dict]:
    """Fallback: use Perplexity to extract job data from app.js content."""
    # Just grab the first 8000 chars which should contain all job data
    truncated = app_js_content[:8000]
    payload = {
        "model": MODEL,
        "messages": [
            {
                "role": "system",
                "content": "Extract the JOBS array data from this JavaScript file. Return ONLY valid JSON.",
            },
            {
                "role": "user",
                "content": f"Extract all job objects from this JOBS array as a JSON array. Each object should have: title, percent, range, risk, driver, detail.\n\n```\n{truncated}\n```",
            },
        ],
        "response_format": {
            "type": "json_schema",
            "json_schema": {
                "name": "jobs_array",
                "schema": {
                    "type": "object",
                    "properties": {
                        "jobs": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "title": {"type": "string"},
                                    "percent": {"type": "integer"},
                                    "range": {"type": "string"},
                                    "risk": {"type": "string"},
                                    "driver": {"type": "string"},
                                    "detail": {"type": "string"},
                                },
                                "required": [
                                    "title",
                                    "percent",
                                    "range",
                                    "risk",
                                    "driver",
                                    "detail",
                                ],
                            },
                        }
                    },
                    "required": ["jobs"],
                },
            },
        },
    }
    resp = requests.post(API_URL, headers=HEADERS, json=payload, timeout=120)
    resp.raise_for_status()
    data = json.loads(resp.json()["choices"][0]["message"]["content"])
    return data["jobs"]


# ------------------------------------------------------------------
# Step 3: Analyze news and determine updates
# ------------------------------------------------------------------

ANALYSIS_SCHEMA = {
    "type": "object",
    "properties": {
        "changes_warranted": {"type": "boolean"},
        "summary": {"type": "string"},
        "updates": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "title": {"type": "string"},
                    "new_percent": {"type": "integer"},
                    "new_range": {"type": "string"},
                    "new_risk": {"type": "string"},
                    "new_driver": {"type": "string"},
                    "new_detail": {"type": "string"},
                    "reason": {"type": "string"},
                },
                "required": [
                    "title",
                    "new_percent",
                    "new_range",
                    "new_risk",
                    "new_driver",
                    "new_detail",
                    "reason",
                ],
            },
        },
    },
    "required": ["changes_warranted", "summary", "updates"],
}


def analyze_and_update(news: str, current_jobs: list[dict]) -> dict:
    """Use Perplexity to analyze news against current data and suggest updates."""
    jobs_summary = json.dumps(current_jobs, indent=2)

    payload = {
        "model": MODEL,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are an AI labor market analyst. You compare the latest AI news against "
                    "current automation estimates for white-collar professions and determine if "
                    "any estimates should be adjusted.\n\n"
                    "RULES:\n"
                    "- Be CONSERVATIVE. Only adjust if news provides concrete evidence.\n"
                    "- Adjust percent by 1-5 points max unless a truly landmark event occurred.\n"
                    "- Shift year ranges by 1 year max per update.\n"
                    "- Risk thresholds: >65 CRITICAL, >55 HIGH, >35 MODERATE, <=35 LOW.\n"
                    "- If nothing significant happened, set changes_warranted to false.\n"
                    "- For each update, you MUST return ALL fields including new_detail "
                    "(the full paragraph description) and new_driver.\n"
                    "- Only modify professions directly impacted by the news.\n"
                    "- Quiet news days = no changes. Do NOT force updates."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"## Latest AI News (past 24 hours)\n\n{news}\n\n"
                    f"## Current Job Automation Estimates\n\n{jobs_summary}\n\n"
                    "Analyze whether any of the above professions should have their "
                    "automation estimates adjusted based on today's news. "
                    "Return a JSON object with changes_warranted (boolean), "
                    "summary (brief description of what changed), and updates (array of changes)."
                ),
            },
        ],
        "response_format": {
            "type": "json_schema",
            "json_schema": {
                "name": "analysis_result",
                "schema": ANALYSIS_SCHEMA,
            },
        },
    }

    resp = requests.post(API_URL, headers=HEADERS, json=payload, timeout=120)
    resp.raise_for_status()
    result = json.loads(resp.json()["choices"][0]["message"]["content"])
    return result


# ------------------------------------------------------------------
# Step 4: Write updated app.js
# ------------------------------------------------------------------


def apply_updates(current_jobs: list[dict], updates: list[dict]) -> list[dict]:
    """Apply the suggested updates to the current job data."""
    jobs_by_title = {job["title"]: job for job in current_jobs}

    for update in updates:
        title = update["title"]
        if title in jobs_by_title:
            job = jobs_by_title[title]
            job["percent"] = update["new_percent"]
            job["range"] = update["new_range"]
            job["risk"] = update["new_risk"]
            job["driver"] = update["new_driver"]
            job["detail"] = update["new_detail"]
            print(f"  Updated: {title} -> {update['new_percent']}% ({update['reason']})")
        else:
            print(f"  Warning: Job '{title}' not found in current data, skipping")

    return list(jobs_by_title.values())


def write_app_js(app_js_path: str, jobs: list[dict]):
    """Rewrite app.js with updated job data, preserving the rest of the file."""
    with open(app_js_path, "r") as f:
        content = f.read()

    # Find and replace the JOBS array
    match = JOBS_RE.search(content)
    if not match:
        raise ValueError("Could not find JOBS array in app.js")

    start = match.start()
    arr_start = content.index("[", start)
    depth = 0
    arr_end = arr_start
    for i in range(arr_start, len(content)):
        if content[i] == "[":
            depth += 1
        elif content[i] == "]":
            depth -= 1
            if depth == 0:
                arr_end = i + 1
                break

    # Build new JOBS array as JS
    js_jobs = "[\n"
    for i, job in enumerate(jobs):
        js_jobs += "  {\n"
        js_jobs += f'    title: "{_escape_js(job["title"])}",\n'
        js_jobs += f'    percent: {job["percent"]},\n'
        js_jobs += f'    range: "{_escape_js(job["range"])}",\n'
        js_jobs += f'    risk: "{job["risk"]}",\n'
        js_jobs += f'    driver: "{_escape_js(job["driver"])}",\n'
        js_jobs += f'    detail: "{_escape_js(job["detail"])}"\n'
        js_jobs += "  }"
        if i < len(jobs) - 1:
            js_jobs += ","
        js_jobs += "\n"
    js_jobs += "]"

    new_content = content[:arr_start] + js_jobs + content[arr_end:]

    with open(app_js_path, "w") as f:
        f.write(new_content)


def _escape_js(s: str) -> str:
    """Escape a string for inclusion in a JS string literal."""
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")


# ------------------------------------------------------------------
# Step 5: Update timestamps in index.html
# ------------------------------------------------------------------


def update_timestamps(index_html_path: str):
    """Update the 'Last updated' and 'Next scan' timestamps in index.html."""
    with open(index_html_path, "r") as f:
        content = f.read()

    today = datetime.utcnow() - timedelta(hours=8)  # Approximate PST
    tomorrow = today + timedelta(days=1)

    today_str = today.strftime("%B %-d, %Y")
    tomorrow_str = tomorrow.strftime("%B %-d, %Y")

    # Replace last updated
    content = re.sub(
        r"Last updated: .+? at 12:00 AM PST",
        f"Last updated: {today_str} at 12:00 AM PST",
        content,
    )

    # Replace next scan
    content = re.sub(
        r"Next scan: .+? at 12:00 AM PST",
        f"Next scan: {tomorrow_str} at 12:00 AM PST",
        content,
    )

    with open(index_html_path, "w") as f:
        f.write(content)


# ------------------------------------------------------------------
# Main
# ------------------------------------------------------------------


def main():
    app_js = os.path.join(os.path.dirname(__file__), "app.js")
    index_html = os.path.join(os.path.dirname(__file__), "index.html")

    print("AUTOMATON Nightly Recalculation")
    print("=" * 40)

    # 1. Gather news
    print("\n1. Gathering latest AI news...")
    news = gather_news()
    print(f"  Collected {len(news)} chars of news data")

    # 2. Read current jobs
    print("\n2. Reading current job data...")
    current_jobs = read_current_jobs(app_js)
    print(f"  Found {len(current_jobs)} professions")

    # 3. Analyze and determine updates
    print("\n3. Analyzing news against current estimates...")
    analysis = analyze_and_update(news, current_jobs)

    if not analysis["changes_warranted"]:
        print("\n  No changes warranted. Quiet news day.")
        print(f"  Summary: {analysis['summary']}")
        # Set output for GitHub Actions
        _set_github_output("changes_made", "false")
        _set_github_output("summary", analysis["summary"])
        return

    # 4. Apply updates
    print(f"\n4. Applying {len(analysis['updates'])} updates...")
    updated_jobs = apply_updates(current_jobs, analysis["updates"])

    # 5. Write updated files
    print("\n5. Writing updated files...")
    write_app_js(app_js, updated_jobs)
    update_timestamps(index_html)
    print("  Done.")

    # 6. Set outputs for GitHub Actions
    summary = analysis["summary"]
    changes = [
        f"- {u['title']}: {u['new_percent']}% ({u['reason']})"
        for u in analysis["updates"]
    ]
    change_log = "\n".join(changes)

    _set_github_output("changes_made", "true")
    _set_github_output("summary", summary)
    _set_github_output("change_log", change_log)

    print(f"\n  Summary: {summary}")
    print(f"\n  Changes:\n{change_log}")


def _set_github_output(name: str, value: str):
    """Set a GitHub Actions output variable."""
    output_file = os.environ.get("GITHUB_OUTPUT")
    if output_file:
        with open(output_file, "a") as f:
            # Handle multiline values
            if "\n" in value:
                delimiter = "EOF"
                f.write(f"{name}<<{delimiter}\n{value}\n{delimiter}\n")
            else:
                f.write(f"{name}={value}\n")


if __name__ == "__main__":
    main()

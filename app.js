/* app.js — AUTOMATON Interactive Logic */

// ============================================
// JOB DATA
// ============================================
const JOBS = [
  {
    title: "Data Entry Clerk",
    percent: 85,
    range: "2026–2028",
    risk: "CRITICAL",
    driver: "RPA + LLMs handle structured data input at scale",
    detail: "Data entry is among the most vulnerable professions. Robotic Process Automation (RPA) combined with large language models can parse, validate, and enter structured data with near-perfect accuracy. Companies are already replacing data entry teams with automated pipelines that run 24/7 at a fraction of the cost."
  },
  {
    title: "Bookkeeper",
    percent: 78,
    range: "2027–2029",
    risk: "CRITICAL",
    driver: "AI accounting platforms automate reconciliation, categorization",
    detail: "AI-powered accounting platforms like QuickBooks AI, Xero, and emerging tools can automatically categorize transactions, reconcile accounts, and flag discrepancies. The shift from manual bookkeeping to automated financial processing is accelerating rapidly, with most routine tasks already handled by software."
  },
  {
    title: "Paralegal / Legal Assistant",
    percent: 72,
    range: "2027–2030",
    risk: "CRITICAL",
    driver: "Contract review AI (Harvey, CoCounsel) at 90% accuracy",
    detail: "Legal AI tools like Harvey, CoCounsel (by Thomson Reuters), and Casetext can review contracts, conduct legal research, and draft standard documents. Stanford studies show these tools achieve 90%+ accuracy on contract review tasks. The bulk of paralegal work — document review, citation checking, and brief drafting — is increasingly automatable."
  },
  {
    title: "Customer Service Rep",
    percent: 70,
    range: "2027–2029",
    risk: "CRITICAL",
    driver: "Chatbots + voice AI handle routine queries; 60% admin automatable (IPPR)",
    detail: "AI chatbots and voice agents now handle the majority of routine customer inquiries. The Institute for Public Policy Research (IPPR) estimates 60% of administrative tasks in customer service are automatable. Companies like Klarna have already replaced hundreds of support agents with AI systems that handle millions of conversations."
  },
  {
    title: "Financial Analyst (Junior)",
    percent: 65,
    range: "2028–2031",
    risk: "HIGH",
    driver: "AI processes data and generates reports faster than humans",
    detail: "Junior financial analysts spend most of their time on data aggregation, model updates, and report generation — all tasks that AI excels at. Bloomberg Terminal AI, Excel Copilot, and specialized financial AI tools can process datasets and generate analyses in seconds. The remaining human value is in interpretation, client context, and strategic recommendations."
  },
  {
    title: "Tax Preparer",
    percent: 68,
    range: "2027–2030",
    risk: "HIGH",
    driver: "Rule-based + ML systems handle standard filings",
    detail: "Tax preparation is fundamentally rule-based, making it highly automatable. AI systems can handle standard individual and business filings, identify deductions, and flag audit risks. TurboTax and H&R Block are investing heavily in AI-first experiences. Complex tax situations and advisory work persist, but standard preparation is rapidly automating."
  },
  {
    title: "Market Research Analyst",
    percent: 62,
    range: "2028–2031",
    risk: "HIGH",
    driver: "53% of tasks automatable (Bloomberg); AI aggregates/synthesizes at scale",
    detail: "Bloomberg estimates 53% of market research tasks are automatable with current AI. LLMs can scan thousands of sources, aggregate market data, identify trends, and generate research reports. The human advantage lies in primary research design, qualitative interviews, and strategic interpretation that requires deep industry knowledge."
  },
  {
    title: "Content Writer (Copywriting)",
    percent: 60,
    range: "2028–2031",
    risk: "HIGH",
    driver: "GPT-5, Claude handle marketing copy, SEO content; human needed for strategy",
    detail: "AI writing tools now produce marketing copy, SEO content, product descriptions, and social media posts at high volume and acceptable quality. The most automatable segments are formulaic content: listicles, product reviews, press releases, and meta descriptions. Human writers retain value in brand voice development, creative strategy, thought leadership, and content that requires original reporting or deep expertise."
  },
  {
    title: "Insurance Underwriter",
    percent: 58,
    range: "2029–2032",
    risk: "HIGH",
    driver: "Automated risk modeling + claims processing",
    detail: "AI-driven underwriting platforms can assess risk profiles, analyze historical claims data, and price policies automatically for standard cases. Machine learning models outperform human underwriters on pattern detection in large datasets. Complex commercial underwriting and novel risk categories still require human judgment, but the volume of straightforward decisions handled by AI is growing rapidly."
  },
  {
    title: "HR Coordinator",
    percent: 55,
    range: "2029–2032",
    risk: "MODERATE",
    driver: "Resume screening, scheduling, onboarding automatable; empathy still needed",
    detail: "AI handles resume screening, interview scheduling, benefits enrollment, and onboarding workflows effectively. Chatbots answer routine employee questions. However, HR fundamentally involves human relationships — conflict resolution, culture building, sensitive conversations, and the empathy required for employee support. These functions are significantly harder to automate."
  },
  {
    title: "Accountant (Senior)",
    percent: 50,
    range: "2030–2034",
    risk: "MODERATE",
    driver: "Transactional work automated; advisory/strategy roles persist (McKinsey)",
    detail: "McKinsey estimates that while transactional accounting work is rapidly automating, the advisory and strategic dimensions of senior accounting — tax planning, M&A due diligence, audit judgment, and regulatory interpretation — require human expertise that AI assists but doesn't replace. Senior accountants are evolving into strategic advisors who leverage AI tools for the analytical heavy lifting."
  },
  {
    title: "Software Engineer (Junior)",
    percent: 52,
    range: "2029–2032",
    risk: "MODERATE",
    driver: "AI coding assistants (Cursor, Copilot) automate implementation; architecture still human",
    detail: "AI coding assistants like GitHub Copilot, Cursor, and Claude Code can generate boilerplate code, write tests, fix bugs, and implement features from specifications. Junior engineering tasks — implementing well-defined features, writing CRUD operations, and basic debugging — are increasingly automatable. However, system design, architectural decisions, debugging complex distributed systems, and understanding business context remain firmly in human territory."
  },
  {
    title: "Graphic Designer",
    percent: 45,
    range: "2030–2034",
    risk: "MODERATE",
    driver: "AI image gen handles production work; creative direction persists",
    detail: "AI image generation tools (Midjourney, DALL-E, Stable Diffusion) have transformed production design work — generating variations, mockups, and assets at unprecedented speed. Template-based design and asset production are highly automatable. However, brand strategy, creative direction, design systems thinking, and the ability to translate abstract business goals into visual language remain human strengths. Designers are evolving from production roles to creative direction and AI orchestration."
  },
  {
    title: "Project Manager",
    percent: 40,
    range: "2031–2035",
    risk: "MODERATE",
    driver: "AI handles scheduling, reporting; stakeholder management stays human",
    detail: "AI can automate project scheduling, resource allocation, status reporting, risk flagging, and meeting summarization. Tools like Monday.com, Asana, and specialized AI PMs handle the mechanical coordination layer. But project management is fundamentally about stakeholder management, conflict resolution, motivation, political navigation, and adapting to ambiguity — deeply human capabilities that AI supports but doesn't replace."
  },
  {
    title: "Management Consultant",
    percent: 38,
    range: "2031–2035",
    risk: "LOW",
    driver: "AI handles analysis; client relationships, judgment, persuasion remain human",
    detail: "AI dramatically accelerates the analytical core of consulting — market sizing, benchmarking, data analysis, and slide production. McKinsey, BCG, and Bain are all deploying internal AI tools. But consulting value ultimately lies in client relationships, institutional trust, organizational change management, boardroom persuasion, and the judgment to navigate political dynamics. These elements are deeply resistant to automation."
  },
  {
    title: "Software Architect",
    percent: 30,
    range: "2033–2038",
    risk: "LOW",
    driver: "System design requires deep contextual understanding; AI assists but doesn't replace",
    detail: "Software architecture requires understanding business domains, making long-term technical bets, evaluating tradeoffs between competing approaches, and designing systems that evolve over years. While AI can suggest patterns and generate diagrams, the contextual reasoning, stakeholder alignment, and strategic technical vision required for architecture remain firmly human. AI serves as a powerful research and prototyping assistant."
  },
  {
    title: "Physician (General)",
    percent: 25,
    range: "2035–2040+",
    risk: "LOW",
    driver: "AI diagnostics assist but regulatory, liability, and trust barriers slow adoption",
    detail: "AI diagnostic tools already match or exceed physician accuracy in specific domains (radiology, dermatology, pathology). However, medicine is protected by massive regulatory barriers (FDA approval, medical licensing), liability structures (malpractice law), patient trust requirements, and the need for physical examination. AI will increasingly augment physicians rather than replace them, handling diagnostic support and administrative burden while physicians focus on patient relationships and complex cases."
  },
  {
    title: "Trial Lawyer",
    percent: 22,
    range: "2035–2040+",
    risk: "LOW",
    driver: "Courtroom strategy, jury persuasion, judgment require human skill",
    detail: "While AI transforms legal research and document preparation, trial law is fundamentally a performance art — reading a jury, crafting narrative, cross-examining witnesses, and making split-second strategic decisions under pressure. The courtroom is one of the most human-centric professional environments. AI will transform back-office legal work but the trial lawyer role itself is highly resistant to full automation."
  },
  {
    title: "Executive / CEO",
    percent: 20,
    range: "2036–2040+",
    risk: "LOW",
    driver: "Strategic vision, leadership, relationship-building resist automation",
    detail: "Executive leadership is the synthesis of strategy, culture, relationships, and judgment under uncertainty. While AI can provide better data, faster analysis, and decision support, the core functions of a CEO — setting vision, building culture, managing boards, inspiring teams, navigating crises, and making high-stakes decisions with incomplete information — are profoundly human. AI makes executives more effective rather than replacing them."
  },
  {
    title: "Therapist / Counselor",
    percent: 15,
    range: "2038–2045+",
    risk: "LOW",
    driver: "Deep empathy, human connection, ethical judgment; regulatory barriers",
    detail: "Therapy is fundamentally built on the therapeutic relationship — a deeply human bond of trust, empathy, and genuine understanding. While AI chatbots (Woebot, Wysa) provide useful mental health support tools, they cannot replicate the nuanced, embodied presence of a human therapist. Regulatory frameworks, ethical considerations around AI in mental health, and the irreducible human need for genuine connection make this one of the most automation-resistant professions."
  }
];

// ============================================
// SOURCES DATA
// ============================================
const SOURCES = [
  {
    name: "McKinsey Global Institute",
    title: "Generative AI and the Future of Work in America (2023)",
    url: "https://www.mckinsey.com/mgi/our-research/generative-ai-and-the-future-of-work-in-america"
  },
  {
    name: "Goldman Sachs",
    title: "AI could automate 25% of work tasks, affecting 300M jobs globally by 2030",
    url: null
  },
  {
    name: "World Economic Forum",
    title: "Future of Jobs Report 2025",
    url: "https://www.weforum.org/publications/the-future-of-jobs-report-2025/digest/"
  },
  {
    name: "Microsoft AI CEO Mustafa Suleyman",
    title: "\"Most white-collar tasks automated in 18 months\" (Feb 2026)",
    url: "https://fortune.com/2026/02/13/when-will-ai-kill-white-collar-office-jobs-18-months-microsoft-mustafa-suleyman/"
  },
  {
    name: "Anthropic CEO Dario Amodei",
    title: "AI could drive unemployment up 10-20%, \"eliminate most entry-level white collar jobs\" (May 2025)",
    url: null
  },
  {
    name: "Forbes",
    title: "The Jobs That Will Fall First (Apr 2025)",
    url: "https://www.forbes.com/sites/jackkelly/2025/04/25/the-jobs-that-will-fall-first-as-ai-takes-over-the-workplace/"
  },
  {
    name: "The Atlantic",
    title: "America Isn't Ready (Feb 2026)",
    url: "https://www.theatlantic.com/magazine/2026/03/ai-economy-labor-market-transformation/685731/"
  }
];

const METHODOLOGY = `Our model weighs three factors: (1) Current AI capability benchmarks for task categories within each profession, (2) Rate of improvement across frontier labs over the trailing 12 months, (3) Historical adoption curves for enterprise technology. Tasks are classified as automatable when AI can perform them at or above median human quality with less than 10% error rate.`;

const RECALC_NOTE = `Estimates are recalculated nightly at 12:00 AM Pacific Time by scanning the latest announcements from OpenAI, Anthropic, Google DeepMind, xAI, Meta AI, and trusted industry sources including McKinsey, Goldman Sachs, World Economic Forum, and major tech publications.`;

// ============================================
// STATE
// ============================================
let currentSort = 'risk';
let searchTerm = '';
let animatedCards = new Set();

// ============================================
// RISK ORDER
// ============================================
const RISK_ORDER = { CRITICAL: 0, HIGH: 1, MODERATE: 2, LOW: 3 };

// ============================================
// RENDER
// ============================================
function getFilteredSorted() {
  let filtered = JOBS;

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = JOBS.filter(j => j.title.toLowerCase().includes(term));
  }

  filtered = [...filtered];

  if (currentSort === 'risk') {
    filtered.sort((a, b) => RISK_ORDER[a.risk] - RISK_ORDER[b.risk] || b.percent - a.percent);
  } else if (currentSort === 'percent') {
    filtered.sort((a, b) => b.percent - a.percent);
  } else if (currentSort === 'title') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  return filtered;
}

function riskToBadgeClass(risk) {
  return 'badge-' + risk.toLowerCase();
}

function riskToFillClass(risk) {
  return 'fill-' + risk.toLowerCase();
}

function renderCards() {
  const grid = document.getElementById('job-grid');
  const empty = document.getElementById('empty-state');
  const countEl = document.getElementById('visible-count');
  const jobs = getFilteredSorted();

  countEl.textContent = jobs.length;

  if (jobs.length === 0) {
    grid.style.display = 'none';
    empty.style.display = 'flex';
    empty.style.flexDirection = 'column';
    empty.style.alignItems = 'center';
    return;
  }

  grid.style.display = 'grid';
  empty.style.display = 'none';

  grid.innerHTML = jobs.map((job, i) => `
    <article class="job-card" role="listitem" data-risk="${job.risk}" data-index="${JOBS.indexOf(job)}" style="animation-delay: ${i * 50}ms;">
      <div class="job-card-header">
        <h2 class="job-title">${job.title}</h2>
        <span class="badge ${riskToBadgeClass(job.risk)}">${job.risk}</span>
      </div>
      <div class="progress-container">
        <div class="progress-label">
          <span class="progress-percent">${job.percent}%</span>
          <span class="progress-sublabel">tasks automatable</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill ${riskToFillClass(job.risk)}" style="--fill-width: ${job.percent}%;" data-target="${job.percent}"></div>
        </div>
      </div>
      <div class="job-card-footer">
        <span class="est-range"><span class="est-range-label">Est.</span> ${job.range}</span>
        <button class="details-btn" onclick="openModal(${JOBS.indexOf(job)})" aria-label="View details for ${job.title}">
          <i data-lucide="info" style="width:14px;height:14px;"></i>
          Details
        </button>
      </div>
    </article>
  `).join('');

  // Re-init Lucide icons in new cards
  if (window.lucide) {
    lucide.createIcons();
  }

  // Trigger progress bar animations
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.querySelectorAll('.progress-fill').forEach(fill => {
        fill.setAttribute('data-animated', 'true');
      });
    });
  });

  // Re-observe for scroll animations
  observeCards();
}

// ============================================
// SCROLL ANIMATION (IntersectionObserver fallback)
// ============================================
let observer;

function observeCards() {
  // Only use IO if scroll-driven animations not supported
  if (CSS.supports && CSS.supports('animation-timeline', 'scroll()')) return;

  if (observer) observer.disconnect();

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.job-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(card);
  });
}

// ============================================
// MODAL
// ============================================
function openModal(index) {
  const job = JOBS[index];
  const modal = document.getElementById('detail-modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  title.textContent = job.title;

  const sourcesHTML = SOURCES.map(s => {
    if (s.url) {
      return `<li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.name}: ${s.title}</a></li>`;
    }
    return `<li><span style="color:var(--color-text-muted);">${s.name}: ${s.title}</span></li>`;
  }).join('');

  const riskColor = {
    CRITICAL: 'var(--color-error)',
    HIGH: 'var(--color-warning)',
    MODERATE: 'var(--color-purple)',
    LOW: 'var(--color-success)'
  };

  body.innerHTML = `
    <div class="modal-stats">
      <div class="modal-stat">
        <span class="modal-stat-value" style="color:${riskColor[job.risk]}">${job.percent}%</span>
        <span class="modal-stat-label">Automatable</span>
      </div>
      <div class="modal-stat">
        <span class="modal-stat-value">${job.range}</span>
        <span class="modal-stat-label">Full Automation</span>
      </div>
      <div class="modal-stat">
        <span class="modal-stat-value badge ${riskToBadgeClass(job.risk)}" style="font-size:var(--text-sm);">${job.risk}</span>
        <span class="modal-stat-label">Risk Level</span>
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Automation Trajectory</div>
      <p>${job.detail}</p>
      <p><strong style="color:var(--color-text);">Key driver:</strong> ${job.driver}</p>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Sources</div>
      <ul class="source-list" role="list">
        ${sourcesHTML}
      </ul>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Methodology</div>
      <p>${METHODOLOGY}</p>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Recalculation Schedule</div>
      <p>${RECALC_NOTE}</p>
    </div>
  `;

  // Re-init icons in modal
  if (window.lucide) {
    lucide.createIcons();
  }

  modal.showModal();
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('detail-modal');
  document.body.style.overflow = '';
  modal.close();
}

// ============================================
// EVENT LISTENERS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Init Lucide
  if (window.lucide) {
    lucide.createIcons();
  }

  // Render initial cards
  renderCards();

  // Search
  const searchInput = document.getElementById('search-input');
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchTerm = e.target.value.trim();
      renderCards();
    }, 200);
  });

  // Sort buttons
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSort = btn.dataset.sort;
      renderCards();
    });
  });

  // Modal close
  document.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', closeModal);
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('detail-modal');
      if (modal.open) {
        closeModal();
      }
    }
  });
});

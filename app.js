/* app.js — AUTOMATON Interactive Logic */

// ============================================
// JOB DATA
// ============================================
const JOBS = [
  {
    title: "Data Entry Clerk",
    percent: 92,
    range: "2025-2026",
    risk: "CRITICAL",
    driver: "GPT-5.4 native computer-use automates Excel/Sheets natively; record OSWorld/WebArena; RPA + LLMs + Block layoffs",
    detail: "GPT-5.4's native integration with Excel/Google Sheets and computer control (screenshots/mouse/keyboard) enables full automation of data input, validation, and manipulation in real apps. Record scores in OSWorld-Verified and WebArena Verified benchmarks confirm desktop navigation surpassing humans. Builds on RPA/LLMs; Block's 40% AI layoffs confirm replacement acceleration.[1][3][4]"
  },
  {
    title: "Bookkeeper",
    percent: 88,
    range: "2025-2027",
    risk: "CRITICAL",
    driver: "GPT-5.4 Excel/Sheets automation, reconciliation agents; 83% GDPval; Goldman + Block",
    detail: "GPT-5.4's computer-use capabilities automate reconciliation, categorization in Excel/Sheets directly. 1M context handles large ledgers; agentic workflows flag discrepancies; 83% on GDPval for knowledge work. Goldman Sachs forecasts and Block's layoffs signal rapid shift.[1][3][4]"
  },
  {
    title: "Paralegal / Legal Assistant",
    percent: 77,
    range: "2025-2028",
    risk: "CRITICAL",
    driver: "GPT-5.4 1M context for doc review, agentic workflows; APEX-Agents law; 33% fewer errors",
    detail: "GPT-5.4's 1M token context and reduced hallucinations (33% fewer errors) enhance contract review/research; agentic tools integrate with legal apps via computer-use; leads Mercor APEX-Agents for legal analysis. Builds on prior tools' accuracy.[1][3][4]"
  },
  {
    title: "Customer Service Rep",
    percent: 74,
    range: "2025–2028",
    risk: "CRITICAL",
    driver: "GPT-5.3 Instant reduced refusals/hallucinations for queries; GPT-5.4 agentic; Block",
    detail: "GPT-5.3 Instant improves factual responses/web synthesis with fewer refusals; GPT-5.4 enables agentic handling of complex queries. Supports 24/7 automation of routine inquiries; Block efficiencies align.[2][4]"
  },
  {
    title: "Financial Analyst (Junior)",
    percent: 75,
    range: "2025-2029",
    risk: "HIGH",
    driver: "GPT-5.4 1M context for data/models, computer-use for Excel; 83% GDPval + APEX-Agents finance; Goldman + Block",
    detail: "GPT-5.4 excels in professional knowledge work (83% GDPval), with 1M tokens for aggregating datasets/models and computer-use for Excel analysis/reporting; leads APEX-Agents for finance skills like financial models. Automates data aggregation and report generation; Goldman/Block confirm finance acceleration.[1][3][4]"
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
    percent: 60,
    range: "2028–2032",
    risk: "HIGH",
    driver: "Resume screening, scheduling, onboarding automatable; Block AI enables 40% flatter teams",
    detail: "AI handles resume screening, interview scheduling, benefits enrollment, and onboarding workflows effectively. Chatbots answer routine employee questions. Block's 40% workforce reduction via AI-paired smaller teams explicitly demonstrates automation of administrative HR functions, though empathy persists.[1][4]"
  },
  {
    title: "Accountant (Senior)",
    percent: 53,
    range: "2030–2034",
    risk: "MODERATE",
    driver: "Transactional work automated; advisory persists but Goldman/Block signal faster shift",
    detail: "McKinsey estimates that while transactional accounting work is rapidly automating, advisory and strategic dimensions require human expertise that AI assists. Goldman Sachs flags accounting as highly automatable with monthly losses; Block efficiencies and Suleyman's 12-18 month timeline indicate faster encroachment on senior transactional tasks.[1][4]"
  },
  {
    title: "Software Engineer (Junior)",
    percent: 59,
    range: "2026-2030",
    risk: "HIGH",
    driver: "GPT-5.4 native computer-use, outperforms coding specialists, record OSWorld/WebArena; agentic dev workflows; Block AI efficiencies",
    detail: "GPT-5.4 introduces native computer-use (Excel/Sheets, Playwright, mouse/keyboard via screenshots), 1M token context, and record OSWorld/WebArena benchmarks, automating implementation, debugging, and tool-heavy workflows in IDEs. Outperforms prior coding specialists; supports enterprise agentic systems for routine junior engineering.[1][3][4]"
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
    detail: "AI can automate project scheduling, resource allocation, status reporting, risk flagging, and meeting summarization. Tools like Monday.com, As"
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

const acts = [
  {
    code: "BNS",
    name: "Bharatiya Nyaya Sanhita",
    year: 2023,
    effectiveDate: "2024-07-01",
    category: "Core Criminal Reform",
    replaced: "Indian Penal Code, 1860",
    summary: "Defines offences and punishments under India's updated criminal law framework.",
    tags: ["criminal law", "offences", "punishment"],
    link: "https://www.indiacode.nic.in/"
  },
  {
    code: "BNSS",
    name: "Bharatiya Nagarik Suraksha Sanhita",
    year: 2023,
    effectiveDate: "2024-07-01",
    category: "Core Criminal Reform",
    replaced: "Code of Criminal Procedure, 1973",
    summary: "Lays out criminal procedure including FIR, arrest, investigation, bail and trial.",
    tags: ["procedure", "arrest", "investigation", "bail"],
    link: "https://www.indiacode.nic.in/"
  },
  {
    code: "BSA",
    name: "Bharatiya Sakshya Adhiniyam",
    year: 2023,
    effectiveDate: "2024-07-01",
    category: "Core Criminal Reform",
    replaced: "Indian Evidence Act, 1872",
    summary: "Governs admissibility and evaluation of evidence, including electronic and digital records.",
    tags: ["evidence", "digital evidence", "admissibility"],
    link: "https://www.indiacode.nic.in/"
  },
  {
    code: "IT Act",
    name: "Information Technology Act",
    year: 2000,
    effectiveDate: "2000-10-17",
    category: "Cyber & Digital",
    replaced: "-",
    summary: "Addresses cyber offences, e-records, digital signatures, and intermediary responsibilities.",
    tags: ["cybercrime", "privacy", "electronic records"],
    link: "https://www.indiacode.nic.in/"
  },
  {
    code: "POCSO",
    name: "Protection of Children from Sexual Offences Act",
    year: 2012,
    effectiveDate: "2012-11-14",
    category: "Special Criminal Laws",
    replaced: "-",
    summary: "Special legislation for sexual offences against children with child-friendly procedures.",
    tags: ["children", "special court", "sexual offences"],
    link: "https://www.indiacode.nic.in/"
  },
  {
    code: "NDPS",
    name: "Narcotic Drugs and Psychotropic Substances Act",
    year: 1985,
    effectiveDate: "1985-11-14",
    category: "Special Criminal Laws",
    replaced: "-",
    summary: "Regulates narcotic drugs and psychotropic substances with strict control and penalties.",
    tags: ["narcotics", "search", "seizure", "bail"],
    link: "https://www.indiacode.nic.in/"
  },
  {
    code: "UAPA",
    name: "Unlawful Activities (Prevention) Act",
    year: 1967,
    effectiveDate: "1967-12-30",
    category: "National Security",
    replaced: "-",
    summary: "Law concerning unlawful activities and terrorism-related offences.",
    tags: ["national security", "terror", "special procedure"],
    link: "https://www.indiacode.nic.in/"
  }
];

const state = {
  query: "",
  category: "All",
  sortBy: "name-asc"
};

const categories = ["All", ...new Set(acts.map((act) => act.category))];

function formatDate(isoDate) {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  });
}

function createCard(act) {
  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
    <h3>${act.code} — ${act.name}, ${act.year}</h3>
    <div class="meta">Category: ${act.category} • Effective: ${formatDate(act.effectiveDate)}</div>
    <div class="map">Replaced / Related legacy law: ${act.replaced}</div>
    <p>${act.summary}</p>
    <div class="tags">${act.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
    <a href="${act.link}" target="_blank" rel="noopener noreferrer">Open official text</a>
  `;
  return card;
}

function createQuickCards() {
  const quickLinks = [
    {
      title: "BNS ↔ IPC mapping",
      text: "Track offence/section migration from IPC to BNS in your next version."
    },
    {
      title: "BNSS procedure tracker",
      text: "Add step-wise flow for FIR, charge sheet, bail, trial timelines."
    },
    {
      title: "BSA evidence checklist",
      text: "Create digital evidence admissibility and chain-of-custody checklists."
    }
  ];

  const container = document.getElementById("quickLinks");
  container.innerHTML = "";
  quickLinks.forEach((item) => {
    const card = document.createElement("article");
    card.className = "quick-card";
    card.innerHTML = `<h3>${item.title}</h3><p>${item.text}</p>`;
    container.appendChild(card);
  });
}

function createFilters() {
  const wrapper = document.getElementById("filters");
  wrapper.innerHTML = "";

  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.className = `filter-btn ${category === state.category ? "active" : ""}`;
    btn.type = "button";
    btn.textContent = category;
    btn.addEventListener("click", () => {
      state.category = category;
      createFilters();
      render();
    });
    wrapper.appendChild(btn);
  });
}

function applyFiltersAndSort() {
  const filtered = acts.filter((act) => {
    const matchesCategory = state.category === "All" || act.category === state.category;
    const haystack = [act.code, act.name, act.summary, act.category, ...act.tags].join(" ").toLowerCase();
    const matchesQuery = haystack.includes(state.query);
    return matchesCategory && matchesQuery;
  });

  const sorted = [...filtered];
  if (state.sortBy === "name-asc") sorted.sort((a, b) => a.name.localeCompare(b.name));
  if (state.sortBy === "name-desc") sorted.sort((a, b) => b.name.localeCompare(a.name));
  if (state.sortBy === "year-asc") sorted.sort((a, b) => a.year - b.year);
  if (state.sortBy === "year-desc") sorted.sort((a, b) => b.year - a.year);

  return sorted;
}

function render() {
  const list = applyFiltersAndSort();
  const grid = document.getElementById("actsGrid");
  const empty = document.getElementById("emptyState");
  const meta = document.getElementById("resultsMeta");

  grid.innerHTML = "";
  list.forEach((act) => grid.appendChild(createCard(act)));

  meta.textContent = `Showing ${list.length} act(s) • Filter: ${state.category} • Sort: ${state.sortBy}`;
  empty.classList.toggle("hidden", list.length > 0);
}

function setupListeners() {
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");

  searchInput.addEventListener("input", (event) => {
    state.query = event.target.value.trim().toLowerCase();
    render();
  });

  sortSelect.addEventListener("change", (event) => {
    state.sortBy = event.target.value;
    render();
  });
}

createQuickCards();
createFilters();
setupListeners();
render();

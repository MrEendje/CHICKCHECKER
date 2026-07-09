// ---------------------------------------------------------------------------
// De vragenlijst is een verzameling categorieën. Elke categorie start met een
// "gate"-vraag; afhankelijk van het antwoord kan een dieper liggende
// vervolgvraag ("branches") worden gesteld — soms wel 2-3 niveaus diep. Een
// duidelijk positief antwoord sluit een categorie meteen af, een twijfelachtig
// of zorgwekkend antwoord opent een vertakking om preciezer te worden. Daardoor
// hangt het totale aantal gestelde vragen (en niet alleen de antwoorden) echt
// af van hoe iemand antwoordt — het aantal categorieën ligt vast, de diepte
// per categorie niet.
//
// Elk knooppunt heeft:
//   text        - de vraag
//   weight      - hoe zwaar hij meetelt in de score
//   goodOnYes   - of "Ja" de gewenste/groene-vlag-richting is
//   trait       - (optioneel) { value, on } tagt een profieltrek als het
//                 antwoord in "on" staat, gebruikt voor de type-uitkomst
//   branches    - (optioneel) { yes, no, unsure } naar een dieper knooppunt
function buildCategories() {
  return [
    {
      id: "humor",
      label: "Humor",
      node: {
        text: "Maakt ze je regelmatig aan het lachen?",
        weight: 1,
        goodOnYes: true,
      },
    },
    {
      id: "chemie",
      label: "Aantrekkingskracht",
      node: {
        text: "Voel je oprechte chemie als jullie samen zijn?",
        weight: 1,
        goodOnYes: true,
      },
    },
    {
      id: "ambitie",
      label: "Ambitie",
      node: {
        text: "Heeft ze een baan, studie of duidelijk doel in haar leven?",
        weight: 1,
        goodOnYes: true,
        trait: { value: "ambitious", on: ["yes"] },
      },
    },
    {
      id: "financien",
      label: "Financiën",
      node: (() => {
        const patroon = {
          text: "Is dit een terugkerend patroon, geen incident?",
          weight: 2,
          goodOnYes: false,
          trait: { value: "redflag", on: ["yes", "unsure"] },
        };
        return {
          text: "Heeft ze vaak geldproblemen of leent ze regelmatig geld van anderen?",
          weight: 2,
          goodOnYes: false,
          trait: { value: "redflag", on: ["yes"] },
          branches: { yes: patroon, unsure: patroon },
        };
      })(),
    },
    {
      id: "ex",
      label: "Ex-gedrag",
      node: (() => {
        const vergelijkt = {
          text: "Vergelijkt ze jou vaak (bewust of onbewust) met die ex?",
          weight: 3,
          goodOnYes: false,
          trait: { value: "redflag", on: ["yes", "unsure"] },
        };
        const gevoelens = {
          text: "Lijkt ze nog gevoelens voor die ex te hebben?",
          weight: 3,
          goodOnYes: false,
          trait: { value: "redflag", on: ["yes", "unsure"] },
          branches: { yes: vergelijkt, unsure: vergelijkt },
        };
        return {
          text: "Praat ze vaak over haar ex?",
          weight: 2,
          goodOnYes: false,
          trait: { value: "guarded", on: ["yes"] },
          branches: { yes: gevoelens, unsure: gevoelens },
        };
      })(),
    },
    {
      id: "respect",
      label: "Respect naar anderen",
      node: (() => {
        const patroon = {
          text: "Heb je dit vaker dan één keer gezien?",
          weight: 2,
          goodOnYes: false,
          trait: { value: "redflag", on: ["yes", "unsure"] },
        };
        return {
          text: "Behandelt ze anderen (bijv. bediening) met respect?",
          weight: 1,
          goodOnYes: true,
          trait: { value: "caretaker", on: ["yes"] },
          branches: { no: patroon, unsure: patroon },
        };
      })(),
    },
    {
      id: "communicatie",
      label: "Communicatie",
      node: (() => {
        const patroon = {
          text: "Gebeurt dit vaker dan één keer per week?",
          weight: 2,
          goodOnYes: false,
          trait: { value: "redflag", on: ["yes", "unsure"] },
        };
        return {
          text: "Laat ze je vaak wachten zonder bericht te sturen?",
          weight: 2,
          goodOnYes: false,
          branches: { yes: patroon, unsure: patroon },
        };
      })(),
    },
    {
      id: "interesse",
      label: "Interesse in jou",
      node: {
        text: "Toont ze oprechte interesse in jouw leven en hobby's?",
        weight: 1,
        goodOnYes: true,
        trait: { value: "caretaker", on: ["yes"] },
      },
    },
    {
      id: "leugen",
      label: "Eerlijkheid",
      node: (() => {
        const ernst = {
          text: "Ging het om iets belangrijks (bijv. andere mannen of geld), niet een onschuldig leugentje?",
          weight: 3,
          goodOnYes: false,
          trait: { value: "redflag", on: ["yes", "unsure"] },
        };
        return {
          text: "Heb je haar weleens op een leugen betrapt?",
          weight: 2,
          goodOnYes: false,
          branches: { yes: ernst, unsure: ernst },
        };
      })(),
    },
    {
      id: "ruzie",
      label: "Conflicthantering",
      node: {
        text: "Kunnen jullie het oneens zijn zonder dat het meteen escaleert?",
        weight: 1,
        goodOnYes: true,
        trait: { value: "steady", on: ["yes"] },
      },
    },
    {
      id: "grenzen",
      label: "Grenzen respecteren",
      node: {
        text: "Accepteert ze het zonder morren als jij een grens aangeeft?",
        weight: 2,
        goodOnYes: true,
        trait: { value: "steady", on: ["yes"] },
      },
    },
    {
      id: "verantwoordelijkheid",
      label: "Verantwoordelijkheid",
      node: {
        text: "Neemt ze verantwoordelijkheid als ze een fout maakt, in plaats van het af te schuiven?",
        weight: 2,
        goodOnYes: true,
        trait: { value: "steady", on: ["yes"] },
      },
    },
    {
      id: "emotie",
      label: "Emotionele openheid",
      node: (() => {
        const afstand = {
          text: "Merk je dat ze afstand houdt, zelfs als je er expliciet naar vraagt?",
          weight: 2,
          goodOnYes: false,
          trait: { value: "guarded", on: ["yes", "unsure"] },
        };
        return {
          text: "Praat ze open met jou over haar gevoelens?",
          weight: 1,
          goodOnYes: true,
          branches: { no: afstand, unsure: afstand },
        };
      })(),
    },
    {
      id: "luisteren",
      label: "Luisteren",
      node: {
        text: "Heb je het gevoel dat ze echt naar je luistert?",
        weight: 1,
        goodOnYes: true,
        trait: { value: "caretaker", on: ["yes"] },
      },
    },
    {
      id: "jaloezie",
      label: "Jaloezie & controle",
      node: (() => {
        const telefoon = {
          text: "Heeft ze weleens je telefoon gecheckt of naar je wachtwoorden gevraagd?",
          weight: 3,
          goodOnYes: false,
          trait: { value: "redflag", on: ["yes", "unsure"] },
        };
        const controle = {
          text: "Probeert ze te bepalen met wie jij mag omgaan?",
          weight: 3,
          goodOnYes: false,
          trait: { value: "redflag", on: ["yes", "unsure"] },
          branches: { yes: telefoon, unsure: telefoon },
        };
        return {
          text: "Is ze weleens overdreven jaloers of controlerend geweest?",
          weight: 2,
          goodOnYes: false,
          branches: { yes: controle, unsure: controle },
        };
      })(),
    },
    {
      id: "middelen",
      label: "Alcohol/middelengebruik",
      node: (() => {
        const patroon = {
          text: "Was dit al meerdere keren een probleem tijdens jullie afspraken?",
          weight: 2,
          goodOnYes: false,
          trait: { value: "redflag", on: ["yes", "unsure"] },
        };
        return {
          text: "Drinkt ze naar jouw idee te veel of te vaak op een zorgwekkende manier?",
          weight: 2,
          goodOnYes: false,
          branches: { yes: patroon, unsure: patroon },
        };
      })(),
    },
    {
      id: "eigen-leven",
      label: "Eigen leven",
      node: {
        text: "Heeft ze een eigen leven naast jullie (vriendenkring, hobby's), in plaats van volledig op te gaan in jou?",
        weight: 1,
        goodOnYes: true,
        trait: { value: "independent", on: ["yes"] },
      },
    },
    {
      id: "sociale-kring",
      label: "Vriendenkring",
      node: (() => {
        const drama = {
          text: "Heeft ze vaak drama of ruzie binnen haar vriendengroep?",
          weight: 2,
          goodOnYes: false,
          trait: { value: "redflag", on: ["yes", "unsure"] },
        };
        return {
          text: "Heeft ze een stabiele, gezonde vriendenkring?",
          weight: 1,
          goodOnYes: true,
          branches: { no: drama, unsure: drama },
        };
      })(),
    },
    {
      id: "familie",
      label: "Familieband",
      node: {
        text: "Heeft ze een gezonde band met haar familie?",
        weight: 1,
        goodOnYes: true,
        trait: { value: "steady", on: ["yes"] },
      },
    },
    {
      id: "avontuur",
      label: "Spontaniteit",
      node: {
        text: "Staat ze open voor nieuwe ervaringen en spontane plannen?",
        weight: 1,
        goodOnYes: true,
        trait: { value: "adventurous", on: ["yes"] },
      },
    },
    {
      id: "onzekerheid",
      label: "Onzekerheid",
      node: (() => {
        const uiting = {
          text: "Uit zich dat bijvoorbeeld in veel appjes sturen als je niet snel reageert, of jaloerse opmerkingen?",
          weight: 2,
          goodOnYes: false,
          trait: { value: "insecure", on: ["yes", "unsure"] },
        };
        return {
          text: "Heeft ze regelmatig bevestiging nodig over of je wel van haar houdt?",
          weight: 1,
          goodOnYes: false,
          trait: { value: "insecure", on: ["yes"] },
          branches: { yes: uiting, unsure: uiting },
        };
      })(),
    },
    {
      id: "stress",
      label: "Stressbestendigheid",
      node: {
        text: "Blijft ze redelijk kalm en volwassen onder stress of tegenslag?",
        weight: 1,
        goodOnYes: true,
        trait: { value: "steady", on: ["yes"] },
      },
    },
    {
      id: "toekomst",
      label: "Toekomstplannen",
      node: {
        text: "Lijken jullie toekomstplannen (settelen, kinderen, wonen) op elkaar?",
        weight: 1,
        goodOnYes: true,
      },
    },
    {
      id: "moeder",
      label: "Gut-check",
      node: {
        text: "Zou je haar zonder twijfel aan je moeder voorstellen?",
        weight: 2,
        goodOnYes: true,
      },
    },
  ];
}

const CATEGORIES = buildCategories();

const TRAIT_INFO = {
  independent: {
    emoji: "🦋",
    title: "De Vrije Vlinder",
    desc: "Ze heeft een eigen leven, vrienden en bezigheden, en gaat niet volledig in een relatie op.",
  },
  caretaker: {
    emoji: "🤝",
    title: "De Zorgzame Verbinder",
    desc: "Ze is gericht op verbinding: ze luistert, toont interesse en denkt aan anderen.",
  },
  ambitious: {
    emoji: "🚀",
    title: "De Ambitieuze Doorzetter",
    desc: "Duidelijke doelen en discipline staan bij haar voorop.",
  },
  redflag: {
    emoji: "🚩",
    title: "Rode-Vlaggen-Centrale",
    desc: "Er kwamen meerdere zorgwekkende patronen naar voren, zoals controle, oneerlijkheid of jaloezie.",
  },
  guarded: {
    emoji: "📕",
    title: "Het Gesloten Boek",
    desc: "Ze houdt haar gevoelens en gedachten liever voor zichzelf — lastiger om echt dichtbij te komen.",
  },
  adventurous: {
    emoji: "🌍",
    title: "De Avonturier",
    desc: "Spontaan en op zoek naar nieuwe ervaringen — weinig fan van vaste routines.",
  },
  steady: {
    emoji: "🪨",
    title: "De Stabiele Rots",
    desc: "Consistent, betrouwbaar en met beide benen op de grond.",
  },
  insecure: {
    emoji: "🤔",
    title: "De Onzekere Twijfelaar",
    desc: "Ze heeft regelmatig bevestiging nodig en is gevoelig voor onzekerheid.",
  },
};

const STORAGE_KEY = "chickchecker_progress_v3";
const MAX_BREAKDOWN_ITEMS = 4;

let state = null;

const screens = {
  welcome: document.getElementById("screen-welcome"),
  quiz: document.getElementById("screen-quiz"),
  result: document.getElementById("screen-result"),
};

const el = {
  inputName: document.getElementById("input-name"),
  btnStart: document.getElementById("btn-start"),
  btnYes: document.getElementById("btn-yes"),
  btnNo: document.getElementById("btn-no"),
  btnUnsure: document.getElementById("btn-unsure"),
  btnQuit: document.getElementById("btn-quit"),
  btnRestart: document.getElementById("btn-restart"),
  questionText: document.getElementById("question-text"),
  questionCount: document.getElementById("question-count"),
  questionTotal: document.getElementById("question-total"),
  progressFill: document.getElementById("progress-fill"),
  resultFor: document.getElementById("result-for"),
  resultEmoji: document.getElementById("result-emoji"),
  resultTitle: document.getElementById("result-title"),
  scoreCircle: document.getElementById("score-circle"),
  scorePercent: document.getElementById("score-percent"),
  resultFlags: document.getElementById("result-flags"),
  archetypeEmoji: document.getElementById("archetype-emoji"),
  archetypeTitle: document.getElementById("archetype-title"),
  archetypeDesc: document.getElementById("archetype-desc"),
  resultMessage: document.getElementById("result-message"),
  breakdownStrengths: document.getElementById("breakdown-strengths"),
  breakdownConcerns: document.getElementById("breakdown-concerns"),
};

function showScreen(name) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[name].classList.add("active");
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function clearProgress() {
  localStorage.removeItem(STORAGE_KEY);
}

function loadProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function startQuiz() {
  state = {
    name: el.inputName.value.trim(),
    categoryIndex: 0,
    node: CATEGORIES[0].node,
    earned: 0,
    total: 0,
    greenFlags: 0,
    history: [],
    traitTally: {},
  };
  saveProgress();
  renderQuestion();
  showScreen("quiz");
}

function renderQuestion() {
  el.questionText.textContent = state.node.text;
  el.questionCount.textContent = state.categoryIndex + 1;
  el.questionTotal.textContent = CATEGORIES.length;
  el.progressFill.style.width = `${(state.categoryIndex / CATEGORIES.length) * 100}%`;
}

function answer(value) {
  // value: "yes" | "no" | "unsure"
  const node = state.node;
  const label = CATEGORIES[state.categoryIndex].label;
  const rawFraction = value === "yes" ? 1 : value === "no" ? 0 : 0.5;
  const creditFraction = node.goodOnYes ? rawFraction : 1 - rawFraction;

  state.earned += node.weight * creditFraction;
  state.total += node.weight;
  if (creditFraction >= 1) state.greenFlags++;
  state.history.push({ label, weight: node.weight, creditFraction });

  if (node.trait && node.trait.on.includes(value)) {
    state.traitTally[node.trait.value] = (state.traitTally[node.trait.value] || 0) + node.weight;
  }

  const nextNode = node.branches && node.branches[value];

  if (nextNode) {
    state.node = nextNode;
    saveProgress();
    renderQuestion();
    return;
  }

  state.categoryIndex++;

  if (state.categoryIndex >= CATEGORIES.length) {
    el.progressFill.style.width = "100%";
    clearProgress();
    showResult();
  } else {
    state.node = CATEGORIES[state.categoryIndex].node;
    saveProgress();
    renderQuestion();
  }
}

function getVerdict(pct) {
  if (pct >= 80) {
    return {
      emoji: "💚",
      title: "Groen licht",
      message: "De signalen zijn overwegend positief. Dit is een gezonde basis om verder te verkennen.",
    };
  }
  if (pct >= 60) {
    return {
      emoji: "🙂",
      title: "Redelijk positief",
      message: "Er is een goede basis, met een paar aandachtspunten. Waag de date, maar houd de punten hieronder in de gaten.",
    };
  }
  if (pct >= 40) {
    return {
      emoji: "😐",
      title: "Gemengd beeld",
      message: "Sterke en zwakke punten houden elkaar ongeveer in evenwicht. Neem de aandachtspunten hieronder serieus voordat je verder gaat.",
    };
  }
  if (pct >= 20) {
    return {
      emoji: "⚠️",
      title: "Meerdere rode vlaggen",
      message: "Er zijn meerdere serieuze aandachtspunten naar voren gekomen. Wees voorzichtig en weeg goed af of dit is wat je zoekt.",
    };
  }
  return {
    emoji: "🚩",
    title: "Duidelijk rood signaal",
    message: "De signalen wijzen overwegend op problematisch gedrag. Dit is geen goede basis voor een gezonde relatie.",
  };
}

function getArchetype() {
  const entries = Object.entries(state.traitTally);
  if (entries.length === 0) return TRAIT_INFO.steady;
  entries.sort((a, b) => b[1] - a[1]);
  return TRAIT_INFO[entries[0][0]];
}

function renderBreakdownList(container, items, emptyText) {
  container.innerHTML = "";

  if (items.length === 0) {
    const li = document.createElement("li");
    li.className = "breakdown-empty";
    li.textContent = emptyText;
    container.appendChild(li);
    return;
  }

  items.forEach((label) => {
    const li = document.createElement("li");
    li.textContent = label;
    container.appendChild(li);
  });
}

function showResult() {
  const pct = Math.round((state.earned / state.total) * 100);
  const verdict = getVerdict(pct);
  const archetype = getArchetype();

  el.resultFor.textContent = state.name ? `Resultaat voor ${state.name}` : "Jouw resultaat";
  el.resultEmoji.textContent = verdict.emoji;
  el.resultTitle.textContent = verdict.title;
  el.resultMessage.textContent = verdict.message;
  el.resultFlags.textContent = `${state.greenFlags} van ${state.history.length} groene vlaggen`;
  el.scorePercent.textContent = `${pct}%`;
  el.scoreCircle.style.setProperty("--pct", pct);

  el.archetypeEmoji.textContent = archetype.emoji;
  el.archetypeTitle.textContent = `Type: ${archetype.title}`;
  el.archetypeDesc.textContent = archetype.desc;

  const uniqueLabels = (predicate, sortKey) => {
    const seen = new Set();
    return state.history
      .filter(predicate)
      .sort((a, b) => sortKey(b) - sortKey(a))
      .map((h) => h.label)
      .filter((label) => {
        if (seen.has(label)) return false;
        seen.add(label);
        return true;
      })
      .slice(0, MAX_BREAKDOWN_ITEMS);
  };

  const strengths = uniqueLabels(
    (h) => h.creditFraction === 1,
    (h) => h.weight
  );
  const concerns = uniqueLabels(
    (h) => h.creditFraction < 1,
    (h) => h.weight * (1 - h.creditFraction)
  );

  renderBreakdownList(el.breakdownStrengths, strengths, "Geen bijzondere sterke punten naar voren gekomen.");
  renderBreakdownList(el.breakdownConcerns, concerns, "Geen bijzondere aandachtspunten naar voren gekomen.");

  showScreen("result");
}

function restart() {
  clearProgress();
  state = null;
  el.inputName.value = "";
  showScreen("welcome");
}

el.btnStart.addEventListener("click", startQuiz);
el.btnYes.addEventListener("click", () => answer("yes"));
el.btnNo.addEventListener("click", () => answer("no"));
el.btnUnsure.addEventListener("click", () => answer("unsure"));
el.btnRestart.addEventListener("click", restart);
el.btnQuit.addEventListener("click", () => {
  if (confirm("Weet je zeker dat je wilt stoppen? Je voortgang gaat dan verloren.")) {
    restart();
  }
});

// Resume an in-progress check after a refresh/accidental close.
const resumed = loadProgress();
if (resumed && resumed.categoryIndex < CATEGORIES.length) {
  state = resumed;
  renderQuestion();
  showScreen("quiz");
}

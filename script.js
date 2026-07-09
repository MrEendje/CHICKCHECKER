// Elke vraag heeft een "weight" (hoe zwaar hij meetelt), "goodOnYes"
// (of "Ja" de gewenste/groene-vlag-richting is) en een "label" (korte
// categorienaam voor de sterke-/zwaktepunten-analyse aan het einde).
// Rode vlaggen wegen zwaarder dan gewone groene-vlag-vragen. Sommige
// vragen hebben een "followUp": die wordt alleen ingevoegd als het
// antwoord in followUp.on staat (bijv. een "Ja" of "Weet niet" op een
// rode-vlag-vraag triggert een verdiepende vervolgvraag).
const QUESTION_BANK = [
  {
    id: "humor",
    label: "Humor",
    text: "Maakt ze je regelmatig aan het lachen?",
    weight: 1,
    goodOnYes: true,
  },
  {
    id: "chemie",
    label: "Aantrekkingskracht",
    text: "Voel je oprechte chemie als jullie samen zijn?",
    weight: 1,
    goodOnYes: true,
  },
  {
    id: "ambitie",
    label: "Ambitie",
    text: "Heeft ze een baan, studie of duidelijk doel in haar leven?",
    weight: 1,
    goodOnYes: true,
  },
  {
    id: "financien",
    label: "Financiën",
    text: "Heeft ze vaak geldproblemen of leent ze regelmatig geld van anderen?",
    weight: 2,
    goodOnYes: false,
    followUp: {
      on: ["yes", "unsure"],
      question: {
        id: "financien-patroon",
        label: "Financiën",
        text: "Is dit een terugkerend patroon, geen incident?",
        weight: 2,
        goodOnYes: false,
      },
    },
  },
  {
    id: "ex",
    label: "Ex-gedrag",
    text: "Praat ze vaak over haar ex?",
    weight: 2,
    goodOnYes: false,
    followUp: {
      on: ["yes", "unsure"],
      question: {
        id: "ex-gevoelens",
        label: "Ex-gedrag",
        text: "Lijkt ze nog gevoelens voor die ex te hebben?",
        weight: 3,
        goodOnYes: false,
      },
    },
  },
  {
    id: "respect",
    label: "Respect naar anderen",
    text: "Behandelt ze anderen (bijv. bediening) met respect?",
    weight: 1,
    goodOnYes: true,
    followUp: {
      on: ["no", "unsure"],
      question: {
        id: "respect-patroon",
        label: "Respect naar anderen",
        text: "Heb je dit vaker dan één keer gezien?",
        weight: 2,
        goodOnYes: false,
      },
    },
  },
  {
    id: "communicatie",
    label: "Communicatie",
    text: "Laat ze je vaak wachten zonder bericht te sturen?",
    weight: 2,
    goodOnYes: false,
    followUp: {
      on: ["yes", "unsure"],
      question: {
        id: "communicatie-patroon",
        label: "Communicatie",
        text: "Gebeurt dit vaker dan één keer per week?",
        weight: 2,
        goodOnYes: false,
      },
    },
  },
  {
    id: "interesse",
    label: "Interesse in jou",
    text: "Toont ze oprechte interesse in jouw leven en hobby's?",
    weight: 1,
    goodOnYes: true,
  },
  {
    id: "leugen",
    label: "Eerlijkheid",
    text: "Heb je haar weleens op een leugen betrapt?",
    weight: 2,
    goodOnYes: false,
    followUp: {
      on: ["yes", "unsure"],
      question: {
        id: "leugen-ernst",
        label: "Eerlijkheid",
        text: "Ging het om iets belangrijks (bijv. andere mannen of geld), niet een onschuldig leugentje?",
        weight: 3,
        goodOnYes: false,
      },
    },
  },
  {
    id: "ruzie",
    label: "Conflicthantering",
    text: "Kunnen jullie het oneens zijn zonder dat het meteen escaleert?",
    weight: 1,
    goodOnYes: true,
  },
  {
    id: "grenzen",
    label: "Grenzen respecteren",
    text: "Accepteert ze het zonder morren als jij een grens aangeeft?",
    weight: 2,
    goodOnYes: true,
  },
  {
    id: "verantwoordelijkheid",
    label: "Verantwoordelijkheid",
    text: "Neemt ze verantwoordelijkheid als ze een fout maakt, in plaats van het af te schuiven?",
    weight: 2,
    goodOnYes: true,
  },
  {
    id: "emotie",
    label: "Emotionele openheid",
    text: "Praat ze open met jou over haar gevoelens?",
    weight: 1,
    goodOnYes: true,
    followUp: {
      on: ["no", "unsure"],
      question: {
        id: "emotie-afstand",
        label: "Emotionele openheid",
        text: "Merk je dat ze afstand houdt, zelfs als je er expliciet naar vraagt?",
        weight: 2,
        goodOnYes: false,
      },
    },
  },
  {
    id: "luisteren",
    label: "Luisteren",
    text: "Heb je het gevoel dat ze echt naar je luistert?",
    weight: 1,
    goodOnYes: true,
  },
  {
    id: "jaloezie",
    label: "Jaloezie & controle",
    text: "Is ze weleens overdreven jaloers of controlerend geweest?",
    weight: 2,
    goodOnYes: false,
    followUp: {
      on: ["yes", "unsure"],
      question: {
        id: "controle",
        label: "Jaloezie & controle",
        text: "Probeert ze te bepalen met wie jij mag omgaan?",
        weight: 3,
        goodOnYes: false,
      },
    },
  },
  {
    id: "middelen",
    label: "Alcohol/middelengebruik",
    text: "Drinkt ze naar jouw idee te veel of te vaak op een zorgwekkende manier?",
    weight: 2,
    goodOnYes: false,
    followUp: {
      on: ["yes", "unsure"],
      question: {
        id: "middelen-patroon",
        label: "Alcohol/middelengebruik",
        text: "Was dit al meerdere keren een probleem tijdens jullie afspraken?",
        weight: 2,
        goodOnYes: false,
      },
    },
  },
  {
    id: "eigen-leven",
    label: "Eigen leven",
    text: "Heeft ze een eigen leven naast jullie (vriendenkring, hobby's), in plaats van volledig op te gaan in jou?",
    weight: 1,
    goodOnYes: true,
  },
  {
    id: "toekomst",
    label: "Toekomstplannen",
    text: "Lijken jullie toekomstplannen (settelen, kinderen, wonen) op elkaar?",
    weight: 1,
    goodOnYes: true,
  },
  {
    id: "moeder",
    label: "Gut-check",
    text: "Zou je haar zonder twijfel aan je moeder voorstellen?",
    weight: 2,
    goodOnYes: true,
  },
];

const STORAGE_KEY = "chickchecker_progress_v2";
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
    queue: QUESTION_BANK.map((q) => ({ ...q })),
    pointer: 0,
    earned: 0,
    total: 0,
    greenFlags: 0,
    history: [],
  };
  saveProgress();
  renderQuestion();
  showScreen("quiz");
}

function renderQuestion() {
  const q = state.queue[state.pointer];
  el.questionText.textContent = q.text;
  el.questionCount.textContent = state.pointer + 1;
  el.questionTotal.textContent = state.queue.length;
  el.progressFill.style.width = `${(state.pointer / state.queue.length) * 100}%`;
}

function answer(value) {
  // value: "yes" | "no" | "unsure"
  const q = state.queue[state.pointer];
  const rawFraction = value === "yes" ? 1 : value === "no" ? 0 : 0.5;
  const creditFraction = q.goodOnYes ? rawFraction : 1 - rawFraction;

  state.earned += q.weight * creditFraction;
  state.total += q.weight;
  if (creditFraction >= 1) state.greenFlags++;
  state.history.push({ label: q.label, weight: q.weight, creditFraction });

  if (q.followUp && q.followUp.on.includes(value)) {
    state.queue.splice(state.pointer + 1, 0, { ...q.followUp.question });
  }

  state.pointer++;

  if (state.pointer >= state.queue.length) {
    el.progressFill.style.width = "100%";
    clearProgress();
    showResult();
  } else {
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

function renderBreakdownList(container, items, emptyText) {
  container.innerHTML = "";
  container.classList.add("breakdown-list");

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

  el.resultFor.textContent = state.name ? `Resultaat voor ${state.name}` : "Jouw resultaat";
  el.resultEmoji.textContent = verdict.emoji;
  el.resultTitle.textContent = verdict.title;
  el.resultMessage.textContent = verdict.message;
  el.resultFlags.textContent = `${state.greenFlags} van ${state.queue.length} groene vlaggen`;
  el.scorePercent.textContent = `${pct}%`;
  el.scoreCircle.style.setProperty("--pct", pct);

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
if (resumed && resumed.pointer < resumed.queue.length) {
  state = resumed;
  renderQuestion();
  showScreen("quiz");
}

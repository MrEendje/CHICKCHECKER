// ---------------------------------------------------------------------------
// De vragenlijst is een pool van categorieën. Elke sessie trekt daar (seeded
// random) een selectie uit, afhankelijk van de gekozen modus, en husselt de
// volgorde. Elke categorie start met een "gate"-vraag; afhankelijk van het
// antwoord kan een dieper liggende vervolgvraag ("branches") worden gesteld —
// soms wel 2-3 niveaus diep. Een duidelijk positief antwoord sluit een
// categorie meteen af, een twijfelachtig of zorgwekkend antwoord opent een
// vertakking om preciezer te worden.
//
// Elke categorie heeft:
//   id, label   - sleutel en naam in de uitslag
//   dim         - thema (zie DIMENSIONS) voor de score-per-thema
//   core        - (optioneel) zit in elke sessie, ongeacht modus
//   final       - (optioneel) altijd als laatste vraag
//   node        - de gate-vraag
//
// Elk knooppunt heeft:
//   text        - de vraag, of een array van formuleringen (per sessie wordt
//                 er één gekozen). Tokens: {ze} {Ze} {haar} {zijn} {Zijn}
//                 worden ingevuld op basis van haar/hem (zie PRONOUNS).
//   weight      - hoe zwaar hij meetelt in de score
//   goodOnYes   - of "Ja" de gewenste/groene-vlag-richting is
//   trait       - (optioneel) { value, on } tagt een profieltrek als het
//                 antwoord in "on" staat, gebruikt voor de type-uitkomst
//   dealbreaker - (optioneel) een volledig fout antwoord hier verlaagt het
//                 eindoordeel, hoe hoog het percentage ook is
//   branches    - (optioneel) { yes, no, unsure } naar een dieper knooppunt
function buildCategories() {
  return [
    // ---------- Klik & fun ----------
    {
      id: "humor",
      label: "Humor",
      dim: "klik",
      node: {
        text: [
          "Maakt {ze} je regelmatig aan het lachen?",
          "Heb je lol met {haar}, ook om de kleinste dingen?",
          "Kun je met {haar} lachen tot je buikpijn hebt?",
        ],
        weight: 1,
        goodOnYes: true,
        trait: { value: "fun", on: ["yes"] },
      },
    },
    {
      id: "chemie",
      label: "Aantrekkingskracht",
      dim: "klik",
      node: {
        text: [
          "Voel je oprechte chemie als jullie samen zijn?",
          "Krijg je nog steeds vlinders als je {haar} ziet?",
          "Is er echt een klik tussen jullie, niet alleen op papier?",
        ],
        weight: 1,
        goodOnYes: true,
        trait: { value: "fun", on: ["yes"] },
      },
    },
    {
      id: "avontuur",
      label: "Spontaniteit",
      dim: "klik",
      node: {
        text: [
          "Staat {ze} open voor nieuwe ervaringen en spontane plannen?",
          "Zou {ze} ja zeggen tegen een spontane roadtrip?",
        ],
        weight: 1,
        goodOnYes: true,
        trait: { value: "adventurous", on: ["yes"] },
      },
    },
    {
      id: "complimenten",
      label: "Waardering",
      dim: "klik",
      node: {
        text: [
          "Geeft {ze} je weleens spontaan een compliment?",
          "Laat {ze} merken dat {ze} je waardeert?",
        ],
        weight: 1,
        goodOnYes: true,
        trait: { value: "caretaker", on: ["yes"] },
      },
    },
    {
      id: "gedeeld",
      label: "Gedeelde interesses",
      dim: "klik",
      node: {
        text: [
          "Hebben jullie dingen die jullie allebei écht leuk vinden om samen te doen?",
          "Hebben jullie gedeelde interesses of hobby's?",
        ],
        weight: 1,
        goodOnYes: true,
        trait: { value: "adventurous", on: ["yes"] },
      },
    },
    {
      id: "initiatief",
      label: "Initiatief",
      dim: "klik",
      node: (() => {
        const eenzijdig = {
          text: "Voelt het alsof jij altijd degene bent die de eerste stap moet zetten?",
          weight: 2,
          goodOnYes: false,
          trait: { value: "guarded", on: ["yes", "unsure"] },
        };
        return {
          text: [
            "Neemt {ze} zelf ook initiatief om af te spreken of te appen?",
            "Komt {ze} ook weleens zelf met een voorstel om iets te doen?",
          ],
          weight: 1,
          goodOnYes: true,
          branches: { no: eenzijdig, unsure: eenzijdig },
        };
      })(),
    },
    {
      id: "energie",
      label: "Hoe je je voelt",
      dim: "klik",
      node: (() => {
        const uitgeput = {
          text: "Voel je je na jullie contact juist vaker onzeker, gespannen of uitgeput?",
          weight: 2,
          goodOnYes: false,
          trait: { value: "redflag", on: ["yes"] },
        };
        return {
          text: [
            "Voel je je beter over jezelf na een date met {haar}?",
            "Ga je meestal met een goed gevoel naar huis na jullie afspraken?",
          ],
          weight: 2,
          goodOnYes: true,
          branches: { no: uitgeput, unsure: uitgeput },
        };
      })(),
    },

    // ---------- Communicatie ----------
    {
      id: "communicatie",
      label: "Bereikbaarheid",
      dim: "communicatie",
      node: (() => {
        const patroon = {
          text: "Gebeurt dit vaker dan één keer per week?",
          weight: 2,
          goodOnYes: false,
          trait: { value: "redflag", on: ["yes", "unsure"] },
        };
        return {
          text: [
            "Laat {ze} je vaak wachten zonder bericht te sturen?",
            "Verdwijnt {ze} weleens urenlang of dagen van de radar zonder uitleg?",
          ],
          weight: 2,
          goodOnYes: false,
          trait: { value: "guarded", on: ["yes"] },
          branches: { yes: patroon, unsure: patroon },
        };
      })(),
    },
    {
      id: "interesse",
      label: "Interesse in jou",
      dim: "communicatie",
      node: {
        text: [
          "Toont {ze} oprechte interesse in jouw leven en hobby's?",
          "Stelt {ze} je vragen over jou, en onthoudt {ze} de antwoorden?",
        ],
        weight: 1,
        goodOnYes: true,
        trait: { value: "caretaker", on: ["yes"] },
      },
    },
    {
      id: "ruzie",
      label: "Conflicthantering",
      dim: "communicatie",
      node: (() => {
        const escalatie = {
          text: "Wordt {ze} dan gemeen, schreeuwerig, of straft {ze} je met stilte?",
          weight: 2,
          goodOnYes: false,
          trait: { value: "redflag", on: ["yes", "unsure"] },
        };
        return {
          text: [
            "Kunnen jullie het oneens zijn zonder dat het meteen escaleert?",
            "Kan een meningsverschil met {haar} gewoon rustig uitgepraat worden?",
          ],
          weight: 1,
          goodOnYes: true,
          trait: { value: "steady", on: ["yes"] },
          branches: { no: escalatie, unsure: escalatie },
        };
      })(),
    },
    {
      id: "emotie",
      label: "Emotionele openheid",
      dim: "communicatie",
      node: (() => {
        const afstand = {
          text: "Merk je dat {ze} afstand houdt, zelfs als je er expliciet naar vraagt?",
          weight: 2,
          goodOnYes: false,
          trait: { value: "guarded", on: ["yes", "unsure"] },
        };
        return {
          text: [
            "Praat {ze} open met jou over {zijn} gevoelens?",
            "Laat {ze} {zijn} kwetsbare kant weleens aan je zien?",
          ],
          weight: 1,
          goodOnYes: true,
          branches: { no: afstand, unsure: afstand },
        };
      })(),
    },
    {
      id: "luisteren",
      label: "Luisteren",
      dim: "communicatie",
      node: {
        text: [
          "Heb je het gevoel dat {ze} echt naar je luistert?",
          "Voel je je gehoord als je {haar} iets belangrijks vertelt?",
        ],
        weight: 1,
        goodOnYes: true,
        trait: { value: "caretaker", on: ["yes"] },
      },
    },
    {
      id: "telefoon",
      label: "Aandacht tijdens dates",
      dim: "communicatie",
      node: {
        text: [
          "Zit {ze} tijdens jullie dates constant op {zijn} telefoon?",
          "Heb je het gevoel dat {zijn} telefoon meer aandacht krijgt dan jij?",
        ],
        weight: 1,
        goodOnYes: false,
      },
    },
    {
      id: "steunen",
      label: "Steun",
      dim: "communicatie",
      node: (() => {
        const ikke = {
          text: "Maakt {ze} het dan eerder over zichzelf?",
          weight: 2,
          goodOnYes: false,
          trait: { value: "redflag", on: ["yes"] },
        };
        return {
          text: [
            "Steunt {ze} jou als het even tegenzit?",
            "Is {ze} er voor je als je een rotdag hebt?",
          ],
          weight: 2,
          goodOnYes: true,
          trait: { value: "caretaker", on: ["yes"] },
          branches: { no: ikke, unsure: ikke },
        };
      })(),
    },

    // ---------- Vertrouwen ----------
    {
      id: "ex",
      label: "Ex-gedrag",
      dim: "vertrouwen",
      node: (() => {
        const vergelijkt = {
          text: "Vergelijkt {ze} jou vaak (bewust of onbewust) met die ex?",
          weight: 3,
          goodOnYes: false,
          trait: { value: "redflag", on: ["yes", "unsure"] },
        };
        const gevoelens = {
          text: [
            "Lijkt {ze} nog gevoelens voor die ex te hebben?",
            "Heb je het idee dat {ze} nog niet over die ex heen is?",
          ],
          weight: 3,
          goodOnYes: false,
          trait: { value: "redflag", on: ["yes", "unsure"] },
          branches: { yes: vergelijkt, unsure: vergelijkt },
        };
        return {
          text: [
            "Praat {ze} vaak over {zijn} ex?",
            "Komt {zijn} ex opvallend vaak ter sprake?",
          ],
          weight: 2,
          goodOnYes: false,
          trait: { value: "guarded", on: ["yes"] },
          branches: { yes: gevoelens, unsure: gevoelens },
        };
      })(),
    },
    {
      id: "leugen",
      label: "Eerlijkheid",
      dim: "vertrouwen",
      core: true,
      node: (() => {
        const ernst = {
          text: "Ging het om iets belangrijks (bijv. andere dates of geld), niet een onschuldig leugentje?",
          weight: 3,
          goodOnYes: false,
          dealbreaker: true,
          trait: { value: "redflag", on: ["yes", "unsure"] },
        };
        return {
          text: [
            "Heb je {haar} weleens op een leugen betrapt?",
            "Heeft {ze} je weleens aantoonbaar voorgelogen?",
          ],
          weight: 2,
          goodOnYes: false,
          branches: { yes: ernst, unsure: ernst },
        };
      })(),
    },
    {
      id: "jaloezie",
      label: "Jaloezie & controle",
      dim: "vertrouwen",
      core: true,
      node: (() => {
        const telefoon = {
          text: "Heeft {ze} weleens je telefoon gecheckt of naar je wachtwoorden gevraagd?",
          weight: 3,
          goodOnYes: false,
          dealbreaker: true,
          trait: { value: "redflag", on: ["yes", "unsure"] },
        };
        const controle = {
          text: "Probeert {ze} te bepalen met wie jij mag omgaan?",
          weight: 3,
          goodOnYes: false,
          dealbreaker: true,
          trait: { value: "redflag", on: ["yes", "unsure"] },
          branches: { yes: telefoon, unsure: telefoon },
        };
        return {
          text: [
            "Is {ze} weleens overdreven jaloers of controlerend geweest?",
            "Reageert {ze} heftig als jij met iemand anders praat of afspreekt?",
          ],
          weight: 2,
          goodOnYes: false,
          branches: { yes: controle, unsure: controle },
        };
      })(),
    },
    {
      id: "onzekerheid",
      label: "Onzekerheid",
      dim: "vertrouwen",
      node: (() => {
        const uiting = {
          text: "Uit zich dat bijvoorbeeld in veel appjes sturen als je niet snel reageert, of jaloerse opmerkingen?",
          weight: 2,
          goodOnYes: false,
          trait: { value: "insecure", on: ["yes", "unsure"] },
        };
        return {
          text: [
            "Heeft {ze} regelmatig bevestiging nodig over of je {haar} wel leuk vindt?",
            "Moet je {haar} vaak geruststellen dat het goed zit tussen jullie?",
          ],
          weight: 1,
          goodOnYes: false,
          trait: { value: "insecure", on: ["yes"] },
          branches: { yes: uiting, unsure: uiting },
        };
      })(),
    },
    {
      id: "geheim",
      label: "Openheid over zichzelf",
      dim: "vertrouwen",
      node: (() => {
        const ontwijkt = {
          text: "Ontwijkt {ze} het als je er gewoon rustig naar vraagt?",
          weight: 2,
          goodOnYes: false,
          trait: { value: "redflag", on: ["yes", "unsure"] },
        };
        return {
          text: [
            "Is {ze} vaag of geheimzinnig over waar {ze} uithangt?",
            "Heb je vaak geen idee wat {ze} eigenlijk aan het doen is?",
          ],
          weight: 1,
          goodOnYes: false,
          trait: { value: "guarded", on: ["yes"] },
          branches: { yes: ontwijkt, unsure: ontwijkt },
        };
      })(),
    },
    {
      id: "gaslighting",
      label: "Aan jezelf twijfelen",
      dim: "vertrouwen",
      core: true,
      node: (() => {
        const vaker = {
          text: "Gebeurde dat meer dan eens?",
          weight: 3,
          goodOnYes: false,
          dealbreaker: true,
          trait: { value: "redflag", on: ["yes", "unsure"] },
        };
        return {
          text: [
            "Heb je weleens het gevoel dat {ze} dingen verdraait zodat jij aan jezelf gaat twijfelen?",
            "Zegt {ze} weleens dat iets 'nooit zo gebeurd is', terwijl jij het zeker weet?",
          ],
          weight: 2,
          goodOnYes: false,
          branches: { yes: vaker, unsure: vaker },
        };
      })(),
    },
    {
      id: "lovebomb",
      label: "Tempo in het begin",
      dim: "vertrouwen",
      node: (() => {
        const kil = {
          text: "Werd {ze} kil of afstandelijk toen jij niet meteen in dat tempo meeging?",
          weight: 3,
          goodOnYes: false,
          dealbreaker: true,
          trait: { value: "redflag", on: ["yes", "unsure"] },
        };
        return {
          text: [
            "Ging het in het begin opvallend snel en intens (overdreven veel aandacht, 'soulmate'-praat)?",
            "Voelde het begin bijna té perfect, met een stortvloed aan aandacht en cadeautjes?",
          ],
          weight: 1,
          goodOnYes: false,
          branches: { yes: kil, unsure: kil },
        };
      })(),
    },

    // ---------- Stabiliteit ----------
    {
      id: "ambitie",
      label: "Ambitie",
      dim: "stabiliteit",
      node: {
        text: [
          "Heeft {ze} een baan, studie of duidelijk doel in {zijn} leven?",
          "Weet {ze} een beetje waar {ze} naartoe wil in het leven?",
        ],
        weight: 1,
        goodOnYes: true,
        trait: { value: "ambitious", on: ["yes"] },
      },
    },
    {
      id: "financien",
      label: "Financiën",
      dim: "stabiliteit",
      node: (() => {
        const patroon = {
          text: "Is dit een terugkerend patroon, geen incident?",
          weight: 2,
          goodOnYes: false,
          trait: { value: "redflag", on: ["yes", "unsure"] },
        };
        return {
          text: [
            "Heeft {ze} vaak geldproblemen of leent {ze} regelmatig geld van anderen?",
            "Zit {ze} vaak krap en vraagt {ze} dan om geld, ook aan jou?",
          ],
          weight: 2,
          goodOnYes: false,
          trait: { value: "redflag", on: ["yes"] },
          branches: { yes: patroon, unsure: patroon },
        };
      })(),
    },
    {
      id: "verantwoordelijkheid",
      label: "Verantwoordelijkheid",
      dim: "stabiliteit",
      node: {
        text: [
          "Neemt {ze} verantwoordelijkheid als {ze} een fout maakt, in plaats van het af te schuiven?",
          "Kan {ze} gewoon 'sorry, mijn fout' zeggen?",
        ],
        weight: 2,
        goodOnYes: true,
        trait: { value: "steady", on: ["yes"] },
      },
    },
    {
      id: "middelen",
      label: "Alcohol/middelengebruik",
      dim: "stabiliteit",
      node: (() => {
        const patroon = {
          text: "Was dit al meerdere keren een probleem tijdens jullie afspraken?",
          weight: 2,
          goodOnYes: false,
          trait: { value: "redflag", on: ["yes", "unsure"] },
        };
        return {
          text: [
            "Drinkt {ze} naar jouw idee te veel of te vaak op een zorgwekkende manier?",
            "Maak je je weleens zorgen over {zijn} alcohol- of drugsgebruik?",
          ],
          weight: 2,
          goodOnYes: false,
          branches: { yes: patroon, unsure: patroon },
        };
      })(),
    },
    {
      id: "sociale-kring",
      label: "Vriendenkring",
      dim: "stabiliteit",
      node: (() => {
        const drama = {
          text: "Heeft {ze} vaak drama of ruzie binnen {zijn} vriendengroep?",
          weight: 2,
          goodOnYes: false,
          trait: { value: "redflag", on: ["yes", "unsure"] },
        };
        return {
          text: [
            "Heeft {ze} een stabiele, gezonde vriendenkring?",
            "Heeft {ze} vrienden die {ze} al jaren kent?",
          ],
          weight: 1,
          goodOnYes: true,
          branches: { no: drama, unsure: drama },
        };
      })(),
    },
    {
      id: "familie",
      label: "Familieband",
      dim: "stabiliteit",
      node: {
        text: [
          "Heeft {ze} een gezonde band met {zijn} familie?",
          "Praat {ze} met warmte of respect over {zijn} familie?",
        ],
        weight: 1,
        goodOnYes: true,
        trait: { value: "steady", on: ["yes"] },
      },
    },
    {
      id: "stress",
      label: "Stressbestendigheid",
      dim: "stabiliteit",
      node: {
        text: [
          "Blijft {ze} redelijk kalm en volwassen onder stress of tegenslag?",
          "Kan {ze} een tegenvaller hebben zonder dat de hele dag verpest is?",
        ],
        weight: 1,
        goodOnYes: true,
        trait: { value: "steady", on: ["yes"] },
      },
    },
    {
      id: "toekomst",
      label: "Toekomstplannen",
      dim: "stabiliteit",
      node: {
        text: [
          "Lijken jullie toekomstplannen (settelen, kinderen, wonen) op elkaar?",
          "Willen jullie ongeveer hetzelfde van de toekomst?",
        ],
        weight: 1,
        goodOnYes: true,
      },
    },
    {
      id: "afspraken",
      label: "Betrouwbaarheid",
      dim: "stabiliteit",
      node: (() => {
        const lastMinute = {
          text: "Zegt {ze} vaak op het laatste moment af?",
          weight: 2,
          goodOnYes: false,
          trait: { value: "redflag", on: ["yes"] },
        };
        return {
          text: [
            "Komt {ze} afspraken na, ook de kleine?",
            "Kun je erop rekenen dat {ze} doet wat {ze} zegt?",
          ],
          weight: 1,
          goodOnYes: true,
          trait: { value: "steady", on: ["yes"] },
          branches: { no: lastMinute, unsure: lastMinute },
        };
      })(),
    },
    {
      id: "humeur",
      label: "Stemmingen",
      dim: "stabiliteit",
      node: (() => {
        const eieren = {
          text: "Heb je daardoor het gevoel dat je op eieren moet lopen?",
          weight: 3,
          goodOnYes: false,
          trait: { value: "redflag", on: ["yes", "unsure"] },
        };
        return {
          text: [
            "Heeft {ze} vaak onvoorspelbare stemmingswisselingen?",
            "Weet je vaak niet in wat voor bui {ze} vandaag zal zijn?",
          ],
          weight: 1,
          goodOnYes: false,
          branches: { yes: eieren, unsure: eieren },
        };
      })(),
    },

    // ---------- Respect & ruimte ----------
    {
      id: "respect",
      label: "Respect naar anderen",
      dim: "respect",
      node: (() => {
        const patroon = {
          text: "Heb je dit vaker dan één keer gezien?",
          weight: 2,
          goodOnYes: false,
          trait: { value: "redflag", on: ["yes", "unsure"] },
        };
        return {
          text: [
            "Behandelt {ze} anderen (bijv. bediening) met respect?",
            "Is {ze} vriendelijk tegen obers, kassamedewerkers en andere onbekenden?",
          ],
          weight: 1,
          goodOnYes: true,
          trait: { value: "caretaker", on: ["yes"] },
          branches: { no: patroon, unsure: patroon },
        };
      })(),
    },
    {
      id: "grenzen",
      label: "Grenzen respecteren",
      dim: "respect",
      core: true,
      node: (() => {
        const ompraten = {
          text: "Probeert {ze} je dan om te praten of je een schuldgevoel aan te praten?",
          weight: 3,
          goodOnYes: false,
          dealbreaker: true,
          trait: { value: "redflag", on: ["yes", "unsure"] },
        };
        return {
          text: [
            "Accepteert {ze} het zonder morren als jij een grens aangeeft?",
            "Als jij 'nee' zegt, respecteert {ze} dat dan meteen?",
          ],
          weight: 2,
          goodOnYes: true,
          trait: { value: "steady", on: ["yes"] },
          branches: { no: ompraten, unsure: ompraten },
        };
      })(),
    },
    {
      id: "eigen-leven",
      label: "Eigen leven",
      dim: "respect",
      node: {
        text: [
          "Heeft {ze} een eigen leven naast jullie (vriendenkring, hobby's), in plaats van volledig op te gaan in jou?",
          "Gunt {ze} jou je eigen tijd, en neemt {ze} die zelf ook?",
        ],
        weight: 1,
        goodOnYes: true,
        trait: { value: "independent", on: ["yes"] },
      },
    },
    {
      id: "roddel",
      label: "Roddelen",
      dim: "respect",
      node: (() => {
        const overJou = {
          text: "Denk je dat {ze} ook zo over jou praat als je er niet bij bent?",
          weight: 2,
          goodOnYes: false,
          trait: { value: "redflag", on: ["yes", "unsure"] },
        };
        return {
          text: [
            "Roddelt {ze} veel en negatief over anderen?",
            "Kraakt {ze} vaak vrienden of collega's af zodra die weg zijn?",
          ],
          weight: 1,
          goodOnYes: false,
          branches: { yes: overJou, unsure: overJou },
        };
      })(),
    },
    {
      id: "zachtheid",
      label: "Zachtaardigheid",
      dim: "respect",
      node: {
        text: [
          "Is {ze} lief voor dieren en kinderen?",
          "Heeft {ze} een zachte kant naar mensen (of dieren) die kwetsbaar zijn?",
        ],
        weight: 1,
        goodOnYes: true,
        trait: { value: "caretaker", on: ["yes"] },
      },
    },
    {
      id: "vrienden-oordeel",
      label: "Oordeel van je vrienden",
      dim: "respect",
      node: (() => {
        const gewaarschuwd = {
          text: "Hebben ze je concreet ergens voor gewaarschuwd?",
          weight: 2,
          goodOnYes: false,
          trait: { value: "redflag", on: ["yes"] },
        };
        return {
          text: [
            "Vinden jouw vrienden {haar} leuk?",
            "Reageren je vrienden positief als je over {haar} vertelt?",
          ],
          weight: 1,
          goodOnYes: true,
          branches: { no: gewaarschuwd, unsure: gewaarschuwd },
        };
      })(),
    },

    // ---------- Altijd als laatste ----------
    {
      id: "moeder",
      label: "Gut-check",
      dim: "klik",
      final: true,
      node: {
        text: [
          "Zou je {haar} zonder twijfel aan je moeder voorstellen?",
          "Zou je {haar} met trots meenemen naar een familiefeest?",
        ],
        weight: 2,
        goodOnYes: true,
      },
    },
  ];
}

const CATEGORIES = buildCategories();
const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

const DIMENSIONS = {
  klik: { label: "Klik & fun", emoji: "✨" },
  communicatie: { label: "Communicatie", emoji: "💬" },
  vertrouwen: { label: "Vertrouwen", emoji: "🔒" },
  stabiliteit: { label: "Stabiliteit", emoji: "🪨" },
  respect: { label: "Respect & ruimte", emoji: "🤝" },
};

const MODES = {
  snel: { size: 12 },
  normaal: { size: 22 },
  diep: { size: Infinity },
};

const PRONOUNS = {
  f: { ze: "ze", Ze: "Ze", haar: "haar", Haar: "Haar", zijn: "haar", Zijn: "Haar" },
  m: { ze: "hij", Ze: "Hij", haar: "hem", Haar: "Hem", zijn: "zijn", Zijn: "Zijn" },
};

const ANSWER_LABELS = { yes: "Ja", no: "Nee", unsure: "Weet niet" };

const TRAIT_INFO = {
  independent: {
    emoji: "🦋",
    title: "De Vrije Vlinder",
    desc: "{Ze} heeft een eigen leven, vrienden en bezigheden, en gaat niet volledig in een relatie op.",
  },
  caretaker: {
    emoji: "🤝",
    title: "De Zorgzame Verbinder",
    desc: "{Ze} is gericht op verbinding: {ze} luistert, toont interesse en denkt aan anderen.",
  },
  ambitious: {
    emoji: "🚀",
    title: "De Ambitieuze Doorzetter",
    desc: "Duidelijke doelen en discipline staan bij {haar} voorop.",
  },
  redflag: {
    emoji: "🚩",
    title: "Rode-Vlaggen-Centrale",
    desc: "Er kwamen meerdere zorgwekkende patronen naar voren, zoals controle, oneerlijkheid of jaloezie.",
  },
  guarded: {
    emoji: "📕",
    title: "Het Gesloten Boek",
    desc: "{Ze} houdt {zijn} gevoelens en gedachten liever voor zichzelf — lastiger om echt dichtbij te komen.",
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
    desc: "{Ze} heeft regelmatig bevestiging nodig en is gevoelig voor onzekerheid.",
  },
  fun: {
    emoji: "🎉",
    title: "De Feestknaller",
    desc: "Met {haar} is het nooit saai: humor, chemie en gezelligheid staan voorop.",
  },
};

// Kip-advies per type. Voor "redflag" bewust geen date-idee.
const ADVICE = {
  independent: [
    "Plan iets waarbij jullie allebei je eigen ding inbrengen, zoals samen koken met elk een eigen gerecht.",
    "Geef {haar} ruimte en wees zelf ook lekker bezig — dat vindt {ze} juist aantrekkelijk.",
  ],
  caretaker: [
    "Een lange wandeling met koffie to go: {ze} houdt van echte gesprekken.",
    "Onthoud iets kleins wat {ze} vertelde en kom erop terug — dat wordt gewaardeerd.",
  ],
  ambitious: [
    "Een workshop of museum: iets leren samen past bij {haar} drive.",
    "Vraag naar {zijn} doelen en denk mee — daar scoor je punten mee.",
  ],
  redflag: [
    "Misschien geen nieuwe date plannen, maar eerst eens goed praten met een vriend(in) over hoe jij je hierbij voelt.",
    "Let op je eigen grenzen. Je hoeft niemand iets uit te leggen om afstand te nemen.",
  ],
  guarded: [
    "Een rustige setting zonder druk, zoals een boekwinkel of een picknick, helpt {haar} te ontdooien.",
    "Geduld: stel open vragen en deel zelf eerst iets persoonlijks.",
  ],
  adventurous: [
    "Boek iets wat jullie allebei nog nooit gedaan hebben: klimhal, escape room, een onbekende stad.",
    "Spontaan idee: pak de eerste trein naar een willekeurige bestemming.",
  ],
  steady: [
    "Een klassieke etentjes-date werkt prima: betrouwbaar, net als {ze}.",
    "Samen iets opbouwen, zoals een moestuinbak of een puzzel van 1000 stukjes, past bij {haar}.",
  ],
  insecure: [
    "Wees duidelijk en consistent in wat je zegt en doet — dat geeft {haar} rust.",
    "Een vertrouwde plek en een heldere afspraak werken beter dan vage plannen.",
  ],
  fun: [
    "Karaoke, pubquiz of een comedy-avond: {ze} maakt er sowieso een feest van.",
    "Minigolf met een weddenschap: wie verliest, betaalt de ijsjes.",
  ],
};

const VERDICTS = [
  {
    min: 95,
    emoji: "🦄",
    title: "Unicorn-alert",
    messages: [
      "Dit komt zelden voor: vrijwel alleen groene vlaggen. Niet te lang twijfelen!",
      "Bijna te mooi om waar te zijn. De kip is onder de indruk. 🐔✨",
    ],
  },
  {
    min: 80,
    emoji: "💚",
    title: "Groen licht",
    messages: [
      "De signalen zijn overwegend positief. Dit is een gezonde basis om verder te verkennen.",
      "Veel groene vlaggen en weinig zorgen. Dit ziet er echt goed uit.",
    ],
  },
  {
    min: 60,
    emoji: "🙂",
    title: "Redelijk positief",
    messages: [
      "Er is een goede basis, met een paar aandachtspunten. Waag de date, maar houd de punten hieronder in de gaten.",
      "Meer plus dan min. Ga ervoor, maar met je ogen open.",
    ],
  },
  {
    min: 40,
    emoji: "😐",
    title: "Gemengd beeld",
    messages: [
      "Sterke en zwakke punten houden elkaar ongeveer in evenwicht. Neem de aandachtspunten hieronder serieus voordat je verder gaat.",
      "Twijfelgeval. Kijk vooral naar de aandachtspunten: zijn dat dingen waar je mee kunt leven?",
    ],
  },
  {
    min: 20,
    emoji: "⚠️",
    title: "Meerdere rode vlaggen",
    messages: [
      "Er zijn meerdere serieuze aandachtspunten naar voren gekomen. Wees voorzichtig en weeg goed af of dit is wat je zoekt.",
      "De kip fronst. Er is genoeg dat je aan het denken zou moeten zetten.",
    ],
  },
  {
    min: 0,
    emoji: "🚩",
    title: "Duidelijk rood signaal",
    messages: [
      "De signalen wijzen overwegend op problematisch gedrag. Dit is geen goede basis voor een gezonde relatie.",
      "Rennen, kip, rennen. Dit is geen gezonde basis.",
    ],
  },
];

const REACTIONS = {
  good: ["Nice! 💚", "Groene vlag 🟢", "Dat klinkt goed!", "Tok tok, top! 🐔", "Love that.", "Zo hoort het ✨", "Check ✅"],
  bad: ["Hmm 🤔", "Aandachtspuntje…", "Noted 📝", "Mwah.", "Oké, onthouden."],
  severe: ["Oei… 🚩", "Dat is een serieuze.", "Hmm, noted. 😬", "Kip zegt: pas op ⚠️"],
  unsure: ["Eerlijk is eerlijk 🤷", "Twijfel is ook info.", "Prima, door!"],
  deeper: ["Even doorvragen… 🔍", "Vertel me meer 🔍", "Daar wil ik meer van weten 🧐"],
};

const TAGLINES = [
  "Beantwoord een paar simpele vragen. De vervolgvragen passen zich aan op wat jij antwoordt.",
  "Laat de kip beslissen. Of in ieder geval meedenken. 🐔",
  "Rode vlag of groene vlag? Tijd voor de waarheid.",
  "Vlinders in je buik, of toch een 🚩 in je hoofd?",
  "Swipe door de vragen en krijg een eerlijk verdict.",
];

const LOGO_FACES = ["🐔", "🐣", "🐤", "🐥", "🐓"];

const STORAGE_KEY = "chickchecker_progress_v4";
const PAST_KEY = "chickchecker_past_v1";
const PREFS_KEY = "chickchecker_prefs_v1";
const MAX_BREAKDOWN_ITEMS = 4;
const MAX_PAST = 8;
const SWIPE_THRESHOLD = 90;

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------------------------------------------------------------------------
// Seeded randomness: alles wat per sessie "willekeurig" is (selectie,
// volgorde, formulering) volgt uit session.seed, zodat een hervatte sessie
// exact dezelfde vragen toont.
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function shuffle(arr, rng) {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pick(arr, rng = Math.random) {
  return arr[Math.floor(rng() * arr.length)];
}

// ---------------------------------------------------------------------------
// Tekst

function fill(template, session, useName = false) {
  const p = PRONOUNS[session.gender] || PRONOUNS.f;
  let nameLeft = useName && !!session.name;
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    if (nameLeft && (key === "ze" || key === "Ze")) {
      nameLeft = false;
      return session.name;
    }
    return p[key] ?? match;
  });
}

function questionText(session, category, depth, node) {
  const variants = Array.isArray(node.text) ? node.text : [node.text];
  const key = `${session.seed}:${category.id}:${depth}`;
  const variant = variants[hashString(key) % variants.length];
  const useName = hashString(`${key}:naam`) % 100 < 40;
  return fill(variant, session, useName);
}

// ---------------------------------------------------------------------------
// Engine. De enige persistente state is `session`
// ({ name, gender, mode, seed, plan, answers }); al het andere (huidige vraag,
// score, geschiedenis) wordt afgeleid door de antwoorden opnieuw af te spelen.
// Daardoor is "terug" simpelweg answers.pop().

function buildPlan(mode, rng) {
  const size = Math.min((MODES[mode] || MODES.normaal).size, CATEGORIES.length);
  const finals = CATEGORIES.filter((c) => c.final);
  const pool = CATEGORIES.filter((c) => !c.final);
  const picked = pool.filter((c) => c.core);
  const rest = shuffle(pool.filter((c) => !c.core), rng);

  // Eerst één categorie per thema dat nog ontbreekt, zodat elk thema in de
  // uitslag iets te zeggen heeft.
  for (const dim of Object.keys(DIMENSIONS)) {
    if (picked.some((c) => c.dim === dim)) continue;
    const i = rest.findIndex((c) => c.dim === dim);
    if (i !== -1) picked.push(...rest.splice(i, 1));
  }
  picked.push(...rest.slice(0, Math.max(0, size - finals.length - picked.length)));

  return [...shuffle(picked, rng), ...finals].map((c) => c.id);
}

function freshRun(session) {
  return {
    categoryIndex: 0,
    depth: 0,
    node: CATEGORY_BY_ID[session.plan[0]].node,
    earned: 0,
    total: 0,
    greenFlags: 0,
    streak: 0,
    history: [],
    traitTally: {},
    last: null,
    done: false,
  };
}

function step(run, session, value) {
  const node = run.node;
  const category = CATEGORY_BY_ID[session.plan[run.categoryIndex]];
  const rawFraction = value === "yes" ? 1 : value === "no" ? 0 : 0.5;
  const creditFraction = node.goodOnYes ? rawFraction : 1 - rawFraction;

  run.earned += node.weight * creditFraction;
  run.total += node.weight;
  if (creditFraction === 1) {
    run.greenFlags++;
    run.streak++;
  } else {
    run.streak = 0;
  }
  run.history.push({
    label: category.label,
    dim: category.dim,
    text: questionText(session, category, run.depth, node),
    value,
    weight: node.weight,
    creditFraction,
    dealbreaker: !!node.dealbreaker && creditFraction === 0,
  });

  if (node.trait && node.trait.on.includes(value)) {
    run.traitTally[node.trait.value] = (run.traitTally[node.trait.value] || 0) + node.weight;
  }

  const nextNode = node.branches && node.branches[value];
  run.last = { creditFraction, weight: node.weight, deeper: !!nextNode };

  if (nextNode) {
    run.node = nextNode;
    run.depth++;
    return;
  }

  run.categoryIndex++;
  run.depth = 0;
  if (run.categoryIndex >= session.plan.length) {
    run.done = true;
    run.node = null;
  } else {
    run.node = CATEGORY_BY_ID[session.plan[run.categoryIndex]].node;
  }
}

function replay(session) {
  const run = freshRun(session);
  for (const value of session.answers) {
    if (run.done) break;
    step(run, session, value);
  }
  return run;
}

function getVerdict(pct, dealbreakerCount) {
  const natural = VERDICTS.findIndex((v) => pct >= v.min);
  // Eén dealbreaker: hooguit "Redelijk positief"; twee of meer: hooguit
  // "Meerdere rode vlaggen" — hoe hoog het percentage verder ook is.
  const floor = dealbreakerCount >= 2 ? 4 : dealbreakerCount === 1 ? 2 : 0;
  return { ...VERDICTS[Math.max(natural, floor)], capped: floor > natural };
}

function getArchetypes(tally) {
  const entries = Object.entries(tally)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return { primary: "steady", secondary: null };
  const secondary =
    entries[1] && entries[1][1] >= entries[0][1] * 0.5 ? entries[1][0] : null;
  return { primary: entries[0][0], secondary };
}

function uniqueLabels(history, predicate, sortKey) {
  const seen = new Set();
  return history
    .filter(predicate)
    .sort((a, b) => sortKey(b) - sortKey(a))
    .map((h) => h.label)
    .filter((label) => {
      if (seen.has(label)) return false;
      seen.add(label);
      return true;
    })
    .slice(0, MAX_BREAKDOWN_ITEMS);
}

function summarize(session, run) {
  const rng = mulberry32(session.seed ^ 0x9e3779b9);
  const pct = Math.round((run.earned / run.total) * 100);
  const dealbreakers = [...new Set(run.history.filter((h) => h.dealbreaker).map((h) => h.label))];
  const verdict = getVerdict(pct, dealbreakers.length);
  const { primary, secondary } = getArchetypes(run.traitTally);

  const dims = {};
  for (const h of run.history) {
    const d = (dims[h.dim] ||= { earned: 0, total: 0 });
    d.earned += h.weight * h.creditFraction;
    d.total += h.weight;
  }

  return {
    seed: session.seed,
    name: session.name,
    pct,
    verdict,
    message: fill(pick(verdict.messages, rng), session),
    dealbreakers,
    primary,
    secondary,
    advice: fill(pick(ADVICE[primary], rng), session),
    dims: Object.keys(DIMENSIONS)
      .filter((key) => dims[key])
      .map((key) => ({ key, pct: Math.round((dims[key].earned / dims[key].total) * 100) })),
    strengths: uniqueLabels(run.history, (h) => h.creditFraction === 1, (h) => h.weight),
    concerns: uniqueLabels(
      run.history,
      (h) => h.creditFraction < 1,
      (h) => h.weight * (1 - h.creditFraction)
    ),
    history: run.history,
    greenFlags: run.greenFlags,
  };
}

// ---------------------------------------------------------------------------
// Opslag (alles in try/catch: private mode e.d. kan localStorage blokkeren)

function storageGet(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Niet erg: dan wordt er gewoon niets onthouden.
  }
}

function storageRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // idem
  }
}

function saveProgress() {
  storageSet(STORAGE_KEY, session);
}

function clearProgress() {
  storageRemove(STORAGE_KEY);
}

function loadProgress() {
  const s = storageGet(STORAGE_KEY);
  const valid =
    s &&
    Array.isArray(s.plan) &&
    s.plan.length > 0 &&
    s.plan.every((id) => CATEGORY_BY_ID[id]) &&
    Array.isArray(s.answers) &&
    s.answers.every((a) => a in ANSWER_LABELS);
  return valid ? s : null;
}

function loadPast() {
  const past = storageGet(PAST_KEY);
  return Array.isArray(past) ? past : [];
}

function recordPast(result) {
  const past = loadPast().filter((p) => p.seed !== result.seed);
  past.unshift({
    seed: result.seed,
    name: result.name,
    pct: result.pct,
    emoji: result.verdict.emoji,
    type: TRAIT_INFO[result.primary].emoji,
    date: Date.now(),
  });
  const trimmed = past.slice(0, MAX_PAST);
  storageSet(PAST_KEY, trimmed);
  return trimmed;
}

// ---------------------------------------------------------------------------
// DOM

let session = null;
let run = null;
let result = null;
let busy = false;

const screens = {
  welcome: document.getElementById("screen-welcome"),
  quiz: document.getElementById("screen-quiz"),
  result: document.getElementById("screen-result"),
};

const $ = (id) => document.getElementById(id);

const el = {
  logo: $("logo"),
  tagline: $("tagline"),
  inputName: $("input-name"),
  btnStart: $("btn-start"),
  btnInfo: $("btn-info"),
  infoDialog: $("info-dialog"),
  btnInfoClose: $("btn-info-close"),
  past: $("past"),
  pastList: $("past-list"),
  btnPastClear: $("btn-past-clear"),

  btnBack: $("btn-back"),
  btnQuit: $("btn-quit"),
  quizName: $("quiz-name"),
  btnYes: $("btn-yes"),
  btnNo: $("btn-no"),
  btnUnsure: $("btn-unsure"),
  card: $("q-card"),
  stampYes: $("stamp-yes"),
  stampNo: $("stamp-no"),
  stampUnsure: $("stamp-unsure"),
  qCategory: $("q-category"),
  qDeeper: $("q-deeper"),
  questionText: $("question-text"),
  questionCount: $("question-count"),
  questionTotal: $("question-total"),
  progressFill: $("progress-fill"),
  vibeMarker: $("vibe-marker"),
  mascot: $("mascot"),
  bubble: $("bubble"),

  resultFor: $("result-for"),
  resultEmoji: $("result-emoji"),
  resultTitle: $("result-title"),
  scoreCircle: $("score-circle"),
  scorePercent: $("score-percent"),
  resultFlags: $("result-flags"),
  resultRank: $("result-rank"),
  dealbreakers: $("dealbreakers"),
  dealbreakersList: $("dealbreakers-list"),
  dealbreakersNote: $("dealbreakers-note"),
  resultMessage: $("result-message"),
  archetypeEmoji: $("archetype-emoji"),
  archetypeTitle: $("archetype-title"),
  archetypeDesc: $("archetype-desc"),
  archetypeSecondary: $("archetype-secondary"),
  dimsList: $("dims-list"),
  breakdownStrengths: $("breakdown-strengths"),
  breakdownConcerns: $("breakdown-concerns"),
  adviceText: $("advice-text"),
  answersCount: $("answers-count"),
  answersList: $("answers-list"),
  btnShare: $("btn-share"),
  btnDownload: $("btn-download"),
  btnRestart: $("btn-restart"),
  toast: $("toast"),
  fx: $("fx"),
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, reduceMotion ? 0 : ms));

function showScreen(name) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[name].classList.add("active");
  window.scrollTo(0, 0);
}

function restartAnimation(node, className) {
  node.classList.remove(className);
  void node.offsetWidth;
  node.classList.add(className);
}

let toastTimer = null;
function toast(message) {
  el.toast.textContent = message;
  el.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.toast.classList.remove("show"), 2200);
}

function scoreColor(pct) {
  if (pct >= 60) return "var(--green)";
  if (pct >= 40) return "var(--amber)";
  return "var(--red)";
}

// ---------- Welkom ----------

function readChoice(name) {
  const checked = document.querySelector(`input[name="${name}"]:checked`);
  return checked ? checked.value : null;
}

function setChoice(name, value) {
  const input = document.querySelector(`input[name="${name}"][value="${value}"]`);
  if (input) input.checked = true;
}

function renderWelcome() {
  el.tagline.textContent = pick(TAGLINES);
  const prefs = storageGet(PREFS_KEY);
  if (prefs) {
    setChoice("gender", prefs.gender);
    setChoice("mode", prefs.mode);
  }
  renderPast();
}

function renderPast() {
  const past = loadPast();
  el.past.hidden = past.length === 0;
  el.pastList.innerHTML = "";
  const dateFmt = new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "short" });

  past.forEach((p) => {
    const li = document.createElement("li");
    const name = document.createElement("span");
    name.className = "past-name";
    name.textContent = `${p.emoji} ${p.name || "Naamloos"}`;
    const meta = document.createElement("span");
    meta.className = "past-meta";
    meta.textContent = `${p.type} · ${dateFmt.format(new Date(p.date))}`;
    const pct = document.createElement("span");
    pct.className = "past-pct";
    pct.style.color = scoreColor(p.pct);
    pct.textContent = `${p.pct}%`;
    li.append(name, meta, pct);
    el.pastList.appendChild(li);
  });
}

function startQuiz() {
  const gender = readChoice("gender") || "f";
  const mode = readChoice("mode") || "normaal";
  storageSet(PREFS_KEY, { gender, mode });

  const seed = (Math.random() * 2 ** 32) >>> 0;
  session = {
    name: el.inputName.value.trim(),
    gender,
    mode,
    seed,
    plan: buildPlan(mode, mulberry32(seed)),
    answers: [],
  };
  run = replay(session);
  saveProgress();
  renderQuestion();
  say(session.name ? `Oké, tijd om ${session.name} te checken! 🐔` : "Daar gaan we! 🐔");
  showScreen("quiz");
}

// ---------- Quiz ----------

function renderQuestion() {
  const category = CATEGORY_BY_ID[session.plan[run.categoryIndex]];
  const dim = DIMENSIONS[category.dim];

  el.questionText.textContent = questionText(session, category, run.depth, run.node);
  el.qCategory.textContent = `${dim.emoji} ${category.label}`;
  el.qDeeper.hidden = run.depth === 0;
  el.questionCount.textContent = run.categoryIndex + 1;
  el.questionTotal.textContent = session.plan.length;
  el.progressFill.style.width = `${(run.categoryIndex / session.plan.length) * 100}%`;
  el.quizName.textContent = session.name ? `🔎 ${session.name}` : "";
  el.btnBack.disabled = session.answers.length === 0;

  const vibe = run.total ? run.earned / run.total : 0.5;
  el.vibeMarker.style.left = `${vibe * 100}%`;

  resetCard();
  restartAnimation(el.card, "enter");
}

function say(message, mood) {
  el.bubble.textContent = message;
  restartAnimation(el.bubble, "pop");
  el.mascot.classList.remove("hop", "shake");
  if (mood) restartAnimation(el.mascot, mood);
}

function react() {
  const { creditFraction, weight, deeper } = run.last;
  let pool = REACTIONS.unsure;
  let mood = null;
  if (deeper) {
    pool = REACTIONS.deeper;
  } else if (creditFraction === 1) {
    pool = REACTIONS.good;
    mood = "hop";
  } else if (creditFraction === 0) {
    pool = weight >= 3 ? REACTIONS.severe : REACTIONS.bad;
    mood = "shake";
  }

  let message = pick(pool);
  if (run.streak >= 3 && (run.streak === 3 || run.streak % 5 === 0)) {
    message = `🔥 ${run.streak} groene vlaggen op rij!`;
  } else if (!deeper && !run.done && run.categoryIndex === Math.floor(session.plan.length / 2) && run.depth === 0) {
    message = "Halverwege! 🥚→🐣";
  }
  say(message, mood);
}

function setStamps(yes, no, unsure) {
  el.stampYes.style.opacity = yes;
  el.stampNo.style.opacity = no;
  el.stampUnsure.style.opacity = unsure;
}

function resetCard() {
  el.card.classList.remove("fly", "snap", "dragging");
  el.card.style.transform = "";
  el.card.style.opacity = "";
  setStamps(0, 0, 0);
}

const FLY = {
  yes: "translate(140%, -20px) rotate(20deg)",
  no: "translate(-140%, -20px) rotate(-20deg)",
  unsure: "translateY(-140%)",
};

async function answer(value) {
  if (busy || !run || run.done || !screens.quiz.classList.contains("active")) return;
  busy = true;

  if (navigator.vibrate) navigator.vibrate(10);
  setStamps(value === "yes" ? 1 : 0, value === "no" ? 1 : 0, value === "unsure" ? 1 : 0);
  el.card.classList.remove("dragging", "enter");
  el.card.classList.add("fly");
  el.card.style.transform = FLY[value];
  el.card.style.opacity = "0";
  await wait(220);

  session.answers.push(value);
  step(run, session, value);
  react();

  if (run.done) {
    finish();
  } else {
    saveProgress();
    renderQuestion();
  }
  busy = false;
}

function undo() {
  if (busy || !session || session.answers.length === 0) return;
  session.answers.pop();
  run = replay(session);
  saveProgress();
  renderQuestion();
  say("Terug in de tijd ⏪");
}

// Swipen: rechts = ja, links = nee, omhoog = weet niet.
let drag = null;

el.card.addEventListener("pointerdown", (e) => {
  if (busy || (e.pointerType === "mouse" && e.button !== 0)) return;
  drag = { id: e.pointerId, x: e.clientX, y: e.clientY, dx: 0, dy: 0 };
  el.card.setPointerCapture(e.pointerId);
  el.card.classList.remove("snap", "enter");
  el.card.classList.add("dragging");
});

el.card.addEventListener("pointermove", (e) => {
  if (!drag || e.pointerId !== drag.id) return;
  drag.dx = e.clientX - drag.x;
  drag.dy = Math.min(0, e.clientY - drag.y);
  el.card.style.transform = `translate(${drag.dx}px, ${drag.dy}px) rotate(${drag.dx / 14}deg)`;
  const vertical = Math.abs(drag.dy) > Math.abs(drag.dx);
  const clamp = (v) => Math.max(0, Math.min(1, v));
  setStamps(
    vertical ? 0 : clamp(drag.dx / SWIPE_THRESHOLD),
    vertical ? 0 : clamp(-drag.dx / SWIPE_THRESHOLD),
    vertical ? clamp(-drag.dy / SWIPE_THRESHOLD) : 0
  );
});

function endDrag(e) {
  if (!drag || e.pointerId !== drag.id) return;
  const { dx, dy } = drag;
  drag = null;
  el.card.classList.remove("dragging");

  if (Math.abs(dy) > Math.abs(dx) && dy < -SWIPE_THRESHOLD * 0.8) return answer("unsure");
  if (dx > SWIPE_THRESHOLD) return answer("yes");
  if (dx < -SWIPE_THRESHOLD) return answer("no");

  el.card.classList.add("snap");
  el.card.style.transform = "";
  setStamps(0, 0, 0);
}

el.card.addEventListener("pointerup", endDrag);
el.card.addEventListener("pointercancel", endDrag);

// ---------- Resultaat ----------

function finish() {
  el.progressFill.style.width = "100%";
  result = summarize(session, run);
  clearProgress();
  const past = recordPast(result);
  showResult(result, past);
}

function renderList(container, items, emptyText) {
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

function animateScore(pct) {
  const set = (v) => {
    el.scorePercent.textContent = `${v}%`;
    el.scoreCircle.style.setProperty("--pct", v);
  };
  el.scoreCircle.style.setProperty("--score-color", scoreColor(pct));
  if (reduceMotion) return set(pct);

  const start = performance.now();
  const duration = 1100;
  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    set(Math.round(pct * (1 - Math.pow(1 - t, 3))));
    if (t < 1) requestAnimationFrame(tick);
  };
  set(0);
  requestAnimationFrame(tick);
}

function renderDims(dims) {
  el.dimsList.innerHTML = "";
  dims.forEach(({ key, pct }) => {
    const row = document.createElement("div");
    row.className = "dim-row";
    const label = document.createElement("span");
    label.className = "dim-label";
    label.textContent = `${DIMENSIONS[key].emoji} ${DIMENSIONS[key].label}`;
    const track = document.createElement("div");
    track.className = "dim-track";
    const fillBar = document.createElement("div");
    fillBar.className = "dim-fill";
    fillBar.style.background = scoreColor(pct);
    track.appendChild(fillBar);
    const value = document.createElement("span");
    value.className = "dim-value";
    value.textContent = `${pct}%`;
    row.append(label, track, value);
    el.dimsList.appendChild(row);
    requestAnimationFrame(() => requestAnimationFrame(() => (fillBar.style.width = `${pct}%`)));
  });
}

function renderAnswers(history) {
  el.answersCount.textContent = history.length;
  el.answersList.innerHTML = "";
  history.forEach((h) => {
    const li = document.createElement("li");
    const tone = h.creditFraction === 1 ? "good" : h.creditFraction === 0 ? "bad" : "meh";
    li.className = `answer-${tone}`;
    const q = document.createElement("span");
    q.className = "answer-q";
    q.textContent = h.text;
    const a = document.createElement("span");
    a.className = "answer-a";
    a.textContent = ANSWER_LABELS[h.value];
    li.append(q, a);
    el.answersList.appendChild(li);
  });
}

function renderRank(result, past) {
  el.resultRank.hidden = past.length < 2;
  if (past.length < 2) return;
  const rank = past.filter((p) => p.pct > result.pct).length + 1;
  el.resultRank.textContent =
    rank === 1
      ? `🏆 Hoogste score van je laatste ${past.length} checks`
      : `#${rank} van je laatste ${past.length} checks`;
}

function showResult(result, past) {
  const archetype = TRAIT_INFO[result.primary];

  el.resultFor.textContent = result.name ? `Resultaat voor ${result.name}` : "Jouw resultaat";
  el.resultEmoji.textContent = result.verdict.emoji;
  el.resultTitle.textContent = result.verdict.title;
  el.resultMessage.textContent = result.message;
  el.resultFlags.textContent = `${result.greenFlags} van ${result.history.length} groene vlaggen`;

  el.dealbreakers.hidden = result.dealbreakers.length === 0;
  renderList(el.dealbreakersList, result.dealbreakers, "");
  el.dealbreakersNote.textContent = result.verdict.capped
    ? "Daarom valt het oordeel lager uit dan het percentage doet vermoeden."
    : "Dit weegt zwaarder dan welke groene vlag ook.";

  el.archetypeEmoji.textContent = archetype.emoji;
  el.archetypeTitle.textContent = `Type: ${archetype.title}`;
  el.archetypeDesc.textContent = fill(archetype.desc, session);
  el.archetypeSecondary.hidden = !result.secondary;
  if (result.secondary) {
    const s = TRAIT_INFO[result.secondary];
    el.archetypeSecondary.textContent = `…met een vleugje ${s.emoji} ${s.title}`;
  }

  renderDims(result.dims);
  renderList(el.breakdownStrengths, result.strengths, "Geen bijzondere sterke punten naar voren gekomen.");
  renderList(el.breakdownConcerns, result.concerns, "Geen bijzondere aandachtspunten naar voren gekomen.");
  el.adviceText.textContent = result.advice;
  renderAnswers(result.history);
  renderRank(result, past);

  showScreen("result");
  animateScore(result.pct);

  if (result.pct >= 80 && result.dealbreakers.length === 0) celebrate(["💚", "🎉", "✨", "🐣", "💛"]);
  else if (result.pct < 30 || result.dealbreakers.length >= 2) celebrate(["🚩"]);
}

// Emoji-"confetti" op een canvas over het hele scherm.
function celebrate(emojis) {
  if (reduceMotion) return;
  const canvas = el.fx;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const parts = Array.from({ length: 60 }, () => ({
    x: Math.random() * innerWidth,
    y: -20 - Math.random() * innerHeight * 0.6,
    vx: (Math.random() - 0.5) * 2,
    vy: 2 + Math.random() * 3,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.2,
    size: 18 + Math.random() * 16,
    emoji: pick(emojis),
  }));

  const start = performance.now();
  const frame = (now) => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    const fade = Math.max(0, 1 - (now - start - 2200) / 800);
    ctx.globalAlpha = Math.min(1, fade);
    for (const p of parts) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.font = `${p.size}px serif`;
      ctx.fillText(p.emoji, -p.size / 2, p.size / 2);
      ctx.restore();
    }
    if (now - start < 3000) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, innerWidth, innerHeight);
  };
  requestAnimationFrame(frame);
}

// ---------- Delen ----------

const IMAGE_FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const IMAGE_COLORS = { green: "#6fae7c", amber: "#d9a441", red: "#cf6d5e" };

function imageScoreColor(pct) {
  return pct >= 60 ? IMAGE_COLORS.green : pct >= 40 ? IMAGE_COLORS.amber : IMAGE_COLORS.red;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function renderShareImage(result) {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const g = canvas.getContext("2d");

  const bg = g.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#f6efe1");
  bg.addColorStop(1, "#ecdfc4");
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);

  g.fillStyle = "#fffcf6";
  roundRect(g, 60, 60, W - 120, H - 120, 48);
  g.fill();

  g.textAlign = "center";
  g.textBaseline = "alphabetic";
  const text = (str, y, size, color, weight = 800) => {
    g.font = `${weight} ${size}px ${IMAGE_FONT}`;
    g.fillStyle = color;
    g.fillText(str, W / 2, y, W - 200);
  };

  const archetype = TRAIT_INFO[result.primary];
  text((result.name ? `Resultaat voor ${result.name}` : "Mijn resultaat").toUpperCase(), 180, 36, "#948a78", 700);
  text(result.verdict.emoji, 360, 160, "#000", 400);
  text(`${result.pct}%`, 560, 180, imageScoreColor(result.pct));
  text(result.verdict.title, 650, 64, "#c17a56");
  text(`${archetype.emoji} ${archetype.title}`, 740, 44, "#4a3f33", 700);

  let y = 830;
  g.textAlign = "left";
  result.dims.forEach(({ key, pct }) => {
    const d = DIMENSIONS[key];
    g.font = `700 34px ${IMAGE_FONT}`;
    g.fillStyle = "#4a3f33";
    g.fillText(`${d.emoji} ${d.label}`, 150, y + 26, 330);
    g.fillStyle = "#ecdfc4";
    roundRect(g, 500, y, 430, 32, 16);
    g.fill();
    g.fillStyle = imageScoreColor(pct);
    roundRect(g, 500, y, Math.max(32, 430 * (pct / 100)), 32, 16);
    g.fill();
    y += 66;
  });

  g.textAlign = "center";
  text("🐔 chickchecker.nl", H - 110, 36, "#948a78", 700);

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

function shareText(result) {
  const archetype = TRAIT_INFO[result.primary];
  const who = result.name ? `${result.name} scoort` : "Score:";
  return `🐔 ChickChecker — ${who} ${result.pct}% ${result.verdict.emoji} ${result.verdict.title}. Type: ${archetype.emoji} ${archetype.title}. Check jouw date op chickchecker.nl`;
}

async function shareResult() {
  if (!result) return;
  const text = shareText(result);
  try {
    const blob = await renderShareImage(result);
    const file = blob && new File([blob], "chickchecker.png", { type: "image/png" });
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], text });
    } else if (navigator.share) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard.writeText(text);
      toast("Gekopieerd naar je klembord 📋");
    }
  } catch (err) {
    if (err && err.name !== "AbortError") toast("Delen lukte niet 😕");
  }
}

async function downloadImage() {
  if (!result) return;
  const blob = await renderShareImage(result);
  if (!blob) return toast("Afbeelding maken lukte niet 😕");
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `chickchecker-${(result.name || "resultaat").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("Afbeelding opgeslagen 🖼️");
}

// ---------- Algemeen ----------

function restart() {
  clearProgress();
  session = null;
  run = null;
  result = null;
  el.inputName.value = "";
  renderWelcome();
  showScreen("welcome");
}

el.btnStart.addEventListener("click", startQuiz);
el.inputName.addEventListener("keydown", (e) => {
  if (e.key === "Enter") startQuiz();
});
el.logo.addEventListener("click", () => {
  el.logo.textContent = pick(LOGO_FACES.filter((f) => f !== el.logo.textContent));
  restartAnimation(el.logo, "hop");
});
el.btnInfo.addEventListener("click", () => el.infoDialog.showModal());
el.btnInfoClose.addEventListener("click", () => el.infoDialog.close());
el.infoDialog.addEventListener("click", (e) => {
  if (e.target === el.infoDialog) el.infoDialog.close();
});
el.btnPastClear.addEventListener("click", () => {
  if (!confirm("Alle eerdere checks wissen?")) return;
  storageRemove(PAST_KEY);
  renderPast();
});

el.btnYes.addEventListener("click", () => answer("yes"));
el.btnNo.addEventListener("click", () => answer("no"));
el.btnUnsure.addEventListener("click", () => answer("unsure"));
el.btnBack.addEventListener("click", undo);
el.btnQuit.addEventListener("click", () => {
  if (confirm("Weet je zeker dat je wilt stoppen? Je voortgang gaat dan verloren.")) {
    restart();
  }
});

el.btnShare.addEventListener("click", shareResult);
el.btnDownload.addEventListener("click", downloadImage);
el.btnRestart.addEventListener("click", restart);

const KEYS = {
  j: "yes", y: "yes", ArrowRight: "yes",
  n: "no", ArrowLeft: "no",
  w: "unsure", u: "unsure", ArrowUp: "unsure",
};

document.addEventListener("keydown", (e) => {
  if (!screens.quiz.classList.contains("active") || el.infoDialog.open) return;
  if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
  if (e.key === "Backspace" || e.key === "z") {
    e.preventDefault();
    undo();
    return;
  }
  const value = KEYS[e.key] || KEYS[e.key.toLowerCase()];
  if (value) {
    e.preventDefault();
    answer(value);
  }
});

// Een lopende check hervatten na een refresh/per ongeluk sluiten.
renderWelcome();
const resumed = loadProgress();
if (resumed) {
  session = resumed;
  run = replay(session);
  if (run.done) {
    clearProgress();
    session = run = null;
  } else {
    renderQuestion();
    say("Welkom terug! We gaan verder waar je was 🐔");
    showScreen("quiz");
  }
}

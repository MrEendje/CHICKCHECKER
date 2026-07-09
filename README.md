# 🐔 ChickChecker

Een mobile-first (maar ook prima op desktop) webapp die je helpt beslissen: wel
of niet daten? Beantwoord een reeks ja/nee/weet-niet-vragen — de vervolgvragen
passen zich live aan op wat je antwoordt — en krijg een onderbouwd verdict met
een score en een concrete sterke-/zwaktepuntenanalyse.

**Live op: [chickchecker.nl](https://chickchecker.nl)**

## Features

- **Adaptieve vragenboom** — 24 categorieën, elk met een startvraag die tot 3
  niveaus dieper vertakt zodra een antwoord daar aanleiding toe geeft (bijv.
  een rode vlag bevestigen of juist ontkrachten). Het aantal daadwerkelijk
  gestelde vragen hangt dus echt af van de antwoorden (ergens tussen de 24 en
  36) — net als bij Akinator wordt er dieper doorgevraagd naarmate een
  antwoord twijfelachtig of zorgwekkend is.
- **Ja / Nee / Weet niet** — geen geforceerde keuzes.
- **Gewogen scoring** — rode vlaggen (jaloezie, leugens, financiële
  problemen, ...) tellen zwaarder mee dan standaard groene-vlag-vragen.
- **Persoonlijkheidsprofiel** — naast het daten-verdict herkent de app ook
  wat voor type ze is (bijv. "De Vrije Vlinder", "De Stabiele Rots",
  "Rode-Vlaggen-Centrale"), gebaseerd op welke trekken tijdens de vragen het
  vaakst naar voren kwamen.
- **Sterke punten & aandachtspunten** — het resultaat is meer dan een los
  percentage: je krijgt te zien welke categorieën het sterkst en het meest
  zorgwekkend waren.
- **Voortgang wordt onthouden** — sluit je de pagina per ongeluk, dan kun je
  verdergaan waar je gebleven was.
- **Stop-knop** — sessie halverwege afbreken en terug naar het beginscherm,
  met bevestiging zodat je niet per ongeluk je voortgang kwijtraakt.
- **Personalisatie** — optioneel een naam invullen voor een persoonlijk
  resultaat ("Resultaat voor Anna").

Puur voor de lol — vertrouw altijd op je eigen gevoel. 😉

## Tech stack

Vanilla HTML, CSS en JavaScript. Geen frameworks, geen dependencies, geen
build-stap.

```
index.html   structuur van de 3 schermen (welkom, quiz, resultaat)
style.css    styling (beige/zachte kleuren, rood/groen voor ratings)
script.js    de adaptieve vragen-engine, scoring en state-persistentie
```

## Lokaal draaien

Geen installatie nodig — open `index.html` gewoon in je browser, of serveer
de map met een simpele static server:

```bash
python -m http.server 8934
```

en ga naar `http://localhost:8934`.

## Deployen

Het is een volledig statische site: de drie bestanden hierboven kunnen
zonder build-stap naar elke static host (Netlify, Vercel, GitHub Pages, ...)
gepusht worden.

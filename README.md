# 🐔 ChickChecker

Een mobile-first (maar ook prima op desktop) webapp die je helpt beslissen: wel
of niet daten? Beantwoord een reeks ja/nee/weet-niet-vragen — de vervolgvragen
passen zich live aan op wat je antwoordt — en krijg een onderbouwd verdict met
een score en een concrete sterke-/zwaktepuntenanalyse.

**Live op: [chickchecker.nl](https://chickchecker.nl)**

## Features

- **Elke check is anders** — een pool van 38 categorieën; per sessie wordt er
  een selectie getrokken, in willekeurige volgorde en met wisselende
  formuleringen (soms met de naam van je date erin).
- **Drie modi** — ⚡ Snel (12 onderdelen), 🐔 Normaal (22) of 🔬 Diep (alles).
- **Haar of hem** — alle vragen passen zich aan.
- **Adaptieve vragenboom** — elke startvraag kan tot 3 niveaus dieper
  vertakken zodra een antwoord twijfelachtig of zorgwekkend is, Akinator-style.
- **Swipen als op een datingapp** — → ja, ← nee, ↑ weet niet. Of knoppen, of
  toetsen (J / N / W). Vergist? **Terug**-knop of Backspace.
- **Kip-mascotte** die live reageert, streaks bijhoudt, en een vibe-meter.
- **Gewogen scoring met dealbreakers** — zware rode vlaggen (controle,
  gaslighting, grenzen negeren, ...) drukken het oordeel, hoe hoog het
  percentage ook is.
- **Rijke uitslag** — score, persoonlijkheidstype (+ tweede type), score per
  thema, sterke punten & aandachtspunten, kip-advies/date-idee, en al je
  antwoorden terug te lezen.
- **Delen** — als tekst of als mooie afbeelding (1080×1350).
- **Eerdere checks** — je laatste resultaten staan op het beginscherm, met
  ranking ("🏆 hoogste score van je laatste 5 checks").
- **Voortgang wordt onthouden** en er is een **dark mode**.

Puur voor de lol — vertrouw altijd op je eigen gevoel. 😉

## Tech stack

Vanilla HTML, CSS en JavaScript. Geen frameworks, geen dependencies, geen
build-stap.

```
index.html   structuur van de 3 schermen (welkom, quiz, resultaat)
style.css    styling (beige/zachte kleuren, dark mode, rood/groen voor ratings)
script.js    vragenpool, adaptieve engine, scoring, swipes, delen en opslag
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

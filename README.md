# Yoga-Timer

Ein Intervall-Timer im Browser für Yoga- oder Übungseinheiten, mit sanft pulsierender Hintergrund-Animation.

## Features

- Wechselt automatisch zwischen Übungs- und Pausenphasen, für eine feste Anzahl Wiederholungen
- Einstellbare Dauer für Übung (Sekunden), Pause (Sekunden) und Anzahl der Wiederholungen
- Start/Pause/Reset-Steuerung
- Akustisches Feedback per Web-Audio-API (keine Audiodateien nötig):
  - Leise Gongtöne als Countdown in den letzten 10 Sekunden jeder Phase
  - Lauterer Gong beim Start und Ende jeder Übung
- Timer stoppt automatisch nach der letzten Wiederholung ("Fertig")

## Verwendung

`index.html` im Browser öffnen — es ist keine Installation oder Build-Schritt nötig.

## Dateien

- `index.html` – Struktur und Markup
- `style.css` – Styling und Animationen
- `script.js` – Timer-Logik

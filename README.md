# Yogatimer

Ein Intervall-Timer im Browser für Yoga- oder Übungseinheiten, mit sanft pulsierender Hintergrund-Animation.

## Features

- Wechselt automatisch zwischen Übungs- und Pausenphasen, für eine feste Anzahl Wiederholungen
- Einstellbare Dauer für Übung (Sekunden), Pause (Sekunden) und Anzahl der Wiederholungen
- Start/Pause/Reset-Steuerung
- Akustisches Feedback per Web-Audio-API (keine Audiodateien nötig):
  - Leise Gongtöne als Countdown in den letzten 10 Sekunden jeder Phase
  - Lauterer Gong beim Start und Ende jeder Übung
- Timer stoppt automatisch nach der letzten Wiederholung ("Fertig")
- Installierbar als App (Progressive Web App) auf Android und iPhone, inkl. Offline-Nutzung

## Verwendung

`index.html` im Browser öffnen — es ist keine Installation oder Build-Schritt nötig.

### Als App aufs Handy installieren

- **Android (Chrome)**: Seite öffnen → Menü (⋮) → "Zum Startbildschirm hinzufügen" bzw. "App installieren"
- **iPhone (Safari)**: Seite öffnen → Teilen-Symbol → "Zum Home-Bildschirm"

Danach startet der Yogatimer wie eine normale App vom Homescreen, im Vollbild ohne Browser-Leiste, und funktioniert auch offline.

## Dateien

- `index.html` – Struktur und Markup
- `style.css` – Styling und Animationen
- `script.js` – Timer-Logik
- `manifest.json` – App-Metadaten für die Installation (Name, Icons, Farben)
- `service-worker.js` – Offline-Caching für die installierte App
- `icons/` – App-Icons in verschiedenen Größen

Live unter: https://communicart1970.github.io/yogatimer/

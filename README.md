# Meta-Visualisierung
Visualisierung und Regelungssimulation für Heizungssysteme („Meta Visualisierung“) – C.M.I.-Webseite (Technische Alternative) im MTF-Design.

![Vorschau](vorschau.png)

## Ordner
| Ordner | Inhalt |
|---|---|
| `cmi/` | Dateien für das C.M.I.: `1.html`, `1.cgi`, `1.png`, `config.tas` |
| `original/` | Ursprüngliche Dateien (zum Vergleich / Zurücksetzen) |
| `tools/` | Hintergrund-Vorlage, MTF-Logo, Render-Skript |

## Funktion
Alle Werte (`c o c …`-Zeilen), die einstellbaren Felder (`class="changex2"` + `adresse`) und `config.tas` sind unverändert.
Die einstellbaren Felder haben einen farbigen Rahmen und ein ✎-Symbol – ein Klick öffnet wie bisher die Eingabe.

## MTF-Logo tauschen
`tools/mtf_logo.svg` ist ein Platzhalter. Echtes Logo als `tools/mtf_logo.png` ablegen und ausführen:

```
node tools/render.js
```

Das erzeugt `cmi/1.png` (Hintergrund mit Logo) und `vorschau.png` neu.

## Beschriftungen ändern
Die Beschriftungen stehen als Text in `cmi/1.cgi` (z. B. `Anzeige 1`, `Wert A`) und können direkt angepasst werden.

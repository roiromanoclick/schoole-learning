# schoole-learning

Collection of small learning web apps. Each project lives in its own sub-folder and is served by GitHub Pages
at `https://roiromanoclick.github.io/schoole-learning/<project>/`.

| Project | Description |
|---|---|
| [math-review-grade4](math-review-grade4/) | Hebrew (RTL) math review for 4th grade — works offline (PWA) |
| [english-memory-grade4](english-memory-grade4/) | Hebrew (RTL) English-vocabulary memory (pairs) game for 4th grade — 20 word/translation pairs, 3 levels, "word bank" matching game, pronunciation, best scores — works offline (PWA) |
| [math-review-grade5](math-review-grade5/) | Hebrew (RTL) multiplication review for 5th grade — times tables, ×10/100/1000, vertical and 2-digit multiplication, decimals, word problems — works offline (PWA) |
| [grade1-prep](grade1-prep/) | Hebrew (RTL) kindergarten→grade 1 prep for ages ~5 — 100 picture questions in 12 worlds (letters, sounds, numbers, counting, add/subtract, shapes, colors, comparisons, patterns, world), voice read-aloud, no test/scores — works offline (PWA) |
| [math-review-grade6](math-review-grade6/) | Hebrew (RTL) math & geometry review for 6th grade — fractions (as division, multiply, divide), prisms, word problems — works offline (PWA) |

Adding a project: create a new sub-folder with its own `index.html`, and add a card to the root `index.html`.
Note: all projects share one origin, so use a unique `localStorage` key prefix and a unique service-worker cache name per project.

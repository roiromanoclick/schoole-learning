# schoole-learning

Collection of small learning web apps. Each project lives in its own sub-folder and is served by GitHub Pages
at `https://roiromanoclick.github.io/schoole-learning/<project>/`.

| Project | Description |
|---|---|
| [math-review-grade4](math-review-grade4/) | Hebrew (RTL) math review for 4th grade — works offline (PWA) |
| [math-review-grade6](math-review-grade6/) | Hebrew (RTL) math & geometry review for 6th grade — fractions (as division, multiply, divide), prisms, word problems — works offline (PWA) |

Adding a project: create a new sub-folder with its own `index.html`, and add a card to the root `index.html`.
Note: all projects share one origin, so use a unique `localStorage` key prefix and a unique service-worker cache name per project.

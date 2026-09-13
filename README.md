# DockHipper Website

Static one-page distribution website for the DockHipper macOS app.

## Structure

- `index.html`: Page markup in the requested order: Header / Hero, How to Install, Figure / Timer tabs, Feature, Apple Notarized, Feedback, Footer.
- `styles.css`: Desktop-first layout, responsive rules, segmented tabs, sticky feature panel, and highlight overlay styling.
- `main.js`: Figure / Timer tab switching, scroll progress calculation, active step updates, screenshot swapping, and description transitions.
- `config.js`: Download constants, feedback constants, image paths, feature copy, and highlight coordinates.
- `assets/images/hero/macbook.png`: Hero MacBook image.
- `assets/images/ui/figure-popup.png`: Figure settings popup screenshot used for all Figure steps.
- `assets/images/ui/timer-settings.png`: Timer settings screenshot for Hours / Minutes and Start Timer.
- `assets/images/ui/timer-complete-dock.png`: Timer completion screenshot used for Timer step 03.
- `assets/images/decor/pompom.png`: Pompom decorative image.
- `downloads/`: Put the signed and notarized app ZIP here.

## Figure Scroll Animation

The Figure tab uses one fixed screenshot throughout the scroll.

`main.js` calculates the user's progress inside `#featureScroll`, maps it to one of four steps, then updates:

- the active step in the left navigation,
- the CSS overlay highlight box,
- the right description card.

The image remains `assets/images/ui/figure-popup.png` for steps 01-04; only the highlight coordinates and description text change.

The sticky behavior is handled with CSS:

```css
.feature-pin {
  position: sticky;
  top: 24px;
}
```

Figure steps are configured in `config.js` under:

```js
tabs.figure.steps
```

## Timer Scroll Animation

The Timer tab uses the same implementation as Figure, but with three steps.

Timer steps are configured in `config.js` under:

```js
tabs.timer.steps
```

Steps 01 and 02 use `assets/images/ui/timer-settings.png`. Step 03 intentionally switches to `assets/images/ui/timer-complete-dock.png` with a light image fade.

## Edit Highlight Positions

Highlight boxes are CSS overlays, not edited into the images.

Edit each step's `highlight` object in `config.js`:

```js
highlight: { left: 5.4, top: 44.0, width: 85.6, height: 39.9 }
```

The values are percentages relative to the displayed screenshot:

- `left`: distance from the left edge
- `top`: distance from the top edge
- `width`: highlight width
- `height`: highlight height

## Replace Image Assets

Replace files directly or update their paths in `config.js`.

- Hero MacBook: `assets/images/hero/macbook.png`
- Figure screenshot: `assets/images/ui/figure-popup.png`
- Timer screenshots: `assets/images/ui/timer-settings.png`, `assets/images/ui/timer-complete-dock.png`
- Pompom decoration: `assets/images/decor/pompom.png`

Keep the same filenames if you want the site to update without editing code.

## Download URL

Put the app ZIP here:

```text
downloads/DockHipper.zip
```

Or edit `DOWNLOAD_URL` in `config.js`:

```js
const DOWNLOAD_URL = "./downloads/DockHipper.zip";
```

Release metadata is also in `config.js`:

```js
const APP_VERSION = "1.0";
const FILE_SIZE = "TBD";
const MIN_MACOS_VERSION = "macOS 13.0+";
```

## Feedback URL

Edit `FEEDBACK_URL` in `config.js`:

```js
const FEEDBACK_URL = "https://forms.gle/your-form-id";
```

Until it is set, feedback links fall back to a placeholder email link.

## Local Preview

Open the file directly:

```text
website/index.html
```

Or run a local server from this folder:

```sh
python3 -m http.server 8787
```

Then open:

```text
http://127.0.0.1:8787
```

Useful preview URLs:

```text
http://127.0.0.1:8787
http://127.0.0.1:8787/?tab=timer
http://127.0.0.1:8787/?tab=figure&step=3
```

## Deploy to GitHub Pages

1. Commit this website folder as the repository root.
2. In GitHub, go to Settings -> Pages.
3. Set Source to GitHub Actions.
4. Add a workflow that uploads the `website` folder as the Pages artifact.

Example:

```yaml
name: Deploy DockHipper Website

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .
      - id: deployment
        uses: actions/deploy-pages@v4
```

For large ZIP files, upload the release to GitHub Releases and set `DOWNLOAD_URL` to the release asset URL.

## Deploy to Vercel

1. Import the repository in Vercel.
2. Leave the project root directory as the repository root.
3. Leave the build command empty.
4. Set the output directory to `.`.
5. Deploy.

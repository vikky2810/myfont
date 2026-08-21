# Viks

My handwriting, turned into a font you can type with. This repo holds the font files and the single-page site that lets you try them before downloading.

## What's actually in the font

Uppercase A to Z, lowercase a to z, the space, and eight marks: `! " ' , . : ; ?`

Nothing else. There are no digits, no hyphen, no parentheses, no slash, no `@` or `&`, so a line like `Aug 2026` comes out half handwritten and half system sans. The tester on the site tells you when you've typed something the font can't render, which is less annoying than finding out later in Canva.

Drawn on a Calligraphr template, scanned back in, exported to three formats:

| File | Size | Use it for |
| --- | --- | --- |
| `fonts/Viks-Regular.otf` | 14 KB | installing on Windows or macOS |
| `fonts/Viks-Regular.ttf` | 14 KB | Word, Canva, anything older |
| `fonts/Viks-Regular.woff2` | 8 KB | your own websites |

## The site

Four things: `index.html`, `style.css`, `script.js`, and `fonts/`. No build step and no dependencies. Double-click `index.html` and it runs, though the copy-UPI button needs a real origin because `navigator.clipboard` refuses to work on `file://`; there's a `document.execCommand` fallback, but a local server is cleaner:

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

What's on the page:

- A contenteditable type tester with sliders for size, letter spacing, and line height, plus left/center/right alignment
- A live warning listing any characters you typed that the font doesn't cover
- A clickable grid of every glyph, which appends to the sample
- Specimen rows at four sizes, and cards on where the font works and where it falls apart
- Dark mode, stored in `localStorage` under the key `viks-theme`
- A confirm dialog on every download link that asks for a UPI tip first, with focus trapping and Escape to close

## Using it on a page of your own

Copy `fonts/` next to your CSS and point an `@font-face` at it. The fallback matters here more than usual, since the sans is doing real work for every digit and symbol:

```css
@font-face {
  font-family: "Viks";
  src: url("fonts/Viks-Regular.woff2") format("woff2"),
       url("fonts/Viks-Regular.otf")   format("opentype");
  font-display: swap;
}

h1 { font-family: "Viks", ui-sans-serif, system-ui, sans-serif; }
```

## Installing it locally

Right-click the `.otf` on Windows and pick Install. On a Mac, double-click it and hit Add Font.

## Before this goes public

`index.html` still has `yourname@upi` sitting in the download dialog as a placeholder. Search for `upi-id` and swap in the real one, or delete that block if you'd rather not ask.

There's no LICENSE file yet. The site says the font is free to use, which isn't the same as a license anyone can rely on, so pick one and commit it.

To put the site online, turn on GitHub Pages for this repo from the `main` branch root. It'll land at https://vikky2810.github.io/myfont/.

## Filling in the missing characters

Open the Calligraphr template again, draw the tiles you skipped the first time, export, and drop the new files over the ones in `fonts/`. The site needs no code change; `script.js` keeps its own list of supported characters near the top, so update that set to match.

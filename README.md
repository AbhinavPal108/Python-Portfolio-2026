# Abhinav Pal — Interactive Book Portfolio

A 10-chapter, book-style portfolio built on the original Node.js + Express project. It includes a cover page, clickable index, chapter navigation, animated page transitions, responsive layout, light/dark mode, media embeds, and an in-browser JSON editor.

## Run locally (Windows / macOS / Linux)

1. Install Node.js LTS.
2. Extract this ZIP.
3. Open the extracted folder in VS Code or a terminal.
4. Run:

```bash
npm install
npm start
```

5. Visit **http://localhost:3000**.

## Edit or add content later

Click **Edit portfolio** in the top-right corner (or **Edit** inside a chapter). The editor contains the complete `data/portfolio.json` data.

- Change a chapter's `title`, `description`, `body`, `reflection`, `facts`, `tags`, `media` or `links`.
- Add a chapter by adding another object to the `items` array.
- Remove a chapter by removing its object.
- Add a photo by copying it into `public/media/` and adding a media object such as:
  `{"type":"image","src":"/media/my-photo.jpg","caption":"My caption"}`
- Add a Google Drive video using a preview URL ending in `/preview` and `{"type":"video","src":"...","caption":"..."}`.
- Add Google Slides using its `/embed` URL and `{"type":"embed","src":"...","caption":"..."}`.
- Download a JSON backup before major edits; restore a backup through the same editor.

The editor saves through the existing Express API. On local development it works without an admin key. For production, set a private `ADMIN_KEY` environment variable; the editor will request it before saving. Do not put the key in this ZIP or commit it to Git.

## Project structure

- `server.js` — Express server and portfolio API
- `data/portfolio.json` — all editable profile and chapter content
- `public/index.html` — app structure
- `public/style.css` — visual design and responsive styles
- `public/app.js` — navigation, rendering, editing and backup/restore
- `public/media/` — supplied portfolio photographs and screenshots

## Notes

- Google Drive embeds require the file to be shared with **Anyone with the link — Viewer**. If embedding is blocked by Google or an institution's policy, the chapter still provides a direct link.
- Google Slides embeds likewise depend on the presentation's sharing permissions.
- The storyboard chapter links to the video provided. The video contents have not been described in detail, so the chapter does not invent a scene-by-scene storyboard.
- HearAssist is presented as a proposed architecture, not as a clinically validated or fully implemented device.
- Udemy progress is shown as 105/118 lessons (about 89%); it is not described as a completed certificate.
- The Japanese learning platform is described using the features and technology stack discussed for the project. Potential monetization ideas are clearly identified as future possibilities, not existing revenue.

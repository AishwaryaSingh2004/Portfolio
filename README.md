# Aishwarya Singh — Portfolio

Scroll-animated portfolio (React + Vite). The old version is kept in `_old-site/`.

## Run locally

```bash
npm install --cache /private/tmp/portfolio-npm-cache
npm run dev
```

## Add the cinematic scroll video

1. Make a hero image (ChatGPT / Nano Banana) and animate it (Google Flow) — download the MP4.
2. `brew install ffmpeg` (one time)
3. `npm run frames -- path/to/video.mp4`

This writes `public/frames/` + `manifest.json`. The landing page picks it up automatically;
scrolling from top to the end of the footer plays the video start to finish. Delete
`public/frames/` to go back to the photo fallback.

## Edit content

All text (projects, experience, skills, contact links) lives in `src/data.js`.

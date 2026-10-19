# JOTA · WB6BSA

## Download the ready-to-publish website

Download [WB6BSA-website.zip](https://github.com/pkoniarski/JOTA/raw/refs/heads/main/WB6BSA-website.zip), unzip it, then drag the extracted folder onto [Netlify Drop](https://app.netlify.com/drop). Netlify supplies a public website address. This ZIP contains the production build, with clearly labelled sample classes until the station sources are configured. After editing source or configuration, rebuild and refresh this ZIP before deploying again.

A responsive station website with an introduction, Excel class schedule, live audio player, external photo gallery, contact section, and motion that respects reduced-motion preferences.

## Development

Use Node.js 22.12+ (Node 24 works).

```sh
npm ci --cache /tmp/jota-npm-cache
npm run dev -- --port 5173
```

`npm run build` creates `dist/`. `npm run preview` serves that build locally. Deploy `dist/` to a static HTTPS host. No secrets or backend are needed.

## Connect your station

Edit `public/station.json`, then rebuild for production. All configuration is public: never put passwords or private keys here.

- `introduction`: introduction paragraph.
- `streamUrl`: public HTTPS audio stream URL supported by browsers, such as MP3 or AAC. A radio station webpage or playlist file is not a direct audio stream. Playback starts only after the listener presses play.
- `scheduleUrl`: direct public `.xlsx` download URL. The first worksheet must have these headers in its first row (case insensitive): `time`, `title`, `description`, `location`, `duration`. Example row: `09:00 | Radio basics | Make your first call | Radio tent | 45 min`. Format time and duration as text for predictable display. Rows appear in sheet order. Loads on page opening; the refresh button reloads the source.
- `albumUrl`: link to the original album, opened in a separate tab.
- `albumFeedUrl`: optional public JSON endpoint returning an array of `{ "url": "https://…/photo.jpg", "caption": "A day in the field" }`. Refreshed on page opening. Generic Google Photos/Flickr album pages cannot be embedded directly as a JSON feed; use a supported public feed/export or list direct images below.
- `photos`: fallback array using the same photo format. Publish only images you have permission to share.
- `email`, `location`: public contact details.

External sheet and JSON servers must allow browser requests from the site's origin (CORS), and use HTTPS when the website uses HTTPS. Normal share-page URLs that return HTML will not work as Excel downloads. For hosts without CORS support, place a public export in `public/` and use a site-relative URL, or arrange a controlled server-side integration separately. Never put private sheet credentials in the browser.

Without configured sources, the page explicitly labels its example classes and illustrated gallery placeholders, disables radio playback, and displays a contact placeholder. Failed configured sources display an unavailable message rather than presenting examples as real events.

## Validation

Production build and Chromium browser smoke checks cover desktop/mobile layout, sample content, actual XLSX parsing through a mocked external response, gallery loading, contacts, player controls, and a failed schedule request. Real station playback and provider access require the station URLs.

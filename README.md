# spotify-metadata

> Get metadata from Spotify URLs. Written in TypeScript, distributed as ESM.

## Install

Install directly from GitHub:

```bash
npm install github:kisastractors/spotify-metadata
```

or with Bun:

```bash
bun add github:kisastractors/spotify-metadata
```

You can also install a specific version using a Git tag:

```bash
npm install github:kisastractors/spotify-metadata#v1.0.0
```

## Usage

This package uses the runtime's native `fetch` implementation.

Requirements:

* Node.js >= 18
* Bun

```ts
import {
  getData,
  getPreview,
  getTracks,
  getDetails
} from "spotify-url-info";
```

There are four functions:

* **getData** — full data, close to the shape returned by Spotify's embed page.

* **getPreview** — normalized fields (title, artist, image, audio, link...), same shape regardless of resource type (track, album, artist, playlist).

* **getTracks** — array of tracks (max 100), parsed from Spotify data.

* **getDetails** — both `getPreview` and `getTracks` in a single request.

All methods take a Spotify URL as the first argument:

```ts
const data = await getPreview(
  "https://open.spotify.com/track/5nTtCOCds6I0PHMNtqelas"
);
```

An optional second argument lets you pass fetch options:

```ts
const data = await getPreview(
  "https://open.spotify.com/track/5nTtCOCds6I0PHMNtqelas",
  {
    headers: {
      "user-agent": "googlebot"
    }
  }
);
```

Example output:

```json
{
  "title": "Immaterial",
  "type": "track",
  "track": "Immaterial",
  "artist": "SOPHIE",
  "image": "https://i.scdn.co/image/d6f496a6708d22a2f867e5acb84afb0eb0b07bc1",
  "audio": "https://p.scdn.co/mp3-preview/6be8eb12ff18ae09b7a6d38ff1e5327fd128a74e",
  "link": "https://open.spotify.com/track/5nTtCOCds6I0PHMNtqelas",
  "embed": "https://embed.spotify.com/?uri=spotify:track:5nTtCOCds6I0PHMNtqelas",
  "date": "2018-06-15T00:00:00.000Z",
  "description": "description of a podcast episode"
}
```

A field you can't retrieve will be `undefined`.

There is no strict guarantee on the shape of this data since it depends on scraping Spotify's embed pages — handle it defensively.

## Versioning

This package is distributed through GitHub releases and tags.

To use a stable version:

```bash
npm install github:kisastractors/spotify-metadata#v1.0.0
```

Latest development version:

```bash
npm install github:kisastractors/spotify-metadata#main
```

## Note

This package has been reviewed and typed with TypeScript, including type definitions, error handling, and ESM packaging.

The package does not use the Spotify API. It extracts metadata from Spotify embed pages.

## License

MIT
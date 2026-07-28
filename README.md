# spotify-url-info-ts-ts

> Get metadata from Spotify URLs. Written in TypeScript, distributed as ESM.

## Install

```bash
npm install spotify-url-info-ts
```

## Usage

You need to provide a `fetch` implementation:

```ts
import fetch from 'isomorphic-unfetch'
import spotifyUrlInfo from 'spotify-url-info-ts'

const { getData, getPreview, getTracks, getDetails } = spotifyUrlInfo(fetch)
```

There are four functions:

- **getData** — full data, close to the shape returned by the Spotify API.
- **getPreview** — normalized fields (title, artist, image, audio, link...), same shape regardless of resource type (track, album, artist, playlist).
- **getTracks** — array of tracks (max 100), raw shape from Spotify.
- **getDetails** — both `getPreview` and `getTracks` in a single request.

All methods take a Spotify URL as the first argument:

```ts
const data = await getPreview('https://open.spotify.com/track/5nTtCOCds6I0PHMNtqelas')
```

An optional second argument lets you pass fetch options:

```ts
const data = await getPreview(
  'https://open.spotify.com/track/5nTtCOCds6I0PHMNtqelas',
  { headers: { 'user-agent': 'googlebot' } }
)
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

A field you can't retrieve will be `undefined`. There's no strict guarantee on the shape of this data since it depends on scraping Spotify's embed pages — handle it defensively.

## Note

This version has been reviewed and typed by Claude: types added throughout, error handling fixed, and packaged as ESM/TypeScript.

## License

MIT
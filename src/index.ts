import * as spotifyURI from "spotify-uri";
import {
  parse,
  type HimalayaElement,
  type HimalayaTextNode,
  type HimalayaNode,
} from "himalaya";

// ---- Types ----

type SpotifyType = "album" | "artist" | "episode" | "playlist" | "track";

const TYPE: Record<string, SpotifyType> = {
  ALBUM: "album",
  ARTIST: "artist",
  EPISODE: "episode",
  PLAYLIST: "playlist",
  TRACK: "track",
};

const ERROR = {
  REPORT:
    "Please report the problem at https://github.com/Kisakay/spotify-url-info/issues.",
  NOT_DATA: "Couldn't find any data in embed page that we know how to parse.",
  NOT_SCRIPTS: "Couldn't find scripts to get the data.",
};

const SUPPORTED_TYPES: SpotifyType[] = Object.values(TYPE);

// Minimal shape of the data returned by Spotify's embed page
export interface SpotifyImage {
  url: string;
  width?: number;
  height?: number;
}

export interface SpotifyArtist {
  name: string;
}

export interface SpotifyShow {
  publisher: string;
}

export interface SpotifyTrackData {
  title: string;
  subtitle?: string;
  duration?: number;
  isPlayable?: boolean;
  audioPreview?: { url: string };
  uri: string;
  artists?: SpotifyArtist[];
  show?: SpotifyShow;
  description?: string;
}

export interface SpotifyEntityData {
  type: string;
  name: string;
  uri: string;
  subtitle?: string;
  description?: string;
  releaseDate?: { isoString?: string };
  release_date?: string;
  coverArt?: { sources: SpotifyImage[] };
  images?: SpotifyImage[];
  visualIdentity?: { image: SpotifyImage[] };
  trackList?: SpotifyTrackData[];
  [key: string]: unknown;
}

export interface Track {
  artist: string | string[] | undefined;
  duration: number | undefined;
  name: string;
  previewUrl: string | undefined;
  uri: string;
}

export interface Preview {
  date: string | undefined;
  title: string;
  type: string;
  track: string;
  description: string | undefined;
  artist: string | string[] | undefined;
  image: string | undefined;
  audio: string | undefined;
  link: string;
  embed: string;
}

export interface Details {
  preview: Preview;
  tracks: Track[];
}

class SpotifyParseError extends TypeError {
  html?: string;
}

// ---- Helpers ----

const throwError = (message: string, html?: string): never => {
  const error = new SpotifyParseError(`${message}\n${ERROR.REPORT}`);
  error.html = html;
  throw error;
};

const parseData = (html: string): SpotifyEntityData => {
  const embed = parse(html);

  const htmlNode = embed.find(
    (el): el is HimalayaElement =>
      el.type === "element" && el.tagName === "html",
  );
  if (htmlNode === undefined) return throwError(ERROR.NOT_SCRIPTS, html);

  const bodyNode = htmlNode.children.find(
    (el): el is HimalayaElement =>
      el.type === "element" && el.tagName === "body",
  );

  const scripts: HimalayaElement[] = (bodyNode?.children ?? []).filter(
    (el): el is HimalayaElement =>
      el.type === "element" && el.tagName === "script",
  );

  let script = scripts.find((script) =>
    script.attributes.some(({ value }) => value === "resource"),
  );

  if (script !== undefined) {
    const content = (script.children[0] as HimalayaTextNode).content;
    const data = JSON.parse(
      Buffer.from(content, "base64").toString("utf-8"),
    ) as SpotifyEntityData;
    return normalizeData({ data });
  }

  script = scripts.find((script) =>
    script.attributes.some(({ value }) => value === "initial-state"),
  );

  if (script !== undefined) {
    const content = (script.children[0] as HimalayaTextNode).content;
    const parsed = JSON.parse(Buffer.from(content, "base64").toString("utf-8"));
    const data = parsed.data.entity as SpotifyEntityData;
    return normalizeData({ data });
  }

  script = scripts.find((script) =>
    script.attributes.some(({ value }) => value === "__NEXT_DATA__"),
  );

  if (script !== undefined) {
    const content = (script.children[0] as HimalayaTextNode).content;
    const string = Buffer.from(content).toString("utf-8");
    const data = JSON.parse(string).props?.pageProps?.state?.data?.entity as
      | SpotifyEntityData
      | undefined;
    if (data !== undefined) return normalizeData({ data });
  }

  return throwError(ERROR.NOT_DATA, html);
};

function getParsedUrl(url: string): string {
  try {
    const parsedURL = spotifyURI.parse(url);
    if (!parsedURL.type) throw new TypeError();
    return spotifyURI.formatEmbedURL(parsedURL);
  } catch (_) {
    throw new TypeError(`Couldn't parse '${url}' as valid URL`);
  }
}

const getImages = (data: SpotifyEntityData): SpotifyImage[] | undefined =>
  data.coverArt?.sources || data.images || data.visualIdentity?.image;

const getDate = (data: SpotifyEntityData): string | undefined =>
  data.releaseDate?.isoString || data.release_date;

const getLink = (data: SpotifyEntityData): string =>
  spotifyURI.formatOpenURL(data.uri);

function getArtistTrack(track: SpotifyTrackData): string | string[] {
  return track.show
    ? track.show.publisher
    : ([] as SpotifyArtist[])
        .concat(track.artists ?? [])
        .filter(Boolean)
        .map((a) => a.name)
        .reduce(
          (acc: string, name: string, index: number, array: string[]) =>
            index === 0
              ? name
              : acc + (array.length - 1 === index ? " & " : ", ") + name,
          "",
        );
}

const getTracks = (data: SpotifyEntityData): Track[] =>
  data.trackList
    ? data.trackList.map(toTrack)
    : [toTrack(data as unknown as SpotifyTrackData)];

function getPreview(data: SpotifyEntityData): Preview {
  const [track] = getTracks(data);
  const date = getDate(data);

  return {
    date: date ? new Date(date).toISOString() : date,
    title: data.name,
    type: data.type,
    track: track.name,
    description:
      data.description ||
      data.subtitle ||
      (track as unknown as SpotifyTrackData).description,
    artist: track.artist,
    image: getImages(data)?.reduce((a, b) =>
      (a.width ?? 0) > (b.width ?? 0) ? a : b,
    )?.url,
    audio: track.previewUrl,
    link: getLink(data),
    embed: `https://embed.spotify.com/?uri=${data.uri}`,
  };
}

const toTrack = (track: SpotifyTrackData): Track => ({
  artist: getArtistTrack(track) || track.subtitle,
  duration: track.duration,
  name: track.title,
  previewUrl: track.isPlayable ? track.audioPreview?.url : undefined,
  uri: track.uri,
});

const normalizeData = ({
  data,
}: {
  data: SpotifyEntityData;
}): SpotifyEntityData => {
  if (!data || !data.type || !data.name) {
    throw new Error("Data doesn't seem to be of the right shape to parse");
  }

  if (!SUPPORTED_TYPES.includes(data.type as SpotifyType)) {
    throw new Error(
      `Not an ${SUPPORTED_TYPES.join(", ")}. Only these types can be parsed`,
    );
  }

  data.type = data.uri.split(":")[1];

  return data;
};

// ---- Public API ----
// Uses the runtime's native `fetch` (Node >= 18 or Bun), no factory/DI needed.

async function getData(
  url: string,
  opts?: RequestInit,
): Promise<SpotifyEntityData> {
  const embedURL = getParsedUrl(url);
  const response = await fetch(embedURL, opts);
  const text = await response.text();
  return parseData(text);
}

async function getPreviewFromUrl(
  url: string,
  opts?: RequestInit,
): Promise<Preview> {
  const data = await getData(url, opts);
  return getPreview(data);
}

async function getTracksFromUrl(
  url: string,
  opts?: RequestInit,
): Promise<Track[]> {
  const data = await getData(url, opts);
  return getTracks(data);
}

async function getDetails(url: string, opts?: RequestInit): Promise<Details> {
  const data = await getData(url, opts);
  return {
    preview: getPreview(data),
    tracks: getTracks(data),
  };
}

export {
  getData,
  getLink,
  getPreviewFromUrl as getPreview,
  getTracksFromUrl as getTracks,
  getDetails,
  parseData,
  throwError,
};

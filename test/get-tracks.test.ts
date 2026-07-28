import { test, expect } from "bun:test";
import fetch from "isomorphic-unfetch";

import createSpotifyUrlInfo from "../src";

const { getTracks } = createSpotifyUrlInfo(fetch);

test("getting data for empty url should return rejection", async () => {
	await expect(getTracks("")).rejects.toThrow(
		"Couldn't parse '' as valid URL"
	);
});

test("getting data for non url string should return rejection", async () => {
	const url = "arti39anptrackspotify:://https";

	await expect(getTracks(url)).rejects.toThrow(
		"Couldn't parse 'arti39anptrackspotify:://https' as valid URL"
	);
});

test("getting data for non spotify url string should return rejection", async () => {
	const url = "http://google.com/5a2w2tgpLwv26BYJf2qYwu";

	await expect(getTracks(url)).rejects.toThrow(
		"Couldn't parse 'http://google.com/5a2w2tgpLwv26BYJf2qYwu' as valid URL"
	);
});

test("get tracks for spotify track", async () => {
	const url = "https://open.spotify.com/track/5nTtCOCds6I0PHMNtqelas";

	const tracks = await getTracks(url);

	expect(Array.isArray(tracks)).toBe(true);
	expect(tracks[0].name).toBe("Immaterial");
	expect(tracks[0].previewUrl).toContain("/mp3-preview/");
});

test("get tracks for spotify artist", async () => {
	const url = "https://open.spotify.com/artist/5a2w2tgpLwv26BYJf2qYwu";

	const tracks = await getTracks(url);

	expect(Array.isArray(tracks)).toBe(true);
	expect(typeof tracks[0].name).toBe("string");
	expect(tracks[0].previewUrl).toContain("/mp3-preview/");
});

test("get tracks for spotify album", async () => {
	const url = "https://open.spotify.com/album/4tDBsfbHRJ9OdcMO9bmnai";

	const tracks = await getTracks(url);

	expect(Array.isArray(tracks)).toBe(true);
	expect(tracks[1].name).toBe("ELLE");
	expect(tracks[1].previewUrl).toContain("/mp3-preview/");
});

test("get tracks for spotify playlist", async () => {
	const url = "https://open.spotify.com/playlist/3Q4cPwMHY95ZHXtmcU2xvH";

	const tracks = await getTracks(url);

	expect(Array.isArray(tracks)).toBe(true);
	expect(tracks[1].name).toBe("ELLE");
	expect(tracks[1].previewUrl).toContain("/mp3-preview/");
});

test("get tracks for spotify episode", async () => {
	const url = "http://open.spotify.com/episode/64TORH3xleuD1wcnFsrH1E";

	const tracks = await getTracks(url);

	expect(Array.isArray(tracks)).toBe(true);
	expect(tracks[0].name).toBe("Hasty Treat - Modules in Node");
	expect(tracks[0].previewUrl).toContain(".spotifycdn.");
});
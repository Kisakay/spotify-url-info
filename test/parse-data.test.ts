import { test, expect } from "bun:test";
import { readFile } from "node:fs/promises";
import path from "node:path";

const mapValuesDeep = (value: unknown, callback: (v: unknown) => unknown): unknown => {
	if (Array.isArray(value)) {
		return value.map((v) => mapValuesDeep(v, callback));
	}

	if (value !== null && typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value).map(([key, val]) => [
				key,
				mapValuesDeep(val, callback),
			])
		);
	}

	return callback(value);
};

import { parseData } from "../src";

const toTypeof = (value: unknown) => typeof value;

const expected = mapValuesDeep(
	{
		type: "track",
		name: "Immaterial",
		uri: "spotify:track:5nTtCOCds6I0PHMNtqelas",
		id: "5nTtCOCds6I0PHMNtqelas",
		title: "Immaterial",
		artists: [
			{
				name: "SOPHIE",
				uri: "spotify:artist:5a2w2tgpLwv26BYJf2qYwu",
			},
		],
		coverArt: {
			extractedColors: {
				colorDark: {
					hex: "#785870",
				},
				colorLight: {
					hex: "#926B88",
				},
			},
			sources: [
				{
					url: "https://i.scdn.co/image/ab67616d00001e026b03d8c63599cc94263d7d60",
					width: 300,
					height: 300,
				},
				{
					url: "https://i.scdn.co/image/ab67616d000048516b03d8c63599cc94263d7d60",
					width: 64,
					height: 64,
				},
				{
					url: "https://i.scdn.co/image/ab67616d0000b2736b03d8c63599cc94263d7d60",
					width: 640,
					height: 640,
				},
			],
		},
		releaseDate: {
			isoString: "2018-06-15T00:00:00Z",
		},
		duration: 232806,
		maxDuration: 232806,
		isPlayable: true,
		isExplicit: false,
		audioPreview: {
			url: "https://p.scdn.co/mp3-preview/97b5eb03593683855fffada4248fcfffe4dcc263",
			format: "MP3_96",
		},
		hasVideo: false,
		relatedEntityUri: "spotify:artist:5a2w2tgpLwv26BYJf2qYwu",
	},
	toTypeof
);

test("from base64", async () => {
	const html = await readFile(
		path.join(import.meta.dirname, "./fixtures/base64.html"),
		"utf-8"
	);

	const data = parseData(html);

	expect(mapValuesDeep(data, toTypeof)).toEqual(expected);
});

test("from nextjs", async () => {
	const html = await readFile(
		path.join(import.meta.dirname, "./fixtures/nextjs.html"),
		"utf-8"
	);

	const data = parseData(html);

	expect(mapValuesDeep(data, toTypeof)).toEqual(expected);
});
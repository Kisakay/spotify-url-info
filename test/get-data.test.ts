import { test, expect } from "bun:test";

import { getLink, getData } from "../src";

test("getting data for empty url should return rejection", async () => {
  await expect(getData("")).rejects.toThrow("Couldn't parse '' as valid URL");
});

test("getting data for non url string should return rejection", async () => {
  const url = "arti39anptrackspotify:://https";

  await expect(getData(url)).rejects.toThrow(
    "Couldn't parse 'arti39anptrackspotify:://https' as valid URL",
  );
});

test("getting data for non spotify url string should return rejection", async () => {
  const url = "http://google.com/5a2w2tgpLwv26BYJf2qYwu";

  await expect(getData(url)).rejects.toThrow(
    "Couldn't parse 'http://google.com/5a2w2tgpLwv26BYJf2qYwu' as valid URL",
  );
});

test("getting data for a deleted spotify url should return rejection", async () => {
  const url = "https://open.spotify.com/playlist/7E6aXqOtSnwECFLiCosTmM";

  await expect(getData(url)).rejects.toThrow(
    "Couldn't find any data in embed page that we know how to parse.\n" +
      "Please report the problem at https://github.com/Kisakay/spotify-url-info/issues.",
  );
});

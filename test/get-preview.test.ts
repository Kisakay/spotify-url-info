import { test, expect } from "bun:test";

import { getPreview } from "../src";

test("getting preview for empty url should return rejection", async () => {
  await expect(getPreview("")).rejects.toThrow(
    "Couldn't parse '' as valid URL",
  );
});

test("getting preview for non url string should return rejection", async () => {
  const url = "arti39anptrackspotify:://https";

  await expect(getPreview(url)).rejects.toThrow(
    "Couldn't parse 'arti39anptrackspotify:://https' as valid URL",
  );
});

test("getting preview for non spotify url string should return rejection", async () => {
  const url = "http://google.com/5a2w2tgpLwv26BYJf2qYwu";

  await expect(getPreview(url)).rejects.toThrow(
    "Couldn't parse 'http://google.com/5a2w2tgpLwv26BYJf2qYwu' as valid URL",
  );
});

test.skip("getting preview for non spotify url string that looks like a spotify url should return rejection", async () => {
  const url = "http://google.com/track/5nTtCOCds6I0PHMNtqelas";

  await expect(getPreview(url)).rejects.toThrow(
    "Couldn't parse 'http://google.com/track/5nTtCOCds6I0PHMNtqelas' as valid URL",
  );
});

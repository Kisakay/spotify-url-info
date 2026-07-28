import { test, expect } from "bun:test";

import { throwError } from "../src";

test("error provides details about next steps", () => {
	try {
		throwError("Couldn't find scripts to get the data.");
		throw new Error("Expected throwError() to throw");
	} catch (error) {
		expect(error).toBeInstanceOf(Error);

		expect((error as Error).message).toBe(
			"Couldn't find scripts to get the data.\n" +
			"Please report the problem at https://github.com/Kisakay/spotify-url-info-ts/issues."
		);
	}
});
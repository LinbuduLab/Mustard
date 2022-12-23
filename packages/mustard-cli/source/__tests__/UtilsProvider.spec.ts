import { describe, it, expect, vi, beforeEach } from "vitest";
import tmp from "tmp";

import {
  JSONHelper,
  MustardUtilsProvider,
} from "../Components/MustardUtilsProvider";

describe("UtilsProvider", () => {
  it("should provide internal utils", () => {
    const utils = MustardUtilsProvider.produce();

    expect(utils.json).toBeDefined();
    expect(utils.json.read).toBeDefined();
    expect(utils.json.readSync).toBeDefined();
    expect(utils.json.write).toBeDefined();
    expect(utils.json.writeSync).toBeDefined();
  });
});

describe("JSONHelper", () => {
  it("should read json file", async () => {
    const tmpFile1 = tmp.fileSync();
    const tmpFile2 = tmp.fileSync();
    const filePath1 = tmpFile1.name;
    const filePath2 = tmpFile1.name;
    const content = { foo: "bar" };

    await JSONHelper.writeJson(filePath1, content);

    const parsed = await JSONHelper.readJson(filePath1);

    expect(parsed).toEqual(content);

    JSONHelper.writeJsonSync(filePath2, content);

    const parsed2 = JSONHelper.readJsonSync(filePath2);

    expect(parsed2).toEqual(content);

    tmpFile1.removeCallback();
    tmpFile2.removeCallback();
  });
});

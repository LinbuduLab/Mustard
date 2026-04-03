import { describe, it, expect, vi, beforeEach } from "vitest";
import tmp from "tmp";
import fs from "fs";

import {
  ColorsHelper,
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

  it("should handle invalid json with throw switch", async () => {
    const tmpFile = tmp.fileSync();
    const filePath = tmpFile.name;

    await JSONHelper.writeJson(filePath, { foo: "bar" });
    fs.writeFileSync(filePath, "{invalid", "utf-8");

    await expect(JSONHelper.readJson(filePath)).resolves.toEqual({});

    await expect(
      JSONHelper.readJson(filePath, { throw: true })
    ).rejects.toThrow(filePath);

    expect(JSONHelper.readJsonSync(filePath)).toEqual({});
    expect(() => JSONHelper.readJsonSync(filePath, { throw: true })).toThrow(
      filePath
    );

    tmpFile.removeCallback();
  });
});

describe("ColorsHelper", () => {
  it("should evaluate color support and formatter helpers", async () => {
    const originalArgv = process.argv;

    process.argv = [...originalArgv, "--color"];
    expect(typeof ColorsHelper.isColorSupported).toBe("boolean");

    const replaceClose = (ColorsHelper as any).replaceClose as (
      value: string,
      close: string,
      replace: string,
      index: number
    ) => string;
    const formatter = (ColorsHelper as any).formatter as (
      open: string,
      close: string,
      replace?: string
    ) => (value: string) => string;
    const factory = (ColorsHelper as any).factory as (
      open: string
    ) => (value: string) => string;
    const bgFactory = (ColorsHelper as any).bgFactory as (
      open: string
    ) => (value: string) => string;

    expect(replaceClose("a\x1b[39mb\x1b[39m", "\x1b[39m", "#", 1)).toContain(
      "#"
    );
    expect(formatter("<", ">", "<>")("ab>cd")).toContain("<>cd");
    vi.spyOn(ColorsHelper, "isColorSupported", "get").mockReturnValueOnce(true);
    expect(factory("\x1b[31m")("x")).toContain("\x1b[31m");
    vi.spyOn(ColorsHelper, "isColorSupported", "get").mockReturnValueOnce(true);
    expect(bgFactory("\x1b[41m")("x")).toContain("\x1b[41m");

    process.argv = originalArgv;

    const coloredModule = await import(
      "../Components/MustardUtilsProvider.ts?force-color"
    );
    expect(typeof coloredModule.ColorsHelper.bold("x")).toBe("string");
    expect(typeof coloredModule.ColorsHelper.dim("x")).toBe("string");
    expect(typeof coloredModule.ColorsHelper.italic("x")).toBe("string");
    expect(typeof coloredModule.ColorsHelper.underline("x")).toBe("string");
    expect(typeof coloredModule.ColorsHelper.inverse("x")).toBe("string");
    expect(typeof coloredModule.ColorsHelper.hidden("x")).toBe("string");
    expect(typeof coloredModule.ColorsHelper.strikethrough("x")).toBe("string");
  });
});

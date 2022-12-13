import { describe, it, expect, vi, beforeEach } from "vitest";
import { MustardUtils } from "../Components/Utils";
import { CommandStruct } from "../Typings/Command.struct";

import mri from "mri";
import parse from "yargs-parser";
import { MustardRegistry } from "../Components/Registry";

class Foo implements CommandStruct {
  public bar: string = "bar";
  public baz: number = 1;

  handler() {}

  run() {}
}

describe("Utils", () => {
  it("should get instance field keys", () => {
    const foo = new Foo();
    const fields = MustardUtils.getInstanceFields(foo);
    expect(fields).toEqual(["bar", "baz"]);
  });

  it("should get instance field values", () => {
    const foo = new Foo();
    const bar = MustardUtils.getInstanceFieldValue<string>(foo, "bar");
    const baz = MustardUtils.getInstanceFieldValue<number>(foo, "baz");
    expect(bar).toBe("bar");
    expect(baz).toBe(1);
  });

  it("should set instance field values", () => {
    const foo = new Foo();
    const bar = MustardUtils.setInstanceFieldValue<string>(foo, "bar", "baz");
    const baz = MustardUtils.setInstanceFieldValue<number>(foo, "baz", 2);
    expect(bar).toBe("baz");
    expect(baz).toBe(2);
  });

  it("should ensure array", () => {
    const foo = MustardUtils.ensureArray("foo");
    const bar = MustardUtils.ensureArray(["bar"]);
    expect(foo).toEqual(["foo"]);
    expect(bar).toEqual(["bar"]);
  });

  it("should check is constructable", () => {
    expect(MustardUtils.isConstructable(Foo)).toBe(true);
    expect(MustardUtils.isConstructable(Array)).toBe(true);

    expect(MustardUtils.isConstructable("bar")).toBe(false);
    expect(MustardUtils.isConstructable({})).toBe(false);
    expect(MustardUtils.isConstructable([])).toBe(false);
  });

  it("should handle levenshtein computation", () => {
    expect(MustardUtils.levenshtein("fo", ["foo", "fap", "baz"])).toBe("foo");
    expect(MustardUtils.levenshtein("fo", ["fap", "baz"])).toBe("fap");
  });
});

describe("Utils.parseFromProcessArgs", () => {
  vi.mock("mri", () => {
    return {
      default: vi.fn().mockReturnValue({ type: "mri" }),
    };
  });
  vi.mock("yargs-parser", () => {
    return {
      default: vi.fn().mockReturnValue({ type: "yargs-parser" }),
    };
  });
  it("should use complete parse only when variadic option or alias option provided", () => {
    const parsed1 = MustardUtils.parseFromProcessArgs();
    expect(mri).toBeCalledWith([]);
    expect(parsed1).toEqual({ type: "mri" });

    const parsed2 = MustardUtils.parseFromProcessArgs(["foo"]);
    expect(parse).toBeCalledWith([], {
      array: ["foo"],
      alias: {},
      configuration: {
        "greedy-arrays": true,
        "strip-aliased": true,
      },
    });
    expect(parsed2).toEqual({ type: "yargs-parser" });

    const parsed3 = MustardUtils.parseFromProcessArgs([], { r: "run" });
    expect(parse).toBeCalledWith([], {
      array: [],
      alias: { r: "run" },
      configuration: {
        "greedy-arrays": true,
        "strip-aliased": true,
      },
    });
    expect(parsed3).toEqual({ type: "yargs-parser" });
  });
});

describe("Utils.findHandlerCommandWithInputs", () => {
  class Foo implements CommandStruct {
    run() {}
  }

  class Bar implements CommandStruct {
    run() {}
  }

  class Baz implements CommandStruct {
    run() {}
  }

  class Root implements CommandStruct {
    run() {}
  }

  MustardRegistry.register("foo", {
    commandInvokeName: "foo",
    commandAlias: "f",
    childCommandList: [],
    Class: Foo,
  });

  MustardRegistry.register("f", {
    commandInvokeName: "foo",
    commandAlias: "f",
    childCommandList: [],
    Class: Foo,
  });

  MustardRegistry.register("bar", {
    commandInvokeName: "bar",
    commandAlias: "b",
    childCommandList: [Baz],
    Class: Bar,
  });

  MustardRegistry.register("b", {
    commandInvokeName: "bar",
    commandAlias: "b",
    childCommandList: [Baz],
    Class: Bar,
  });

  MustardRegistry.register("baz", {
    commandInvokeName: "baz",
    childCommandList: [],
    Class: Baz,
  });

  MustardRegistry.register("root", {
    root: true,
    childCommandList: [],
    Class: Root,
  });

  it("should handle root", () => {
    const r1 = MustardUtils.findHandlerCommandWithInputs([]);
    expect(r1).toEqual({
      command: MustardRegistry.provideRootCommand(),
      inputs: [],
    });

    const r2 = MustardUtils.findHandlerCommandWithInputs(["ffff"]);
    expect(r2).toEqual({
      command: MustardRegistry.provideRootCommand(),
      inputs: ["ffff"],
    });
  });

  it("should find for only one input", () => {
    const r1 = MustardUtils.findHandlerCommandWithInputs(["foo"]);
    expect(r1).toEqual({
      command: MustardRegistry.provide("foo"),
      inputs: [],
    });

    const r2 = MustardUtils.findHandlerCommandWithInputs(["bar"]);
    expect(r2).toEqual({
      command: MustardRegistry.provide("bar"),
      inputs: [],
    });

    const r3 = MustardUtils.findHandlerCommandWithInputs(["barzzz"]);
    expect(r3).toEqual({
      command: MustardRegistry.provideRootCommand(),
      inputs: ["barzzz"],
    });
  });

  it("should handle alias", () => {
    const r1 = MustardUtils.findHandlerCommandWithInputs(["f"]);
    expect(r1).toEqual({
      command: MustardRegistry.provide("foo"),
      inputs: [],
    });

    const r2 = MustardUtils.findHandlerCommandWithInputs(["b"]);
    expect(r2).toEqual({
      command: MustardRegistry.provide("bar"),
      inputs: [],
    });

    const r3 = MustardUtils.findHandlerCommandWithInputs(["barzzz"]);
    expect(r3).toEqual({
      command: MustardRegistry.provideRootCommand(),
      inputs: ["barzzz"],
    });
  });

  it("should find for multi inputs", () => {
    const r1 = MustardUtils.findHandlerCommandWithInputs(["foo", "bar"]);
    expect(r1).toEqual({
      command: MustardRegistry.provide("foo"),
      inputs: ["bar"],
    });

    const r2 = MustardUtils.findHandlerCommandWithInputs([
      "foo",
      "1",
      "2",
      "3",
    ]);
    expect(r2).toEqual({
      command: MustardRegistry.provide("foo"),
      inputs: ["1", "2", "3"],
    });

    const r3 = MustardUtils.findHandlerCommandWithInputs(["bar", "baz"]);
    expect(r3).toEqual({
      command: MustardRegistry.provide("baz"),
      inputs: [],
    });

    const r4 = MustardUtils.findHandlerCommandWithInputs(["bar", "baz", "fff"]);
    expect(r4).toEqual({
      command: MustardRegistry.provide("baz"),
      inputs: ["fff"],
    });

    const r5 = MustardUtils.findHandlerCommandWithInputs(["bar", "baz", "foo"]);
    expect(r5).toEqual({
      command: MustardRegistry.provide("baz"),
      inputs: ["foo"],
    });
  });
});

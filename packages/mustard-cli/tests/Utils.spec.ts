import { describe, it, expect, vi, beforeEach } from "vitest";
import { MustardUtils } from "../Components/Utils";
import { MustardInternalUtils } from "../source/Utils/Utils";
import { CommandStruct } from "../Typings/Command.struct";

import mri from "mri";
import parse from "yargs-parser";
import { CommandRegistry } from "../Components/Registry";

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

  it("should check is promise", () => {
    expect(MustardUtils.isPromise(Foo)).toBe(false);
    expect(MustardUtils.isPromise(Array)).toBe(false);

    expect(MustardUtils.isPromise("bar")).toBe(false);
    expect(MustardUtils.isPromise({})).toBe(false);
    expect(MustardUtils.isPromise([])).toBe(false);

    expect(MustardUtils.isPromise(new Promise(() => {}))).toBe(true);
    expect(MustardUtils.isPromise({ then: () => {} })).toBe(true);
  });

  it("should handle levenshtein computation", () => {
    expect(MustardUtils.levenshtein("fo", ["foo", "fap", "baz"])).toBe("foo");
    expect(MustardUtils.levenshtein("fo", ["fap", "baz"])).toBe("fap");
  });

  it("should handle option initializer and restrictions", () => {
    expect(MustardUtils.isOptionInitializer({ type: "Option" })).toBe(true);
    expect(MustardUtils.isOptionInitializer("foo")).toBe(false);

    expect(MustardUtils.applyRestrictions("foo", "bar")).toBe("foo");
    expect(MustardUtils.applyRestrictions("foo", "bar", ["foo"])).toBe("foo");
    expect(MustardUtils.applyRestrictions("baz", "bar", ["foo"])).toBe("bar");
    expect(
      MustardUtils.applyRestrictions("foo", "bar", { foo: "foo", baz: "baz" }),
    ).toBe("foo");
    expect(
      MustardUtils.applyRestrictions("xxx", "bar", { foo: "foo", baz: "baz" }),
    ).toBe("bar");
  });

  it("should match command registrations by class names", () => {
    class C1 implements CommandStruct {
      run() {}
    }
    class C2 implements CommandStruct {
      run() {}
    }
    class C3 implements CommandStruct {
      run() {}
    }

    vi.spyOn(CommandRegistry, "provide").mockReturnValueOnce(
      new Map<any, any>([
        [
          "c1",
          {
            Class: C1,
            commandInvokeName: "c1",
          },
        ],
        [
          "c2",
          {
            Class: C2,
            commandInvokeName: "c2",
          },
        ],
        ["bad", undefined],
        [
          "dup",
          {
            Class: C1,
            commandInvokeName: "c1-dup",
          },
        ],
      ]),
    );

    const matched = MustardUtils.matchFromCommandClass([C1, C3]);
    expect(matched.map((item) => item.Class.name)).toEqual(["C1"]);
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

describe("Utils.filterDecoratedInstanceFields", () => {
  it("should filter and decorated fields", () => {
    class Foo implements CommandStruct {
      option1 = {
        type: "Option",
      };
      option2 = {
        type: "Options",
      };
      option3 = {
        type: "VariadicOption",
      };
      option4 = {
        type: "Input",
      };
      option5 = {
        type: "Context",
      };
      option6 = {
        type: "Utils",
      };
      option7 = {
        type: "Inject",
      };
      option8 = {
        type: "Provide",
      };
      option9 = {
        type: "Controller",
      };
      option10 = {
        type: "Service",
      };
      run() {}
    }

    const foo = new Foo();
    const fields = MustardUtils.filterDecoratedInstanceFields(foo);
    expect(fields).toMatchInlineSnapshot(`
      [
        {
          "key": "option1",
          "type": "Option",
          "value": {
            "type": "Option",
          },
        },
        {
          "key": "option2",
          "type": "Options",
          "value": {
            "type": "Options",
          },
        },
        {
          "key": "option3",
          "type": "VariadicOption",
          "value": {
            "type": "VariadicOption",
          },
        },
        {
          "key": "option4",
          "type": "Input",
          "value": {
            "type": "Input",
          },
        },
        {
          "key": "option5",
          "type": "Context",
          "value": {
            "type": "Context",
          },
        },
        {
          "key": "option6",
          "type": "Utils",
          "value": {
            "type": "Utils",
          },
        },
        {
          "key": "option7",
          "type": "Inject",
          "value": {
            "type": "Inject",
          },
        },
      ]
    `);
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

  CommandRegistry.register("foo", {
    commandInvokeName: "foo",
    commandAlias: "f",
    childCommandList: [],
    Class: Foo,
  });

  CommandRegistry.register("f", {
    commandInvokeName: "foo",
    commandAlias: "f",
    childCommandList: [],
    Class: Foo,
  });

  CommandRegistry.register("bar", {
    commandInvokeName: "bar",
    commandAlias: "b",
    childCommandList: [Baz],
    Class: Bar,
  });

  CommandRegistry.register("b", {
    commandInvokeName: "bar",
    commandAlias: "b",
    childCommandList: [Baz],
    Class: Bar,
  });

  CommandRegistry.register("baz", {
    commandInvokeName: "baz",
    childCommandList: [],
    Class: Baz,
  });

  CommandRegistry.register("root", {
    root: true,
    childCommandList: [],
    Class: Root,
  });

  it("should handle root", () => {
    const r1 = MustardUtils.findHandlerCommandWithInputs([]);
    expect(r1).toEqual({
      command: CommandRegistry.provideRootCommand(),
      inputs: [],
    });

    const r2 = MustardUtils.findHandlerCommandWithInputs(["ffff"]);
    expect(r2).toEqual({
      command: CommandRegistry.provideRootCommand(),
      inputs: ["ffff"],
    });
  });

  it("should find for only one input", () => {
    const r1 = MustardUtils.findHandlerCommandWithInputs(["foo"]);
    expect(r1).toEqual({
      command: CommandRegistry.provide("foo"),
      inputs: [],
    });

    const r2 = MustardUtils.findHandlerCommandWithInputs(["bar"]);
    expect(r2).toEqual({
      command: CommandRegistry.provide("bar"),
      inputs: [],
    });

    const r3 = MustardUtils.findHandlerCommandWithInputs(["barzzz"]);
    expect(r3).toEqual({
      command: CommandRegistry.provideRootCommand(),
      inputs: ["barzzz"],
    });
  });

  it("should handle alias", () => {
    const r1 = MustardUtils.findHandlerCommandWithInputs(["f"]);
    expect(r1).toEqual({
      command: CommandRegistry.provide("foo"),
      inputs: [],
    });

    const r2 = MustardUtils.findHandlerCommandWithInputs(["b"]);
    expect(r2).toEqual({
      command: CommandRegistry.provide("bar"),
      inputs: [],
    });

    const r3 = MustardUtils.findHandlerCommandWithInputs(["barzzz"]);
    expect(r3).toEqual({
      command: CommandRegistry.provideRootCommand(),
      inputs: ["barzzz"],
    });
  });

  it("should find for multi inputs", () => {
    const r1 = MustardUtils.findHandlerCommandWithInputs(["foo", "bar"]);
    expect(r1).toEqual({
      command: CommandRegistry.provide("foo"),
      inputs: ["bar"],
    });

    const r2 = MustardUtils.findHandlerCommandWithInputs([
      "foo",
      "1",
      "2",
      "3",
    ]);
    expect(r2).toEqual({
      command: CommandRegistry.provide("foo"),
      inputs: ["1", "2", "3"],
    });

    const r3 = MustardUtils.findHandlerCommandWithInputs(["bar", "baz"]);
    expect(r3).toEqual({
      command: CommandRegistry.provide("baz"),
      inputs: [],
    });

    const r4 = MustardUtils.findHandlerCommandWithInputs(["bar", "baz", "fff"]);
    expect(r4).toEqual({
      command: CommandRegistry.provide("baz"),
      inputs: ["fff"],
    });

    const r5 = MustardUtils.findHandlerCommandWithInputs(["bar", "baz", "foo"]);
    expect(r5).toEqual({
      command: CommandRegistry.provide("baz"),
      inputs: ["foo"],
    });
  });
});

describe("MustardInternalUtils.uniqBy", () => {
  it("should deduplicate by function iteratee", () => {
    const input = [
      { id: 1, name: "a" },
      { id: 2, name: "b" },
      { id: 3, name: "a" },
    ];
    const result = MustardInternalUtils.uniqBy(input, (item) => item.name);
    expect(result).toEqual([
      { id: 1, name: "a" },
      { id: 2, name: "b" },
    ]);
  });

  it("should deduplicate by property key", () => {
    const input = [
      { id: 1, name: "a" },
      { id: 2, name: "b" },
      { id: 3, name: "a" },
    ];
    const result = MustardInternalUtils.uniqBy(input, "name");
    expect(result).toEqual([
      { id: 1, name: "a" },
      { id: 2, name: "b" },
    ]);
  });

  it("should keep the first occurrence", () => {
    const input = [
      { id: 1, category: "x" },
      { id: 2, category: "x" },
      { id: 3, category: "y" },
    ];
    const result = MustardInternalUtils.uniqBy(input, "category");
    expect(result).toEqual([
      { id: 1, category: "x" },
      { id: 3, category: "y" },
    ]);
  });

  it("should return empty array for empty input", () => {
    const result = MustardInternalUtils.uniqBy([], (x) => x);
    expect(result).toEqual([]);
  });

  it("should return all items when all are unique", () => {
    const input = [
      { id: 1, name: "a" },
      { id: 2, name: "b" },
      { id: 3, name: "c" },
    ];
    const result = MustardInternalUtils.uniqBy(input, "name");
    expect(result).toEqual(input);
  });

  it("should handle primitive arrays with identity iteratee", () => {
    const input = [1, 2, 2, 3, 1, 4];
    const result = MustardInternalUtils.uniqBy(input, (x) => x);
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it("should handle iteratee returning different types", () => {
    const input = [{ value: 1 }, { value: "1" }, { value: 2 }];
    const result = MustardInternalUtils.uniqBy(input, (item) => item.value);
    expect(result).toEqual([{ value: 1 }, { value: "1" }, { value: 2 }]);
  });

  it("should not mutate the original array", () => {
    const input = [
      { id: 1, name: "a" },
      { id: 2, name: "a" },
    ];
    const copy = [...input];
    MustardInternalUtils.uniqBy(input, "name");
    expect(input).toEqual(copy);
  });
});

describe("MustardInternalUtils.groupBy", () => {
  it("should group by function iteratee", () => {
    const input = [
      { id: 1, category: "a" },
      { id: 2, category: "b" },
      { id: 3, category: "a" },
    ];
    const result = MustardInternalUtils.groupBy(input, (item) => item.category);
    expect(result).toEqual({
      a: [
        { id: 1, category: "a" },
        { id: 3, category: "a" },
      ],
      b: [{ id: 2, category: "b" }],
    });
  });

  it("should group by property key", () => {
    const input = [
      { id: 1, category: "a" },
      { id: 2, category: "b" },
      { id: 3, category: "a" },
    ];
    const result = MustardInternalUtils.groupBy(input, "category");
    expect(result).toEqual({
      a: [
        { id: 1, category: "a" },
        { id: 3, category: "a" },
      ],
      b: [{ id: 2, category: "b" }],
    });
  });

  it("should return empty object for empty input", () => {
    const result = MustardInternalUtils.groupBy([], (x) => String(x));
    expect(result).toEqual({});
  });

  it("should handle numeric keys via string coercion", () => {
    const input = [
      { name: "alice", age: 30 },
      { name: "bob", age: 25 },
      { name: "carol", age: 30 },
    ];
    const result = MustardInternalUtils.groupBy(input, (item) => item.age);
    expect(result).toEqual({
      "30": [
        { name: "alice", age: 30 },
        { name: "carol", age: 30 },
      ],
      "25": [{ name: "bob", age: 25 }],
    });
  });

  it("should place each item in exactly one group", () => {
    const input = [1, 2, 3, 4, 5, 6];
    const result = MustardInternalUtils.groupBy(input, (x) =>
      x % 2 === 0 ? "even" : "odd",
    );
    expect(result).toEqual({
      odd: [1, 3, 5],
      even: [2, 4, 6],
    });
  });

  it("should preserve insertion order within groups", () => {
    const input = ["banana", "apple", "blueberry", "avocado", "cherry"];
    const result = MustardInternalUtils.groupBy(input, (s) => s[0]);
    expect(result).toEqual({
      b: ["banana", "blueberry"],
      a: ["apple", "avocado"],
      c: ["cherry"],
    });
  });

  it("should not mutate the original array", () => {
    const input = [
      { id: 1, group: "x" },
      { id: 2, group: "y" },
    ];
    const copy = [...input];
    MustardInternalUtils.groupBy(input, "group");
    expect(input).toEqual(copy);
  });

  it("should handle single-element array", () => {
    const input = [{ tag: "solo" }];
    const result = MustardInternalUtils.groupBy(input, "tag");
    expect(result).toEqual({ solo: [{ tag: "solo" }] });
  });
});

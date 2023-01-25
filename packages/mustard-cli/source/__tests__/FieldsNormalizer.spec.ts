import { describe, it, expect, vi, beforeEach } from "vitest";

import {
  UnknownOptionsError,
  DidYouMeanError,
} from "../Errors/UnknownOptionsError";
import { DecoratedClassFieldsNormalizer } from "../Components/DecoratedFieldsNormalizer";
import { CommandStruct } from "../Typings/Command.struct";

class Foo implements CommandStruct {
  field1: string;

  field2: number;

  run() {}
}

const foo = new Foo();

beforeEach(() => {
  foo.field1 = "field1";
  foo.field2 = 599;
});

describe("FieldsNormalizer", () => {
  it("should throw or tip on unknown options", () => {
    class Foo implements CommandStruct {
      run() {}
    }

    DecoratedClassFieldsNormalizer.throwOnUnknownOptions(new Foo(), {}, false);

    try {
      DecoratedClassFieldsNormalizer.throwOnUnknownOptions(
        new Foo(),
        {
          foo: "bar",
        },
        false
      );
    } catch (error) {
      expect(error).toBeInstanceOf(UnknownOptionsError);
    }

    try {
      DecoratedClassFieldsNormalizer.throwOnUnknownOptions(
        new Foo(),
        {
          foo: "bar",
        },
        true
      );
    } catch (error) {
      expect(error).toBeInstanceOf(DidYouMeanError);
    }
  });

  it("should dispatch normalizer", () => {});

  it("should normalize @Context field", () => {
    DecoratedClassFieldsNormalizer.normalizeContextField(foo, "field1");

    expect(typeof foo.field1).toBe("object");
  });

  it("should normalize @Inject field", () => {});

  it("should normalize @Utils field", () => {
    DecoratedClassFieldsNormalizer.normalizeUtilField(foo, "field1");

    expect(typeof foo.field1).toBe("object");
  });

  it("should normalize @Input field", () => {
    DecoratedClassFieldsNormalizer.normalizeInputField(foo, "field1", ["foo"], {
      type: "Input",
    });

    expect(foo.field1).toEqual("foo");

    DecoratedClassFieldsNormalizer.normalizeInputField(foo, "field2", [], {
      type: "Input",
      initValue: "bar",
    });

    expect(foo.field2).toEqual("bar");

    DecoratedClassFieldsNormalizer.normalizeInputField(
      foo,
      "field3",
      ["foo", "bar", "baz"],
      {
        type: "Input",
        initValue: "bar",
      }
    );

    expect(foo.field3).toEqual(["foo", "bar", "baz"]);
  });

  it("should normalize @Option field", () => {
    DecoratedClassFieldsNormalizer.normalizeOption(
      foo,
      "field1",
      {
        foo: "foo-value",
      },
      {
        type: "Option",
        optionName: "foo",
        initValue: undefined,
      }
    );

    expect(foo.field1).toBe("foo-value");

    DecoratedClassFieldsNormalizer.normalizeOption(
      foo,
      "field1",
      {
        foo: "foo-value",
      },
      {
        type: "Option",
        optionName: "foo",
        initValue: "foo-init-value",
      }
    );

    expect(foo.field1).toBe("foo-value");

    DecoratedClassFieldsNormalizer.normalizeOption(
      foo,
      "field1",
      {},
      {
        type: "Option",
        optionName: "foo",
        initValue: "foo-init-value",
      }
    );

    expect(foo.field1).toBe("foo-init-value");
  });

  it("should normalize @VariadicOption field", () => {
    DecoratedClassFieldsNormalizer.normalizeOption(
      foo,
      "field1",
      {
        foo: ["foo-value"],
      },
      {
        type: "VariadicOption",
        optionName: "foo",
        initValue: undefined,
      }
    );

    expect(foo.field1).toEqual(["foo-value"]);

    DecoratedClassFieldsNormalizer.normalizeOption(
      foo,
      "field1",
      {
        foo: ["foo-value"],
      },
      {
        type: "VariadicOption",
        optionName: "foo",
        initValue: ["foo-init-value"],
      }
    );

    expect(foo.field1).toEqual(["foo-value"]);

    DecoratedClassFieldsNormalizer.normalizeOption(
      foo,
      "field1",
      {},
      {
        type: "VariadicOption",
        optionName: "foo",
        initValue: ["foo-init-value"],
      }
    );

    expect(foo.field1).toEqual(["foo-init-value"]);
  });

  it("should normalize @Options field", () => {
    DecoratedClassFieldsNormalizer.normalizeOptions(
      foo,
      "field1",
      {
        foo: "foo-value",
      },
      []
    );

    expect(foo.field1).toEqual({});

    DecoratedClassFieldsNormalizer.normalizeOptions(
      foo,
      "field1",
      {
        foo: "foo-value",
      },
      [
        {
          key: "bar",
          type: "Option",
          value: {
            type: "Option",
            optionName: "bar",
            initValue: "bar-value",
          },
        },
        {
          key: "baz",
          type: "VariadicOption",
          value: {
            type: "VariadicOption",
            optionName: "baz",
            initValue: ["baz-value"],
          },
        },
      ]
    );

    expect(foo.field1).toEqual({
      bar: "bar-value",
      baz: ["baz-value"],
    });
  });
});

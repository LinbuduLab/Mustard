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
    DecoratedClassFieldsNormalizer.normalizeInputField(foo, "field1", ["foo"]);

    expect(foo.field1).toEqual(["foo"]);
  });

  it("should normalize @Option and @VariadicOption field", () => {});

  it("should normalize @Options field", () => {
    DecoratedClassFieldsNormalizer.normalizeOptions(foo, "field1", {
      foo: "bar",
    });

    expect(foo.field1).toEqual({
      foo: "bar",
    });
  });
});

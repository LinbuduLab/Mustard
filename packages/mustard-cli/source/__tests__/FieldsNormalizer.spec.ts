import { describe, it, expect, vi, beforeEach } from "vitest";

import {
  UnknownOptionsError,
  DidYouMeanError,
} from "../Errors/UnknownOptionsError";
import { DecoratedClassFieldsNormalizer } from "../Components/DecoratedFieldsNormalizer";
import {
  CommandRegistryPayload,
  CommandStruct,
} from "../Typings/Command.struct";
import { MustardUtils } from "../Components/Utils";
import { MustardRegistry } from "../Components/Registry";

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

class RunCommand implements CommandStruct {
  run() {}
}

const registration = {
  commandInvokeName: "run",
  Class: RunCommand,
  root: false,
  childCommandList: [],
  commandAlias: "r",
  description: "run command",
  instance: new RunCommand(),
  decoratedInstanceFields: [
    {
      key: "foo",
      type: "Option",
      value: {
        type: "Option",
        optionName: "foo",
        optionAlias: "f",
        description: "foo option",
        initValue: "foo_default",
      },
    },
  ],
} satisfies CommandRegistryPayload;

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

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should dispatch normalizer", () => {
    vi.spyOn(
      DecoratedClassFieldsNormalizer,
      "normalizeContextField"
    ).mockImplementationOnce(() => {});
    vi.spyOn(
      DecoratedClassFieldsNormalizer,
      "normalizeUtilField"
    ).mockImplementationOnce(() => {});
    vi.spyOn(
      DecoratedClassFieldsNormalizer,
      "normalizeInputField"
    ).mockImplementationOnce(() => {});
    vi.spyOn(
      DecoratedClassFieldsNormalizer,
      "normalizeInjectField"
    ).mockImplementationOnce(() => {});
    vi.spyOn(
      DecoratedClassFieldsNormalizer,
      "normalizeOption"
    ).mockImplementationOnce(() => {});
    vi.spyOn(
      DecoratedClassFieldsNormalizer,
      "normalizeOptions"
    ).mockImplementationOnce(() => {});

    DecoratedClassFieldsNormalizer.normalizeDecoratedFields(
      {
        ...registration,
        decoratedInstanceFields: [
          {
            key: "ctx",
            type: "Context",
            value: {
              type: "Context",
            },
          },
        ],
      },
      [],
      {},
      {}
    );

    expect(
      DecoratedClassFieldsNormalizer.normalizeContextField
    ).toBeCalledTimes(1);

    DecoratedClassFieldsNormalizer.normalizeDecoratedFields(
      {
        ...registration,
        decoratedInstanceFields: [
          {
            key: "inject",
            type: "Inject",
            value: {
              type: "Inject",
              optionName: "inject",
              optionAlias: "i",
            },
          },
        ],
      },
      [],
      {},
      {}
    );

    expect(DecoratedClassFieldsNormalizer.normalizeInjectField).toBeCalledTimes(
      1
    );

    DecoratedClassFieldsNormalizer.normalizeDecoratedFields(
      {
        ...registration,
        decoratedInstanceFields: [
          {
            key: "input",
            type: "Input",
            value: {
              type: "Input",
              optionName: "input",
            },
          },
        ],
      },
      [],
      {},
      {}
    );

    expect(DecoratedClassFieldsNormalizer.normalizeInputField).toBeCalledTimes(
      1
    );

    DecoratedClassFieldsNormalizer.normalizeDecoratedFields(
      {
        ...registration,
        decoratedInstanceFields: [
          {
            key: "option",
            type: "Option",
            value: {
              type: "Option",
              optionName: "option",
            },
          },
        ],
      },
      [],
      {},
      {}
    );

    expect(DecoratedClassFieldsNormalizer.normalizeOption).toBeCalledTimes(1);

    DecoratedClassFieldsNormalizer.normalizeDecoratedFields(
      {
        ...registration,
        decoratedInstanceFields: [
          {
            key: "options",
            type: "Options",
            value: {
              type: "Options",
              optionName: "options",
            },
          },
        ],
      },
      [],
      {},
      {}
    );

    expect(DecoratedClassFieldsNormalizer.normalizeOptions).toBeCalledTimes(1);

    DecoratedClassFieldsNormalizer.normalizeDecoratedFields(
      {
        ...registration,
        decoratedInstanceFields: [
          {
            key: "vardicOption",
            type: "VariadicOption",
            value: {
              type: "VariadicOption",
              optionName: "vardicOption",
            },
          },
        ],
      },
      [],
      {},
      {}
    );

    expect(DecoratedClassFieldsNormalizer.normalizeOption).toBeCalledTimes(2);

    DecoratedClassFieldsNormalizer.normalizeDecoratedFields(
      {
        ...registration,
        decoratedInstanceFields: [
          {
            key: "utils",
            type: "Utils",
            value: {
              type: "Utils",
              optionName: "utils",
            },
          },
        ],
      },
      [],
      {},
      {}
    );

    expect(DecoratedClassFieldsNormalizer.normalizeUtilField).toBeCalledTimes(
      1
    );

    DecoratedClassFieldsNormalizer.normalizeDecoratedFields(
      {
        ...registration,
        decoratedInstanceFields: [
          {
            key: "unknown",
            // @ts-expect-error
            type: "Unknown",
            value: {
              // @ts-expect-error
              type: "Unknown",
              optionName: "unknown",
            },
          },
        ],
      },
      [],
      {},
      {}
    );

    expect(DecoratedClassFieldsNormalizer.normalizeUtilField).toBeCalledTimes(
      1
    );
    expect(
      DecoratedClassFieldsNormalizer.normalizeContextField
    ).toBeCalledTimes(1);
    expect(DecoratedClassFieldsNormalizer.normalizeInputField).toBeCalledTimes(
      1
    );
    expect(DecoratedClassFieldsNormalizer.normalizeOption).toBeCalledTimes(2);
    expect(DecoratedClassFieldsNormalizer.normalizeOptions).toBeCalledTimes(1);
    expect(DecoratedClassFieldsNormalizer.normalizeInjectField).toBeCalledTimes(
      1
    );
  });

  it("should normalize @Context field", () => {
    DecoratedClassFieldsNormalizer.normalizeContextField(foo, "field1");

    expect(typeof foo.field1).toBe("object");
  });

  it("should normalize @Inject field", async () => {
    vi.spyOn(MustardUtils, "getInstanceFieldValue").mockReturnValue({
      type: "Inject",
      identifier: "foo",
    });

    // START --- Plain Injecttion ---
    MustardRegistry.ExternalProviderRegistry = new Map().set("foo", {
      value: "injected-foo-value",
    });

    DecoratedClassFieldsNormalizer.normalizeInjectField(foo, "field1");

    expect(foo.field1).toEqual({
      value: "injected-foo-value",
    });

    // END --- Plain Injecttion ---

    // START --- Function Injecttion ---
    MustardRegistry.ExternalProviderRegistry = new Map().set(
      "foo",
      () => "computed-injected-foo-value"
    );

    DecoratedClassFieldsNormalizer.normalizeInjectField(foo, "field1");

    expect(foo.field1).toEqual("computed-injected-foo-value");
    // END --- Function Injecttion ---

    // START --- Async Function Injecttion ---
    MustardRegistry.ExternalProviderRegistry = new Map().set(
      "foo",
      () =>
        new Promise((resolve) => resolve("async-computed-injected-foo-value"))
    );

    await DecoratedClassFieldsNormalizer.normalizeInjectField(foo, "field1");

    expect(foo.field1).toEqual("async-computed-injected-foo-value");
    // END --- Async Function Injecttion ---

    // START --- Class Injecttion ---
    class InjectFoo {}

    MustardRegistry.ExternalProviderRegistry = new Map().set("foo", InjectFoo);

    DecoratedClassFieldsNormalizer.normalizeInjectField(foo, "field1");

    expect(foo.field1).toEqual(new InjectFoo());
    // END --- Class Injecttion ---
  });

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

    // @ts-expect-error
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

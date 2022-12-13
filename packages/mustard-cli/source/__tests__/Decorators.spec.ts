import { CommandStruct } from "mustard-cli";
import { MustardRegistry } from "../Components/Registry";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BuiltInDecorators } from "../Decorators/BuiltIn";
import { CommandDecorators } from "../Decorators/Command";
import { DIServiceDecorators } from "../Decorators/DIService";
import { InputDecorator } from "../Decorators/Input";
import { OptionDecorators } from "../Decorators/Option";
import { Validator } from "../Validators/index";

const { Utils, Ctx } = BuiltInDecorators;
const { Command, RootCommand } = CommandDecorators;
const { Inject } = DIServiceDecorators;
const { Input } = InputDecorator;
const { Option, Options, VariadicOption } = OptionDecorators;

class ChildCommand implements CommandStruct {
  run() {}
}

const optionImplSpy = vi.fn();

const variadicOptionImplSpy = vi.fn();

const commandImplSpy = vi.fn();

// @ts-expect-error
vi.spyOn(OptionDecorators, "OptionImpl").mockImplementation(optionImplSpy);
// @ts-expect-error
vi.spyOn(OptionDecorators, "VariadicOptionImpl").mockImplementation(
  variadicOptionImplSpy
);

// @ts-expect-error
vi.spyOn(CommandDecorators, "registerCommandImpl").mockImplementation(
  commandImplSpy
);

vi.spyOn(MustardRegistry, "registerInit");

const V = Validator.String().StartsWith("linbudu");

describe("Decorators.@Option", () => {
  beforeEach(() => {
    optionImplSpy.mockClear();
    variadicOptionImplSpy.mockClear();
  });

  it("should handle @Option overloads", () => {
    Option();
    expect(optionImplSpy).toHaveBeenLastCalledWith(null, null, null, null);

    Option(V);
    expect(optionImplSpy).toHaveBeenLastCalledWith(null, null, null, V);

    Option("dry");
    expect(optionImplSpy).toHaveBeenLastCalledWith("dry", null, null, null);

    Option("dry", "d");
    expect(optionImplSpy).toHaveBeenLastCalledWith("dry", "d", null, null);

    Option("dry", "dry run this");
    expect(optionImplSpy).toHaveBeenLastCalledWith(
      "dry",
      null,
      "dry run this",
      null
    );

    Option("dry", V);
    expect(optionImplSpy).toHaveBeenLastCalledWith("dry", null, null, V);

    Option("dry", "d", V);
    expect(optionImplSpy).toHaveBeenLastCalledWith("dry", "d", null, V);

    Option("dry", "dry run this", V);
    expect(optionImplSpy).toHaveBeenLastCalledWith(
      "dry",
      null,
      "dry run this",
      V
    );

    Option("dry", "d", "dry run this");
    expect(optionImplSpy).toHaveBeenLastCalledWith(
      "dry",
      "d",
      "dry run this",
      null
    );

    Option("dry", "d", "dry run this", V);
    expect(optionImplSpy).toHaveBeenLastCalledWith(
      "dry",
      "d",
      "dry run this",
      V
    );
  });

  it("should handle object config @Option", () => {
    Option({ name: "dry" });
    expect(optionImplSpy).toHaveBeenLastCalledWith("dry", null, null, null);

    Option({
      name: "dry",
      alias: "d",
      description: "dry run this",
      validator: V,
    });
    expect(optionImplSpy).toHaveBeenLastCalledWith(
      "dry",
      "d",
      "dry run this",
      V
    );
  });

  it("should handle @VariadicOption overloads", () => {
    VariadicOption();
    expect(variadicOptionImplSpy).toHaveBeenLastCalledWith(null, null, null);

    VariadicOption("dry");
    expect(variadicOptionImplSpy).toHaveBeenLastCalledWith("dry", null, null);

    VariadicOption("dry", "d");
    expect(variadicOptionImplSpy).toHaveBeenLastCalledWith("dry", "d", null);

    VariadicOption("dry", "dry run this");
    expect(variadicOptionImplSpy).toHaveBeenLastCalledWith(
      "dry",
      null,
      "dry run this"
    );

    VariadicOption("dry", "d", "dry run this");
    expect(variadicOptionImplSpy).toHaveBeenLastCalledWith(
      "dry",
      "d",
      "dry run this"
    );
  });

  it("should handle object config @VariadicOption", () => {
    VariadicOption({ name: "dry" });
    expect(variadicOptionImplSpy).toHaveBeenLastCalledWith("dry", null, null);

    VariadicOption({
      name: "dry",
      alias: "d",
      description: "dry run this",
    });
    expect(variadicOptionImplSpy).toHaveBeenLastCalledWith(
      "dry",
      "d",
      "dry run this"
    );
  });

  it("should handle @Options", () => {
    Options();

    expect(optionImplSpy).not.toHaveBeenCalled();

    expect(typeof Options()).toBe("function");
    // @ts-expect-error
    expect(typeof Options()()).toBe("function");
    // @ts-expect-error
    expect(Options()(undefined, { name: "optionsField" })()).toEqual({
      type: "Options",
      initValue: undefined,
    });
    // @ts-expect-error
    expect(Options()(undefined, { name: "optionsField" })(599)).toEqual({
      type: "Options",
      initValue: 599,
    });
  });
});

describe("Decorators.@Command", () => {
  it("should handle @Command overloads", () => {
    Command("run");
    expect(commandImplSpy).toHaveBeenLastCalledWith("run", null, null, []);

    Command("run", "r");
    expect(commandImplSpy).toHaveBeenLastCalledWith("run", "r", null, []);

    Command("run", "run command");
    expect(commandImplSpy).toHaveBeenLastCalledWith(
      "run",
      null,
      "run command",
      []
    );

    Command("run", "r", "run command");
    expect(commandImplSpy).toHaveBeenLastCalledWith(
      "run",
      "r",
      "run command",
      []
    );

    Command("run", [ChildCommand]);
    expect(commandImplSpy).toHaveBeenLastCalledWith("run", null, null, [
      ChildCommand,
    ]);

    Command("run", "r", [ChildCommand]);
    expect(commandImplSpy).toHaveBeenLastCalledWith("run", "r", null, [
      ChildCommand,
    ]);

    Command("run", "run command", [ChildCommand]);
    expect(commandImplSpy).toHaveBeenLastCalledWith(
      "run",
      "run command",
      null,
      [ChildCommand]
    );
  });

  it("should handle object type config for @Command", () => {
    Command({
      name: "run",
    });
    expect(commandImplSpy).toHaveBeenLastCalledWith(
      "run",
      undefined,
      undefined,
      undefined
    );

    Command({
      name: "run",
      alias: "r",
      description: "run command",
    });
    expect(commandImplSpy).toHaveBeenLastCalledWith(
      "run",
      "r",
      "run command",
      undefined
    );

    Command({
      name: "run",
      alias: "r",
      description: "run command",
      childCommandList: [ChildCommand],
    });
    expect(commandImplSpy).toHaveBeenLastCalledWith("run", "r", "run command", [
      ChildCommand,
    ]);
  });

  it("should handle root command", () => {
    // @ts-expect-error
    RootCommand()({ type: "target" }, { name: "rootClassName" });
    expect(MustardRegistry.registerInit).toBeCalledWith("rootClassName", {
      Class: {
        type: "target",
      },
      childCommandList: [],
      commandInvokeName: "root",
      root: true,
    });
  });
});

describe("Decorators.BuiltIn", () => {
  it("should handle @Utils", () => {
    expect(typeof Utils()).toBe("function");
    // @ts-expect-error
    expect(typeof Utils()()).toBe("function");
    // @ts-expect-error
    expect(Utils()(undefined, {})()).toEqual({
      type: "Utils",
    });
  });

  it("should handle @Ctx", () => {
    expect(typeof Ctx()).toBe("function");
    // @ts-expect-error
    expect(typeof Ctx()()).toBe("function");
    // @ts-expect-error
    expect(Ctx()(undefined, {})()).toEqual({
      type: "Context",
    });
  });
});

describe("Decorators.Input", () => {
  it("should handle @Input", () => {
    expect(typeof Input()).toBe("function");
    // @ts-expect-error
    expect(typeof Input()()).toBe("function");
    // @ts-expect-error
    expect(Input()(undefined, {})()).toEqual({
      type: "Input",
    });
  });
});

describe("Decorators.DIService", () => {
  it("should handle @Inject", () => {
    expect(typeof Inject()).toBe("function");
    // @ts-expect-error
    expect(typeof Inject()()).toBe("function");
    // @ts-expect-error
    expect(Input()(undefined, {})()).toEqual({
      type: "Input",
    });
  });
});

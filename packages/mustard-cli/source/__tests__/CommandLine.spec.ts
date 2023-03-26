import { describe, it, expect, vi, beforeEach } from "vitest";

import { CLI } from "../Commands/CommandLine";
import { MustardRegistry } from "../Components/Registry";
import { BuiltInCommands } from "../Commands/BuiltInCommands";
import { MustardConstanst } from "../Components/Constants";
import { MustardUtils } from "../Components/Utils";
import { DecoratedClassFieldsNormalizer } from "../Components/DecoratedFieldsNormalizer";

describe("CommandLine", () => {
  it("should register providers", () => {
    vi.spyOn(MustardRegistry.ExternalProviderRegistry, "set");

    const cli = new CLI("mm", []);

    expect(MustardRegistry.ExternalProviderRegistry.set).not.toBeCalled();

    cli.registerProvider({
      identifier: "foo",
      value: "bar",
    });

    expect(
      MustardRegistry.ExternalProviderRegistry.set
    ).toHaveBeenLastCalledWith("foo", "bar");

    class Foo {}

    cli.registerProvider(Foo);

    expect(
      MustardRegistry.ExternalProviderRegistry.set
    ).toHaveBeenLastCalledWith("Foo", Foo);

    cli.registerProvider([
      {
        identifier: "foo",
        value: "bar",
      },
      Foo,
    ]);

    expect(MustardRegistry.ExternalProviderRegistry.set).toBeCalledTimes(4);
  });

  it("should normalized configurations", () => {
    const cli1 = new CLI("mm", [], {});

    expect(cli1["options"]).toMatchInlineSnapshot(`
      {
        "allowUnknownOptions": false,
        "didYouMean": true,
        "enableUsage": true,
        "enableVersion": false,
        "ignoreValidationErrors": false,
        "lifeCycles": {},
      }
    `);

    const cli2 = new CLI("mm", [], {
      allowUnknownOptions: true,
      enableUsage: false,
      enableVersion: "1.2.7",
      didYouMean: false,
      ignoreValidationErrors: true,
    });

    expect(cli2["options"]).toMatchInlineSnapshot(`
      {
        "allowUnknownOptions": true,
        "didYouMean": false,
        "enableUsage": false,
        "enableVersion": "1.2.7",
        "ignoreValidationErrors": true,
        "lifeCycles": {},
      }
    `);

    cli2.configure({
      allowUnknownOptions: false,
      enableUsage: true,
    });

    expect(cli2["options"]).toMatchInlineSnapshot(`
      {
        "allowUnknownOptions": false,
        "didYouMean": false,
        "enableUsage": true,
        "enableVersion": "1.2.7",
        "ignoreValidationErrors": true,
        "lifeCycles": {},
      }
    `);
  });

  it("should start correctly", () => {
    const startFn = vi.fn();

    const cli: any = new CLI("mm", [], {
      lifeCycles: {
        onStart: startFn,
      },
    });

    cli["parsedArgs"] = {
      _: [],
    };

    vi.spyOn(cli, "instantiateWithParse").mockImplementation(() => {});
    vi.spyOn(cli, "dispatchRootHandler").mockImplementation(() => {});
    vi.spyOn(cli, "dispatchCommand").mockImplementation(() => {});
    vi.spyOn(BuiltInCommands, "useVersionCommand").mockImplementationOnce(
      () => {}
    );
    vi.spyOn(BuiltInCommands, "useVersionCommand").mockImplementationOnce(
      () => {}
    );

    cli.start();

    expect(cli.instantiateWithParse).toBeCalledTimes(1);
    expect(cli.dispatchRootHandler).toBeCalledTimes(1);
    expect(cli.dispatchCommand).toBeCalledTimes(0);
    expect(startFn).toBeCalledTimes(1);

    cli["parsedArgs"] = {
      _: ["foo"],
    };

    cli.start();

    expect(cli.instantiateWithParse).toBeCalledTimes(2);
    expect(cli.dispatchRootHandler).toBeCalledTimes(1);
    expect(cli.dispatchCommand).toBeCalledTimes(1);
    expect(startFn).toBeCalledTimes(2);
  });

  it("should register command", () => {
    const cli = new CLI("mm", []);

    class RunCommand {
      run() {}
    }

    class RootCommand {
      run() {}
    }

    vi.spyOn(MustardRegistry, "provideInit").mockImplementation(
      (requestName) => {
        return {
          commandInvokeName: requestName.toLowerCase().replace("command", ""),
          Class: requestName === RootCommand.name ? RootCommand : RunCommand,
          commandAlias: requestName === RootCommand.name ? undefined : "r",
          root: requestName === RootCommand.name,
          instance:
            requestName === RootCommand.name
              ? new RootCommand()
              : new RunCommand(),
          decoratedInstanceFields: [],
          childCommandList: [],
        };
      }
    );

    vi.spyOn(MustardRegistry, "register");

    cli.registerCommand([]);

    expect(MustardRegistry.register).not.toBeCalled();

    cli.registerCommand([RootCommand]);

    expect(MustardRegistry.register).toBeCalledWith(
      MustardConstanst.RootCommandRegistryKey,
      MustardRegistry.provideInit("RootCommand")
    );

    cli.registerCommand([RunCommand]);

    expect(MustardRegistry.register).toBeCalledWith(
      "run",
      MustardRegistry.provideInit("RunCommand")
    );
    expect(MustardRegistry.register).toBeCalledWith(
      "r",
      MustardRegistry.provideInit("RunCommand")
    );
  });

  it("should instantiate and parse args", () => {
    class RunCommand {}
    const cli = new CLI("mm", []);

    vi.spyOn(MustardRegistry, "provide").mockImplementationOnce(() => {
      const map = new Map();

      map.set("run", {
        Class: RunCommand,
      });

      return map as any;
    });

    vi.spyOn(
      MustardUtils,
      "filterDecoratedInstanceFields"
    ).mockImplementationOnce(() => []);

    vi.spyOn(MustardRegistry, "upsert").mockImplementationOnce(() => {});

    vi.spyOn(MustardUtils, "parseFromProcessArgs").mockImplementationOnce(
      () => ({
        _: ["foo", "bar"],
      })
    );

    cli["instantiateWithParse"]();

    expect(MustardRegistry.upsert).toBeCalledWith("run", {
      instance: new RunCommand(),
      decoratedInstanceFields: [],
    });
    expect(cli["parsedArgs"]).toMatchInlineSnapshot(`
      {
        "_": [
          "foo",
          "bar",
        ],
      }
    `);
  });

  it("should dispatch commands", () => {
    const cli = new CLI("mm", []);
    class RunCommand {
      run() {}
    }

    vi.spyOn(MustardUtils, "findHandlerCommandWithInputs").mockReturnValueOnce({
      command: {
        commandInvokeName: "run",
        Class: RunCommand,
        commandAlias: "r",
        root: false,
        instance: new RunCommand(),
        decoratedInstanceFields: [],
        childCommandList: [],
      },
      inputs: ["bar"],
    });

    vi.spyOn(BuiltInCommands, "useHelpCommand").mockImplementationOnce(
      () => {}
    );

    // @ts-expect-error
    vi.spyOn(cli, "handleCommandExecution").mockImplementationOnce(() => {});

    cli["parsedArgs"] = {
      _: ["run", "bar"],
    };

    cli["dispatchCommand"]();

    expect(MustardUtils.findHandlerCommandWithInputs).toBeCalledWith([
      "run",
      "bar",
    ]);

    expect(BuiltInCommands.useHelpCommand).toBeCalledTimes(1);
    // @ts-expect-error
    expect(cli.handleCommandExecution).toBeCalledTimes(1);

    vi.spyOn(MustardUtils, "findHandlerCommandWithInputs").mockReturnValueOnce({
      // @ts-expect-error
      command: null,
      inputs: ["bar"],
    });

    try {
      cli["dispatchCommand"]();
    } catch (error) {
      expect(error).toMatchInlineSnapshot(`
        [CommandNotFoundError: Command not found with parsed args: {
          "_": [
            "run",
            "bar"
          ]
        }]
      `);
    }
  });

  it("should dispatch root handler", () => {
    const cli = new CLI("mm", []);

    vi.spyOn(BuiltInCommands, "useHelpCommand").mockImplementation(() => {});

    // @ts-expect-error
    vi.spyOn(cli, "executeCommandFromRegistration").mockResolvedValue();

    class RootCommand {
      run() {}
    }

    const rootRegistration = {
      commandInvokeName: "root",
      Class: RootCommand,
      commandAlias: null,
      root: true,
      instance: new RootCommand(),
      decoratedInstanceFields: [],
      childCommandList: [],
    };

    vi.spyOn(MustardRegistry, "provideRootCommand").mockReturnValueOnce(
      rootRegistration
    );

    cli["parsedArgs"] = {
      _: ["p1", "p2", "p3"],
    };

    cli["dispatchRootHandler"]();

    expect(BuiltInCommands.useHelpCommand).toBeCalledTimes(1);
    expect(BuiltInCommands.useHelpCommand).toHaveBeenLastCalledWith(
      "mm",
      {
        _: ["p1", "p2", "p3"],
      },
      rootRegistration,
      true
    );

    // @ts-expect-error
    expect(cli.executeCommandFromRegistration).toBeCalledWith(rootRegistration);

    // @ts-expect-error
    vi.spyOn(MustardRegistry, "provideRootCommand").mockReturnValueOnce(null);

    cli.configure({
      enableUsage: true,
    });

    cli["dispatchRootHandler"]();

    expect(BuiltInCommands.useHelpCommand).toBeCalledTimes(2);
    expect(BuiltInCommands.useHelpCommand).toHaveBeenLastCalledWith(
      "mm",
      true,
      undefined,
      true
    );

    // @ts-expect-error
    vi.spyOn(MustardRegistry, "provideRootCommand").mockReturnValueOnce(null);

    cli.configure({
      enableUsage: false,
    });

    try {
      cli["dispatchRootHandler"]();
    } catch (error) {
      expect(error).toMatchInlineSnapshot(
        "[NoRootHandlerError: No root handler found, please provide command decorated with '@RootCommand' or enable option enableUsage for usage info generation.]"
      );
    }
  });

  it("should execute command", () => {
    const cli = new CLI("mm", []);

    cli["parsedArgs"] = {
      _: ["p1", "p2", "p3"],
    };

    const executeStub = vi.fn();
    class RootCommand {
      run() {
        executeStub();
      }
    }

    const rootRegistration = {
      commandInvokeName: "root",
      Class: RootCommand,
      commandAlias: null,
      root: true,
      instance: new RootCommand(),
      decoratedInstanceFields: [],
      childCommandList: [],
    };

    vi.spyOn(
      DecoratedClassFieldsNormalizer,
      "throwOnUnknownOptions"
    ).mockImplementationOnce(() => {});

    vi.spyOn(
      DecoratedClassFieldsNormalizer,
      "normalizeDecoratedFields"
    ).mockImplementationOnce(() => {});

    cli["executeCommandFromRegistration"](rootRegistration, ["p1", "p2", "p3"]);

    cli.configure({
      allowUnknownOptions: false,
      didYouMean: true,
    });

    expect(
      DecoratedClassFieldsNormalizer.throwOnUnknownOptions
    ).toBeCalledTimes(1);

    expect(DecoratedClassFieldsNormalizer.throwOnUnknownOptions).toBeCalledWith(
      rootRegistration.instance,
      {
        _: ["p1", "p2", "p3"],
      },
      true
    );

    expect(
      DecoratedClassFieldsNormalizer.normalizeDecoratedFields
    ).toBeCalledTimes(1);

    expect(
      DecoratedClassFieldsNormalizer.normalizeDecoratedFields
    ).toHaveBeenLastCalledWith(rootRegistration, ["p1", "p2", "p3"], {
      _: ["p1", "p2", "p3"],
    });

    expect(executeStub).toBeCalledTimes(1);

    cli.configure({
      allowUnknownOptions: true,
      didYouMean: true,
    });

    cli["executeCommandFromRegistration"](rootRegistration, ["p1", "p2", "p3"]);

    expect(
      DecoratedClassFieldsNormalizer.throwOnUnknownOptions
    ).toBeCalledTimes(1);
  });
});

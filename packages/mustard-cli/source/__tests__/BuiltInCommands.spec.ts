import {
  CommandRegistryPayload,
  CommandStruct,
} from "../Typings/Command.struct";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BuiltInCommands } from "../Commands/BuiltInCommands";
import { MustardConstanst } from "../Components/Constants";
import { UsageInfoGenerator } from "../Components/UsageGenerator";

vi.spyOn(UsageInfoGenerator, "printHelp").mockImplementation(() => {});

class Foo implements CommandStruct {
  run() {}
}

const registration = {
  commandInvokeName: "foo",
  root: false,
  Class: Foo,
  instance: new Foo(),
  childCommandList: [],
  decoratedInstanceFields: [],
} satisfies CommandRegistryPayload;

describe.skip("BuiltInCommands", () => {
  it("should check if contains help flag", () => {
    expect(BuiltInCommands.containsHelpFlag({ _: [], help: true })).toBe(true);
    expect(BuiltInCommands.containsHelpFlag({ _: [], h: true })).toBe(true);
    expect(
      BuiltInCommands.containsHelpFlag({
        _: [],
        [MustardConstanst.InternalHelpFlag]: true,
      })
    ).toBe(true);
    expect(
      BuiltInCommands.containsHelpFlag({
        _: [],
      })
    ).toBe(false);
    expect(
      BuiltInCommands.containsHelpFlag({
        _: [],
        foo: true,
      })
    ).toBe(false);
  });

  it("should check if contains version flag", () => {
    expect(BuiltInCommands.containsVersionFlag({ _: [], version: true })).toBe(
      true
    );
    expect(BuiltInCommands.containsVersionFlag({ _: [], v: true })).toBe(true);
    expect(
      BuiltInCommands.containsVersionFlag({
        _: [],
        [MustardConstanst.InternalVersionFlag]: true,
      })
    ).toBe(true);
    expect(
      BuiltInCommands.containsVersionFlag({
        _: [],
      })
    ).toBe(false);
    expect(
      BuiltInCommands.containsVersionFlag({
        _: [],
        foo: true,
      })
    ).toBe(false);
  });

  it("should handle help command", () => {
    BuiltInCommands.useHelpCommand(false, undefined, undefined, false);
    expect(UsageInfoGenerator.printHelp).not.toBeCalled();

    BuiltInCommands.useHelpCommand(true, undefined, false, false);
    expect(UsageInfoGenerator.printHelp).toBeCalledTimes(1);

    BuiltInCommands.useHelpCommand(
      { _: [], help: true },
      undefined,
      false,
      false
    );
    expect(UsageInfoGenerator.printHelp).toBeCalledTimes(2);

    BuiltInCommands.useHelpCommand(true, registration, false, false);

    expect(UsageInfoGenerator.printHelp).toBeCalledTimes(3);
    expect(UsageInfoGenerator.printHelp).toHaveBeenLastCalledWith(registration);

    BuiltInCommands.useHelpCommand(
      { _: [], help: true },
      registration,
      false,
      false
    );
    expect(UsageInfoGenerator.printHelp).toBeCalledTimes(4);
    expect(UsageInfoGenerator.printHelp).toBeCalledWith(registration);
  });

  it("should handle version command", () => {
    const controller = vi.fn().mockReturnValue("1.0.0");
    vi.spyOn(console, "log").mockImplementation(() => {});

    BuiltInCommands.useVersionCommand(false, controller, false);
    expect(controller).not.toBeCalled();

    BuiltInCommands.useVersionCommand(true, controller, false);
    expect(controller).toBeCalledTimes(1);
    expect(console.log).toBeCalledTimes(1);

    BuiltInCommands.useVersionCommand(
      { _: [], version: true },
      controller,
      false
    );
    expect(console.log).toBeCalledTimes(2);
    expect(controller).toBeCalledTimes(2);

    BuiltInCommands.useVersionCommand(true, "1.2.0", false);
    expect(controller).toBeCalledTimes(2);
    expect(console.log).toBeCalledTimes(3);
  });
});

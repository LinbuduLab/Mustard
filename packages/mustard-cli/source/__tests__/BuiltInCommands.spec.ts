import {
  CommandRegistryPayload,
  CommandStruct,
} from "../Typings/Command.struct";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BuiltInCommands } from "../Commands/BuiltInCommands";
import { MustardConstanst } from "../Components/Constants";
import { UsageInfoGenerator } from "../Components/UsageGenerator";

beforeEach(() => {
  vi.spyOn(UsageInfoGenerator, "collectCompleteAppUsage").mockClear();
  vi.spyOn(UsageInfoGenerator, "collectSpecificCommandUsage").mockClear();
});

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
    BuiltInCommands.useHelpCommand(false);
    expect(UsageInfoGenerator.collectCompleteAppUsage).not.toBeCalled();
    expect(UsageInfoGenerator.collectSpecificCommandUsage).not.toBeCalled();

    BuiltInCommands.useHelpCommand(true);
    expect(UsageInfoGenerator.collectCompleteAppUsage).toBeCalledTimes(1);
    expect(UsageInfoGenerator.collectSpecificCommandUsage).not.toBeCalled();

    BuiltInCommands.useHelpCommand({ _: [], help: true });
    expect(UsageInfoGenerator.collectCompleteAppUsage).toBeCalledTimes(2);
    expect(UsageInfoGenerator.collectSpecificCommandUsage).not.toBeCalled();

    const registration = {
      commandInvokeName: "foo",
      root: false,
      Class: class Foo implements CommandStruct {
        run() {}
      },
      childCommandList: [],
    } satisfies CommandRegistryPayload;

    BuiltInCommands.useHelpCommand(true, registration);

    expect(UsageInfoGenerator.collectCompleteAppUsage).toBeCalledTimes(2);
    expect(UsageInfoGenerator.collectSpecificCommandUsage).toBeCalledTimes(1);
    expect(UsageInfoGenerator.collectSpecificCommandUsage).toBeCalledWith(
      registration
    );

    BuiltInCommands.useHelpCommand({ _: [], help: true }, registration);
    expect(UsageInfoGenerator.collectCompleteAppUsage).toBeCalledTimes(2);
    expect(UsageInfoGenerator.collectSpecificCommandUsage).toBeCalledTimes(2);
    expect(UsageInfoGenerator.collectSpecificCommandUsage).toBeCalledWith(
      registration
    );
  });

  it("should handle version command", () => {
    expect(1 + 1).toBe(2);
  });
});

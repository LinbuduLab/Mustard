import { describe, it, expect, vi, beforeAll } from "vitest";
import { MustardRegistry } from "../Components/Registry";
import {
  ParsedCommandUsage,
  UsageInfoGenerator,
} from "../Components/UsageGenerator";
import {
  CommandRegistryPayload,
  CommandStruct,
} from "../Typings/Command.struct";

const collect = {
  name: "foo",
  alias: "f",
  description: "foo command",
  options: [
    {
      name: "bar",
      alias: "b",
      description: "bar option",
      defaultValue: "bar",
    },
    {
      name: "baz",
      alias: "z",
      description: "baz option",
      defaultValue: "baz",
    },
  ],
  input: {
    name: "projects",
    description: "projects to collect",
    defaultValue: ["p1", "p2", "p3", "p4"],
  },
  variadicOptions: [],
} satisfies ParsedCommandUsage;

class StubCommand implements CommandStruct {
  run() {}
}

class RunCommand implements CommandStruct {
  run() {}
}

class UpdateCommand implements CommandStruct {
  run() {}
}

const _RunCommandRegistration = {
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

const _UpdateCommandRegistration = {
  commandInvokeName: "update",
  Class: UpdateCommand,
  root: false,
  childCommandList: [],
  commandAlias: "u",
  description: "this is update command",
  instance: new UpdateCommand(),
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
    {
      key: "bar",
      type: "Options",
      value: {
        type: "Options",
        optionName: "bar",
        optionAlias: "b",
        description: "bar option",
        initValue: [],
      },
    },
  ],
} satisfies CommandRegistryPayload;

beforeAll(() => {
  UsageInfoGenerator.commandBinaryName = "cli";

  vi.spyOn(MustardRegistry, "provide").mockImplementationOnce(() => {
    const map = new Map<string, CommandRegistryPayload>();

    map.set("run", _RunCommandRegistration);
    map.set("update", _UpdateCommandRegistration);

    return map;
  });
});

describe("UsageGenerator", () => {
  it("should collect complete app usage", () => {
    const result = UsageInfoGenerator.collectCompleteAppUsage();

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "alias": "r",
          "description": "run command",
          "input": undefined,
          "name": "run",
          "options": [],
          "variadicOptions": [],
        },
        {
          "alias": "u",
          "description": "this is update command",
          "input": undefined,
          "name": "update",
          "options": [],
          "variadicOptions": [],
        },
      ]
    `);
  });

  it("should format command usage", () => {
    const result = UsageInfoGenerator.formatCommandUsage(collect);

    expect(result).toMatchInlineSnapshot(`
      "
      Usage:

        $ cli foo


      Command:
        foo, f, foo command

      Options:
        --bar, -b, bar option, default: \\"bar\\"
        --baz, -z, baz option, default: \\"baz\\"
      "
    `);
  });

  it("should format root command usage", () => {
    const result = UsageInfoGenerator.formatRootCommandUsage(collect);

    expect(result).toMatchInlineSnapshot(`
      "
      Usage:

        $ cli [projects, projects to collect, default: [
        \\"p1\\",
        \\"p2\\",
        \\"p3\\",
        \\"p4\\"
      ]]

      Options: 
        --bar -b, bar option, default: \\"bar\\"
        --baz -z, baz option, default: \\"baz\\"
      "
    `);
  });

  it("should batch format command usage", () => {
    const result = UsageInfoGenerator.batchfFormatCommandUsage([
      collect,
      {
        ...collect,
        name: "bar",
        variadicOptions: [],
      },
      {
        ...collect,
        name: "foo",
        variadicOptions: [],
      },
    ]);

    expect(result).toMatchInlineSnapshot(`
      "
      Usage:

        $ cli [command] [--options]

      Command:
        foo, f, foo command

      Options:
        --bar, -b, bar option, default: \\"bar\\"
        --baz, -z, baz option, default: \\"baz\\"

      Command:
        bar, f, foo command

      Options:
        --bar, -b, bar option, default: \\"bar\\"
        --baz, -z, baz option, default: \\"baz\\"

      Command:
        foo, f, foo command

      Options:
        --bar, -b, bar option, default: \\"bar\\"
        --baz, -z, baz option, default: \\"baz\\"
      "
    `);
  });

  it("should collect specific command usage", () => {
    expect(
      UsageInfoGenerator.collectSpecificCommandUsage(_RunCommandRegistration)
    ).toMatchInlineSnapshot(`
      {
        "alias": "r",
        "description": "run command",
        "input": undefined,
        "name": "run",
        "options": [],
        "variadicOptions": [],
      }
    `);

    expect(
      UsageInfoGenerator.collectSpecificCommandUsage(_UpdateCommandRegistration)
    ).toMatchInlineSnapshot(`
      {
        "alias": "u",
        "description": "this is update command",
        "input": undefined,
        "name": "update",
        "options": [],
        "variadicOptions": [],
      }
    `);
  });

  it("should invoke corresponding formatter", () => {
    vi.spyOn(
      UsageInfoGenerator,
      "collectSpecificCommandUsage"
    ).mockImplementationOnce(() => collect);

    vi.spyOn(
      UsageInfoGenerator,
      "collectCompleteAppUsage"
    ).mockImplementationOnce(() => [collect]);

    vi.spyOn(
      UsageInfoGenerator,
      "formatRootCommandUsage"
    ).mockImplementationOnce(() => "root command usage");

    vi.spyOn(UsageInfoGenerator, "formatCommandUsage").mockImplementationOnce(
      () => "command usage"
    );

    vi.spyOn(
      UsageInfoGenerator,
      "batchfFormatCommandUsage"
    ).mockImplementationOnce(() => "batch command usage");

    UsageInfoGenerator.printHelp("bin", undefined);

    expect(UsageInfoGenerator.batchfFormatCommandUsage).toBeCalledTimes(1);
    expect(UsageInfoGenerator.collectCompleteAppUsage).toBeCalledTimes(1);

    UsageInfoGenerator.printHelp("bin", {
      ..._RunCommandRegistration,
      root: true,
    } as CommandRegistryPayload);

    expect(UsageInfoGenerator.formatRootCommandUsage).toBeCalledTimes(1);
    expect(UsageInfoGenerator.collectSpecificCommandUsage).toBeCalledTimes(1);

    UsageInfoGenerator.printHelp("bin", {
      ..._RunCommandRegistration,
      root: false,
    } as CommandRegistryPayload);

    expect(UsageInfoGenerator.formatCommandUsage).toBeCalledTimes(1);
    expect(UsageInfoGenerator.collectSpecificCommandUsage).toBeCalledTimes(2);
  });
});

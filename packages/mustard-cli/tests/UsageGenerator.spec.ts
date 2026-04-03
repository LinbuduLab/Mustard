import { describe, it, expect, vi, beforeAll } from "vitest";
import { CommandRegistry } from "../Components/Registry";
import { MustardUtils } from "../Components/Utils";
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
  childCommandNames: [],
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
  UsageInfoGenerator.initGenerator({
    bin: "cli",
    parsedInputs: [],
  });

  // @ts-expect-error
  vi.spyOn(CommandRegistry, "provide").mockImplementationOnce(() => {
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
          "childCommandNames": [],
          "description": "run command",
          "input": undefined,
          "name": "run",
          "options": [],
          "variadicOptions": [],
        },
        {
          "alias": "u",
          "childCommandNames": [],
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

        $ cli foo [projects] [options]

      Command:
        foo, f, foo command

      Options:
        --bar, -b, bar option, default: \\"bar\\"
        --baz, -z, baz option, default: \\"baz\\"
      "
    `);
  });

  it("should assemble previous command inputs", () => {
    UsageInfoGenerator.initGenerator({
      bin: "cli",
      parsedInputs: ["foo", "bar", "cmd"],
    });

    expect(UsageInfoGenerator.assemblePreviousInputsWithBinary("cmd")).toBe(
      "cli foo bar cmd",
    );

    UsageInfoGenerator.initGenerator({
      bin: "cli",
      parsedInputs: [],
    });

    expect(UsageInfoGenerator.assemblePreviousInputsWithBinary("cmd")).toBe(
      "cli cmd",
    );

    UsageInfoGenerator.initGenerator({
      bin: "cli",
      parsedInputs: ["foo", "bar", "cmd", "p1", "p2"],
    });

    expect(UsageInfoGenerator.assemblePreviousInputsWithBinary("cmd")).toBe(
      "cli foo bar cmd",
    );
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
      UsageInfoGenerator.collectSpecificCommandUsage(_RunCommandRegistration),
    ).toMatchInlineSnapshot(`
      {
        "alias": "r",
        "childCommandNames": [],
        "description": "run command",
        "input": undefined,
        "name": "run",
        "options": [],
        "variadicOptions": [],
      }
    `);

    expect(
      UsageInfoGenerator.collectSpecificCommandUsage(
        _UpdateCommandRegistration,
      ),
    ).toMatchInlineSnapshot(`
      {
        "alias": "u",
        "childCommandNames": [],
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
      "collectSpecificCommandUsage",
    ).mockImplementationOnce(() => collect);

    vi.spyOn(
      UsageInfoGenerator,
      "collectCompleteAppUsage",
    ).mockImplementationOnce(() => [collect]);

    vi.spyOn(
      UsageInfoGenerator,
      "formatRootCommandUsage",
    ).mockImplementationOnce(() => "root command usage");

    vi.spyOn(UsageInfoGenerator, "formatCommandUsage").mockImplementationOnce(
      () => "command usage",
    );

    vi.spyOn(
      UsageInfoGenerator,
      "batchfFormatCommandUsage",
    ).mockImplementationOnce(() => "batch command usage");

    UsageInfoGenerator.printHelp(undefined);

    expect(UsageInfoGenerator.batchfFormatCommandUsage).toBeCalledTimes(1);
    expect(UsageInfoGenerator.collectCompleteAppUsage).toBeCalledTimes(1);

    UsageInfoGenerator.printHelp({
      ..._RunCommandRegistration,
      root: true,
    } as CommandRegistryPayload);

    expect(UsageInfoGenerator.formatRootCommandUsage).toBeCalledTimes(1);
    expect(UsageInfoGenerator.collectSpecificCommandUsage).toBeCalledTimes(1);

    UsageInfoGenerator.printHelp({
      ..._RunCommandRegistration,
      root: false,
    } as CommandRegistryPayload);

    expect(UsageInfoGenerator.formatCommandUsage).toBeCalledTimes(1);
    expect(UsageInfoGenerator.collectSpecificCommandUsage).toBeCalledTimes(2);
  });

  it("should collect child command and decorated option details", () => {
    class Child implements CommandStruct {
      run() {}
    }

    const withChild = {
      ..._RunCommandRegistration,
      childCommandList: [Child],
    } satisfies CommandRegistryPayload;

    vi.spyOn(MustardUtils, "matchFromCommandClass").mockReturnValueOnce([
      {
        ..._RunCommandRegistration,
        commandInvokeName: "child",
        commandAlias: "c",
        description: "child command",
      },
    ]);

    vi.spyOn(MustardUtils, "filterDecoratedInstanceFields").mockReturnValueOnce(
      [
        {
          key: "flag",
          type: "Option",
          value: {
            type: "Option",
            optionName: "flag",
            optionAlias: "f",
            description: "flag option",
            initValue: false,
          },
        },
        {
          key: "list",
          type: "VariadicOption",
          value: {
            type: "VariadicOption",
            optionName: "list",
            optionAlias: "l",
            description: "list option",
            initValue: [],
          },
        },
        {
          key: "input",
          type: "Input",
          value: {
            type: "Input",
            optionName: "input",
            description: "input desc",
            initValue: "",
          },
        },
      ] as any,
    );

    const result = UsageInfoGenerator.collectSpecificCommandUsage(withChild);

    expect(result.childCommandNames).toEqual([
      {
        name: "child",
        alias: "c",
        description: "child command",
      },
    ]);
    expect(result.options[0]?.name).toBe("flag");
    expect(result.variadicOptions[0]?.name).toBe("list");
    expect(result.input?.name).toBe("input");
  });

  it("should format usages for commands without option defaults", () => {
    UsageInfoGenerator.initGenerator({
      bin: "mm",
      parsedInputs: [],
    });

    const usage = UsageInfoGenerator.formatCommandUsage({
      name: "empty",
      alias: null,
      description: null,
      options: [],
      variadicOptions: [],
      childCommandNames: [],
      input: undefined,
    });

    expect(usage).not.toContain("[options]");

    const rootUsage = UsageInfoGenerator.formatRootCommandUsage({
      name: "root",
      alias: null,
      description: null,
      options: [
        {
          name: "disabled",
          alias: "d",
          description: null,
          defaultValue: false,
        },
      ],
      variadicOptions: [],
      childCommandNames: [],
      input: {
        name: "arg",
        alias: null,
        description: null,
        defaultValue: "",
      },
    });

    expect(rootUsage).toContain("--disabled -d");
    expect(rootUsage).not.toContain("default:");
    expect(rootUsage).not.toContain("[arg,");

    const commandWithChild = UsageInfoGenerator.formatCommandUsage({
      name: "parent",
      alias: "p",
      description: "desc",
      options: [],
      variadicOptions: [],
      childCommandNames: [
        {
          name: "child",
          alias: null,
          description: null,
        },
      ],
      input: undefined,
    });

    expect(commandWithChild).toContain("Child Command(s):");
    expect(commandWithChild).toContain(
      "Run 'mm parent [child command] --help' for more information on child command.",
    );
  });
});

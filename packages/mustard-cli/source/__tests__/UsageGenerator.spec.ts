import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ParsedCommandUsage,
  UsageInfoGenerator,
} from "../Components/UsageGenerator";

UsageInfoGenerator.commandBinaryName = "cli";

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
    defaultValue: [],
  },
  variadicOptions: [],
} satisfies ParsedCommandUsage;

describe("UsageGenerator", () => {
  it("should format command usage", () => {
    const result = UsageInfoGenerator.formatCommandUsage(collect);

    expect(result).toMatchInlineSnapshot(`
      "
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

        $ cli [projects, projects to collect, default: []]

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
});

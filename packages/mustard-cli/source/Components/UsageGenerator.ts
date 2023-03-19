import { MustardRegistry } from "./Registry";
import { MustardUtils } from "./Utils";
import uniqBy from "lodash.uniqby";

import type { CommandRegistryPayload } from "../Typings/Command.struct";
import type { Nullable } from "../Typings/Shared.struct";
import { Arguments } from "yargs-parser";

interface SharedInfo {
  name: string;
  alias?: Nullable<string>;
  description?: Nullable<string>;
}

export interface ParsedCommandUsage extends SharedInfo {
  options: ParsedOptionInfo[];
  variadicOptions: ParsedOptionInfo[];
  input?: ParsedOptionInfo;
  childCommandNames: SharedInfo[];
}

interface ParsedOptionInfo extends SharedInfo {
  defaultValue: unknown;
}

interface UsageInfoGeneratorOptions {
  bin: string;
  parsedInputs: (string | number)[];
}

export class UsageInfoGenerator {
  public static generatorOptions: UsageInfoGeneratorOptions = {
    bin: "<cli>",
    parsedInputs: [],
  };

  public static initGenerator(options: UsageInfoGeneratorOptions) {
    UsageInfoGenerator.generatorOptions = options;
  }

  public static assemblePreviousInputsWithBinary(
    currentCommandInvokeName: string
  ): string {
    const { parsedInputs } = UsageInfoGenerator.generatorOptions;

    const previousInputs = parsedInputs
      .slice(0, parsedInputs.indexOf(currentCommandInvokeName))
      .join(" ");

    return `${UsageInfoGenerator.generatorOptions.bin}${
      previousInputs ? ` ${previousInputs} ` : " "
    }${currentCommandInvokeName}`;
  }

  public static collectCompleteAppUsage() {
    const completeRegistration = MustardRegistry.provide();

    const commands: ParsedCommandUsage[] = uniqBy(
      Array.from(completeRegistration.values()).map((c) =>
        UsageInfoGenerator.collectSpecificCommandUsage(c)
      ),
      "name"
    );

    return commands;
  }

  public static collectSpecificCommandUsage(
    registration: CommandRegistryPayload
  ): ParsedCommandUsage {
    const { commandInvokeName, instance, childCommandList = [] } = registration;

    const childCommandNames = <SharedInfo[]>MustardUtils.matchFromCommandClass(
      childCommandList
    )
      .map((r) => ({
        name: r.commandInvokeName,
        alias: r.commandAlias,
        description: r.description,
      }))
      .filter(Boolean);

    const decoratedFields = MustardUtils.filterDecoratedInstanceFields(
      instance!
    ).map((option) => {
      return {
        name: option.key,
        alias: option.value.optionAlias,
        description: option.value.description,
        defaultValue: option.value.initValue,
        type: option.type,
      };
    });

    const options: ParsedOptionInfo[] = decoratedFields.filter(
      (o) => o.type === "Option"
    ) as ParsedOptionInfo[];

    const variadicOptions: ParsedOptionInfo[] = decoratedFields.filter(
      (o) => o.type === "VariadicOption"
    ) as ParsedOptionInfo[];

    const input: ParsedOptionInfo = decoratedFields.find(
      (o) => o.type === "Input"
    ) as ParsedOptionInfo;

    const command: ParsedCommandUsage = {
      name: commandInvokeName,
      alias: registration.commandAlias,
      description: registration.description,
      options,
      input,
      variadicOptions,
      childCommandNames,
    };

    return command;
  }

  public static printHelp(registration?: CommandRegistryPayload) {
    registration
      ? registration.root
        ? // print usage info for RootCommand only
          console.log(
            UsageInfoGenerator.formatRootCommandUsage(
              UsageInfoGenerator.collectSpecificCommandUsage(registration)
            )
          )
        : // print usage info for specific command only
          console.log(
            UsageInfoGenerator.formatCommandUsage(
              UsageInfoGenerator.collectSpecificCommandUsage(registration)
            )
          )
      : // print usage info for complete application
        console.log(
          UsageInfoGenerator.batchfFormatCommandUsage(
            UsageInfoGenerator.collectCompleteAppUsage()
          )
        );
  }

  public static formatCommandUsage(collect: ParsedCommandUsage): string {
    return `
Usage:

  $ ${UsageInfoGenerator.assemblePreviousInputsWithBinary(collect.name)} ${
      collect.input ? `[${collect.input.name}]` : ""
    } ${
      collect.options.length || collect.variadicOptions.length
        ? "[options]"
        : ""
    }
${UsageInfoGenerator.formatCommandUsageInternal(collect)}`;
  }

  public static formatCommandUsageInternal(
    collect: ParsedCommandUsage
  ): string {
    const commandPart = `Command:\n  ${collect.name}${
      collect.alias ? `, ${collect.alias},` : ""
    } ${collect.description ? collect.description + "\n" : "\n"}`;

    const childCommandsPart = collect.childCommandNames?.length
      ? `\nChild Command(s):\n ${collect.childCommandNames
          .map(
            (c) =>
              ` ${c.name}${c.alias ? `, ${c.alias},` : ""} ${
                c.description ? c.description + "\n" : "\n"
              }`
          )
          .join(" ")}
Run '${UsageInfoGenerator.generatorOptions.bin} ${
          collect.name
        } [child command] --help' for more information on child command.\n`
      : "";

    let optionsPart = "Options:\n";

    [...collect.options, ...collect.variadicOptions].forEach((o) => {
      optionsPart += `  --${o.name}${o.alias ? `, -${o.alias}` : ""}${
        o.description ? `, ${o.description}` : ""
      }${
        o.defaultValue
          ? `, default: ${JSON.stringify(o.defaultValue, null, 2)}`
          : ""
      }`;
      optionsPart += "\n";
    });

    return `
${commandPart}${childCommandsPart}
${optionsPart}`;
  }

  public static formatRootCommandUsage(collect: ParsedCommandUsage): string {
    let optionsPart = "";

    optionsPart += "\n";

    [...collect.options, ...collect.variadicOptions].forEach((o) => {
      optionsPart += `  --${o.name}${o.alias ? ` -${o.alias}` : ""}${
        o.description ? `, ${o.description}` : ""
      }${
        o.defaultValue
          ? `, default: ${JSON.stringify(o.defaultValue, null, 2)}`
          : ""
      }`;
      optionsPart += "\n";
    });

    const inputPrePart = collect.input
      ? `[${collect.input.name}${
          collect.input.description ? `, ${collect.input.description}` : ""
        }${
          collect.input.defaultValue
            ? `, default: ${JSON.stringify(
                collect.input.defaultValue,
                null,
                2
              )}`
            : ""
        }]`
      : "";

    return `
Usage:

  $ ${UsageInfoGenerator.generatorOptions.bin} ${inputPrePart}

Options: ${optionsPart}`;
  }

  public static batchfFormatCommandUsage(
    collect: ParsedCommandUsage[]
  ): string {
    let result = "";

    collect.forEach((c) => {
      result += UsageInfoGenerator.formatCommandUsageInternal(c);
    });

    result = `
Usage:

  $ ${UsageInfoGenerator.generatorOptions.bin} [command] [--options]
${result}`;

    return result;
  }
}

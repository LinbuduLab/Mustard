import { MustardRegistry } from "./Registry";
import { MustardUtils } from "./Utils";
import uniqBy from "lodash.uniqby";

import type { CommandRegistryPayload } from "../Typings/Command.struct";
import type { Nullable } from "../Typings/Shared.struct";

interface SharedInfo {
  name: string;
  alias?: Nullable<string>;
  description?: Nullable<string>;
}

interface ParsedCommandUsage extends SharedInfo {
  options: ParsedOptionInfo[];
  variadicOptions: ParsedOptionInfo[];
}

interface ParsedOptionInfo extends SharedInfo {
  defaultValue: unknown;
}

export class UsageInfoGenerator {
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
    const { commandInvokeName, instance } = registration;

    const options: ParsedOptionInfo[] =
      MustardUtils.filterDecoratedInstanceFields(instance!).map((option) => {
        return {
          name: option.key,
          alias: option.value.optionAlias,
          description: option.value.description,
          defaultValue: option.value.initValue,
        };
      });

    const command: ParsedCommandUsage = {
      name: commandInvokeName,
      alias: registration.commandAlias,
      description: registration.description,
      options,
      variadicOptions: [],
    };

    return command;
  }

  private static commandBinaryName: Nullable<string> = null;

  public static printHelp(bin: string, registration?: CommandRegistryPayload) {
    UsageInfoGenerator.commandBinaryName = bin;

    registration
      ? registration.root
        ? console.log(
            UsageInfoGenerator.formatRootCommandUsage(
              UsageInfoGenerator.collectSpecificCommandUsage(registration)
            )
          )
        : console.log(
            UsageInfoGenerator.formatCommandUsage(
              UsageInfoGenerator.collectSpecificCommandUsage(registration)
            )
          )
      : console.log(
          UsageInfoGenerator.batchfFormatCommandUsage(
            UsageInfoGenerator.collectCompleteAppUsage()
          )
        );
  }

  public static formatCommandUsage(collect: ParsedCommandUsage): string {
    const { commandBinaryName: bin } = UsageInfoGenerator;

    const commandPart = `Command:\n  ${collect.name}${
      collect.alias ? `, ${collect.alias},` : ""
    } ${collect.description ? collect.description + "\n" : "\n"}`;

    let optionsPart = "Options:\n";

    // optionsPart += "\n\n";

    collect.options.forEach((o) => {
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
${commandPart}
${optionsPart}`;
  }

  public static formatRootCommandUsage(collect: ParsedCommandUsage): string {
    let optionsPart = "";

    optionsPart += "\n";

    collect.options.forEach((o) => {
      optionsPart += `  --${o.name}${o.alias ? ` -${o.alias}` : ""}${
        o.description ? `, ${o.description}` : ""
      }${
        o.defaultValue
          ? `, default: ${JSON.stringify(o.defaultValue, null, 2)}`
          : ""
      }`;
      optionsPart += "\n\n";
    });

    return `
Usage:

  $ ${UsageInfoGenerator.commandBinaryName}

Options: ${optionsPart}`;
  }

  public static batchfFormatCommandUsage(
    collect: ParsedCommandUsage[]
  ): string {
    const { commandBinaryName: bin } = UsageInfoGenerator;

    let result = "";

    collect.forEach((c) => {
      result += UsageInfoGenerator.formatCommandUsage(c);
    });

    result = `
Usage:

  $ ${bin} [command] [--options]
${result}`;

    return result;
  }
}

import { MustardRegistry } from "./Registry";
import { MustardUtils } from "./Utils";

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

  public static printHelp(registration?: CommandRegistryPayload) {
    registration
      ? console.log(
          UsageInfoGenerator.formatCommandUsage(
            UsageInfoGenerator.collectSpecificCommandUsage(registration)
          )
        )
      : void 0;
  }

  public static formatCommandUsage(collect: ParsedCommandUsage): string {
    return `
Command: ${collect.name}${collect.alias ? ` (${collect.alias})` : ""}
${collect.description ? collect.description + "\n" : ""}
Options:
${collect.options.map((o) => {
  return `
--${o.name}${o.alias ? `, --${o.alias}` : ""}${
    o.description ? `, ${o.description}` : ""
  }
`;
})}
    `;
  }
}

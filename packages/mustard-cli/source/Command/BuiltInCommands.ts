import { UsageInfoGenerator } from "../Components/UsageGenerator";
import chalk from "chalk";

import type { Configurations } from "../Typings/Configuration.struct";
import type { Arguments } from "yargs-parser";
import type { CommandRegistryPayload } from "../Typings/Command.struct";

export class BuiltInCommands {
  public static containsHelpFlag(parsedArgs: Arguments) {
    return (
      parsedArgs["help"] ||
      parsedArgs["h"] ||
      parsedArgs["MUSTARD_SPECIFIED_HELP_FLAG"]
    );
  }

  public static containsVersionFlag(parsedArgs: Arguments) {
    return (
      parsedArgs["version"] ||
      parsedArgs["v"] ||
      parsedArgs["MUSTARD_SPECIFIED_VERSION_FLAG"]
    );
  }

  public static useHelpCommand(
    parsedArgs: Arguments | boolean,
    registration?: CommandRegistryPayload
  ) {
    const printHelp =
      typeof parsedArgs === "boolean"
        ? parsedArgs
        : BuiltInCommands.containsHelpFlag(parsedArgs);

    if (!printHelp) {
      return;
    }

    registration
      ? UsageInfoGenerator.collectSpecificCommandUsage(registration)
      : UsageInfoGenerator.collectCompleteAppUsage();

    process.exit(0);
  }

  public static useVersionCommand(
    controller?: Configurations["enableVersion"]
  ) {
    if (!controller) return;

    const version =
      typeof controller === "function" ? controller() : controller;

    console.log(`V ${chalk.bold(version)}`);

    process.exit(0);
  }
}

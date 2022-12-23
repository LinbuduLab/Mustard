import chalk from "chalk";

import { UsageInfoGenerator } from "../Components/UsageGenerator";
import { MustardConstanst } from "../Components/Constants";

import type { Configurations } from "../Typings/Configuration.struct";
import type { Arguments } from "yargs-parser";
import type { CommandRegistryPayload } from "../Typings/Command.struct";

export class BuiltInCommands {
  public static containsHelpFlag(parsedArgs: Arguments): boolean {
    return Boolean(
      parsedArgs["help"] ||
        parsedArgs["h"] ||
        parsedArgs[MustardConstanst.InternalHelpFlag]
    );
  }

  public static containsVersionFlag(parsedArgs: Arguments): boolean {
    return Boolean(
      parsedArgs["version"] ||
        parsedArgs["v"] ||
        parsedArgs[MustardConstanst.InternalVersionFlag]
    );
  }

  public static useHelpCommand(
    parsedArgs: Arguments | boolean,
    registration?: CommandRegistryPayload,
    exit = true
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

    exit && process.exit(0);
  }

  public static useVersionCommand(
    parsedArgs: Arguments | boolean,
    controller?: Configurations["enableVersion"],
    exit = true
  ) {
    const printVersion =
      typeof parsedArgs === "boolean"
        ? parsedArgs
        : BuiltInCommands.containsVersionFlag(parsedArgs);

    if (!printVersion) {
      return;
    }

    if (!controller) return;

    const version =
      typeof controller === "function" ? controller() : controller;

    console.log(`V ${chalk.bold(version)}`);

    exit && process.exit(0);
  }
}

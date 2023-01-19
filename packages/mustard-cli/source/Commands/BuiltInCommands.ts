import chalk from "chalk";

import { UsageInfoGenerator } from "../Components/UsageGenerator";
import { MustardConstanst } from "../Components/Constants";

import type { Configurations } from "../Typings/Configuration.struct";
import type { Arguments } from "yargs-parser";
import type { CommandRegistryPayload } from "../Typings/Command.struct";
import type { MaybeFactory } from "../../source/Typings/Shared.struct";

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

  private static useController<T extends string | boolean>(
    factory: MaybeFactory<T>,
    ...factoryArguments: unknown[]
  ): T {
    return typeof factory === "function"
      ? factory(...factoryArguments)
      : factory;
  }

  public static useHelpCommand(
    parsedArgs: Arguments | boolean,
    registration?: CommandRegistryPayload,
    controller?: Configurations["enableUsage"],
    exit = true
  ) {
    const printHelp =
      typeof parsedArgs === "boolean"
        ? parsedArgs
        : BuiltInCommands.containsHelpFlag(parsedArgs);

    if (!printHelp) {
      return;
    }

    controller
      ? typeof controller === "function"
        ? console.log(controller(registration))
        : UsageInfoGenerator.printHelp(registration)
      : UsageInfoGenerator.printHelp(registration);

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

    console.log(`V ${chalk.bold(BuiltInCommands.useController(controller))}`);

    exit && process.exit(0);
  }
}

import _debug from "debug";

import { CommandList } from "source/Typings/Configuration.struct";
import { MustardRegistry } from "../Components/Registry";
import { MustardConstanst } from "../Components/Constants";

import type { Nullable } from "../Typings/Shared.struct";
import type { AnyClassDecoratorReturnType } from "../Typings/Temp";
import type { CommandConfiguration } from "../Typings/Command.struct";

const debug = _debug("mustard:decorator:command");

export class CommandDecorators {
  /**
   * @example
   * \@Command('run')
   * class RunCommand {}
   */
  public static Command(commandName: string): AnyClassDecoratorReturnType;
  /**
   * @example
   * \@Command({ name: 'run', alias: 'r' })
   * class RunCommand {}
   */
  public static Command(
    config: CommandConfiguration
  ): AnyClassDecoratorReturnType;
  /**
   * @example
   * \@Command('run', 'r')
   * class RunCommand {}
   *
   * \@Command('run', 'run command handle')
   * class RunCommand {}
   */
  public static Command(
    commandName: string,
    aliasOrDescription: string
  ): AnyClassDecoratorReturnType;
  /**
   * @example
   *  \@Command('task')
   * class RunTaskCommand {}
   *
   * \@Command('run', [RunTaskCommand])
   * class RunCommand {}
   */
  public static Command(
    commandName: string,
    childCommandList: CommandList
  ): AnyClassDecoratorReturnType;
  /**
   * @example

   * \@Command('run', 'r', 'run command handle')
   * class RunCommand {}
   */
  public static Command(
    commandName: string,
    alias: string,
    description: string
  ): AnyClassDecoratorReturnType;
  /**
   * @example
   *  \@Command('task')
   * class RunTaskCommand {}
   *
   * \@Command('run', 'r', [RunTaskCommand])
   * class RunCommand {}
   *
   * \@Command('run', 'run command handle', [RunTaskCommand])
   * class RunCommand {}
   */
  public static Command(
    commandName: string,
    aliasOrDescription: string,
    childCommandList: CommandList
  ): AnyClassDecoratorReturnType;
  /**
   * @example
   *  \@Command('task')
   * class RunTaskCommand {}
   *
   * \@Command('run', 'r', 'run command handle', [RunTaskCommand])
   * class RunCommand {}
   */
  public static Command(
    commandName: string,
    alias: string,
    description: string,
    childCommandList: CommandList
  ): AnyClassDecoratorReturnType;
  public static Command(
    commandNameOrConfig: string | CommandConfiguration,
    aliasOrDescriptionOrChildComnandList?: string | CommandList,
    descriptionOrChildComnandList?: string | CommandList,
    childCommandList?: CommandList
  ): AnyClassDecoratorReturnType {
    //  @Command(config: CommandConfiguration)
    if (typeof commandNameOrConfig === "object") {
      const { name, alias, description, childCommandList } =
        commandNameOrConfig;
      return CommandDecorators.registerCommandImpl(
        name,
        alias,
        description,
        childCommandList
      );
    }

    // @Command(commandName: string)
    if (
      typeof commandNameOrConfig === "string" &&
      !aliasOrDescriptionOrChildComnandList &&
      !descriptionOrChildComnandList &&
      !childCommandList
    ) {
      return CommandDecorators.registerCommandImpl(
        commandNameOrConfig,
        null,
        null,
        []
      );
    }

    if (
      typeof commandNameOrConfig === "string" &&
      aliasOrDescriptionOrChildComnandList &&
      !descriptionOrChildComnandList &&
      !childCommandList
    ) {
      // @Command(commandName: string, aliasOrDescription: string)
      if (typeof aliasOrDescriptionOrChildComnandList === "string") {
        const asAlias = aliasOrDescriptionOrChildComnandList.length <= 2;

        return CommandDecorators.registerCommandImpl(
          commandNameOrConfig,
          asAlias ? aliasOrDescriptionOrChildComnandList : null,
          asAlias ? null : aliasOrDescriptionOrChildComnandList,
          []
        );
      } else {
        // @Command(commandName: string, childCommandList: CommandList)
        return CommandDecorators.registerCommandImpl(
          commandNameOrConfig,
          null,
          null,
          aliasOrDescriptionOrChildComnandList
        );
      }
    }

    if (
      typeof commandNameOrConfig === "string" &&
      aliasOrDescriptionOrChildComnandList &&
      descriptionOrChildComnandList &&
      !childCommandList
    ) {
      // @Command(commandName: string, alias: string, description: string)
      if (typeof descriptionOrChildComnandList === "string") {
        return CommandDecorators.registerCommandImpl(
          commandNameOrConfig,
          <string>aliasOrDescriptionOrChildComnandList,
          descriptionOrChildComnandList,
          []
        );
      } else {
        // @Command(commandName: string, aliasOrDescription: string, childCommandList: CommandList)
        return CommandDecorators.registerCommandImpl(
          commandNameOrConfig,
          <string>aliasOrDescriptionOrChildComnandList,
          null,
          descriptionOrChildComnandList
        );
      }
    }

    // @Command(commandName: string, alias: string, description: string, childCommandList: CommandList)
    if (Array.isArray(childCommandList)) {
      return CommandDecorators.registerCommandImpl(
        commandNameOrConfig,
        <string>aliasOrDescriptionOrChildComnandList,
        <string>descriptionOrChildComnandList,
        childCommandList
      );
    }

    return CommandDecorators.registerCommandImpl(
      commandNameOrConfig,
      null,
      null,
      childCommandList
    );
  }

  public static RootCommand(): AnyClassDecoratorReturnType {
    return (target, context) => {
      MustardRegistry.registerInit(<string>context.name, {
        commandInvokeName: MustardConstanst.RootCommandRegistryKey,
        Class: target,
        root: true,
        childCommandList: [],
      });
    };
  }

  private static registerCommandImpl(
    commandInvokeName: string,
    commandAlias?: Nullable<string>,
    description?: Nullable<string>,
    childCommandList: CommandList = []
  ): AnyClassDecoratorReturnType {
    return (target, context) => {
      debug("Command %s registered", commandInvokeName);

      MustardRegistry.registerInit(<string>context.name, {
        commandInvokeName,
        commandAlias,
        description,
        Class: target,
        root: false,
        childCommandList,
      });
    };
  }
}

import _debug from "debug";

import { CommandRegistry } from "../Core/CommandRegistry.js";
import { MustardConstanst } from "../Utils/Constants.js";

import { MultipleRootCommandError } from "../Errors/MultipleRootCommandError.js";

import type { CommandList } from "../Typings/Configuration.struct.js";
import type { ClassStruct, Nullable } from "../Typings/Shared.struct.js";
import type { ClassDecoratorImpl } from "../Typings/Decorator.struct.js";
import type { CommandConfiguration } from "../Typings/Command.struct.js";

const debug = _debug("mustard:decorator:command");

/**
 * Command related decorators
 *
 * `@Command` and `@RootCommand`
 */
export class CommandDecorators {
  private static RegisteredRootCommandTarget: Nullable<ClassStruct> = null;

  /**
   * Register root command handler class
   * @returns
   */
  public static RootCommand(): ClassDecoratorImpl {
    return (target, context) => {
      if (CommandDecorators.RegisteredRootCommandTarget) {
        throw new MultipleRootCommandError(
          CommandDecorators.RegisteredRootCommandTarget,
          target,
        );
      }

      CommandDecorators.RegisteredRootCommandTarget = target;

      CommandRegistry.registerInit(<string>context.name, {
        commandInvokeName: MustardConstanst.RootCommandRegistryKey,
        Class: target,
        root: true,
        childCommandList: [],
      });
    };
  }

  /**
   * Register command handler class
   * @example
   * \@Command('run')
   * class RunCommand {}
   */
  public static Command(commandName: string): ClassDecoratorImpl;
  /**
   * Register command handler class
   * @example
   * \@Command({ name: 'run', alias: 'r' })
   * class RunCommand {}
   */
  public static Command(config: CommandConfiguration): ClassDecoratorImpl;
  /**
   * Register command handler class
   * @example
   * \@Command('run', 'r')
   * class RunCommand {}
   *
   * \@Command('run', 'run command handle')
   * class RunCommand {}
   */
  public static Command(
    commandName: string,
    aliasOrDescription: string,
  ): ClassDecoratorImpl;
  /**
   * Register command handler class
   * @example
   *  \@Command('task')
   * class RunTaskCommand {}
   *
   * \@Command('run', [RunTaskCommand])
   * class RunCommand {}
   */
  public static Command(
    commandName: string,
    childCommandList: CommandList,
  ): ClassDecoratorImpl;
  /**
   * Register command handler class
   * @example
   * \@Command('run', 'r', 'run command handle')
   * class RunCommand {}
   */
  public static Command(
    commandName: string,
    alias: string,
    description: string,
  ): ClassDecoratorImpl;
  /**
   * Register command handler class
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
    childCommandList: CommandList,
  ): ClassDecoratorImpl;
  /**
   * Register command handler class
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
    childCommandList: CommandList,
  ): ClassDecoratorImpl;
  public static Command(
    commandNameOrConfig: string | CommandConfiguration,
    aliasOrDescriptionOrChildComnandList?: string | CommandList,
    descriptionOrChildComnandList?: string | CommandList,
    childCommandList?: CommandList,
  ): ClassDecoratorImpl {
    //  @Command(config: CommandConfiguration)
    if (typeof commandNameOrConfig === "object") {
      const { name, alias, description, childCommandList } =
        commandNameOrConfig;
      return CommandDecorators.registerCommandImpl(
        name,
        alias,
        description,
        childCommandList,
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
        [],
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
          [],
        );
      } else {
        // @Command(commandName: string, childCommandList: CommandList)
        return CommandDecorators.registerCommandImpl(
          commandNameOrConfig,
          null,
          null,
          aliasOrDescriptionOrChildComnandList,
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
          [],
        );
      } else {
        // @Command(commandName: string, aliasOrDescription: string, childCommandList: CommandList)
        return CommandDecorators.registerCommandImpl(
          commandNameOrConfig,
          <string>aliasOrDescriptionOrChildComnandList,
          null,
          descriptionOrChildComnandList,
        );
      }
    }

    // @Command(commandName: string, alias: string, description: string, childCommandList: CommandList)
    if (Array.isArray(childCommandList)) {
      return CommandDecorators.registerCommandImpl(
        commandNameOrConfig,
        <string>aliasOrDescriptionOrChildComnandList,
        <string>descriptionOrChildComnandList,
        childCommandList,
      );
    }

    return CommandDecorators.registerCommandImpl(
      commandNameOrConfig,
      null,
      null,
      childCommandList,
    );
  }

  private static registerCommandImpl(
    commandInvokeName: string,
    commandAlias?: Nullable<string>,
    description?: Nullable<string>,
    childCommandList: CommandList = [],
  ): ClassDecoratorImpl {
    return (target, context) => {
      debug("Command %s registered", commandInvokeName);

      CommandRegistry.registerInit(<string>context.name, {
        commandInvokeName,
        commandAlias,
        description,
        Class: target,
        root: false,
        childCommandList,
      });
    };
  }

  /**
   * Mark command as dangerous
   */
  public static Dangerous(): ClassDecoratorImpl {
    return (target, context) => {};
  }

  /**
   * Mark command as require approval
   */
  public static RequireApproval(): ClassDecoratorImpl {
    return (target, context) => {};
  }

  /**
   * Mark command as safe
   */
  public static Safe(): ClassDecoratorImpl {
    return (target, context) => {};
  }
}

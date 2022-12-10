import { CommandList } from "source/Typings/Configuration.struct";
import { MustardRegistry } from "../Components/Registry";
import { MustardConstanst } from "../Components/Constants";

import type { Nullable } from "../Typings/Shared.struct";
import type { AnyClassDecoratorReturnType } from "../Typings/Temp";
import type { CommandConfiguration } from "../Typings/Command.struct";

export class CommandDecorators {
  public static Command(commandName: string): AnyClassDecoratorReturnType;
  public static Command(
    config: CommandConfiguration
  ): AnyClassDecoratorReturnType;
  public static Command(
    commandName: string,
    aliasOrDescription: string
  ): AnyClassDecoratorReturnType;
  public static Command(
    commandName: string,
    childCommandList: CommandList
  ): AnyClassDecoratorReturnType;
  public static Command(
    commandName: string,
    alias: string,
    description: string
  ): AnyClassDecoratorReturnType;
  public static Command(
    commandName: string,
    aliasOrDescription: string,
    childCommandList: CommandList
  ): AnyClassDecoratorReturnType;
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
    childCommandList: CommandList = []
  ): AnyClassDecoratorReturnType {
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

    if (
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
      !descriptionOrChildComnandList &&
      !childCommandList &&
      aliasOrDescriptionOrChildComnandList
    ) {
      if (typeof aliasOrDescriptionOrChildComnandList === "string") {
        const asAlias = aliasOrDescriptionOrChildComnandList.length <= 2;

        return CommandDecorators.registerCommandImpl(
          commandNameOrConfig,
          asAlias ? aliasOrDescriptionOrChildComnandList : null,
          asAlias ? null : aliasOrDescriptionOrChildComnandList,
          []
        );
      } else {
        return CommandDecorators.registerCommandImpl(
          commandNameOrConfig,
          null,
          null,
          aliasOrDescriptionOrChildComnandList
        );
      }
    }

    if (
      !childCommandList &&
      descriptionOrChildComnandList &&
      aliasOrDescriptionOrChildComnandList
    ) {
      if (typeof descriptionOrChildComnandList === "string") {
        return CommandDecorators.registerCommandImpl(
          commandNameOrConfig,
          <string>aliasOrDescriptionOrChildComnandList,
          descriptionOrChildComnandList,
          []
        );
      } else {
        return CommandDecorators.registerCommandImpl(
          commandNameOrConfig,
          <string>aliasOrDescriptionOrChildComnandList,
          null,
          descriptionOrChildComnandList
        );
      }
    }

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

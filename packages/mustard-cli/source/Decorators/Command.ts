import { CommandList } from "source/Typings/Configuration.struct";
import { MustardRegistry } from "../Components/Registry";
import { MustardConstanst } from "../Components/Constants";

import type { Nullable } from "../Typings/Shared.struct";
import type { AnyClassDecoratorReturnType } from "../Typings/Temp";

export class CommandDecorators {
  public static Command(commandName: string): AnyClassDecoratorReturnType;
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
    commandName: string,
    aliasOrDescriptionOrChildComnandList?: string | CommandList,
    descriptionOrChildComnandList?: string | CommandList,
    childCommandList: CommandList = []
  ): AnyClassDecoratorReturnType {
    // overload1
    if (
      !aliasOrDescriptionOrChildComnandList &&
      !descriptionOrChildComnandList &&
      !childCommandList
    ) {
      return CommandDecorators.registerCommandImpl(commandName, null, null, []);
    }

    // overload 2 & 3
    if (
      !descriptionOrChildComnandList &&
      !childCommandList &&
      aliasOrDescriptionOrChildComnandList
    ) {
      if (typeof aliasOrDescriptionOrChildComnandList === "string") {
        const asAlias = aliasOrDescriptionOrChildComnandList.length <= 2;

        return CommandDecorators.registerCommandImpl(
          commandName,
          asAlias ? aliasOrDescriptionOrChildComnandList : null,
          asAlias ? null : aliasOrDescriptionOrChildComnandList,
          []
        );
      } else {
        return CommandDecorators.registerCommandImpl(
          commandName,
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
      // overload 4
      if (typeof descriptionOrChildComnandList === "string") {
        return CommandDecorators.registerCommandImpl(
          commandName,
          <string>aliasOrDescriptionOrChildComnandList,
          descriptionOrChildComnandList,
          []
        );
      } else {
        // overload 5
        return CommandDecorators.registerCommandImpl(
          commandName,
          <string>aliasOrDescriptionOrChildComnandList,
          null,
          descriptionOrChildComnandList
        );
      }
    }

    // overload 6
    if (Array.isArray(childCommandList)) {
      return CommandDecorators.registerCommandImpl(
        commandName,
        <string>aliasOrDescriptionOrChildComnandList,
        <string>descriptionOrChildComnandList,
        childCommandList
      );
    }

    return CommandDecorators.registerCommandImpl(
      commandName,
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

import { CommandList } from "source/Typings/Configuration.struct";
import { MustardRegistry } from "../Components/Registry";

import type { Nullable } from "../Typings/Shared.struct";
import type { AnyClassDecoratorReturnType } from "../Typings/Temp";

export class CommandDecorators {
  // public static Command(commandName: string): ClassDecoratorFunction;
  // public static Command(
  //   commandName: string,
  //   aliasOrDescription: string
  // ): ClassDecoratorFunction;
  // public static Command(
  //   commandName: string,
  //   alias: string,
  //   description: string
  // ): ClassDecoratorFunction;
  public static Command(
    commandName: string,
    aliasOrDescription?: string,
    description?: string,
    childCommandList: CommandList = []
  ): AnyClassDecoratorReturnType {
    if (typeof description === "string") {
      return CommandDecorators.registerCommandImpl(
        commandName,
        aliasOrDescription,
        description,
        childCommandList
      );
    }

    if (typeof aliasOrDescription === "string") {
      if (aliasOrDescription.length <= 2) {
        return CommandDecorators.registerCommandImpl(
          commandName,
          aliasOrDescription,
          null,
          childCommandList
        );
      } else {
        return CommandDecorators.registerCommandImpl(
          commandName,
          null,
          aliasOrDescription,
          childCommandList
        );
      }
    }

    return CommandDecorators.registerCommandImpl(
      commandName,
      null,
      null,
      childCommandList
    );
  }

  public static RootCommand(): ClassDecoratorFunction<{}, any> {
    return (target, context) => {
      // @ts-expect-error
      MustardRegistry.registerInit(context.name, {
        commandName: "root",
        Class: target,
        root: true,
        childCommandList: [],
      });
    };
  }

  private static registerCommandImpl(
    commandName: string,
    alias?: Nullable<string>,
    description?: Nullable<string>,
    childCommandList?: CommandList
  ): AnyClassDecoratorReturnType {
    return (target, context) => {
      // @ts-expect-error
      MustardRegistry.registerInit(context.name, {
        commandName,
        alias,
        description,
        Class: target,
        root: false,
        childCommandList,
      });
    };
  }
}

import { MustardRegistry } from "source/Components/Registry";
import { Nullable } from "source/Typings/Shared.struct";
import { AnyClassDecoratorReturnType } from "source/Typings/Temp";

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
    childCommandList: any[] = []
  ): ClassDecoratorFunction<{}, any> {
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
      MustardRegistry.register(context.name, {
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
    childCommandList?: any[]
  ): AnyClassDecoratorReturnType {
    return (target, context) => {
      // @ts-expect-error
      MustardRegistry.register(context.name, {
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

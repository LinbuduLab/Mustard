import { MustardRegistry } from "source/Core/Registry";
import { Nullable } from "source/Typings/Shared.struct";

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
      MustardRegistry.register(context.name, {
        commandName: "root",
        class: target,
        root: true,
        childCommandList: [],
      });
    };
  }

  private static registerCommandImpl(
    commandName: string,
    alias: Nullable<string>,
    description: Nullable<string>,
    childCommandList?: any[]
  ): ClassDecoratorFunction<{}, any> {
    return (target, context) => {
      MustardRegistry.register(context.name, {
        commandName,
        alias,
        description,
        class: target,
        root: false,
        childCommandList,
      });
    };
  }
}

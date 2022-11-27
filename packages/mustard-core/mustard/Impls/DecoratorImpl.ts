import { ValidatorFactory } from "./Validator";
import { CommandRegistry } from "./types/Instantiation.struct";
import type { OptionInitializerPlaceHolder } from "./types/Option.struct";
import { ContextInitializerPlaceHolder } from "./types/Context.struct";
import { Nullable } from "./types/Shared.struct";

export class DecoratorImpl {
  public static commandRegistry = new CommandRegistry();

  public static Command(commandName: string): ClassDecoratorFunction;
  public static Command(
    commandName: string,
    aliasOrDescription: string
  ): ClassDecoratorFunction;
  public static Command(
    commandName: string,
    alias: string,
    description: string
  ): ClassDecoratorFunction;
  public static Command(
    commandName: string,
    aliasOrDescription?: string,
    description?: string
  ): ClassDecoratorFunction {
    if (typeof description === "string") {
      return DecoratorImpl.CommandImpl(
        commandName,
        aliasOrDescription,
        description
      );
    }

    if (typeof aliasOrDescription === "string") {
      if (aliasOrDescription.length <= 2) {
        return DecoratorImpl.CommandImpl(commandName, aliasOrDescription, null);
      } else {
        return DecoratorImpl.CommandImpl(commandName, null, aliasOrDescription);
      }
    }

    return DecoratorImpl.CommandImpl(commandName, null, null);
  }

  public static CommandImpl(
    commandName: string,
    alias: Nullable<string>,
    description: Nullable<string>
  ): ClassDecoratorFunction {
    return (target, context) => {
      DecoratorImpl.commandRegistry.set(context.name, {
        commandName,
        alias,
        description,
        class: target,
        root: false,
      });
    };
  }

  public static RootCommand(): ClassDecoratorFunction {
    return (target, context) => {
      DecoratorImpl.commandRegistry.set(context.name, {
        commandName: "root",
        class: target,
        root: true,
      });
    };
  }

  public static Option(
    optionName?: string,
    // description?: string,
    validator?: Partial<ValidatorFactory>
  ): ClassFieldDecoratorFunction {
    return (_, { name }) =>
      (initValue) =>
        <OptionInitializerPlaceHolder>{
          type: "Option",
          optionName: optionName ?? String(name),
          initValue,
          schema: validator?.schema,
          // description,
        };
  }

  public static Input(): ClassFieldDecoratorFunction {
    return (_, { name }) =>
      (initValue) => ({
        type: "Input",
      });
  }

  public static Context(): ClassFieldDecoratorFunction {
    return (_, { name }) =>
      (initValue) =>
        <ContextInitializerPlaceHolder>{
          type: "Context",
          // description,
        };
  }

  // @Options accept no args as it represents all options received
  public static Options(): ClassFieldDecoratorFunction {
    return (initValue) => () =>
      <OptionInitializerPlaceHolder>{
        type: "Options",
        initValue,
      };
  }
}

import { ValidatorFactory } from "./Validator";
import { CommandRegistry } from "./types/Instantiation.struct";
import type { OptionInitializerPlaceHolder } from './types/Option.struct';






export class DecoratorImpl {
  public static commandRegistry = new CommandRegistry();

  public static Command(
    commandName: string,
    aliasName?: string
    // subCommands?: any[]
  ): ClassDecoratorFunction {
    return (target, context) => {
      DecoratorImpl.commandRegistry.set(context.name, {
        commandName,
        aliasName,
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
      (initValue) => ({
        type: 'Option',
        optionName: optionName ?? String(name),
        initValue,
        schema: validator?.schema,
        // description,
      } satisfies OptionInitializerPlaceHolder);
  }

  // @Options accept no args as it represents all options received
  public static Options(): ClassFieldDecoratorFunction {
    return (initValue) => () => ({
      type: 'Options',
      initValue,
    } satisfies OptionInitializerPlaceHolder);
  }
}

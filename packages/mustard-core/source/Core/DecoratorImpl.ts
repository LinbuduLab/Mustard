import { ValidatorFactory } from "../Validators/Validator";
import { CommandRegistry } from "../Types/Instantiation.struct";
import type { OptionInitializerPlaceHolder } from "../Types/Option.struct";
import { ContextInitializerPlaceHolder } from "../Types/Context.struct";
import { Nullable } from "../Types/Shared.struct";
import { MustardRegistry } from "./Registry";

export class DecoratorImpl {
  public static commandRegistry = new CommandRegistry();

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
      return DecoratorImpl.CommandImpl(
        commandName,
        aliasOrDescription,
        description,
        childCommandList
      );
    }

    if (typeof aliasOrDescription === "string") {
      if (aliasOrDescription.length <= 2) {
        return DecoratorImpl.CommandImpl(
          commandName,
          aliasOrDescription,
          null,
          childCommandList
        );
      } else {
        return DecoratorImpl.CommandImpl(
          commandName,
          null,
          aliasOrDescription,
          childCommandList
        );
      }
    }

    return DecoratorImpl.CommandImpl(commandName, null, null, childCommandList);
  }

  public static CommandImpl(
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

  public static Option(
    optionName: string,
    validator?: Partial<ValidatorFactory>
  ): ClassFieldDecoratorFunction<any, any, any>;
  public static Option(
    optionName: string,
    aliasOrDescription?: string,
    validator?: Partial<ValidatorFactory>
  ): ClassFieldDecoratorFunction<any, any, any>;
  public static Option(
    optionName: string,
    alias: string,
    description: string,
    validator?: Partial<ValidatorFactory>
  ): ClassFieldDecoratorFunction<any, any, any>;
  public static Option(
    optionName?: string,
    aliasOrDescription?: string | Partial<ValidatorFactory>,
    description?: string | Partial<ValidatorFactory>,
    validator?: Partial<ValidatorFactory>
  ): ClassFieldDecoratorFunction<any, any, any> {
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

  public static VariadicOption(
    optionName?: string
  ): ClassFieldDecoratorFunction<any, any, any> {
    return (_, { name }) =>
      (initValue) =>
        <OptionInitializerPlaceHolder>{
          type: "VariadicOption",
          optionName: optionName ?? String(name),
          initValue,
        };
  }

  public static Input(): ClassFieldDecoratorFunction<any, any, any> {
    return (_, { name }) =>
      (initValue) => ({
        type: "Input",
      });
  }

  public static Context(): ClassFieldDecoratorFunction<any, any, any> {
    return (_, { name }) =>
      (initValue) =>
        <ContextInitializerPlaceHolder>{
          type: "Context",
          // description,
        };
  }

  // @Options accept no args as it represents all options received
  public static Options(): ClassFieldDecoratorFunction<any, any, any> {
    return (initValue) => () =>
      <OptionInitializerPlaceHolder>{
        type: "Options",
        initValue,
      };
  }
}

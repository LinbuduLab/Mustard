import { MustardRegistry } from "source/Components/Registry";
import { OptionInitializerPlaceHolder } from "source/Typings/Option.struct";
import { AnyClassFieldDecoratorReturnType } from "source/Typings/Temp";
import { ValidatorFactory } from "source/Validators/Factory";

export class OptionDecorators {
  public static Option(
    optionName: string,
    validator?: Partial<ValidatorFactory>
  ): AnyClassFieldDecoratorReturnType;
  public static Option(
    optionName: string,
    aliasOrDescription?: string,
    validator?: Partial<ValidatorFactory>
  ): AnyClassFieldDecoratorReturnType;
  public static Option(
    optionName: string,
    alias: string,
    description: string,
    validator?: Partial<ValidatorFactory>
  ): AnyClassFieldDecoratorReturnType;
  public static Option(
    optionName?: string,
    aliasOrDescription?: string | Partial<ValidatorFactory>,
    description?: string | Partial<ValidatorFactory>,
    validator?: Partial<ValidatorFactory>
  ): AnyClassFieldDecoratorReturnType {
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
      (initValue) => {
        const optionNameValue = optionName ?? String(name);

        MustardRegistry.VariadicOptions.add(optionNameValue);

        return <OptionInitializerPlaceHolder>{
          type: "VariadicOption",
          optionName: optionNameValue,
          initValue,
        };
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

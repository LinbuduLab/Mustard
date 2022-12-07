import { MustardRegistry } from "../Components/Registry";
import { ValidatorFactory } from "../Validators/Factory";

import type { OptionInitializerPlaceHolder } from "../Typings/Option.struct";
import type { AnyClassFieldDecoratorReturnType } from "../Typings/Temp";
import type { Nullable } from "source/Typings/Shared.struct";

export class OptionDecorators {
  public static Option(): AnyClassFieldDecoratorReturnType;
  public static Option(optionName: string): AnyClassFieldDecoratorReturnType;
  public static Option(
    validator: Partial<ValidatorFactory>
  ): AnyClassFieldDecoratorReturnType;
  public static Option(
    optionName: string,
    aliasOrDescription: string
  ): AnyClassFieldDecoratorReturnType;
  public static Option(
    optionName: string,
    validator: Partial<ValidatorFactory>
  ): AnyClassFieldDecoratorReturnType;
  public static Option(
    optionName: string,
    aliasOrDescription: string,
    validator: Partial<ValidatorFactory>
  ): AnyClassFieldDecoratorReturnType;
  public static Option(
    optionName: string,
    alias: string,
    description: string,
    validator: Partial<ValidatorFactory>
  ): AnyClassFieldDecoratorReturnType;
  public static Option(
    optionNameOrValidator?: string | Partial<ValidatorFactory>,
    aliasOrDescriptionOrValidator?: string | Partial<ValidatorFactory>,
    descriptionOrValidator?: string | Partial<ValidatorFactory>,
    validator?: Partial<ValidatorFactory>
  ): AnyClassFieldDecoratorReturnType {
    // overload 1
    if (
      !optionNameOrValidator &&
      !aliasOrDescriptionOrValidator &&
      !descriptionOrValidator &&
      !validator
    ) {
      return OptionDecorators.OptionImpl(null, null, null, null);
    }
    // overload 2 & 3
    if (
      optionNameOrValidator &&
      !aliasOrDescriptionOrValidator &&
      !descriptionOrValidator &&
      !validator
    ) {
      if (typeof optionNameOrValidator === "string") {
        return OptionDecorators.OptionImpl(
          optionNameOrValidator,
          null,
          null,
          null
        );
      }

      return OptionDecorators.OptionImpl(
        null,
        null,
        null,
        optionNameOrValidator
      );
    }
    // overload 4 & 5
    if (
      optionNameOrValidator &&
      aliasOrDescriptionOrValidator &&
      !descriptionOrValidator &&
      !validator
    ) {
      // overlad 4
      if (
        typeof optionNameOrValidator === "string" &&
        typeof aliasOrDescriptionOrValidator === "string"
      ) {
        const asAlias = aliasOrDescriptionOrValidator.length <= 2;

        return OptionDecorators.OptionImpl(
          optionNameOrValidator,
          asAlias ? aliasOrDescriptionOrValidator : null,
          asAlias ? null : aliasOrDescriptionOrValidator,
          null
        );
      }

      // overlad 5
      return OptionDecorators.OptionImpl(
        <string>optionNameOrValidator,
        null,
        null,
        <Partial<ValidatorFactory>>aliasOrDescriptionOrValidator
      );
    }

    // overload 6 & 7
    return OptionDecorators.OptionImpl(
      <string>optionNameOrValidator,
      <string>aliasOrDescriptionOrValidator,
      <string>descriptionOrValidator,
      <Partial<ValidatorFactory>>validator
    );
  }

  private static OptionImpl(
    optionName?: Nullable<string>,
    alias?: Nullable<string>,
    description?: Nullable<string>,
    validator?: Nullable<Partial<ValidatorFactory>>
  ): AnyClassFieldDecoratorReturnType {
    return (_, { name }) =>
      (initValue) =>
        <OptionInitializerPlaceHolder>{
          type: "Option",
          optionName: optionName ?? String(name),
          optionAlias: alias,
          initValue,
          schema: validator?.schema,
          description,
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

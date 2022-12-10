import { MustardRegistry } from "../Components/Registry";
import { ValidatorFactory } from "../Validators/Factory";

import type {
  OptionInitializerPlaceHolder,
  OptionConfiguration,
  VariadicOptionConfiguration,
} from "../Typings/Option.struct";
import type { AnyClassFieldDecoratorReturnType } from "../Typings/Temp";
import type { Nullable } from "../Typings/Shared.struct";

export class OptionDecorators {
  public static Option(): AnyClassFieldDecoratorReturnType;
  public static Option(
    optionName: OptionConfiguration
  ): AnyClassFieldDecoratorReturnType;
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
    optionNameOrValidatorOrCompleteConfig?:
      | string
      | Partial<ValidatorFactory>
      | OptionConfiguration,
    aliasOrDescriptionOrValidator?: string | Partial<ValidatorFactory>,
    descriptionOrValidator?: string | Partial<ValidatorFactory>,
    validator?: Partial<ValidatorFactory>
  ): AnyClassFieldDecoratorReturnType {
    if (
      !optionNameOrValidatorOrCompleteConfig &&
      !aliasOrDescriptionOrValidator &&
      !descriptionOrValidator &&
      !validator
    ) {
      return OptionDecorators.OptionImpl(null, null, null, null);
    }

    if (
      optionNameOrValidatorOrCompleteConfig &&
      !aliasOrDescriptionOrValidator &&
      !descriptionOrValidator &&
      !validator
    ) {
      if (typeof optionNameOrValidatorOrCompleteConfig === "string") {
        return OptionDecorators.OptionImpl(
          optionNameOrValidatorOrCompleteConfig,
          null,
          null,
          null
        );
      }

      if (
        typeof optionNameOrValidatorOrCompleteConfig === "object" &&
        "name" in optionNameOrValidatorOrCompleteConfig
      ) {
        return OptionDecorators.OptionImpl(
          optionNameOrValidatorOrCompleteConfig.name,
          optionNameOrValidatorOrCompleteConfig.alias,
          optionNameOrValidatorOrCompleteConfig.description,
          optionNameOrValidatorOrCompleteConfig.validator
        );
      }

      return OptionDecorators.OptionImpl(
        null,
        null,
        null,
        <Partial<ValidatorFactory>>optionNameOrValidatorOrCompleteConfig
      );
    }

    if (
      optionNameOrValidatorOrCompleteConfig &&
      aliasOrDescriptionOrValidator &&
      !descriptionOrValidator &&
      !validator
    ) {
      if (
        typeof optionNameOrValidatorOrCompleteConfig === "string" &&
        typeof aliasOrDescriptionOrValidator === "string"
      ) {
        const asAlias = aliasOrDescriptionOrValidator.length <= 2;

        return OptionDecorators.OptionImpl(
          optionNameOrValidatorOrCompleteConfig,
          asAlias ? aliasOrDescriptionOrValidator : null,
          asAlias ? null : aliasOrDescriptionOrValidator,
          null
        );
      }

      return OptionDecorators.OptionImpl(
        <string>optionNameOrValidatorOrCompleteConfig,
        null,
        null,
        <Partial<ValidatorFactory>>aliasOrDescriptionOrValidator
      );
    }

    if (
      typeof optionNameOrValidatorOrCompleteConfig === "string" &&
      typeof aliasOrDescriptionOrValidator === "string" &&
      typeof descriptionOrValidator !== "string"
    ) {
      const asAlias = aliasOrDescriptionOrValidator.length <= 2;

      return OptionDecorators.OptionImpl(
        <string>optionNameOrValidatorOrCompleteConfig,
        asAlias ? aliasOrDescriptionOrValidator : null,
        asAlias ? null : aliasOrDescriptionOrValidator,
        <Partial<ValidatorFactory>>validator
      );
    }

    return OptionDecorators.OptionImpl(
      <string>optionNameOrValidatorOrCompleteConfig,
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
      (initValue) => {
        const applyOptionName = optionName ?? String(name);

        alias
          ? (MustardRegistry.OptionAliasMap[applyOptionName] = alias)
          : void 0;

        return <OptionInitializerPlaceHolder>{
          type: "Option",
          optionName: applyOptionName,
          optionAlias: alias,
          initValue,
          schema: validator?.schema,
          description,
        };
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

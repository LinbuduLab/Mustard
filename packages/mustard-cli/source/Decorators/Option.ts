import _debug from "debug";

import { MustardRegistry } from "../Components/Registry";
import { ValidatorFactory } from "../Validators/Factory";

import type {
  OptionInitializerPlaceHolder,
  OptionConfiguration,
  VariadicOptionConfiguration,
} from "../Typings/Option.struct";
import type { AnyClassFieldDecoratorReturnType } from "../Typings/Temp";
import type { Nullable } from "../Typings/Shared.struct";

const debug = _debug("mustard:decorator:option");

export class OptionDecorators {
  /**
   * @example
   * class RunCommand {
   *  \@Option()
   *   public dry: boolean;
   * }
   */
  public static Option(): AnyClassFieldDecoratorReturnType;
  /**
   * @example
   * class RunCommand {
   *  \@Option('dryRun')
   *   public dry: boolean;
   * }
   */
  public static Option(optionName: string): AnyClassFieldDecoratorReturnType;
  /**
   * @example
   * class RunCommand {
   *  \@Option(Validator.Boolean())
   *   public dry: boolean;
   * }
   */
  public static Option(
    validator: Partial<ValidatorFactory>
  ): AnyClassFieldDecoratorReturnType;
  /**
   * @example
   * class RunCommand {
   *  \@Option({ name: 'dryRun' })
   *   public dry: boolean;
   * }
   */
  public static Option(
    optionConfig: OptionConfiguration
  ): AnyClassFieldDecoratorReturnType;
  /**
   * @example
   * class RunCommand {
   *  \@Option('dryRun', 'dry run mode')
   *   public dry: boolean;
   *
   * \@Option('sync', 's')
   *   public sync: boolean;
   * }
   */
  public static Option(
    optionName: string,
    aliasOrDescription: string
  ): AnyClassFieldDecoratorReturnType;
  /**
   * @example
   * class RunCommand {
   *  \@Option('dryRun', Validator.Boolean())
   *   public dry: boolean;
   * }
   */
  public static Option(
    optionName: string,
    validator: Partial<ValidatorFactory>
  ): AnyClassFieldDecoratorReturnType;
  /**
   * @example
   * class RunCommand {
   *  \@Option('dryRun', 'dry run mode', Validator.Boolean())
   *   public dry: boolean;
   *
   * \@Option('sync', 's', Validator.Boolean())
   *   public sync: boolean;
   * }
   */
  public static Option(
    optionName: string,
    aliasOrDescription: string,
    validator: Partial<ValidatorFactory>
  ): AnyClassFieldDecoratorReturnType;
  /**
   * @example
   * class RunCommand {
   *  \@Option('dryRun', 'd', 'dry run mode')
   *   public dry: boolean;
   * }
   */
  public static Option(
    optionName: string,
    alias: string,
    description: string
  ): AnyClassFieldDecoratorReturnType;
  /**
   * @example
   * class RunCommand {
   *  \@Option('dryRun', 'd', 'dry run mode', Validator.Boolean())
   *   public dry: boolean;
   * }
   */
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

    if (typeof optionNameOrValidatorOrCompleteConfig === "object") {
      if ("schema" in optionNameOrValidatorOrCompleteConfig) {
        return OptionDecorators.OptionImpl(
          null,
          null,
          null,
          optionNameOrValidatorOrCompleteConfig
        );
      } else {
        const {
          name = null,
          alias = null,
          description = null,
          validator = null,
        } = <OptionConfiguration>optionNameOrValidatorOrCompleteConfig;
        return OptionDecorators.OptionImpl(name, alias, description, validator);
      }
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
        <Partial<ValidatorFactory>>descriptionOrValidator
      );
    }

    return OptionDecorators.OptionImpl(
      <string>optionNameOrValidatorOrCompleteConfig,
      <string>aliasOrDescriptionOrValidator,
      <string>descriptionOrValidator,
      <Partial<ValidatorFactory>>validator ?? null
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

        debug("Option %s registered", applyOptionName);

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

  public static VariadicOption(): AnyClassFieldDecoratorReturnType;
  public static VariadicOption(
    optionName: string
  ): AnyClassFieldDecoratorReturnType;
  public static VariadicOption(
    config: VariadicOptionConfiguration
  ): AnyClassFieldDecoratorReturnType;
  public static VariadicOption(
    optionName: string,
    aliasOrDescription?: string
  ): AnyClassFieldDecoratorReturnType;
  public static VariadicOption(
    optionName: string,
    alias: string,
    description: string
  ): AnyClassFieldDecoratorReturnType;
  public static VariadicOption(
    optionNameOrCompleteConfig?: string | VariadicOptionConfiguration,
    aliasOrDescription?: string,
    description?: string
  ): AnyClassFieldDecoratorReturnType {
    if (typeof optionNameOrCompleteConfig === "object") {
      const {
        name = null,
        alias = null,
        description = null,
      } = optionNameOrCompleteConfig;
      return OptionDecorators.VariadicOptionImpl(name, alias, description);
    }

    if (typeof description === "string") {
      return OptionDecorators.VariadicOptionImpl(
        optionNameOrCompleteConfig ?? null,
        aliasOrDescription ?? null,
        description
      );
    }

    if (optionNameOrCompleteConfig && !aliasOrDescription && !description) {
      return OptionDecorators.VariadicOptionImpl(
        optionNameOrCompleteConfig,
        null,
        null
      );
    }

    if (!optionNameOrCompleteConfig && !aliasOrDescription && !description) {
      return OptionDecorators.VariadicOptionImpl(null, null, null);
    }

    const asAlias = aliasOrDescription!.length <= 2;

    return OptionDecorators.VariadicOptionImpl(
      optionNameOrCompleteConfig ?? null,
      asAlias ? aliasOrDescription : null,
      asAlias ? null : aliasOrDescription
    );
  }

  private static VariadicOptionImpl(
    optionName?: Nullable<string>,
    alias?: Nullable<string>,
    description?: Nullable<string>
  ): AnyClassFieldDecoratorReturnType {
    return (_, context) => (initValue) => {
      const applyOptionName = optionName ?? String(context.name);

      debug("Variadic Option %s registered", applyOptionName);

      MustardRegistry.VariadicOptions.add(applyOptionName);

      alias ? MustardRegistry.VariadicOptions.add(alias) : void 0;

      return <OptionInitializerPlaceHolder>{
        type: "VariadicOption",
        optionName: applyOptionName,
        optionAlias: alias,
        description,
        initValue,
      };
    };
  }

  // @Options accept no args as it represents all options received
  public static Options(): AnyClassFieldDecoratorReturnType {
    return (_, context) => (initValue) => {
      debug("Options registered in %s field", context.name);
      return <OptionInitializerPlaceHolder>{
        type: "Options",
        initValue,
      };
    };
  }
}

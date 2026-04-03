import _debug from "debug";

import { CommandRegistry } from "../Core/CommandRegistry.js";
import { ValidatorFactory } from "../Validators/Factory.js";

import type {
  OptionInitializerPlaceHolder,
  OptionConfiguration,
  VariadicOptionConfiguration,
} from "../Typings/Option.struct.js";
import type { ClassFieldDecoratorImpl } from "../Typings/Decorator.struct.js";
import type { Nullable } from "../Typings/Shared.struct.js";
import { InstanceFieldDecorationTypes } from "../Utils/Constants.js";
import { GlobalRegistry } from "../Core/GlobalRegistry.js";

const debug = _debug("mustard:decorator:option");

/**
 * Options related decorators.
 */
export class OptionDecorators {
  /**
   * Register option for command.
   * Use property name as option name.
   *
   * @example
   * class RunCommand {
   *  // registered as '--dry'
   *  \@Option()
   *   public dry: boolean;
   * }
   */
  public static Option(): ClassFieldDecoratorImpl;

  /**
   * Register option for command.
   * Use provided option name.
   *
   * @example
   * class RunCommand {
   *  // registered as '--dry-run'
   *  \@Option('dryRun')
   *   public dry: boolean;
   * }
   */
  public static Option(optionName: string): ClassFieldDecoratorImpl;

  /**
   * Register option value inject
   * @example
   * class RunCommand {
   *  \@Option(Validator.Boolean())
   *   public dry: boolean;
   * }
   */
  public static Option(
    validator: Partial<ValidatorFactory>,
  ): ClassFieldDecoratorImpl;
  /**
   * Register option value inject
   * @example
   * class RunCommand {
   *  \@Option({ name: 'dryRun' })
   *   public dry: boolean;
   * }
   */
  public static Option(
    optionConfig: OptionConfiguration,
  ): ClassFieldDecoratorImpl;
  /**
   * Register option value inject
   * @example
   * class RunCommand {
   *  \@Option('sync', 's')
   *   public sync: boolean;
   * }
   */
  public static Option(
    optionName: string,
    alias: string,
  ): ClassFieldDecoratorImpl;
  /**
   * Register option value inject
   * @example
   * class RunCommand {
   *  \@Option('dryRun', Validator.Boolean())
   *   public dry: boolean;
   * }
   */
  public static Option(
    optionName: string,
    validator: Partial<ValidatorFactory>,
  ): ClassFieldDecoratorImpl;
  /**
   * Register option value inject
   * @example
   * class RunCommand {
   *  \@Option('sync', 's', Validator.Boolean())
   *   public sync: boolean;
   * }
   */
  public static Option(
    optionName: string,
    alias: string,
    validator: Partial<ValidatorFactory>,
  ): ClassFieldDecoratorImpl;
  public static Option(
    optionNameOrValidatorOrCompleteConfig?:
      | string
      | Partial<ValidatorFactory>
      | OptionConfiguration,
    aliasOrValidator?: string | Partial<ValidatorFactory>,
    validator?: Partial<ValidatorFactory>,
  ): ClassFieldDecoratorImpl {
    if (
      !optionNameOrValidatorOrCompleteConfig &&
      !aliasOrValidator &&
      !validator
    ) {
      return OptionDecorators.OptionImpl(null, null, null);
    }

    if (typeof optionNameOrValidatorOrCompleteConfig === "object") {
      if ("schema" in optionNameOrValidatorOrCompleteConfig) {
        return OptionDecorators.OptionImpl(
          null,
          null,
          optionNameOrValidatorOrCompleteConfig,
        );
      } else {
        const {
          name = null,
          alias = null,
          validator = null,
        } = <OptionConfiguration>optionNameOrValidatorOrCompleteConfig;
        return OptionDecorators.OptionImpl(name, alias, validator);
      }
    }

    if (
      optionNameOrValidatorOrCompleteConfig &&
      !aliasOrValidator &&
      !validator
    ) {
      if (typeof optionNameOrValidatorOrCompleteConfig === "string") {
        return OptionDecorators.OptionImpl(
          optionNameOrValidatorOrCompleteConfig,
          null,
          null,
        );
      }

      return OptionDecorators.OptionImpl(
        null,
        null,
        <Partial<ValidatorFactory>>optionNameOrValidatorOrCompleteConfig,
      );
    }

    if (
      optionNameOrValidatorOrCompleteConfig &&
      aliasOrValidator &&
      !validator
    ) {
      if (
        typeof optionNameOrValidatorOrCompleteConfig === "string" &&
        typeof aliasOrValidator === "string"
      ) {
        return OptionDecorators.OptionImpl(
          optionNameOrValidatorOrCompleteConfig,
          aliasOrValidator,
          null,
        );
      }

      return OptionDecorators.OptionImpl(
        <string>optionNameOrValidatorOrCompleteConfig,
        null,
        <Partial<ValidatorFactory>>aliasOrValidator,
      );
    }

    return OptionDecorators.OptionImpl(
      <string>optionNameOrValidatorOrCompleteConfig,
      <string>aliasOrValidator,
      <Partial<ValidatorFactory>>validator ?? null,
    );
  }

  private static OptionImpl(
    optionName?: Nullable<string>,
    alias?: Nullable<string>,
    validator?: Nullable<Partial<ValidatorFactory>>,
  ): ClassFieldDecoratorImpl {
    return (_, { name }) =>
      (initValue) => {
        const applyOptionName = optionName ?? String(name);

        debug("Option %s registered", applyOptionName);

        alias
          ? (GlobalRegistry.OptionAliasMap[applyOptionName] = alias)
          : void 0;

        return <OptionInitializerPlaceHolder>{
          type: InstanceFieldDecorationTypes.Option,
          optionName: applyOptionName,
          optionAlias: alias,
          initValue,
          schema: validator?.schema,
        };
      };
  }

  /**
   * Register variadic option value inject
   * @example
   * class RunCommand {
   *  \@VariadicOption()
   *   public packages: string[];
   * }
   */
  public static VariadicOption(): ClassFieldDecoratorImpl;
  /**
   * Register variadic option value inject
   * @example
   * class RunCommand {
   *  \@VariadicOption('pkg')
   *   public packages: string[];
   * }
   */
  public static VariadicOption(optionName: string): ClassFieldDecoratorImpl;
  /**
   * Register variadic option value inject
   * @example
   * class RunCommand {
   *  \@VariadicOption({ name: 'pkg', alias: 'p' })
   *   public packages: string[];
   * }
   */
  public static VariadicOption(
    config: VariadicOptionConfiguration,
  ): ClassFieldDecoratorImpl;
  /**
   * Register variadic option value inject
   * @example
   * class RunCommand {
   *  \@VariadicOption('pkg', 'p')
   *   public packages: string[];
   *
   * \@VariadicOption('conf', 'config file to use')
   *   public config: string[];
   * }
   */
  public static VariadicOption(
    optionName: string,
    aliasOrDescription?: string,
  ): ClassFieldDecoratorImpl;
  /**
   * Register variadic option value inject
   * @example
   * class RunCommand {
   *  \@VariadicOption('pkg', 'p', 'some description')
   *   public packages: string[];
   * }
   */
  public static VariadicOption(
    optionName: string,
    alias: string,
    description: string,
  ): ClassFieldDecoratorImpl;
  public static VariadicOption(
    optionNameOrCompleteConfig?: string | VariadicOptionConfiguration,
    aliasOrDescription?: string,
    description?: string,
  ): ClassFieldDecoratorImpl {
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
        description,
      );
    }

    if (optionNameOrCompleteConfig && !aliasOrDescription && !description) {
      return OptionDecorators.VariadicOptionImpl(
        optionNameOrCompleteConfig,
        null,
        null,
      );
    }

    if (!optionNameOrCompleteConfig && !aliasOrDescription && !description) {
      return OptionDecorators.VariadicOptionImpl(null, null, null);
    }

    const asAlias = aliasOrDescription!.length <= 2;

    return OptionDecorators.VariadicOptionImpl(
      optionNameOrCompleteConfig ?? null,
      asAlias ? aliasOrDescription : null,
      asAlias ? null : aliasOrDescription,
    );
  }

  private static VariadicOptionImpl(
    optionName?: Nullable<string>,
    alias?: Nullable<string>,
    description?: Nullable<string>,
  ): ClassFieldDecoratorImpl {
    return (_, context) => (initValue) => {
      const applyOptionName = optionName ?? String(context.name);

      debug("Variadic Option %s registered", applyOptionName);

      GlobalRegistry.VariadicOptions.add(applyOptionName);

      alias ? GlobalRegistry.VariadicOptions.add(alias) : void 0;

      return <OptionInitializerPlaceHolder>{
        type: InstanceFieldDecorationTypes.VariadicOption,
        optionName: applyOptionName,
        optionAlias: alias,
        description,
        initValue,
      };
    };
  }

  /**
   * Register options value(complete parsed args merged with default values) inject
   *
   * `@Options` accept no args as it represents all options received
   * @example
   * class RunCommand {
   *  \@Options()
   *   public completeOptions: unknown;
   * }
   * @returns
   */
  public static Options(): ClassFieldDecoratorImpl {
    return (_, context) => (initValue) => {
      debug("Options registered in %s field", context.name);
      return <OptionInitializerPlaceHolder>{
        type: InstanceFieldDecorationTypes.Options,
        initValue,
      };
    };
  }
}

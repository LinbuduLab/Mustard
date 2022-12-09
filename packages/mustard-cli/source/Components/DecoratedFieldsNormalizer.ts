import { MustardRegistry } from "./Registry";
import { MustardUtils } from "./Utils";
import { MustardUtilsProvider } from "./MustardUtilsProvider";
import { UnknownOptionsError } from "../Errors/UnknownOptionsError";
import { ValidationError } from "../Errors/ValidationError";

import type { InstanceFieldDecorationTypesUnion } from "./Constants";
import type {
  ExecutionContext,
  InjectInitializerPlaceHolder,
} from "../Typings/Context.struct";
import type { OptionInitializerPlaceHolder } from "../Typings/Option.struct";
import type { Dictionary } from "../Typings/Shared.struct";
import type { CommandStruct } from "../Typings/Command.struct";

export class DecoratedClassFieldsNormalizer {
  public static throwOnUnknownOptions(
    instance: CommandStruct,
    parsedArgs: Dictionary
  ) {
    const instanceDeclaredOptions = MustardUtils.getInstanceFields(instance);

    const unknownOptions = Object.keys(parsedArgs).filter(
      (key) => !instanceDeclaredOptions.includes(key)
    );

    if (unknownOptions.length > 0) {
      throw new UnknownOptionsError(unknownOptions);
    }
  }

  public static normalizeDecoratedFields(
    instance: CommandStruct,
    parsedInputs: string[],
    parsedArgs: Dictionary
  ) {
    const completeInstanceFields = <string[]>Reflect.ownKeys(instance);

    completeInstanceFields.forEach((instanceField) => {
      const initializer = Reflect.get(instance, instanceField);

      const { type } = <
          {
            type: InstanceFieldDecorationTypesUnion;
          }
        >initializer ?? {};

      switch (type) {
        case "Context":
          DecoratedClassFieldsNormalizer.normalizeContextField(
            instance,
            instanceField
          );
          break;
        case "Inject":
          DecoratedClassFieldsNormalizer.normalizeInjectField(
            instance,
            instanceField
          );
          break;
        case "Utils":
          DecoratedClassFieldsNormalizer.normalizeUtilField(
            instance,
            instanceField
          );
          break;
        case "Input":
          DecoratedClassFieldsNormalizer.normalizeInputField(
            instance,
            instanceField,
            parsedInputs
          );
          break;
        case "Option":
        case "VariadicOption":
          DecoratedClassFieldsNormalizer.normalizeOption(
            instance,
            instanceField,
            parsedArgs
          );
          break;
        case "Options":
          DecoratedClassFieldsNormalizer.normalizeOptions(
            instance,
            instanceField,
            parsedArgs
          );
          break;
        default:
          // Not Decorated Instance Field
          break;
      }
    });
  }

  public static normalizeInputField(
    instance: CommandStruct,
    instanceField: string,
    inputs: string[] = []
  ) {
    MustardUtils.setInstanceFieldValue(instance, instanceField, inputs);
  }

  public static normalizeInjectField(
    instance: CommandStruct,
    instanceField: string
  ) {
    const injectValue = <InjectInitializerPlaceHolder>(
      MustardUtils.getInstanceFieldValue(instance, instanceField)
    );

    const providerFactory = MustardRegistry.ExternalProviderRegistry.get(
      injectValue.identifier
    );

    const provideValue =
      typeof providerFactory === "function"
        ? providerFactory()
        : providerFactory;

    MustardUtils.setInstanceFieldValue(instance, instanceField, provideValue);
  }

  public static normalizeContextField(
    instance: CommandStruct,
    instanceField: string
  ) {
    MustardUtils.setInstanceFieldValue(instance, instanceField, {
      cwd: process.cwd(),
      argv: process.argv,
      inputArgv: process.argv.slice(2),
      env: process.env,
    } satisfies ExecutionContext);
  }

  public static normalizeUtilField(
    instance: CommandStruct,
    instanceField: string
  ) {
    MustardUtils.setInstanceFieldValue(
      instance,
      instanceField,
      MustardUtilsProvider.produce()
    );
  }

  public static normalizeOption(
    instance: CommandStruct,
    instanceField: string,
    parsedArgs: Dictionary
  ) {
    const initializer = MustardUtils.getInstanceFieldValue(
      instance,
      instanceField
    );

    const {
      optionName: injectKey,
      initValue,
      schema,
      // todo: by XOR types
    } = <Required<OptionInitializerPlaceHolder>>initializer;

    // use value from parsed args
    if (injectKey in parsedArgs) {
      const argValue = parsedArgs[injectKey];

      let validatedValue = null;

      // control parse / safeParse from options
      // hijack zoderror for better error message

      if (schema) {
        validatedValue = schema.safeParse(argValue);

        if (!validatedValue.success) {
          throw new ValidationError(injectKey, argValue, validatedValue.error);
        }
      } else {
        validatedValue = argValue;
      }

      MustardUtils.setInstanceFieldValue(
        instance,
        instanceField,
        validatedValue
      );

      // validate for values from parsed args
    } else {
      // use default value or mark as undefined
      // null should also be converted to undefined
      MustardUtils.setInstanceFieldValue(
        instance,
        instanceField,
        initValue ?? undefined
      );
    }
  }

  public static normalizeOptions(
    instance: CommandStruct,
    instanceField: string,
    parsedArgs: Dictionary
  ) {
    const { _, ...preservedParsedArgs } = parsedArgs;
    MustardUtils.setInstanceFieldValue(
      instance,
      instanceField,
      preservedParsedArgs
    );
  }
}
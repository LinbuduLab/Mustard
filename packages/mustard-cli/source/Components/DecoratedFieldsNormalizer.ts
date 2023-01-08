import { MustardRegistry } from "./Registry";
import { MustardUtils } from "./Utils";
import { MustardUtilsProvider } from "./MustardUtilsProvider";
import groupBy from "lodash.groupby";

import {
  DidYouMeanError,
  UnknownOptionsError,
} from "../Errors/UnknownOptionsError";
import { ValidationError } from "../Errors/ValidationError";

import type {
  Context,
  InjectInitializerPlaceHolder,
} from "../Typings/Context.struct";
import type { OptionInitializerPlaceHolder } from "../Typings/Option.struct";
import type { Dictionary } from "../Typings/Shared.struct";
import type {
  CommandRegistryPayload,
  CommandStruct,
} from "../Typings/Command.struct";
import type {
  BasePlaceholder,
  TaggedDecoratedInstanceFields,
} from "../Typings/Utils.struct";

export class DecoratedClassFieldsNormalizer {
  public static throwOnUnknownOptions(
    instance: CommandStruct,
    parsedArgs: Dictionary,
    useDidYouMean: boolean
  ) {
    const instanceDeclaredOptions = MustardUtils.getInstanceFields(instance);

    const unknownOptions = Object.keys(parsedArgs).filter(
      (key) => !instanceDeclaredOptions.includes(key) && key !== "_"
    );

    if (unknownOptions.length > 0) {
      const firstUnknownOption = unknownOptions[0]!;
      if (useDidYouMean) {
        throw new DidYouMeanError(
          firstUnknownOption,
          MustardUtils.levenshtein(firstUnknownOption, instanceDeclaredOptions)
        );
      }

      throw new UnknownOptionsError(unknownOptions);
    }
  }

  public static normalizeDecoratedFields(
    command: CommandRegistryPayload,
    parsedInputs: string[],
    parsedArgs: Dictionary
  ) {
    const { instance, decoratedInstanceFields = [] } = command;

    decoratedInstanceFields.forEach(({ key: instanceField, value, type }) => {
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
            parsedArgs,
            value
          );
          break;
        case "Options":
          DecoratedClassFieldsNormalizer.normalizeOptions(
            instance,
            instanceField,
            parsedArgs,
            decoratedInstanceFields
          );
          break;
        default:
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
        ? MustardUtils.isConstructable(providerFactory)
          ? new providerFactory()
          : providerFactory()
        : providerFactory;

    MustardUtils.isPromise(provideValue)
      ? provideValue.then((resolvedValue) => {
          MustardUtils.setInstanceFieldValue(
            instance,
            instanceField,
            resolvedValue
          );
        })
      : MustardUtils.setInstanceFieldValue(
          instance,
          instanceField,
          provideValue
        );
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
    } satisfies Context);
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
    parsedArgs: Dictionary,
    value: BasePlaceholder
  ) {
    const {
      optionName: injectKey,
      initValue,
      schema,
      optionAlias: injectSubKey,
    } = <Required<OptionInitializerPlaceHolder>>value;

    // use value from parsed args
    if (injectKey in parsedArgs || injectSubKey in parsedArgs) {
      const argValue = parsedArgs[injectKey] ?? parsedArgs[injectSubKey];

      let validatedValue = null;

      if (schema) {
        const validation = schema.safeParse(argValue);
        if (!validation.success) {
          throw new ValidationError(
            injectKey ?? injectSubKey,
            argValue,
            validation.error
          );
        }
        validatedValue = validation.data;
      } else {
        validatedValue = argValue;
      }

      MustardUtils.setInstanceFieldValue(
        instance,
        instanceField,
        validatedValue
      );
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
    parsedArgs: Dictionary,
    commonFields: TaggedDecoratedInstanceFields[]
  ) {
    const { _, ...preservedParsedArgs } = parsedArgs;

    const commonOptionFieldsWithInitialValue = commonFields.reduce<Dictionary>(
      (acc, curr) => {
        // collect initValue of @Option and @VariadicOption fields
        return curr.type === "Option" || curr.type === "VariadicOption"
          ? // filter only the fields with valid initial values
            // null was regarded as a valid initial value here as it was set by the user
            typeof curr.value.initValue !== "undefined"
            ? {
                ...acc,
                [curr.value.optionName as string]: curr.value.initValue,
              }
            : acc
          : acc;
      },
      {}
    );

    const mergedOptionsFieldValue: Dictionary = {};

    for (const optionField in commonOptionFieldsWithInitialValue) {
      mergedOptionsFieldValue[optionField] =
        preservedParsedArgs[optionField] ??
        commonOptionFieldsWithInitialValue[optionField];
    }

    MustardUtils.setInstanceFieldValue(
      instance,
      instanceField,
      mergedOptionsFieldValue
    );
  }
}

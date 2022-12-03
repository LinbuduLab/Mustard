import { MustardRegistry } from "./Registry";
import { MustardUtils } from "./Utils";
import { MustardUtilsProvider } from "./MustardUtilsProvider";

import type { InstanceFieldDecorationTypesUnion } from "./Constants";
import type { InjectInitializerPlaceHolder } from "../Typings/Context.struct";
import type { OptionInitializerPlaceHolder } from "../Typings/Option.struct";
import type { Dictionary } from "../Typings/Shared.struct";
import type { CommandStruct } from "../Typings/Command.struct";

export class DecoratedClassFieldsNormalizer {
  public static throwOnUnknownOptions(
    target: CommandStruct,
    parsedArgs: Dictionary
  ) {
    const targetDeclaredOptions = MustardUtils.getInstanceFields(target);

    const unknownOptions = Object.keys(parsedArgs).filter(
      (key) => !targetDeclaredOptions.includes(key)
    );

    if (unknownOptions.length > 0) {
      // throw new Error(
      //   `Unknown options: ${unknownOptions.join(", ")}. See --help for usage.`
      // );
    }
  }

  public static normalizeDecoratedFields(
    target: CommandStruct,
    inputs: string[],
    parsedArgs: Dictionary
  ) {
    const fields = <string[]>Reflect.ownKeys(target);

    fields.forEach((fieldKey) => {
      const initializer = Reflect.get(target, fieldKey);

      const { type } = <
        {
          type: InstanceFieldDecorationTypesUnion;
        }
      >initializer;

      switch (type) {
        case "Context":
          DecoratedClassFieldsNormalizer.normalizeContextField(
            target,
            fieldKey
          );
          break;
        case "Utils":
          DecoratedClassFieldsNormalizer.normalizeUtilField(target, fieldKey);
          break;
        case "Input":
          DecoratedClassFieldsNormalizer.normalizeInputField(
            target,
            fieldKey,
            inputs
          );
          break;
        case "Option":
          DecoratedClassFieldsNormalizer.normalizeOption(
            target,
            fieldKey,
            parsedArgs
          );
          break;
        case "Options":
          DecoratedClassFieldsNormalizer.normalizeOptions(
            target,
            fieldKey,
            parsedArgs
          );
          break;
        default:
          // Not Decorated
          break;
      }
    });
  }

  public static normalizeInputField(
    target: CommandStruct,
    prop: string,
    inputs: string[] = []
  ) {
    MustardUtils.setInstanceFieldValue(target, prop, inputs);
  }

  public static normalizeInjectField(target: CommandStruct, prop: string) {
    const injectValue = <InjectInitializerPlaceHolder>(
      MustardUtils.getInstanceFieldValue(target, prop)
    );

    MustardUtils.setInstanceFieldValue(
      target,
      prop,
      MustardRegistry.ExternalProviderRegistry.get(injectValue.identifier)
    );
  }

  public static normalizeContextField(target: CommandStruct, prop: string) {
    MustardUtils.setInstanceFieldValue(target, prop, {});
  }

  public static normalizeUtilField(target: CommandStruct, prop: string) {
    MustardUtils.setInstanceFieldValue(
      target,
      prop,
      MustardUtilsProvider.produce()
    );
  }

  public static normalizeOption(
    target: CommandStruct,
    prop: string,
    parsedArgs: Dictionary
  ) {
    const initializer = Reflect.get(target, prop);

    const {
      optionName: injectKey,
      initValue,
      schema,
      // todo: by XOR types
    } = <Required<OptionInitializerPlaceHolder>>initializer;

    // use value from parsed args
    if (injectKey in parsedArgs) {
      const argValue = parsedArgs[injectKey];

      // control parse / safeParse from options
      // hijack zoderror for better error message
      const validatedValue = schema ? schema.safeParse(argValue) : argValue;

      MustardUtils.setInstanceFieldValue(target, prop, validatedValue);

      // validate for values from parsed args
    } else {
      // use default value or mark as undefined
      // null should also be converted to undefined
      MustardUtils.setInstanceFieldValue(target, prop, initValue ?? undefined);
    }
  }

  public static normalizeOptions(
    target: CommandStruct,
    prop: string,
    parsedArgs: Dictionary
  ) {
    MustardUtils.setInstanceFieldValue(target, prop, parsedArgs);
  }
}

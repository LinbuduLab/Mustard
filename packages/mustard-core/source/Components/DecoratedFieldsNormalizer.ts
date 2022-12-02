import { InjectInitializerPlaceHolder } from "source/Typings/Context.struct";
import { OptionInitializerPlaceHolder } from "source/Typings/Option.struct";
import { Dictionary } from "source/Typings/Shared.struct";
import { MustardUtils } from "../Core/Utils";
import { MustardUtilsProvider } from "./MustardUtilsProvider";
import { MustardRegistry } from "../Core/Registry";

export class DecoratedClassFieldsNormalizer {
  public static checkUnknownOptions(target, parsedArgs: Dictionary) {
    const targetDeclaredOptions = MustardUtils.getInstanceFields(target);

    const unknownOptions = Object.keys(parsedArgs).filter(
      (key) => !targetDeclaredOptions.includes(key)
    );

    if (unknownOptions.length > 0) {
      // todo: UnknownOptionError
      // throw new Error(
      //   `Unknown options: ${unknownOptions.join(", ")}. See --help for usage.`
      // );
    }
  }

  public static groupOptions() {}

  public static normalizeDecoratedFields(target, inputs, parsedArgs) {
    const fields = Reflect.ownKeys(target) as string[];

    fields.forEach((fieldKey) => {
      const initializer = Reflect.get(target, fieldKey);

      const { type } = initializer;

      switch (type) {
        case "Context":
          DecoratedClassFieldsNormalizer.normalizeContextField(
            target,
            fieldKey
          );
          break;
        case "Util":
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

  public static normalizeInputField(target, prop, inputs = []) {
    MustardUtils.setInstanceFieldValue(target, prop, inputs);
  }

  public static normalizeInjectField(target, prop) {
    const injectValue: InjectInitializerPlaceHolder =
      MustardUtils.getInstanceFieldValue(target, prop);
    MustardUtils.setInstanceFieldValue(
      target,
      prop,
      MustardRegistry.ExternalProviderRegistry.get(injectValue.identifier)
    );
  }

  public static normalizeContextField(target, prop) {
    MustardUtils.setInstanceFieldValue(target, prop, {});
  }

  public static normalizeUtilField(target, prop) {
    MustardUtils.setInstanceFieldValue(
      target,
      prop,
      MustardUtilsProvider.produce()
    );
  }

  public static normalizeOption(target, prop, parsedArgs: Dictionary) {
    const initializer = Reflect.get(target, prop);

    const {
      optionName: injectKey,
      initValue,
      schema,
      // todo: by XOR types
    } = initializer as OptionInitializerPlaceHolder;

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

  public static normalizeOptions(target, prop, parsedArgs: Dictionary) {
    MustardUtils.setInstanceFieldValue(target, prop, parsedArgs);
  }
}

import { OptionInitializerPlaceHolder } from "source/Types/Option.struct";
import { Dictionary } from "source/Types/Shared.struct";
import { MustardUtils } from "../Core/Utils";

export class DecoratedClassFieldsNormalizer {
  public static checkUnknownOptions(target, parsedArgs: Dictionary) {
    const handlerDeclaredOptions = MustardUtils.getInstanceFields(target);

    const unknownOptions = Object.keys(parsedArgs).filter(
      (key) => !handlerDeclaredOptions.includes(key)
    );

    if (unknownOptions.length > 0) {
      // todo: UnknownOptionError
      // throw new Error(
      //   `Unknown options: ${unknownOptions.join(", ")}. See --help for usage.`
      // );
    }
  }

  public static groupOptions() {}

  public static normalizeInputField() {}

  public static normalizeContextField() {}

  public static normalizeVariadicOptions() {}

  public static normalizeOptions(initializer: OptionInitializerPlaceHolder) {}
}

import type {
  ContextInitializerPlaceHolder,
  UtilsInitializerPlaceHolder,
} from "../Typings/Context.struct";
import type { AnyClassFieldDecoratorReturnType } from "../Typings/Temp";

export class BuiltInDecorators {
  /**
   * Inject utils
   */
  public static Utils(): AnyClassFieldDecoratorReturnType {
    return (_, context) => () =>
      <UtilsInitializerPlaceHolder>{
        type: "Utils",
      };
  }

  /**
   * Inject context info
   */
  public static Ctx(): AnyClassFieldDecoratorReturnType {
    return (_, context) => () =>
      <ContextInitializerPlaceHolder>{
        type: "Context",
      };
  }
}

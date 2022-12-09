import type {
  ContextInitializerPlaceHolder,
  UtilsInitializerPlaceHolder,
} from "../Typings/Context.struct";
import type { AnyClassFieldDecoratorReturnType } from "../Typings/Temp";

export class BuiltInDecorators {
  public static Utils(): AnyClassFieldDecoratorReturnType {
    return (_, context) =>
      () =>
        <UtilsInitializerPlaceHolder>{
          type: "Utils",
        };
  }

  public static Context(): AnyClassFieldDecoratorReturnType {
    return (_, context) => () =>
      <ContextInitializerPlaceHolder>{
        type: "Context",
      };
  }
}

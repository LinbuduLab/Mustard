import type {
  ContextInitializerPlaceHolder,
  UtilsInitializerPlaceHolder,
} from "../Typings/Context.struct";
import type { AnyClassFieldDecoratorReturnType } from "../Typings/Temp";

export class BuiltInDecorators {
  public static Utils(): AnyClassFieldDecoratorReturnType {
    return (_, { name }) =>
      (initValue) =>
        <UtilsInitializerPlaceHolder>{
          type: "Utils",
        };
  }

  public static Context(): AnyClassFieldDecoratorReturnType {
    return (_, { name }) =>
      (initValue) =>
        <ContextInitializerPlaceHolder>{
          type: "Context",
          // description,
        };
  }
}

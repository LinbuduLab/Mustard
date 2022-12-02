import {
  ContextInitializerPlaceHolder,
  UtilsInitializerPlaceHolder,
} from "source/Typings/Context.struct";
import { AnyClassFieldDecoratorReturnType } from "source/Typings/Temp";

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

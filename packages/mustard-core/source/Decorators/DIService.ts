import { InjectInitializerPlaceHolder } from "source/Typings/Context.struct";
import {
  AnyClassDecoratorReturnType,
  AnyClassFieldDecoratorReturnType,
} from "source/Typings/Temp";

export class DIServiceDecorators {
  public static Inject(identifier: string): AnyClassFieldDecoratorReturnType {
    return () => () =>
      <InjectInitializerPlaceHolder>{
        type: "Inject",
        identifier,
      };
  }

  public static Service(identifier: string): AnyClassDecoratorReturnType {
    return () => () => {};
  }
}

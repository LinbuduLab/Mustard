import type { InjectInitializerPlaceHolder } from "../Typings/Context.struct";
import type {
  AnyClassDecoratorReturnType,
  AnyClassFieldDecoratorReturnType,
} from "../Typings/Temp";

export class DIServiceDecorators {
  public static Inject(identifier: string): AnyClassFieldDecoratorReturnType {
    return (_, context) => () =>
      <InjectInitializerPlaceHolder>{
        type: "Inject",
        identifier,
      };
  }

  public static Service(identifier: string): AnyClassDecoratorReturnType {
    return () => () => {};
  }
}

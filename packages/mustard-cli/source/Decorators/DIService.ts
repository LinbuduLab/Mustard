import { MustardRegistry } from "../Components/Registry";
import type { InjectInitializerPlaceHolder } from "../Typings/Context.struct";
import type {
  AnyClassDecoratorReturnType,
  AnyClassFieldDecoratorReturnType,
} from "../Typings/Temp";

export class DIServiceDecorators {
  public static Inject(identifier?: string): AnyClassFieldDecoratorReturnType {
    return (_, context) => () =>
      <InjectInitializerPlaceHolder>{
        type: "Inject",
        identifier: identifier ?? context.name,
      };
  }

  public static Provide(identifier?: string): AnyClassDecoratorReturnType {
    return (target, context) => () => {
      MustardRegistry.ExternalProviderRegistry.set(
        identifier ?? context.name,
        target
      );
    };
  }
}

import { MustardRegistry } from "../Core/Registry";

import type { InjectInitializerPlaceHolder } from "../Typings/Context.struct";
import type {
  ClassDecoratorImpl,
  ClassFieldDecoratorImpl,
} from "../Typings/Decorator.struct";

/**
 * DI related decorators
 */
export class DIServiceDecorators {
  public static Inject(identifier?: string): ClassFieldDecoratorImpl {
    return (_, context) => () =>
      <InjectInitializerPlaceHolder>{
        type: "Inject",
        identifier: identifier ?? context.name,
      };
  }

  public static Provide(identifier?: string): ClassDecoratorImpl {
    return (target, context) => () => {
      MustardRegistry.ExternalProviderRegistry.set(
        identifier ?? context.name,

        target
      );
    };
  }
}

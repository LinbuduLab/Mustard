import { CommandRegistry } from "../Core/CommandRegistry.js";

import type { InjectInitializerPlaceHolder } from "../Typings/Context.struct.js";
import type {
  ClassDecoratorImpl,
  ClassFieldDecoratorImpl,
} from "../Typings/Decorator.struct.js";

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
      CommandRegistry.ExternalProviderRegistry.set(
        identifier ?? context.name,

        target,
      );
    };
  }
}

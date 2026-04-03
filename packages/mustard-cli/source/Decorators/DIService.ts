import { CommandRegistry } from "../Core/CommandRegistry.js";
import { ProviderRegistry } from "../Core/ProviderRegistry.js";

import type { InjectInitializerPlaceHolder } from "../Typings/Context.struct.js";
import type {
  ClassDecoratorImpl,
  ClassFieldDecoratorImpl,
} from "../Typings/Decorator.struct.js";
import { InstanceFieldDecorationTypes } from "../Utils/Constants.js";

/**
 * DI related decorators
 */
export class DIServiceDecorators {
  public static Inject(identifier?: string): ClassFieldDecoratorImpl {
    return (_, context) => () =>
      <InjectInitializerPlaceHolder>{
        type: InstanceFieldDecorationTypes.Inject,
        identifier: identifier ?? context.name,
      };
  }

  public static Provide(identifier?: string): ClassDecoratorImpl {
    return (target, context) => () => {
      ProviderRegistry.ExternalProviderRegistry.set(
        identifier ?? context.name,

        target,
      );
    };
  }
}

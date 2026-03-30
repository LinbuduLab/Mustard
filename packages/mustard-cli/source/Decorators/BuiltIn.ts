import type {
  ContextInitializerPlaceHolder,
  UtilsInitializerPlaceHolder,
} from "../Typings/Context.struct.js";
import type { ClassFieldDecoratorImpl } from "../Typings/Decorator.struct.js";
import { InstanceFieldDecorationTypes } from "../Utils/Constants.js";

/**
 * Built-in providers related decorators
 */
export class BuiltInDecorators {
  /**
   * Inject utils
   * @example
   * class RunCommand {
   *  \@Utils()
   *   public utils: MustardInternalUtils;
   *
   *   run() {
   *     this.utils.json.read();
   *   };
   * }
   */
  public static Utils(): ClassFieldDecoratorImpl {
    return (_, context) => () =>
      <UtilsInitializerPlaceHolder>{
        type: InstanceFieldDecorationTypes.Utils,
      };
  }

  /**
   * Inject context info
   * @example
   * class RunCommand {
   *  \@Ctx()
   *   public context: Context;
   *
   *   run() {
   *     this.context.stdout.write();
   *   };
   * }
   */
  public static Ctx(): ClassFieldDecoratorImpl {
    return (_, context) => () =>
      <ContextInitializerPlaceHolder>{
        type: InstanceFieldDecorationTypes.Context,
      };
  }
}

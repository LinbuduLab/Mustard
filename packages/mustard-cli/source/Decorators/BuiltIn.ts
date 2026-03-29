import type {
  ContextInitializerPlaceHolder,
  UtilsInitializerPlaceHolder,
} from "../Typings/Context.struct";
import type { ClassFieldDecoratorImpl } from "../Typings/Decorator.struct";

/**
 * Built-in providers related decorators
 */
export class BuiltInDecorators {
  /**
   * Inject utils
   * @example
   * class RunCommand {
   *  \@Utils()
   *   public utils: MustardUtils;
   *
   *   run() {
   *     this.utils.json.read();
   *   };
   * }
   */
  public static Utils(): ClassFieldDecoratorImpl {
    return (_, context) => () =>
      <UtilsInitializerPlaceHolder>{
        type: "Utils",
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
        type: "Context",
      };
  }
}

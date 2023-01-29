import type { AnyClassFieldDecoratorReturnType } from "../Typings/Temp";

export class ControllerDecorators {
  public static Restrict(
    restrictValues: unknown[] | Record<string, unknown>
  ): AnyClassFieldDecoratorReturnType {
    return (target, context) => {
      return () => {};
    };
  }
}

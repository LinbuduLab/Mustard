import type { AnyClassFieldDecoratorReturnType } from "../Typings/Temp";

export class InputDecorator {
  public static Input(): AnyClassFieldDecoratorReturnType {
    return (_, context) => () => ({
      type: "Input",
    });
  }
}

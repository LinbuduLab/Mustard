import { AnyClassFieldDecoratorReturnType } from "source/Typings/Temp";

export class InputDecorator {
  public static Input(): AnyClassFieldDecoratorReturnType {
    return (_, { name }) =>
      (initValue) => ({
        type: "Input",
      });
  }
}

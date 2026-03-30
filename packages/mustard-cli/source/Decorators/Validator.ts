import type { ClassFieldDecoratorImpl } from "../Typings/Decorator.struct.js";

export class ValidatorDecorators {
  public static Required(): ClassFieldDecoratorImpl {
    return (_, { name }) => {
      return (initValue) => {};
    };
  }
}

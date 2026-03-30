import { ClassFieldDecoratorImpl } from "../Typings/Decorator.struct.js";

export class SharedDecorators {
  public static Description(description: string): ClassFieldDecoratorImpl {
    return (_, { name }) => {
      return (initValue) => {
        console.log("03-30 @Description initValue: ", initValue);
        return {
          ...initValue,
          description,
        };
      };
    };
  }
}

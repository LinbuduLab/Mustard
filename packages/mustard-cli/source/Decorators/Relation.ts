import type { ClassFieldDecoratorImpl } from "../Typings/Decorator.struct.js";

export class RelationDecorators {
  public static XOR(): ClassFieldDecoratorImpl {
    return (_, context) => (initValue) => {
      // return {
      //   type: "XOR",
      //   initValue,
      // };
    };
  }
}

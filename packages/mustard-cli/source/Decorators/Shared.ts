import { ClassFieldDecoratorImpl } from "../Typings/Decorator.struct.js";
import { MustardInternalUtils } from "../Utils/Utils.js";

export class SharedDecorators {
  public static Description(description: string): ClassFieldDecoratorImpl {
    return (_value, context) => {
      MustardInternalUtils.createContextInitializer(
        context,
        "description",
        description,
      );

      return (initialValue) => initialValue;
    };
  }
}

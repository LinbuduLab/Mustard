import { ClassFieldDecoratorImpl } from "../Typings/Decorator.struct.js";
import { MustardInternalUtils } from "../Utils/Utils.js";

export class SharedDecorators {
  public static Description(description: string): ClassFieldDecoratorImpl {
    return (_value, context) => {
      context.addInitializer(function () {
        if (!description) return;

        const instanceField = String(context.name);
        const currentValue = Reflect.get(this as object, instanceField);

        if (MustardInternalUtils.isOptionInitializer(currentValue)) {
          Reflect.set(this as object, instanceField, {
            ...currentValue,
            description,
          });
        }
      });

      return (initialValue) => initialValue;
    };
  }
}

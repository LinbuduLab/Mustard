import { MustardInternalUtils } from "../Utils/Utils";

import type { RestrictValueSet } from "../Typings/Controller.struct";
import type { ClassFieldDecoratorImpl } from "../Typings/Decorator.struct";

export class ControllerDecorators {
  /**
   * Restrict user input to a specific set of values
   * @param restrictValues
   *
   * @example
   *
   * const list = ['foo', 'bar', 'baz'] as const;
   *
   * type ListElements = typeof list[number];
   *
   * class RunCommand {
   *
   *  \@Restrict(list)
   *  \@Option()
   *   public value: ListElements = 'foo';
   * }
   *
   * bin run --value=foo // foo
   * bin run --value=bar // bar
   * bin run --value=qux // foo
   */
  public static Restrict(
    restrictValues: RestrictValueSet
  ): ClassFieldDecoratorImpl {
    return (_value, context) => {
      context.addInitializer(function () {
        const instanceField = String(context.name);
        const currentValue = Reflect.get(this as object, instanceField);

        if (MustardInternalUtils.isOptionInitializer(currentValue)) {
          Reflect.set(this as object, instanceField, {
            ...currentValue,
            restrictValues,
          });
        }
      });

      return (initialValue) => initialValue;
    };
  }
}

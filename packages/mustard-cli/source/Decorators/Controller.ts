import { MustardUtils } from "../Components/Utils";

import type { RestrictValueSet } from "../Typings/Controller.struct";
import type { AnyClassFieldDecoratorReturnType } from "../Typings/Temp";

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
  ): AnyClassFieldDecoratorReturnType {
    return (_, _context) => {
      return (initialValue) => {
        if (MustardUtils.isOptionInitializer(initialValue)) {
          return {
            ...initialValue,
            restrictValues,
          };
        }

        return initialValue;
      };
    };
  }
}

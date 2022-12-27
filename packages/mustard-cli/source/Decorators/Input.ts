import type { AnyClassFieldDecoratorReturnType } from "../Typings/Temp";

export class InputDecorator {
  /**
   * Inject inputs after commands
   * @example
   * class RunCommand {
   *  \@Input()
   *   public inputs: string[];
   * }
   */
  public static Input(): AnyClassFieldDecoratorReturnType {
    return (_, context) => () => ({
      type: "Input",
    });
  }
}

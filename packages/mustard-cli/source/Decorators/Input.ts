import type { AnyClassFieldDecoratorReturnType } from "../Typings/Temp";

export class InputDecorator {
  /**
   * TODO:
   *
   * @Input(name, alias, description)
   * @Input({ name, alias, description })
   *
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

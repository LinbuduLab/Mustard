import type { ClassFieldDecoratorImpl } from "../Typings/Decorator.struct";
import type { InputConfiguration } from "../Typings/Option.struct";

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
   *  \@Input('list of projects to include')
   *   public projects: string[];
   * }
   */
  public static Input(description?: string): ClassFieldDecoratorImpl;

  /**
   * Inject inputs after commands
   * @example
   * class RunCommand {
   *  \@Input({ description: 'list of projects to include' } })
   *   public projects: string[];
   * }
   */
  public static Input(
    configuration?: InputConfiguration
  ): ClassFieldDecoratorImpl;
  public static Input(
    config?: string | InputConfiguration
  ): ClassFieldDecoratorImpl {
    const inputDescription =
      typeof config === "string" ? config : config?.description;

    return (_, context) => (initValue) => {
      return {
        type: "Input",
        initValue,
        description: inputDescription,
      };
    };
  }
}

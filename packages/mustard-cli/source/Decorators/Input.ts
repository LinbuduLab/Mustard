import type { AnyClassFieldDecoratorReturnType } from "../Typings/Temp";
import type { InputConfiguration } from "../Typings/Option.struct";

export class InputDecorator {
  /**
   * Inject inputs after commands
   * @example
   * class RunCommand {
   *  \@Input('list of projects to include')
   *   public projects: string[];
   * }
   */
  public static Input(description?: string): AnyClassFieldDecoratorReturnType;

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
  ): AnyClassFieldDecoratorReturnType;
  public static Input(
    config?: string | InputConfiguration
  ): AnyClassFieldDecoratorReturnType {
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

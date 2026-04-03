import { InstanceFieldDecorationTypes } from "../Utils/Constants.js";

import type { ClassFieldDecoratorImpl } from "../Typings/Decorator.struct.js";
import type { InputConfiguration } from "../Typings/Option.struct.js";
import { BaseClassFieldInitialValue } from "../Typings/Utils.struct.js";

// export class InputDecoratorInitialValue extends DecoratorInitialValue<InputInitialValue> {
//   public constructor(value: InputInitialValue) {
//     super(value);
//   }
// }

// class DecoratorInitialValue

export interface InputInitialValue extends BaseClassFieldInitialValue {
  type: InstanceFieldDecorationTypes.Input;
}

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
    configuration?: InputConfiguration,
  ): ClassFieldDecoratorImpl;
  public static Input(
    config?: string | InputConfiguration,
  ): ClassFieldDecoratorImpl {
    const inputDescription =
      typeof config === "string" ? config : config?.description;

    return (_, context) => (initValue) => {
      console.log("03-30 @Input initValue: ", initValue);
      return {
        type: InstanceFieldDecorationTypes.Input,
        description: inputDescription,
        initValue,
      };
    };
  }
}

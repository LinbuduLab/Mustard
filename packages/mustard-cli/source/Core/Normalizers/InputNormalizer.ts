import { MustardInternalUtils } from "../../Utils/Utils.js";

import type { MustardCommand } from "../../Typings/Command.struct.js";
import type { BasePlaceholder } from "../../Typings/Utils.struct.js";

export class InputNormalizer {
  public static normalize(
    instance: MustardCommand,
    instanceField: string,
    inputs: string[] = [],
    value: BasePlaceholder,
  ) {
    console.log("03-30 instance: ", instance);
    console.log("03-30 instanceField: ", instanceField);
    console.log("03-30 inputs: ", inputs);
    console.log("03-30 value: ", value);

    const inputValue =
      inputs.length === 0
        ? (value.initValue ?? [])
        : inputs.length === 1
          ? (inputs[0] ?? value.initValue)
          : inputs;

    MustardInternalUtils.setInstanceFieldValue(
      instance,
      instanceField,
      inputValue,
    );
  }
}

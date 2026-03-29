import { MustardInternalUtils } from "../../Utils/Utils";

import type { MustardCommand } from "../../Typings/Command.struct";
import type { BasePlaceholder } from "../../Typings/Utils.struct";

export class InputNormalizer {
  public static normalize(
    instance: MustardCommand,
    instanceField: string,
    inputs: string[] = [],
    value: BasePlaceholder
  ) {
    const inputValue =
      inputs.length === 0
        ? value.initValue ?? []
        : inputs.length === 1
        ? inputs[0] ?? value.initValue
        : inputs;

    MustardInternalUtils.setInstanceFieldValue(
      instance,
      instanceField,
      inputValue
    );
  }
}

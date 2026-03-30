import { MustardInternalUtils } from "../../Utils/Utils.js";

import type { Dictionary } from "../../Typings/Shared.struct.js";
import type { MustardCommand } from "../../Typings/Command.struct.js";
import type { TaggedDecoratedInstanceFields } from "../../Typings/Utils.struct.js";

export class OptionsNormalizer {
  public static normalize(
    instance: MustardCommand,
    instanceField: string,
    parsedArgs: Dictionary,
    commonFields: TaggedDecoratedInstanceFields[]
  ) {
    const { _, ...preservedParsedArgs } = parsedArgs;

    const commonOptionFieldsWithInitialValue = commonFields.reduce<Dictionary>(
      (acc, curr) => {
        // collect initValue of @Option and @VariadicOption fields
        return curr.type === "Option" || curr.type === "VariadicOption"
          ? // filter only the fields with valid initial values
            // null was regarded as a valid initial value here as it was set by the user
            typeof curr.value.initValue !== "undefined"
            ? {
                ...acc,
                [curr.value.optionName as string]: curr.value.initValue,
              }
            : acc
          : acc;
      },
      {}
    );

    const mergedOptionsFieldValue: Dictionary = {};

    for (const optionField in commonOptionFieldsWithInitialValue) {
      mergedOptionsFieldValue[optionField] =
        preservedParsedArgs[optionField] ??
        commonOptionFieldsWithInitialValue[optionField];
    }

    MustardInternalUtils.setInstanceFieldValue(
      instance,
      instanceField,
      mergedOptionsFieldValue
    );
  }
}

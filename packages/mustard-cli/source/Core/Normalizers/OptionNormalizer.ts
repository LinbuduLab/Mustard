import { MustardInternalUtils } from "../../Utils/Utils.js";
import { ValidationError } from "../../Errors/ZodValidationError.js";

import type { OptionInitializerPlaceHolder } from "../../Typings/Option.struct.js";
import type { Dictionary } from "../../Typings/Shared.struct.js";
import type { MustardCommand } from "../../Typings/Command.struct.js";
import type { BasePlaceholder } from "../../Typings/Utils.struct.js";
import type { CLIInstantiationConfiguration } from "../../Typings/Configuration.struct.js";

export class OptionNormalizer {
  public static normalize(
    instance: MustardCommand,
    instanceField: string,
    parsedArgs: Dictionary,
    value: BasePlaceholder,
    appOptions: CLIInstantiationConfiguration = {},
  ) {
    const {
      optionName: injectKey,
      initValue,
      schema,
      optionAlias: injectSubKey,
      restrictValues,
    } = <Required<OptionInitializerPlaceHolder>>value;

    const isCurrentFieldRequired = schema ? !schema.isOptional() : false;

    // use value from parsed args
    if (injectKey in parsedArgs || injectSubKey in parsedArgs) {
      const argValue = parsedArgs[injectKey] ?? parsedArgs[injectSubKey];

      let validatedValue = null;

      // validator specified
      if (schema) {
        const validation = schema.safeParse(argValue);
        if (validation.success) {
          // validation success
          validatedValue = validation.data;
        } else {
          // validation failed
          if (appOptions.ignoreValidationErrors) {
            // ignore validation errors and keep the original value
            validatedValue = argValue;
          } else {
            // throw validation error
            throw new ValidationError(
              injectKey ?? injectSubKey,
              argValue,
              ValidationError.formatError(
                injectKey ?? injectSubKey,
                validation.error,
              ),
            );
          }
        }
      } else {
        // no validator specified, only set the value
        validatedValue = argValue;
      }

      const restrictedValue = MustardInternalUtils.applyRestrictions(
        validatedValue,
        initValue,
        restrictValues,
      );

      MustardInternalUtils.setInstanceFieldValue(
        instance,
        instanceField,
        restrictedValue,
      );
    } else if (isCurrentFieldRequired) {
      // required field but not specified in parsed args
      if (appOptions.ignoreValidationErrors) {
        void 0;
      } else {
        throw new ValidationError(
          injectKey ?? injectSubKey,
          undefined,
          "Required field not specified in parsed args",
        );
      }
    } else {
      // use default value or mark as undefined
      // null should also be converted to undefined
      MustardInternalUtils.setInstanceFieldValue(
        instance,
        instanceField,
        initValue ?? undefined,
      );
    }
  }
}

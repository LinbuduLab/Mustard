import { InstanceFieldDecorationTypes } from "../Utils/Constants.js";

import { ContextNormalizer } from "./Normalizers/ContextNormalizer.js";
import { InjectNormalizer } from "./Normalizers/InjectNormalizer.js";
import { InputNormalizer } from "./Normalizers/InputNormalizer.js";
import { OptionNormalizer } from "./Normalizers/OptionNormalizer.js";
import { OptionsNormalizer } from "./Normalizers/OptionsNormalizer.js";
import { UtilNormalizer } from "./Normalizers/UtilNormalizer.js";

import type { CommandRegistryPayload } from "../Typings/Command.struct.js";
import type { Dictionary } from "../Typings/Shared.struct.js";
import type { CLIInstantiationConfiguration } from "../Typings/Configuration.struct.js";

export class DecoratedClassFieldsNormalizer {
  private static appOptions: CLIInstantiationConfiguration;

  public static normalizeDecoratedFields(
    command: CommandRegistryPayload,
    parsedInputs: string[],
    parsedArgs: Dictionary,
    appOptions?: CLIInstantiationConfiguration,
  ) {
    DecoratedClassFieldsNormalizer.appOptions = appOptions ?? {};

    const { instance, decoratedInstanceFields = [] } = command;

    decoratedInstanceFields.forEach(({ key: instanceField, value, type }) => {
      switch (type) {
        case InstanceFieldDecorationTypes.Context:
          ContextNormalizer.normalize(instance, instanceField);
          break;
        case InstanceFieldDecorationTypes.Inject:
          InjectNormalizer.normalize(instance, instanceField);
          break;
        case InstanceFieldDecorationTypes.Utils:
          UtilNormalizer.normalize(instance, instanceField);
          break;
        case InstanceFieldDecorationTypes.Input:
          InputNormalizer.normalize(
            instance,
            instanceField,
            parsedInputs,
            value,
          );
          break;
        case InstanceFieldDecorationTypes.Option:
        case InstanceFieldDecorationTypes.VariadicOption:
          OptionNormalizer.normalize(
            instance,
            instanceField,
            parsedArgs,
            value,
          );
          break;
        case InstanceFieldDecorationTypes.Options:
          OptionsNormalizer.normalize(
            instance,
            instanceField,
            parsedArgs,
            decoratedInstanceFields,
          );
          break;
        default:
          break;
      }
    });
  }
}

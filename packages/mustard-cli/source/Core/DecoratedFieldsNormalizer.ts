import { ContextNormalizer } from "./Normalizers/ContextNormalizer";
import { InjectNormalizer } from "./Normalizers/InjectNormalizer";
import { InputNormalizer } from "./Normalizers/InputNormalizer";
import { OptionNormalizer } from "./Normalizers/OptionNormalizer";
import { OptionsNormalizer } from "./Normalizers/OptionsNormalizer";
import { UtilNormalizer } from "./Normalizers/UtilNormalizer";

import { InstanceFieldDecorationTypes } from "../Utils/Constants";

import type { CommandRegistryPayload } from "../Typings/Command.struct";
import type { Dictionary } from "../Typings/Shared.struct";
import type { CLIInstantiationConfiguration } from "../Typings/Configuration.struct";

export class DecoratedClassFieldsNormalizer {
  private static appOptions: CLIInstantiationConfiguration;

  public static normalizeDecoratedFields(
    command: CommandRegistryPayload,
    parsedInputs: string[],
    parsedArgs: Dictionary,
    appOptions?: CLIInstantiationConfiguration
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
            value
          );
          break;
        case InstanceFieldDecorationTypes.Option:
        case InstanceFieldDecorationTypes.VariadicOption:
          OptionNormalizer.normalize(
            instance,
            instanceField,
            parsedArgs,
            value
          );
          break;
        case InstanceFieldDecorationTypes.Options:
          OptionsNormalizer.normalize(
            instance,
            instanceField,
            parsedArgs,
            decoratedInstanceFields
          );
          break;
        default:
          break;
      }
    });
  }
}

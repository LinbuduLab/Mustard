import mri from "mri";
import parse from "yargs-parser";
import { closest } from "fastest-levenshtein";
import { MustardRegistry } from "./Registry";
import { MustardConstanst } from "./Constants";

import type {
  CommandInput,
  CommandRegistryPayload,
  CommandStruct,
} from "../Typings/Command.struct";
import type { TaggedDecoratedInstanceFields } from "../Typings/Utils.struct";
import type { Constructable, Dictionary } from "../Typings/Shared.struct";
import type { OptionInitializerPlaceHolder } from "../Typings/Option.struct";
import { RestrictValueSet } from "../Typings/Controller.struct";

export class MustardUtils {
  public static getInstanceFields(instance: CommandStruct): string[] {
    return <string[]>Reflect.ownKeys(instance);
  }

  public static getInstanceFieldValue<TExpected>(
    instance: CommandStruct,
    field: string
  ): TExpected {
    return <TExpected>Reflect.get(instance, field);
  }

  public static setInstanceFieldValue<T>(
    instance: CommandStruct,
    field: string,
    value: T
  ) {
    Reflect.set(instance, field, value);

    return MustardUtils.getInstanceFieldValue<T>(instance, field);
  }

  public static parseFromProcessArgs(
    withVariadic: string[] = [],

    aliasMap: Dictionary<string> = {}
  ) {
    const useCompleteParse = Boolean(
      withVariadic.length || Object.keys(aliasMap).length
    );

    const parsed = useCompleteParse
      ? parse(process.argv.slice(2), {
          array: Array.from(withVariadic),
          alias: aliasMap,
          configuration: {
            "greedy-arrays": true,
            "strip-aliased": true,
          },
        })
      : mri(process.argv.slice(2));

    return parsed;
  }

  public static filterDecoratedInstanceFields(
    instance: CommandStruct
  ): TaggedDecoratedInstanceFields[] {
    const fields = <string[]>MustardUtils.getInstanceFields(instance);

    return <TaggedDecoratedInstanceFields[]>fields
      .map((field: string) => {
        const value = <TaggedDecoratedInstanceFields>(
          MustardUtils.getInstanceFieldValue(instance, field)
        );

        if (
          MustardConstanst.InstanceFieldDecorationTypes.includes(value.type)
        ) {
          return {
            key: field,
            type: value.type,
            value,
          };
        }

        return null;
      })
      .filter(Boolean);
  }

  public static findHandlerCommandWithInputs(
    inputs: CommandInput | string[],
    commands: string[] = Array.from(MustardRegistry.provide().keys()),
    fallback: CommandRegistryPayload = MustardRegistry.provideRootCommand()
  ): {
    command?: CommandRegistryPayload;
    inputs: string[];
  } {
    const [matcher, ...rest] = inputs;

    // match command from first input
    const matchFromFirstInput = MustardRegistry.provide().get(matcher);

    // if only one input is provided, use it directly
    if (inputs.length === 1) {
      return {
        // lookup common commands first, or return fallback(will be RootCommand at first)
        command: matchFromFirstInput ?? fallback,
        inputs: matchFromFirstInput ? [] : inputs,
      };
    }

    // if more than 1 inputs provided but no matched for first input, return fallback
    if (!matchFromFirstInput) {
      return {
        command: fallback,
        inputs: inputs,
      };
    }

    // map to get ChildCommand registration
    const childCommands = <string[]>(
      matchFromFirstInput?.childCommandList ?? []
    )
      .map((C) => {
        const matched = commands.find((commandIdentifier) => {
          const registered = MustardRegistry.provide(commandIdentifier)?.Class;

          return typeof registered !== "undefined" && registered === C;
        });

        return matched;
      })
      .filter(Boolean);

    // if no child commands registered, use first matched
    if (!childCommands.length) {
      return {
        command: matchFromFirstInput ?? fallback,
        // use rest inputs if matched first input successfully
        inputs: matchFromFirstInput ? rest : inputs,
      };
    }

    // do this recursively till no more inputs
    return MustardUtils.findHandlerCommandWithInputs(
      rest,
      childCommands.concat([...rest]),
      matchFromFirstInput
    );
  }

  public static ensureArray<T>(providers: T | T[]): T[] {
    return Array.isArray(providers) ? providers : [providers];
  }

  public static isPromise(obj: any): obj is Promise<any> {
    return (
      !!obj &&
      (typeof obj === "object" || typeof obj === "function") &&
      typeof obj.then === "function"
    );
  }

  public static isConstructable(input: any): input is Constructable {
    try {
      Reflect.construct(String, [], input);
    } catch (e) {
      return false;
    }
    return true;
  }

  public static uniq() {}

  public static levenshtein(
    unknownOption: string,
    avaliableOptions: string[] = []
  ): string {
    return closest(unknownOption, avaliableOptions);
  }

  public static isOptionInitializer(
    input: any
  ): input is OptionInitializerPlaceHolder {
    return typeof input === "object" && input.type === "Option";
  }

  public static applyRestrictions(
    restrictions: RestrictValueSet,
    inputValue: unknown,
    defaultValue: unknown
  ) {
    const restrictValues = Array.isArray(restrictions)
      ? restrictions
      : Object.values(restrictions ?? {});

    return restrictValues.includes(inputValue) ? inputValue : defaultValue;
  }
}

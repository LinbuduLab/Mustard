import mri from "mri";
import parse from "yargs-parser";
import { closest } from "./Levenshtein.js";
import { CommandRegistry } from "../Core/CommandRegistry.js";
import {
  InstanceFieldDecorationTypes,
  isInstanceFieldDecorationType,
} from "./Constants.js";

import type {
  CommandInput,
  CommandRegistryPayload,
  MustardCommand,
} from "../Typings/Command.struct.js";
import type { TaggedDecoratedInstanceFields } from "../Typings/Utils.struct.js";
import type { Constructable, Dictionary } from "../Typings/Shared.struct.js";
import type { OptionInitializerPlaceHolder } from "../Typings/Option.struct.js";
import type { RestrictValueSet } from "../Typings/Controller.struct.js";
import type { CommandList } from "../Typings/Configuration.struct.js";

export class MustardInternalUtils {
  public static createContextInitializer(
    context: ClassFieldDecoratorContext,
    key: string,
    value: unknown,
  ): void {
    context.addInitializer(function () {
      if (!value) return;

      const instanceField = String(context.name);
      const currentValue = Reflect.get(this as object, instanceField);

      if (MustardInternalUtils.isOptionInitializer(currentValue)) {
        Reflect.set(this as object, instanceField, {
          ...currentValue,
          [key]: value,
        });
      }
    });
  }

  public static getInstanceFields(instance: MustardCommand): string[] {
    return <string[]>Reflect.ownKeys(instance);
  }

  public static getInstanceFieldValue<TExpected>(
    instance: MustardCommand,
    field: string,
  ): TExpected {
    return <TExpected>Reflect.get(instance, field);
  }

  public static setInstanceFieldValue<T>(
    instance: MustardCommand,
    field: string,
    value: T,
  ) {
    Reflect.set(instance, field, value);

    return MustardInternalUtils.getInstanceFieldValue<T>(instance, field);
  }

  public static parseFromProcessArgs(
    withVariadic: string[] = [],

    aliasMap: Dictionary<string> = {},
  ) {
    const useCompleteParse = Boolean(
      withVariadic.length || Object.keys(aliasMap).length,
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
    instance: MustardCommand,
  ): TaggedDecoratedInstanceFields[] {
    const fields = <string[]>MustardInternalUtils.getInstanceFields(instance);

    return <TaggedDecoratedInstanceFields[]>fields
      .map((field: string) => {
        const value = <TaggedDecoratedInstanceFields>(
          MustardInternalUtils.getInstanceFieldValue(instance, field)
        );

        if (isInstanceFieldDecorationType(value.type)) {
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
    commands: string[] = Array.from(CommandRegistry.provide().keys()),
    fallback: CommandRegistryPayload = CommandRegistry.provideRootCommand(),
  ): {
    command?: CommandRegistryPayload;
    inputs: string[];
  } {
    const [matcher, ...rest] = inputs;

    // match command from first input
    const matchFromFirstInput = CommandRegistry.provide().get(matcher);

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
          const registered = CommandRegistry.provide(commandIdentifier)?.Class;

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
    return MustardInternalUtils.findHandlerCommandWithInputs(
      rest,
      childCommands.concat([...rest]),
      matchFromFirstInput,
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

  public static levenshtein(
    unknownOption: string,
    avaliableOptions: string[] = [],
  ): string {
    return closest(unknownOption, avaliableOptions);
  }

  public static isOptionInitializer(
    input: any,
  ): input is OptionInitializerPlaceHolder {
    return (
      (typeof input === "object" &&
        "type" in input &&
        input.type === InstanceFieldDecorationTypes.Option) ||
      input.type === InstanceFieldDecorationTypes.Options ||
      input.type === InstanceFieldDecorationTypes.VariadicOption
    );
  }

  public static applyRestrictions(
    inputValue: unknown,
    defaultValue: unknown,
    restrictions?: RestrictValueSet,
  ) {
    if (!restrictions) return inputValue;

    const restrictValues = Array.isArray(restrictions)
      ? restrictions
      : Object.values(restrictions ?? {});

    return restrictValues.includes(inputValue) ? inputValue : defaultValue;
  }

  public static uniqBy<T>(
    array: readonly T[],
    iteratee: ((item: T) => unknown) | keyof T,
  ): T[] {
    const seen = new Set<unknown>();
    return array.filter((item) => {
      const key =
        typeof iteratee === "function" ? iteratee(item) : item[iteratee];
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  public static groupBy<T>(
    array: readonly T[],
    iteratee: ((item: T) => string | number) | keyof T,
  ): Record<string, T[]> {
    return array.reduce<Record<string, T[]>>((result, item) => {
      const key =
        typeof iteratee === "function"
          ? String(iteratee(item))
          : String(item[iteratee]);
      (result[key] ??= []).push(item);
      return result;
    }, {});
  }

  public static matchFromCommandClass(
    commandClassList: CommandList,
  ): CommandRegistryPayload[] {
    const commandNameList = commandClassList.map((C) => C.name);

    const completeRegistration = CommandRegistry.provide();

    const matched = Array.from(completeRegistration.values()).filter(
      (registration) => {
        return (
          typeof registration !== "undefined" &&
          commandNameList.includes(registration.Class.name)
        );
      },
    );

    return MustardInternalUtils.uniqBy(
      matched,
      (registration) => registration.Class.name,
    );
  }
}

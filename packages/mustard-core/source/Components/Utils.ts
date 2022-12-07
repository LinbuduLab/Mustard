import parse from "yargs-parser";
import mri from "mri";
import { MustardRegistry } from "./Registry";
import { MustardConstanst } from "../Components/Constants";

import type {
  CommandInput,
  CommandRegistryPayload,
  CommandStruct,
} from "../Typings/Command.struct";
import type { TaggedDecoratedInstanceFields } from "../Typings/Utils.struct";
import type { Nullable } from "../Typings/Shared.struct";

export class MustardUtils {
  public static getInstanceFields(target: CommandStruct): string[] {
    return <string[]>Reflect.ownKeys(target);
  }

  public static getInstanceFieldValue<TExpected>(
    target: CommandStruct,
    prop: string
  ): TExpected {
    return <TExpected>Reflect.get(target, prop);
  }

  public static setInstanceFieldValue<T>(
    target: CommandStruct,
    prop: string,
    value: T
  ) {
    Reflect.set(target, prop, value);

    return MustardUtils.getInstanceFieldValue<T>(target, prop);
  }

  public static parseFromProcessArgs(withVariadic: string[] = []) {
    const parsed = withVariadic.length
      ? parse(process.argv.slice(2), {
          array: Array.from(withVariadic),
          alias: {
            dddd: "d",
          },
          configuration: {
            "greedy-arrays": true,
            "strip-aliased": true,
          },
        })
      : mri(process.argv.slice(2));

    return parsed;
  }

  public static filterDecoratedInstanceFields(
    target: CommandStruct
  ): TaggedDecoratedInstanceFields[] {
    const fields = <string[]>MustardUtils.getInstanceFields(target);
    return <TaggedDecoratedInstanceFields[]>fields
      .map((field: string) => {
        const value = <TaggedDecoratedInstanceFields>(
          MustardUtils.getInstanceFieldValue(target, field)
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

    // do this recursively
    return MustardUtils.findHandlerCommandWithInputs(
      rest,
      childCommands.concat([...rest]),
      matchFromFirstInput
    );
  }

  public static uniq() {}
}

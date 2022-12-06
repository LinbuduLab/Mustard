import parse from "yargs-parser";
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
    const parsed = parse(process.argv.slice(2), {
      array: Array.from(withVariadic),
      configuration: {
        "greedy-arrays": true,
      },
    });

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

  public static iterateRegistryToMatchCommand(
    commands: CommandRegistryPayload[],
    matcher: string
  ) {
    return Array.from(MustardRegistry.provide().values())
      .map((c) => c.commandName)
      .includes(matcher);
  }

  // todo: support nested commands better
  public static findHandlerCommandWithInputs(
    inputs: CommandInput | string[],
    commands: CommandRegistryPayload[] = Array.from(
      MustardRegistry.provide().values()
    ),
    fallback: CommandRegistryPayload = MustardRegistry.provideRootCommand()
  ): {
    command: CommandRegistryPayload | undefined;
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

    // 如果有多个 input，但第一个都没匹配到，返回 fallback

    // if more than 1 inputs provided but no matched for first input, return fallback
    if (!matchFromFirstInput) {
      return {
        command: fallback,
        inputs: inputs,
      };
    }

    // map to get ChildCommand registration
    const childCommands = <CommandRegistryPayload[]>(
      (matchFromFirstInput?.childCommandList ?? [])
        .map((C) => commands.find((registered) => registered.Class === C))
        .filter(Boolean)
    );

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
      childCommands,
      matchFromFirstInput
    );
  }

  public static uniq() {}
}

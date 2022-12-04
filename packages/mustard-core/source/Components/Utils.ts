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
    commands: CommandRegistryPayload[],
    inputs: CommandInput | string[],
    fallback: CommandRegistryPayload
  ): {
    command: CommandRegistryPayload | undefined;
    inputs: string[];
  } {
    const [matcher, ...rest] = inputs;

    const matchFromFirstInput = MustardRegistry.provide().get(matcher);

    // 如果只有一个 input，那么就直接返回这个命令
    if (inputs.length === 1) {
      return {
        // 优先查找正常命令，如果没有找到就返回根命令
        // cli-cmd project-a --dry
        // cli-cmd update --dry
        command: matchFromFirstInput ?? fallback,
        inputs: [],
      };
    }

    return {
      // 优先查找正常命令，如果没有找到就返回根命令
      // cli-cmd project-a --dry
      // cli-cmd update --dry
      command: matchFromFirstInput ?? fallback,
      inputs: [],
    };
  }

  public static uniq() {}
}

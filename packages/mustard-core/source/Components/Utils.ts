import parse from "yargs-parser";
import { MustardRegistry } from "./Registry";
import { MustardConstanst } from "../Components/Constants";

import type {
  CommandRegistryPayload,
  CommandStruct,
} from "../Typings/Command.struct";
import type { TaggedDecoratedInstanceFields } from "../Typings/Utils.struct";

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

  public static findHandlerCommandWithInputs(input: string[]): {
    command: CommandRegistryPayload;
    inputs: string[];
  } {
    // input 长度必定>=1
    // console.log("11-29 input: ", input);
    // console.log(MustardRegistry.provide());

    // 处理 alias、child

    const [matcher, ...rest] = input;
    // console.log("11-29 rest: ", rest);

    // ['run', 'sync', 'r', 'check']

    if (input.length === 1) {
      // alias 好像不用特别处理了
      return {
        command: MustardRegistry.provide(matcher as string),
        inputs: [],
      };
    } else {
      // 至少存在一个需要额外处理的输入
      // 处理子命令

      // FIXME: recursive
      const command = MustardRegistry.provide(matcher as string);

      if (command.childCommandList.length === 0) {
        return {
          command,
          inputs: rest,
        };
      }

      const childCommand = command.childCommandList.find((child) => {
        return (
          child.commandName === rest[0] ||
          child.alias === rest[0] ||
          child.alias === rest[1]
        );
      });

      return {
        command: childCommand,
        inputs: rest.slice(1),
      };
    }
  }

  public static uniq() {}
}

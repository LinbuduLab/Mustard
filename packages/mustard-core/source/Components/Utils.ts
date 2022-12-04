import parse from "yargs-parser";
import { MustardRegistry } from "./Registry";
import { MustardConstanst } from "../Components/Constants";

import type {
  CommandInput,
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

  public static iterateRegistryToMatchCommand(
    commands: CommandRegistryPayload[],
    matcher: string
  ) {
    return Array.from(MustardRegistry.provide().values())
      .map((c) => c.commandName)
      .includes(matcher);
  }

  public static findHandlerCommandWithInputs(
    commands: CommandRegistryPayload[],
    inputs: CommandInput | string[],
    fallback: CommandRegistryPayload
  ): {
    command: CommandRegistryPayload | undefined;
    inputs: string[];
  } {
    // 完全没有 input 的情况已经被处理了，这里要处理的主要是这些情况
    // input length 为 1 时
    // 如果没有找到对应的 command，使用 rootCommand
    // input length > 1 时
    // 不断递归找到最后一个拥有注册的命令
    // 返回这个命令，并将 剩余的 input 传入

    // 只管返回，如果实际没有注册那是上一级的事情

    // input 长度必定>=1
    // console.log("11-29 input: ", input);
    // console.log(MustardRegistry.provide());

    // 处理 alias、child

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

    // 否则，进行递归查找
    // const res = this.findHandlerCommandWithInputs(
    //   [],
    //   // matchFromFirstInput?.childCommandList ?? [],
    //   rest,
    //   matchFromFirstInput
    // );

    if (inputs.length === 1) {
      return {
        // the CommandLine will handle case of no root command
        command: MustardRegistry.provide(matcher),
        inputs: [],
      };
    } else {
      // 至少存在一个需要额外处理的输入
      // 处理子命令

      // FIXME: recursive
      const command = MustardRegistry.provide(matcher);

      // if (command.childCommandList.length === 0) {
      //   return {
      //     command,
      //     inputs: rest,
      //   };
      // }

      // const childCommand = command.childCommandList.find((child) => {
      //   return (
      //     child.commandName === rest[0] ||
      //     child.alias === rest[0] ||
      //     child.alias === rest[1]
      //   );
      // });

      // return {
      //   command: childCommand,
      //   inputs: rest.slice(1),
      // };
    }
  }

  public static uniq() {}
}

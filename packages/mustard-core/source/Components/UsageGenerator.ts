import { MustardRegistry } from "../Components/Registry";

import type { CommandRegistryPayload } from "../Typings/Command.struct";

interface SharedInfo {
  name: string;
  alias: string;
  description: string;
}

interface ParsedCommandUsage extends SharedInfo {
  options: ParsedOptionInfo[];
  variadicOptions: ParsedOptionInfo[];
}

interface ParsedOptionInfo extends SharedInfo {
  defaultValue: unknown;
}

export class UsageInfoGenerator {
  // 收集
  public static collectCommandUsage(registration: CommandRegistryPayload) {
    // 如何在这一步收集 options 的描述？
    // 如果每个命令实例化一个肯定就可以了嗷
    //     const rootUsage = [];
    //     const commandNames = new Set();
    //     const commonUsages = [];
    //     const rootCommand = MustardRegistry.provideRootCommand();
    //     if (rootCommand) {
    //       const RootCommand = rootCommand.Class;
    //       const instance = new RootCommand();
    //       const handlerOptions = Reflect.ownKeys(instance);
    //       handlerOptions.forEach((optionKey) => {
    //         const value = Reflect.get(instance, optionKey);
    //         const { optionName: injectKey, description } = value;
    //       });
    //       // const usage = RootCommand.usage?.();
    //       // rootUsage.push({
    //       //   commandName: "root",
    //       //   usage,
    //       // });
    //     }
    //     MustardRegistry.CommandRegistry.forEach((Command) => {
    //       if (commandNames.has(Command)) return;
    //       const collected = {
    //         commandName: Command.commandName,
    //         // usage: Command.Class.usage?.(),
    //         instance: new Command.Class(),
    //       };
    //       commonUsages.push(collected);
    //       commandNames.add(Command.commandName);
    //     });
    //     // dedupe
    //     const dedupedCommonUsages = commonUsages.reduce((prev, cur) => {
    //       if (prev.find((item) => item.commandName === cur.commandName))
    //         return prev;
    //       return [...prev, cur];
    //     }, []);
    //     dedupedCommonUsages.forEach((item) => {
    //       console.log(`[${item.commandName}]
    // usage: ${item.usage}
    // `);
    //       const options = Reflect.ownKeys(item.instance);
    //       options.forEach((optionKey) => {
    //         const value = Reflect.get(item.instance, optionKey);
    //         const { optionName: injectKey, description } = value;
    //       });
    //     });
    //     rootUsage.forEach((item) => {
    //       console.log(`[${item.commandName}] ${item.usage}`);
    //     });
  }

  public static formatCommandUsage(collect: ParsedCommandUsage): string {
    return `
Command: ${collect.name}, Alias: ${collect.alias}
${collect.description}

Options:
${collect.options.map((o) => {
  return `
--${o.name}, -${o.alias}
`;
})}
    `;
  }
}

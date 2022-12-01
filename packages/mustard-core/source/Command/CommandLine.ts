import parse, { Arguments } from "yargs-parser";

import { ICLIConfiguration } from "../Types/Configuration.struct";
import { ClassStruct, Dictionary } from "../Types/Shared.struct";
import { MustardRegistry } from "../Core/Registry";
import { MustardConstanst } from "../Components/Constants";
import { UsageInfoGenerator } from "source/Components/UsageGenerator";
import { DecoratedClassFieldsNormalizer } from "../Components/DecoratedFieldsNormalizer";
import { MustardUtils } from "source/Core/Utils";

export class CLI {
  constructor(
    private readonly identifier: string,
    Commands: ClassStruct[],
    private options?: ICLIConfiguration
  ) {
    this.initialize(Commands);
    // debug 模式
    console.log(`CLI for ${identifier} initialized`);
  }

  public configure(overrides: Partial<ICLIConfiguration>) {
    Object.assign(this.options ?? {}, overrides ?? {});
  }

  public registerCommand(Commands: ClassStruct[]) {
    this.internalRegisterCommand(Commands);
  }

  private internalRegisterCommand(Commands: ClassStruct[]) {
    const CommandToLoad = Commands.map((Command) =>
      MustardRegistry.provide(Command.name)
    );

    // 然后将这些命令注册到命令注册表中
    CommandToLoad.forEach((Command) => {
      MustardRegistry.register(
        Command.root
          ? MustardConstanst.RootCommandRegistryKey
          : Command.commandName,
        Command
      );

      Command.alias && MustardRegistry.register(Command.alias, Command);

      if (Command.childCommandList.length > 0) {
        // 如果希望将子命令的注册名更改为 run:update:sync 这种形式，那感觉最好把 alias 也统一
        this.internalRegisterCommand(Command.childCommandList);
      }
    });
  }

  private initialize(Commands: ClassStruct[]) {
    // 拿到注册的所有命令
    Commands.forEach((Command) => {
      console.log(Command.name);
    });

    // 注册命令
    this.internalRegisterCommand(Commands);
  }

  private injectCommandOptions(handler: any, inputs: string[]) {
    DecoratedClassFieldsNormalizer.normalizeDecoratedFields(
      handler,
      inputs,
      this.parsedArgs
    );
  }

  private executeCommand(command: any, inputs: string[]) {
    const handler = command.instance;

    !this?.options?.allowUnknownOptions &&
      DecoratedClassFieldsNormalizer.checkUnknownOptions(
        handler,
        this.parsedArgs
      );

    this.injectCommandOptions(handler, inputs);

    // 执行命令
    handler.run();
  }

  private getRealHandleCommand(input: (string | number)[]) {
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

    // run / r / run sync / r sync / r s

    // 输出
    // 实际负责的命令，传递给命令的 Input

    // 这里还是要处理下是否存在 sub-command 的情况
    // 如果 command.length === 1
    // 如果当前 command 没有 handler，则打印帮助信息
    // 如果当前 command 有 handler，则执行 handler
    // 如果 command.length > 1
    // 尝试查找是否存在 sub-command
    // 如果存在，则递归向下查找
    // 否则，存为 Input
    // 不太对，还需要处理 Root Command 的 Input 的情况...
    // const [currentCommandNameMatch, ...inputs] = command;

    // const CommandInfo = MustardRegistry.provide(currentCommandNameMatch);

    // if (!CommandInfo) {
    //   return null;
    // }

    // const fallback = { Command: CommandInfo.class, inputs };

    // // 如果存在子命令且仍然存在可供匹配的项，才继续向下
    // if (CommandInfo?.childCommandList?.length && command.length >= 1) {
    //   return this.getRealHandleCommand(command.slice(1)) ?? fallback;
    // }

    // return fallback;
  }

  private dispatchCommand() {
    const { _: input } = this.parsedArgs;

    const { command, inputs: commandInput } = this.getRealHandleCommand(input);

    this.executeCommand(command, commandInput as string[]);
  }

  private tryExecuteRootCommandOrPrintUsage() {
    // 如果指定了 RootCommand，则调用
    // 否则检查是否启用了 enableHelp
    // 如果都没有，NoRootHandlerError
    const root = MustardRegistry.provideRootCommand();

    if (root) {
      this.executeCommand(root, []);
    } else if (this.options.enableUsage) {
      UsageInfoGenerator.collectCommandUsage();
    } else {
      // throws
    }
  }

  private rawArgs = process.argv.slice(2);

  private parsedArgs: Arguments;

  private completeParse() {
    const CommandMap = MustardRegistry.provide();

    CommandMap.forEach((Command, key) => {
      const instance = new Command.class();

      const decoratedInstanceFields =
        MustardUtils.filterDecoratedInstanceFields(instance);

      decoratedInstanceFields
        .filter((v) => v.type === "VariadicOption")
        .forEach((v) => {
          MustardRegistry.VariadicOptions.add(v.value.optionName);
        });

      MustardRegistry.upsert(key, { instance });
    });

    const parsed = parse(this.rawArgs, {
      array: Array.from(MustardRegistry.VariadicOptions),
      configuration: {
        "greedy-arrays": true,
      },
    });

    this.parsedArgs = parsed;
  }

  // 调用此方法后，再修改配置和添加命令将不会生效
  public start() {
    this.completeParse();

    const { _ } = this.parsedArgs;

    if (_.length === 0) {
      this.tryExecuteRootCommandOrPrintUsage();
      return;
    }

    this.dispatchCommand();
  }

  public registerProviders(provider: {
    identifier: string;
    value: unknown | ClassStruct;
  }) {
    MustardRegistry.ExternalProviderRegistry.set(
      provider.identifier,
      provider.value
    );
  }
}

import parse, { Arguments } from "yargs-parser";

import { DecoratorImpl } from "./DecoratorImpl";
import { ICLIConfiguration } from "./types/Configuration.struct";
import {
  ContextInitializerPlaceHolder,
  InputInitializerPlaceHolder,
} from "./types/Context.struct";
import { OptionInitializerPlaceHolder } from "./types/Option.struct";
import { ClassStruct, Dictionary } from "./types/Shared.struct";

export class CLI {
  public commandRegistry = new Map<string, any>();

  // only one key!
  public rootCommandRegistry = new Map<string, any>();

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
      DecoratorImpl.commandRegistry.get(Command.name)
    );

    // 然后将这些命令注册到命令注册表中
    CommandToLoad.forEach((Command) => {
      Command.root
        ? this.rootCommandRegistry.set("root", Command)
        : this.commandRegistry.set(Command.commandName, Command);

      Command.alias && this.commandRegistry.set(Command.alias, Command);

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

  private collectCommandUsage() {
    // 如何在这一步收集 options 的描述？
    // 如果每个命令实例化一个肯定就可以了嗷
    const rootUsage = [];
    const commandNames = new Set();
    const commonUsages = [];

    if (this.rootCommandRegistry.size > 0) {
      const RootCommand = this.rootCommandRegistry.get("root").class;

      const instance = new RootCommand();

      const handlerOptions = Reflect.ownKeys(instance);

      handlerOptions.forEach((optionKey) => {
        const value = Reflect.get(instance, optionKey);

        const { optionName: injectKey, description } = value;
      });

      const usage = RootCommand.usage?.();
      rootUsage.push({
        commandName: "root",
        usage,
      });
    }

    this.commandRegistry.forEach((Command) => {
      if (commandNames.has(Command)) return;

      const collected = {
        commandName: Command.commandName,
        usage: Command.class.usage?.(),
        instance: new Command.class(),
      };

      commonUsages.push(collected);

      commandNames.add(Command.commandName);
    });

    // dedupe
    const dedupedCommonUsages = commonUsages.reduce((prev, cur) => {
      if (prev.find((item) => item.commandName === cur.commandName))
        return prev;
      return [...prev, cur];
    }, []);

    dedupedCommonUsages.forEach((item) => {
      console.log(`[${item.commandName}]
usage: ${item.usage}
`);
      const options = Reflect.ownKeys(item.instance);

      options.forEach((optionKey) => {
        const value = Reflect.get(item.instance, optionKey);

        const { optionName: injectKey, description } = value;

        console.log("injectKey: ", injectKey);
        console.log("description: ", description);
      });
    });

    rootUsage.forEach((item) => {
      console.log(`[${item.commandName}] ${item.usage}`);
    });
  }

  private checkUnknownOptions(handler: any, parsedArgs: Dictionary) {
    const handlerDeclaredOptions = Reflect.ownKeys(handler);

    const unknownOptions = Object.keys(parsedArgs).filter(
      (key) => !handlerDeclaredOptions.includes(key)
    );

    if (unknownOptions.length > 0) {
      // todo: UnknownOptionError
      // throw new Error(
      //   `Unknown options: ${unknownOptions.join(", ")}. See --help for usage.`
      // );
    }
  }

  private injectCommandOptions(
    handler: any,
    inputs: string[],
    _args: Dictionary
  ) {
    const handlerOptions = Reflect.ownKeys(handler);

    const commonOptions: Array<{
      key: string;
      value: OptionInitializerPlaceHolder;
    }> = [];
    const variadicOptions: Array<{
      key: string;
      value: OptionInitializerPlaceHolder;
    }> = [];

    const variadicOptionsInjectKey: string[] = [];

    handlerOptions.forEach((key: string) => {
      const value: OptionInitializerPlaceHolder = Reflect.get(handler, key);

      if (value.type === "VariadicOption") {
        variadicOptions.push({
          key,
          value,
        });
        variadicOptionsInjectKey.push(value.optionName);
      } else {
        commonOptions.push({
          key,
          value,
        });
      }
    });

    const parseForVariadic = parse(this.rawArgs, {
      array: variadicOptionsInjectKey,
      configuration: {
        "combine-arrays": true,
        "greedy-arrays": true,
        "halt-at-non-option": false,
      },
    });

    // 需要将 variadic 从 parsed 中移除
    // 这一步可以通过对 this.rawArgs 做处理，建议直接自己实现一个 parser

    variadicOptions.forEach((opt) => {
      const injectKey = opt.value.optionName;
      Reflect.set(handler, opt.key, parseForVariadic[injectKey]);
    });

    commonOptions.forEach(({ key: optionKey, value: _value }) => {
      const value:
        | OptionInitializerPlaceHolder
        | ContextInitializerPlaceHolder
        | InputInitializerPlaceHolder = Reflect.get(handler, optionKey);

      const { type } = value;

      if (type === "Context") {
        Reflect.set(handler, optionKey, {
          temp: "this is context...",
        });
        return;
      }

      if (type === "Input") {
        Reflect.set(handler, optionKey, inputs ?? []);
        return;
      }

      const {
        optionName: injectKey,
        initValue,
        schema,
        // todo: by XOR types
      } = value as OptionInitializerPlaceHolder;

      // use value from parsed args
      if (injectKey in this.parsedArgs) {
        const argValue = this.parsedArgs[injectKey];

        // control parse / safeParse from options
        // hijack zoderror for better error message
        const validatedValue = schema ? schema.safeParse(argValue) : argValue;

        Reflect.set(handler, optionKey, validatedValue);

        // validate for values from parsed args
      } else {
        // use default value or mark as undefined
        // null should also be converted to undefined
        Reflect.set(handler, optionKey, initValue ?? undefined);
      }

      if (type === "Options") {
        Reflect.set(handler, optionKey, this.parsedArgs);
      }
    });
  }

  private executeCommand(Command: any, inputs: string[], args: Dictionary) {
    // 在这一步应当完成对所有内部选项值的填充
    const handler = new Command();

    !this?.options?.allowUnknownOptions &&
      this.checkUnknownOptions(handler, args);

    this.injectCommandOptions(handler, inputs, args);

    // 执行命令
    handler.run();
  }

  private getRealHandleCommand(command: string[]) {
    // 这里还是要处理下是否存在 sub-command 的情况
    // 如果 command.length === 1
    // 如果当前 command 没有 handler，则打印帮助信息
    // 如果当前 command 有 handler，则执行 handler
    // 如果 command.length > 1
    // 尝试查找是否存在 sub-command
    // 如果存在，则递归向下查找
    // 否则，存为 Input
    // 不太对，还需要处理 Root Command 的 Input 的情况...
    const [currentCommandNameMatch, ...inputs] = command;

    const CommandInfo = this.commandRegistry.get(currentCommandNameMatch);

    if (!CommandInfo) {
      return null;
    }

    const fallback = { Command: CommandInfo.class, inputs };

    // 如果存在子命令且仍然存在可供匹配的项，才继续向下
    if (CommandInfo?.childCommandList?.length && command.length >= 1) {
      return this.getRealHandleCommand(command.slice(1)) ?? fallback;
    }

    return fallback;
  }

  private dispatchCommand(command: string[], args: Dictionary) {
    const { Command, inputs } = this.getRealHandleCommand(command);

    this.executeCommand(Command, inputs, args);
  }

  private tryExecuteRootCommandOrPrintUsage(parsedArgs) {
    // 如果指定了 RootCommand，则调用
    // 否则检查是否启用了 enableHelp
    // 如果都没有，NoRootHandlerError
    // if (this.rootCommandRegistry.size > 0) {
    //   const RootCommand = this.rootCommandRegistry.get("root").class;
    //   this.executeCommand(RootCommand, parsedArgs);
    // } else if (this.options.enableUsage) {
    this.collectCommandUsage();
    // } else {
    //   // throws
    // }
  }

  private rawArgs = process.argv.slice(2);

  private parsedArgs: Arguments;

  // 调用此方法后，再修改配置和添加命令将不会生效
  public start() {
    // 由于更希望按需实例化，即最终负责的那个 Command Class 才会被实例化
    // 因此无法在这里提前收集到所有 Command 内部选项的 alias
    const parsed = parse(this.rawArgs, {
      // 这个目前还没法支持
      // 或者说用一个专门的 VariadicOption ...
      // 对于这个 VariadicOption 进行 parse 两次
      configuration: {
        "halt-at-non-option": false,
      },
    });

    this.parsedArgs = parsed;

    const { _, ...parsedArgs } = parsed;

    if (_.length === 0) {
      this.tryExecuteRootCommandOrPrintUsage(parsedArgs);
      return;
    }

    this.dispatchCommand(_ as string[], parsedArgs);
  }
}

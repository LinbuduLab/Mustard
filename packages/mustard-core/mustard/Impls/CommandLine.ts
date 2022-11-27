import parse from "yargs-parser";

import { DecoratorImpl } from "./DecoratorImpl";
import { ICLIConfiguration } from "./types/Configuration.struct";
import { ContextInitializerPlaceHolder } from "./types/Context.struct";
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

      Command.aliasName && this.commandRegistry.set(Command.aliasName, Command);
    });
  }

  private initialize(Commands: ClassStruct[]) {
    // 拿到注册的所有命令
    Commands.forEach((Command) => {
      console.log(Command.name);
    });

    // 注册命令
    this.internalRegisterCommand(Commands);

    // 实例化 Parser
    // 初始化配置
    // 检查环境
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

  private injectCommandOptions(handler: any, args: Dictionary) {
    const handlerOptions = Reflect.ownKeys(handler);

    handlerOptions.forEach((optionKey) => {
      const value:
        | OptionInitializerPlaceHolder
        | ContextInitializerPlaceHolder = Reflect.get(handler, optionKey);

      const { type } = value;

      if (type === "Context") {
        Reflect.set(handler, optionKey, {
          temp: "this is context...",
        });
        return;
      }

      const {
        optionName: injectKey,
        initValue,
        schema,
        // todo: by XOR types
      } = value as OptionInitializerPlaceHolder;

      // use value from parsed args
      if (injectKey in args) {
        const argValue = args[injectKey];

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
        Reflect.set(handler, optionKey, args);
      }
    });
  }

  private executeCommand(Command: any, args: Dictionary) {
    // 在这一步应当完成对所有内部选项值的填充
    const handler = new Command();

    !this?.options?.allowUnknownOptions &&
      this.checkUnknownOptions(handler, args);

    this.injectCommandOptions(handler, args);

    // 执行命令
    handler.run();
  }

  private dispatchCommand(command: string[], args: Dictionary) {
    // todo: sub command
    const [main, ...subs] = command;

    const Command = this.commandRegistry.get(main).class;

    this.executeCommand(Command, args);
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

  // 调用此方法后，再修改配置和添加命令将不会生效
  public start() {
    const args = process.argv.slice(2);
    const parsed = parse(args);

    const { _, ...parsedArgs } = parsed;

    if (_.length === 0) {
      this.tryExecuteRootCommandOrPrintUsage(parsedArgs);
      return;
    }

    this.dispatchCommand(_ as string[], parsedArgs);
  }
}

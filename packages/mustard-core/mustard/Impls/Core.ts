export type FuncStruct<
  TArgs extends unknown[] = unknown[],
  TReturnType extends unknown = unknown
> = (...args: TArgs) => Promise<TReturnType>;

export type ClassStruct<TInstanceType extends unknown = unknown> = new (
  ...args: any[]
) => TInstanceType;

const CommandRrgistry = Map<
  string,
  {
    commandName: string;
    aliasName?: string;
    class: any;
    root: boolean;
  }
>;

const OptionRegistry = Map<
  string,
  {
    optionName: string;
    commandName: string;
    class: any;
    // 是否注入全部
    eager: boolean;
  }
>;

const ClassRegistryMap = Map<string, ClassStruct<any>>;
const InstanceRegistryMap = Map<string, any>;

export class Container {
  public static classMap = new ClassRegistryMap();

  public static instanceMap = new InstanceRegistryMap();

  public static commandRegistry = new CommandRrgistry();

  public static optionRegistry = new CommandRrgistry();

  public static Command(
    commandName: string,
    aliasName?: string
    // subCommands?: any[]
  ): ClassDecoratorFunction {
    return (target, context) => {
      // @ts-ignore
      Container.commandRegistry.set(context.name, {
        commandName,
        aliasName,
        class: target,
        root: false,
      });
    };
  }

  public static RootCommand(): ClassDecoratorFunction {
    return (target, context) => {
      // @ts-ignore
      Container.commandRegistry.set(context.name, {
        commandName: "root",
        class: target,
        root: true,
      });
    };
  }

  // 这里并不能拿到 Class 信息
  // Accessor Decorator 的 target 应该可以，但需要额外的接受成本？
  // 要让 Command 和 Option 关联的话，最简单的方式应该是使用 Entangled
  // 或者让 Command 变成 getter，每次访问分派...
  public static Option(
    optionName?: string,
    description?: string,
    validators?: any
  ): ClassFieldDecoratorFunction {
    // 试试用一个占位值标记 Option
    // todo: Symbol
    return (_, { name }) =>
      (initValue) => ({
        type: "Option",
        optionName: optionName ?? String(name),
        rule: "rule",
        initValue,
        description,
      });
  }

  // accept no args
  public static Options(): ClassFieldDecoratorFunction {
    return (initValue) => () => ({
      type: "Options",
      initValue,
      rule: "rule",
    });
  }

  public static register(identifier: string, cls: ClassStruct): void {
    Container.classMap.set(identifier, cls);
  }

  public static collect(instance: unknown) {}

  public static produce<T extends any = any>(identifier: string): T {
    const Cls = Container.classMap.get(identifier);

    const instance = new Cls();

    return instance;
  }
}

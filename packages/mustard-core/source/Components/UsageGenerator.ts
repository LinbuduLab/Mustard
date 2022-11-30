import { MustardRegistry } from "source/Core/Registry";

export class UsageInfoGenerator {
  public static collectCommandUsage() {
    // 如何在这一步收集 options 的描述？
    // 如果每个命令实例化一个肯定就可以了嗷
    const rootUsage = [];
    const commandNames = new Set();
    const commonUsages = [];

    const rootCommand = MustardRegistry.provideRootCommand();

    if (rootCommand) {
      const RootCommand = rootCommand.class;

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

    MustardRegistry.CommandRegistry.forEach((Command) => {
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
      });
    });

    rootUsage.forEach((item) => {
      console.log(`[${item.commandName}] ${item.usage}`);
    });
  }
}
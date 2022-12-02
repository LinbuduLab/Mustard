import { Arguments } from "yargs-parser";

import { MustardRegistry } from "../Components/Registry";
import { MustardConstanst } from "../Components/Constants";
import { UsageInfoGenerator } from "source/Components/UsageGenerator";
import { DecoratedClassFieldsNormalizer } from "../Components/DecoratedFieldsNormalizer";
import { MustardUtils } from "source/Components/Utils";
import { CommandRegistryPayload } from "../Typings/Command.struct";
import {
  CLIInstantiationConfiguration,
  CommandList,
} from "source/Typings/configuration.struct";

export class CLI {
  constructor(
    private readonly identifier: string,
    Commands: CommandList,
    private options?: CLIInstantiationConfiguration
  ) {
    this.initialize(Commands);
  }

  private parsedArgs: Arguments;

  private initialize(Commands: CommandList) {
    this.normalizeConfigurations();
    this.internalRegisterCommand(Commands);
  }

  private normalizeConfigurations() {
    const {
      enableUsage = true,
      allowUnknownOptions = true,
      enableVersion = true,
    } = this.options;

    this.options = {
      enableUsage,
      allowUnknownOptions,
      enableVersion,
    };
  }

  public configure(overrides: Partial<CLIInstantiationConfiguration>) {
    Object.assign(this.options ?? {}, overrides ?? {});
  }

  public registerCommand(Commands: CommandList) {
    this.internalRegisterCommand(Commands);
  }

  private instantiateWithParse() {
    const commandMap = MustardRegistry.provide();
    const variadicOptionKeys = new Set<string>();

    commandMap.forEach((commandRegistration, key) => {
      const instance = new commandRegistration.Class();

      const decoratedInstanceFields =
        MustardUtils.filterDecoratedInstanceFields(instance);

      decoratedInstanceFields
        .filter((v) => v.type === "VariadicOption")
        .forEach((v) => {
          variadicOptionKeys.add(v.key);
        });

      MustardRegistry.upsert(key, { instance });
    });

    this.parsedArgs = MustardUtils.parseFromProcessArgs(
      Array.from(MustardRegistry.VariadicOptions)
    );
  }

  public start() {
    this.instantiateWithParse();

    const { _ } = this.parsedArgs;

    const useRootHandle = _?.length === 0;

    useRootHandle ? this.dispatchRootHandler() : this.dispatchCommand();
  }

  private dispatchCommand() {
    const { _: input } = <{ _: string[] }>this.parsedArgs;

    const { command, inputs: commandInput } =
      MustardUtils.findHandlerCommandWithInputs(input);

    this.executeCommand(command, commandInput);
  }

  private executeCommand(command: CommandRegistryPayload, inputs: string[]) {
    const handler = command.instance;

    this.options.allowUnknownOptions === false &&
      DecoratedClassFieldsNormalizer.throwOnUnknownOptions(
        handler,
        this.parsedArgs
      );

    DecoratedClassFieldsNormalizer.normalizeDecoratedFields(
      handler,
      inputs,
      this.parsedArgs
    );

    handler.run();
  }

  private internalRegisterCommand(Commands: CommandList) {
    for (const Command of Commands) {
      const CommandRegistration = MustardRegistry.provide(Command.name);

      MustardRegistry.register(
        CommandRegistration.root
          ? MustardConstanst.RootCommandRegistryKey
          : CommandRegistration.commandName,

        CommandRegistration
      );

      CommandRegistration.alias &&
        MustardRegistry.register(
          CommandRegistration.alias,
          CommandRegistration
        );

      if (CommandRegistration.childCommandList.length > 0) {
        this.internalRegisterCommand(CommandRegistration.childCommandList);
      }
    }
  }

  private dispatchRootHandler() {
    // 如果指定了 RootCommand，则调用
    // 否则检查是否启用了 enableHelp
    // 如果都没有，NoRootHandlerError
    const root = MustardRegistry.provideRootCommand();

    if (root) {
      this.executeCommand(root, []);
      // enabled by default
    } else if (this.options.enableUsage) {
      UsageInfoGenerator.collectCommandUsage();
    } else {
      // throws
    }
  }
}

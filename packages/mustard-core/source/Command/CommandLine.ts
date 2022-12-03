import { Arguments } from "yargs-parser";

import { MustardRegistry } from "../Components/Registry";
import { MustardConstanst } from "../Components/Constants";
import { UsageInfoGenerator } from "source/Components/UsageGenerator";
import { DecoratedClassFieldsNormalizer } from "../Components/DecoratedFieldsNormalizer";
import { MustardUtils } from "source/Components/Utils";
import {
  CommandRegistryPayload,
  CommandStruct,
} from "../Typings/Command.struct";
import {
  CLIInstantiationConfiguration,
  CommandList,
} from "source/Typings/configuration.struct";

export class CLI {
  constructor(
    readonly identifier: string,
    Commands: CommandList,
    private options?: CLIInstantiationConfiguration
  ) {
    this.initialize(Commands);
  }

  private parsedArgs!: Arguments;

  private initialize(Commands: CommandList) {
    this.normalizeConfigurations();
    this.registerCommand(Commands);
  }

  private normalizeConfigurations() {
    const {
      enableUsage = true,
      allowUnknownOptions = true,
      enableVersion = true,
      lifeCycles = {},
    } = this.options ?? {};

    this.options = {
      enableUsage,
      allowUnknownOptions,
      enableVersion,
      lifeCycles,
    };
  }

  public configure(overrides: Partial<CLIInstantiationConfiguration>) {
    Object.assign(this.options ?? {}, overrides ?? {});
  }

  public registerCommand(Commands: CommandList) {
    for (const Command of Commands) {
      const CommandRegistration = MustardRegistry.provide(Command.name);

      MustardRegistry.register(
        CommandRegistration.root
          ? MustardConstanst.RootCommandRegistryKey
          : CommandRegistration.commandName,

        CommandRegistration
      );

      CommandRegistration.alias
        ? MustardRegistry.register(
            CommandRegistration.alias,
            CommandRegistration
          )
        : void 0;

      if (CommandRegistration.childCommandList.length > 0) {
        this.registerCommand(CommandRegistration.childCommandList);
      }
    }
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
    this.options?.lifeCycles?.onStart?.();

    this.instantiateWithParse();

    const useRootHandle = this.parsedArgs._?.length === 0;

    useRootHandle ? this.dispatchRootHandler() : this.dispatchCommand();
  }

  private dispatchCommand() {
    const { command: commandRegistration, inputs: commandInput } =
      MustardUtils.findHandlerCommandWithInputs(<string[]>this.parsedArgs._);

    this.executeCommandFromRegistration(commandRegistration, commandInput)
      .then(this.options?.lifeCycles?.onComplete ?? (() => {}))
      .catch(this.options?.lifeCycles?.onError ?? (() => {}));
  }

  private async executeCommandFromRegistration(
    command: CommandRegistryPayload,
    inputs: string[] = []
  ) {
    const handler: CommandStruct = command.instance;

    this.options?.allowUnknownOptions === false
      ? DecoratedClassFieldsNormalizer.throwOnUnknownOptions(
          handler,
          this.parsedArgs
        )
      : void 0;

    DecoratedClassFieldsNormalizer.normalizeDecoratedFields(
      handler,
      inputs,
      this.parsedArgs
    );

    await handler.run();
  }

  private dispatchRootHandler() {
    const rootCommandRegistation = MustardRegistry.provideRootCommand();

    if (rootCommandRegistation) {
      this.executeCommandFromRegistration(rootCommandRegistation);
    } else if (this.options?.enableUsage) {
      UsageInfoGenerator.collectCommandUsage();
    } else {
      // throws
    }
  }
}

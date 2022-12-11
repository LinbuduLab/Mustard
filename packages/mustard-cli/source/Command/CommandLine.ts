import { MustardRegistry } from "../Components/Registry";
import { MustardConstanst } from "../Components/Constants";
import { DecoratedClassFieldsNormalizer } from "../Components/DecoratedFieldsNormalizer";
import { MustardUtils } from "../Components/Utils";
import { BuiltInCommands } from "./BuiltInCommands";

import { CommandNotFoundError } from "../Errors/CommandNotFoundError";
import { NoRootHandlerError } from "../Errors/NoRootHandlerError";

import type { Arguments } from "yargs-parser";
import type {
  CommandInput,
  CommandRegistryPayload,
  CommandStruct,
} from "../Typings/Command.struct";
import type {
  CLIInstantiationConfiguration,
  CommandList,
} from "../Typings/configuration.struct";
import type { Provider } from "../Typings/DIService.struct";
import type { MaybeArray } from "../Typings/Shared.struct";

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
    this.registerProvider(this.options?.providers ?? []);
  }

  public registerProvider(providers: MaybeArray<Provider>) {
    const providerList = MustardUtils.ensureArray(providers);

    if (!providerList.length) return;

    providerList.forEach((provider) => {
      MustardRegistry.ExternalProviderRegistry.set(
        provider.identifier,
        provider.value
      );
    });
  }

  private normalizeConfigurations() {
    const {
      enableUsage = true,
      allowUnknownOptions = false,
      enableVersion = false,
      lifeCycles = {},
      didYouMean = true,
    } = this.options ?? {};

    this.options = {
      enableUsage,
      allowUnknownOptions,
      enableVersion,
      lifeCycles,
      didYouMean,
    };
  }

  public configure(overrides: Partial<CLIInstantiationConfiguration>) {
    Object.assign(this.options ?? {}, overrides ?? {});
  }

  public registerCommand(Commands: CommandList) {
    for (const Command of Commands) {
      const CommandRegistration = MustardRegistry.provideInit(Command.name);

      MustardRegistry.register(
        CommandRegistration.root
          ? MustardConstanst.RootCommandRegistryKey
          : CommandRegistration.commandInvokeName,

        CommandRegistration
      );

      CommandRegistration.commandAlias
        ? MustardRegistry.register(
            CommandRegistration.commandAlias,
            CommandRegistration
          )
        : void 0;

      if (CommandRegistration.childCommandList.length > 0) {
        this.registerCommand(CommandRegistration.childCommandList);
      }
    }
  }

  private instantiateWithParse() {
    const variadicOptionKeys = new Set<string>();

    MustardRegistry.provide().forEach((commandRegistration, key) => {
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
      Array.from(MustardRegistry.VariadicOptions),
      MustardRegistry.OptionAliasMap
    );
  }

  public start() {
    this.options?.lifeCycles?.onStart?.();

    this.instantiateWithParse();

    BuiltInCommands.useVersionCommand(this.options?.enableVersion);

    const useRootHandle = this.parsedArgs._?.length === 0;

    useRootHandle ? this.dispatchRootHandler() : this.dispatchCommand();
  }

  private handleCommandExecution(
    commandRegistration: CommandRegistryPayload,
    commandInput: string[]
  ) {
    this.executeCommandFromRegistration(commandRegistration, commandInput)
      .then(this.options?.lifeCycles?.onComplete ?? (() => {}))
      .catch(
        this.options?.lifeCycles?.onError ??
          ((err) => {
            throw err;
          })
      );
  }

  private dispatchCommand() {
    const { command: commandRegistration, inputs: commandInput } =
      MustardUtils.findHandlerCommandWithInputs(
        <CommandInput>this.parsedArgs._
      );

    // should only throw when no matched command found
    if (!commandRegistration) {
      throw new CommandNotFoundError(this.parsedArgs);
    }

    BuiltInCommands.useHelpCommand(this.parsedArgs, commandRegistration);

    this.handleCommandExecution(commandRegistration, commandInput);
  }

  private async executeCommandFromRegistration(
    command: CommandRegistryPayload,
    inputs: string[] = []
  ) {
    const handler: CommandStruct = command.instance!;

    this.options?.allowUnknownOptions === false
      ? DecoratedClassFieldsNormalizer.throwOnUnknownOptions(
          handler,
          this.parsedArgs,
          this.options?.didYouMean ?? true
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
    const rootCommandRegistration = MustardRegistry.provideRootCommand();

    if (rootCommandRegistration) {
      BuiltInCommands.useHelpCommand(this.parsedArgs, rootCommandRegistration);

      this.executeCommandFromRegistration(rootCommandRegistration);
    } else if (this.options?.enableUsage) {
      BuiltInCommands.useHelpCommand(true);
    } else {
      throw new NoRootHandlerError();
    }
  }
}

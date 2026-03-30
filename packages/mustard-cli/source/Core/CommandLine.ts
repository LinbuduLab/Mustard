import _debug from "debug";

import { CommandRegistry } from "./CommandRegistry.js";
import { MustardConstanst } from "../Utils/Constants.js";
import { DecoratedClassFieldsNormalizer } from "./DecoratedFieldsNormalizer.js";
import { MustardInternalUtils } from "../Utils/Utils.js";

import { BuiltInCommands } from "./BuiltInCommands.js";

import { CommandNotFoundError } from "../Errors/CommandNotFoundError.js";
import { NoRootHandlerError } from "../Errors/NoRootHandlerError.js";

import type { Arguments } from "yargs-parser";
import {
  CommandInput,
  CommandRegistryPayload,
  MustardCommand,
} from "../Typings/Command.struct.js";
import type {
  CLIInstantiationConfiguration,
  CommandList,
} from "../Typings/Configuration.struct.js";
import type { Provider } from "../Typings/DIService.struct.js";
import type { Dictionary, MaybeArray } from "../Typings/Shared.struct.js";
import { DidYouMeanOptionError } from "../Errors/DidYouMeanOptionError.js";
import { UnknownOptionsError } from "../Errors/UnknownOptionsError.js";
import { ProviderRegistry } from "./ProviderRegistry.js";
import { GlobalRegistry } from "./GlobalRegistry.js";

const debug = _debug("mustard:command-line");

export class MustardCommandLine {
  constructor(
    readonly identifier: string,
    Commands: CommandList,
    private options?: CLIInstantiationConfiguration,
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
    const providerList = MustardInternalUtils.ensureArray(providers);

    if (!providerList.length) return;

    providerList.forEach((provider) => {
      MustardInternalUtils.isConstructable(provider)
        ? ProviderRegistry.ExternalProviderRegistry.set(provider.name, provider)
        : ProviderRegistry.ExternalProviderRegistry.set(
            provider.identifier,
            provider.value,
          );
    });
  }

  private normalizeConfigurations() {
    const {
      allowUnknownOptions = false,
      enableUsage = true,
      enableVersion = false,
      lifeCycles = {},
      didYouMean = true,
      ignoreValidationErrors = false,
    } = this.options ?? {};

    this.options = {
      allowUnknownOptions,
      enableVersion,
      lifeCycles,
      didYouMean,
      enableUsage,
      ignoreValidationErrors,
    };

    debug("normalized configurations: %O", this.options);
  }

  public configure(overrides: Partial<CLIInstantiationConfiguration>) {
    debug("overriding configurations: %O", overrides);
    Object.assign(this.options ?? {}, overrides ?? {});
  }

  public registerCommand(Commands: CommandList) {
    for (const Command of Commands) {
      const CommandRegistration = CommandRegistry.provideInit(Command.name);

      CommandRegistry.register(
        CommandRegistration.root
          ? MustardConstanst.RootCommandRegistryKey
          : CommandRegistration.commandInvokeName,

        CommandRegistration,
      );

      CommandRegistration.commandAlias
        ? CommandRegistry.register(
            CommandRegistration.commandAlias,
            CommandRegistration,
          )
        : void 0;

      if (
        !CommandRegistration.root &&
        CommandRegistration.childCommandList.length > 0
      ) {
        this.registerCommand(CommandRegistration.childCommandList);
      }
    }
  }

  private instantiateWithParse() {
    CommandRegistry.provide().forEach((commandRegistration, key) => {
      const instance = new commandRegistration.Class();

      const decoratedInstanceFields =
        MustardInternalUtils.filterDecoratedInstanceFields(instance);

      CommandRegistry.upsert(key, { instance, decoratedInstanceFields });
    });

    this.parsedArgs = MustardInternalUtils.parseFromProcessArgs(
      Array.from(GlobalRegistry.VariadicOptions),
      GlobalRegistry.OptionAliasMap,
    );

    debug("parsed arguments: %O", this.parsedArgs);
  }

  public startCommandLine() {
    this.options?.lifeCycles?.onStart?.();

    this.instantiateWithParse();

    BuiltInCommands.useVersionCommand(
      this.parsedArgs,
      this.options?.enableVersion,
    );

    const useRootHandle = this.parsedArgs._?.length === 0;

    useRootHandle ? this.dispatchRootHandler() : this.dispatchCommand();
  }

  private dispatchCommand() {
    const { command: commandRegistration, inputs: commandInput } =
      MustardInternalUtils.findHandlerCommandWithInputs(
        <CommandInput>this.parsedArgs._,
      );

    // should only throw when no matched command found
    if (!commandRegistration) {
      throw new CommandNotFoundError(this.parsedArgs);
    }

    // execute command with help flag
    BuiltInCommands.useHelpCommand(
      this.identifier,
      this.parsedArgs,
      commandRegistration,
      this.options?.enableUsage,
    );

    this.handleCommandExecution(commandRegistration, commandInput);
  }

  private handleCommandExecution(
    commandRegistration: CommandRegistryPayload,
    commandInput: string[],
  ) {
    this.executeCommandFromRegistration(commandRegistration, commandInput)
      .then(this.options?.lifeCycles?.onComplete ?? (() => {}))
      .catch(
        this.options?.lifeCycles?.onError ??
          ((err) => {
            throw err;
          }),
      );
  }

  private static throwOnUnknownOption(
    instance: MustardCommand,
    parsedArgs: Dictionary,
    useDidYouMean: boolean,
  ) {
    const instanceDeclaredOptions =
      MustardInternalUtils.getInstanceFields(instance);

    const unknownOptions = Object.keys(parsedArgs).filter(
      (key) => !instanceDeclaredOptions.includes(key) && key !== "_",
    );

    if (unknownOptions.length > 0) {
      const firstUnknownOption = unknownOptions[0]!;
      if (useDidYouMean) {
        throw new DidYouMeanOptionError(
          firstUnknownOption,
          MustardInternalUtils.levenshtein(
            firstUnknownOption,
            instanceDeclaredOptions,
          ),
        );
      }

      throw new UnknownOptionsError(unknownOptions);
    }
  }

  private async executeCommandFromRegistration(
    command: CommandRegistryPayload,
    inputs: string[] = [],
  ) {
    const handler: MustardCommand = command.instance!;

    this.options?.allowUnknownOptions === false
      ? MustardCommandLine.throwOnUnknownOption(
          handler,
          this.parsedArgs,
          this.options?.didYouMean ?? true,
        )
      : void 0;

    DecoratedClassFieldsNormalizer.normalizeDecoratedFields(
      command,
      inputs,
      this.parsedArgs,
    );

    await handler.run();
  }

  private dispatchRootHandler() {
    const rootCommandRegistration = CommandRegistry.provideRootCommand();

    if (rootCommandRegistration) {
      // bin --help with root command specified
      // print help info for root command only(even there're other commands)
      BuiltInCommands.useHelpCommand(
        this.identifier,
        this.parsedArgs,
        rootCommandRegistration,
        this.options?.enableUsage,
      );

      this.executeCommandFromRegistration(rootCommandRegistration);
    } else if (this.options?.enableUsage) {
      // bin --help without root command specified
      // print help info for cpmplete app
      BuiltInCommands.useHelpCommand(
        this.identifier,
        true,
        undefined,
        this.options?.enableUsage,
      );
    } else {
      // no root command specified and options.enableUsage is disabled
      throw new NoRootHandlerError();
    }
  }
}

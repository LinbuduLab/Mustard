import type {
  CommandRegistryPayload,
  MustardCommand,
} from "./Command.struct.js";
import type { Provider } from "./DIService.struct.js";
import type { MaybeFactory } from "./Shared.struct.js";

export interface MustardConfigurations {
  /**
   * Specify how to parse option name.
   */
  parseCamelCaseOptionName: "dot" | "dash" | "none";

  /**
   * Allow unknown options to be passed to the command. If this is set to `false`, Mustard will throw an error when it encounters an unknown option during parse stage.
   *
   * @default false
   */
  allowUnknownOptions?: boolean;

  /**
   * Allow Mustard to generate usage information for commands when `--help` or `-h` option is passed.
   *
   * You can also specify a custom usage generator:
   *
   * Example:
   *
   * ```typescript
   * \@App({
   *   configurations: {
   *     enableUsage: (command) => `Help info for ${command.commandInvokeName}.`
   *   }
   * })
   * ```
   */
  enableUsage: boolean | ((registration?: CommandRegistryPayload) => string);
  enableVersion: false | MaybeFactory<string>;
  ignoreValidationErrors: boolean;
  defaultOverrides: boolean;
  lifeCycles?: Partial<LifeCycles>;
  didYouMean?: boolean;
  providers?: Provider[];
}

export interface LifeCycles {
  onStart: () => void;
  onError: (err: Error) => void;
  onComplete: () => void;
}

export interface CLIInstantiationConfiguration extends Partial<MustardConfigurations> {}

export type CommandList = (typeof MustardCommand)[];

export interface AppFactoryOptions {
  name?: string;
  commands: CommandList;
  configurations?: Partial<MustardConfigurations>;
  providers?: Provider[];
}

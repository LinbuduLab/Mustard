import type { CommandRegistryPayload, CommandStruct } from "./Command.struct";
import type { Provider } from "./DIService.struct";
import type { MaybeFactory } from "./Shared.struct";

export interface Configurations {
  allowUnknownOptions?: boolean;
  debug: boolean;
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

export interface CLIInstantiationConfiguration
  extends Partial<Configurations> {}

export type CommandList = (typeof CommandStruct)[];

export interface AppFactoryOptions {
  name?: string;
  commands: CommandList;
  configurations?: Partial<Configurations>;
  providers?: Provider[];
}

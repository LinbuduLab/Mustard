import { CommandStruct } from "./Command.struct";
import { Provider } from "./DIService.struct";
import { MaybeFactory } from "./Shared.struct";

export interface Configurations {
  allowUnknownOptions?: boolean;
  debug: boolean;
  enableUsage: boolean | MaybeFactory<string>;
  enableVersion: boolean | MaybeFactory<string>;
  lifeCycles?: Partial<LifeCycles>;
  didYouMean?: boolean;
  providers?: Provider[];
}

export interface LifeCycles {
  onStart: () => void;
  onError: () => void;
  onComplete: () => void;
}

export interface CLIInstantiationConfiguration
  extends Partial<Configurations> {}

export type CommandList = typeof CommandStruct[];

export interface AppFactoryOptions {
  name?: string;
  commands: CommandList;
  configurations?: Partial<Configurations>;
  providers?: Provider[];
}

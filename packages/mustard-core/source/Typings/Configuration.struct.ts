import { CommandStruct } from "./Command.struct";
import { MaybeFactory } from "./Shared.struct";

export interface Configurations {
  allowUnknownOptions: boolean;
  debug: boolean;
  enableUsage: boolean | MaybeFactory<string>;
  enableVersion: boolean | MaybeFactory<string>;
}

export interface CLIInstantiationConfiguration
  extends Partial<Configurations> {}

export interface AppFactoryOptions {
  name?: string;
  commands: CommandStruct[];
  configurations?: Partial<Configurations>;
}

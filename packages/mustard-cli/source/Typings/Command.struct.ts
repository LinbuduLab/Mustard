import { MaybePromise, Constructable, Nullable } from "./Shared.struct";
import { CommandList } from "./Configuration.struct";

export type CommandRegistryPayload = {
  commandInvokeName: string;
  Class: Constructable<CommandStruct>;
  root: boolean;
  childCommandList: CommandList;

  commandAlias?: Nullable<string>;
  description?: Nullable<string>;
  instance?: CommandStruct;
};

export abstract class CommandStruct {
  abstract example?: () => string;

  abstract run(): MaybePromise<void>;
}

export type CommandInput = [string, ...string[]];

export type CommandConfiguration = {
  name: string;
  alias?: string;
  description?: string;
  childCommandList?: CommandList;
};

import { ClassStruct, MaybePromise, Constructable } from "./Shared.struct";
import { CommandList } from "./Configuration.struct";

export type CommandRegistryPayload = {
  commandName: string;
  alias?: string;
  description?: string;
  Class: Constructable<CommandStruct>;
  root: boolean;
  childCommandList: CommandList;
  instance?: CommandStruct;
};

export abstract class CommandStruct {
  abstract example?: () => string;

  abstract run(): MaybePromise<void>;
}

export type CommandInput = [string, ...string[]];

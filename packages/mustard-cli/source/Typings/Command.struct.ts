import type { MaybePromise, Constructable, Nullable } from "./Shared.struct";
import type { CommandList } from "./Configuration.struct";
import type { TaggedDecoratedInstanceFields } from "./Utils.struct";

export type CommandRegistryPayload = {
  commandInvokeName: string;
  Class: Constructable<CommandStruct>;
  root: boolean;
  childCommandList: CommandList;

  commandAlias?: Nullable<string>;
  description?: Nullable<string>;
  instance: CommandStruct;
  decoratedInstanceFields: TaggedDecoratedInstanceFields[];
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

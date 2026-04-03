import type { MaybePromise, Constructable, Nullable } from "./Shared.struct.js";
import type { CommandList } from "./Configuration.struct.js";
import type { TaggedDecoratedInstanceFields } from "./Utils.struct.js";

export type CommandRegistryPayload = {
  commandInvokeName: string;
  Class: Constructable<MustardCommand>;
  root: boolean;
  childCommandList: CommandList;

  commandAlias?: Nullable<string>;
  description?: Nullable<string>;
  instance: MustardCommand;
  decoratedInstanceFields: TaggedDecoratedInstanceFields[];
};

export abstract class MustardCommand {
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

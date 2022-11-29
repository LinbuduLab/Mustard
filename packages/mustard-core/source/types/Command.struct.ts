import { ClassStruct } from "./Shared.struct";

export type CommandRegistryPayload = {
  commandName: string;
  alias?: string;
  description?: string;
  // todo: fix after typing fixed in #50820
  class: any;
  root: boolean;
  childCommandList: any[];
};

export abstract class CommandStruct {
  abstract example?: () => string;

  abstract run(): void;
}

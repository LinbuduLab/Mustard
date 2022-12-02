import { ClassStruct, MaybePromise } from "./Shared.struct";

export type CommandRegistryPayload = {
  commandName: string;
  alias?: string;
  description?: string;
  // todo: fix after typing fixed in #50820
  Class: new () => CommandStruct;
  root: boolean;
  childCommandList: any[];
  instance?: any;
  decoratedInstanceFields?: any;
};

export abstract class CommandStruct {
  abstract example?: () => string;

  abstract run(): MaybePromise<void>;
}

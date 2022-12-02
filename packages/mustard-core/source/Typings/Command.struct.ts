import { ClassStruct } from "./Shared.struct";

export type CommandRegistryPayload = {
  commandName: string;
  alias?: string;
  description?: string;
  // todo: fix after typing fixed in #50820
  class: any;
  root: boolean;
  childCommandList: any[];
  instance?: any;
  decoratedInstanceFields?: any;
};

export abstract class CommandStruct {
  // todo:
  name: string;

  abstract example?: () => string;

  abstract run(): void;
}

import { ClassStruct } from "./Shared.struct";

export type CommandRegistryPayload = {
  commandName: string;
  aliasName?: string;
  // todo: fix after typing fixed in #50820
  class: any;
  root: boolean;
};

export abstract class CommandStruct {
  abstract example?: () => string;

  abstract run(): void;
}

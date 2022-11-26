import { ZodType } from "zod";
import type { ClassStruct } from "./Shared.struct";

export type OptionRegistryPayload = {
  optionName: string;
  commandName: string;
  class: ClassStruct;
};

export enum OptionInjectionType {
  Option = "Option",
  Options = "Options",
  // todo: expand
}

export type OptionInitializerPlaceHolder = {
  type: OptionInjectionType;
  optionName?: string;
  optionAlias?: string;
  initValue?: unknown;
  description?: string;
  schema?: ZodType;
};

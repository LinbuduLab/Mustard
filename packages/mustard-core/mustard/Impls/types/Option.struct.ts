import { ZodType } from "zod";

import type { ClassStruct } from "./Shared.struct";

export type OptionInjectionType = "Option" | "Options";

export type OptionRegistryPayload = {
  optionName: string;
  commandName: string;
  class: ClassStruct;
};

export type OptionInitializerPlaceHolder = {
  type: OptionInjectionType;
  optionName?: string;
  optionAlias?: string;
  initValue?: unknown;
  description?: string;
  schema?: ZodType;
};

import { ZodType } from "zod";

import type { ClassStruct } from "./Shared.struct";
import type { ValidatorFactory } from "../Validators/Factory";

export type OptionInjectionType = "VariadicOption" | "Option" | "Options";

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

export type OptionConfiguration = {
  name?: string;
  alias?: string;
  description?: string;
  validator?: Partial<ValidatorFactory>;
};

export type VariadicOptionConfiguration = OptionConfiguration;

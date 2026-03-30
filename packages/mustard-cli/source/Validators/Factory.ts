import { StringValidator } from "./StringValidator.js";
import { BooleanValidator } from "./BooleanValidator.js";
import { NumberValidator } from "./NumberValidator.js";
import { DateValidator } from "./DateValidator.js";

import type { ZodType } from "zod";

import type { Nullable } from "../Typings/Shared.struct.js";

export class ValidatorFactory {
  public schema: Nullable<ZodType> = null;

  constructor(private required: boolean = false) {}

  public Required() {
    return new ValidatorFactory(true);
  }

  public Optional() {
    return new ValidatorFactory(false);
  }

  public String(): StringValidator {
    return new StringValidator(this.required);
  }

  public Boolean(): BooleanValidator {
    return new BooleanValidator(this.required);
  }

  public Number(): NumberValidator {
    return new NumberValidator(this.required);
  }

  public Date(): DateValidator {
    return new DateValidator(this.required);
  }

  // public Enum(input: Dictionary<unknown>): NativeEnumValidator {
  //   return new NativeEnumValidator(this.required, input);
  // }
}

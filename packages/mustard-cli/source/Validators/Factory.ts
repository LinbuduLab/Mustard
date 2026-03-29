import { StringValidator } from "./StringValidator";
import { BooleanValidator } from "./BooleanValidator";
import { NumberValidator } from "./NumberValidator";
import { DateValidator } from "./DateValidator";

import type { ZodType } from "zod";

import type { Nullable } from "../Typings/Shared.struct";

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

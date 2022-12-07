import { NativeEnumValidator } from "./EnumValidators";
import {
  StringValidator,
  BooleanValidator,
  NumberValidator,
} from "./PrimitiveValidators";

import type { Dictionary, Nullable } from "../Typings/Shared.struct";
import type { ZodType } from "zod";

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

  public Enum(input: Dictionary<string>): NativeEnumValidator {
    return new NativeEnumValidator(this.required, input);
  }
}

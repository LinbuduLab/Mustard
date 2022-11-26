import { z, ZodDate } from "zod";
import type { ZodType, ZodBoolean, ZodNull, ZodNumber, ZodString } from "zod";

type AvaliableSchemaValidations =
  | keyof typeof z
  | keyof ZodString
  | keyof ZodNumber
  | keyof ZodBoolean
  | keyof ZodNull
  | keyof ZodDate;

type ValidationItem = {
  type: AvaliableSchemaValidations;
  args?: unknown[];
};

export class ValidatorFactory {
  private schema: ZodType = null;

  private required = false;

  private validations: ValidationItem[] = [];

  public validate<T>(input: T) {
    for (const validation of this.validations) {
      this.schema = this.schema[validation.type](...validation.args);
    }

    if (this.required === false) this.schema.optional();

    return this.schema.parse(input);
  }

  public Required(): Omit<this, "Required"> {
    this.required = true;
    return this;
  }

  public Optional(): Omit<this, "Required"> {
    this.required = false;
    return this;
  }

  public String(): Omit<this, "String"> {
    this.validations.push({ type: "string" });
    return this;
  }

  public MinLength(len: number): Omit<this, "MinLength"> {
    this.validations.push({ type: "min", args: [len] });

    return this;
  }

  public MaxLength(len: number): Omit<this, "MaxLength"> {
    this.validations.push({ type: "max", args: [len] });
    return this;
  }
}

export const Validator = new ValidatorFactory();

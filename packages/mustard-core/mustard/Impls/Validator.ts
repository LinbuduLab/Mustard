import { z, ZodDate } from "zod";
import type { ZodType, ZodBoolean, ZodNull, ZodNumber, ZodString } from "zod";

// todo: support object type validations
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
  public schema: ZodType = null;

  private required = false;

  public validations: ValidationItem[] = [];

  public static validate<T>(
    input: T,
    schema: ZodType,
    validations: ValidationItem[],
    required: boolean
  ): T {
    // todo: findLast primitive validation type and apply first
    for (const validation of validations) {
      schema = (schema ?? z)[validation.type](...(validation.args ?? []));
    }

    if (required === false) schema = schema.optional();

    return schema.parse(input);
  }

  public Required(): Omit<this, "Required"> {
    this.required = true;
    return this;
  }

  public Optional(): Omit<this, "Required"> {
    this.required = false;
    return this;
  }

  // return String Validator!!!
  public String(): Omit<this, "String"> {
    this.validations.push({ type: "string" });
    return this;
  }

  public Number(): Omit<this, "Number"> {
    this.validations.push({ type: "number" });
    return this;
  }

  public Boolean(): Omit<this, "Boolean"> {
    this.validations.push({ type: "boolean" });
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

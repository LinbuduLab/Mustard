import { z, ZodDate, ZodOptional, ZodType } from "zod";
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

type MaybeOptionalZodType<T extends ZodType<unknown>> = T | ZodOptional<T>;

export class PrimitiveValidator<T extends ZodType> {}

export class StringValidator extends PrimitiveValidator<ZodType<String>> {
  private _schema: ZodString;

  constructor(private required: boolean = false) {
    super();
    this._schema = z.string();
  }

  public get schema(): MaybeOptionalZodType<ZodString> {
    return this.required ? this._schema : this._schema.optional();
  }

  public addValidation(type: keyof ZodString, args?: unknown[]) {
    const validation: ValidationItem = {
      type,
      args,
    };

    this._schema = this._schema[validation.type](...validation.args);
  }

  public validate(value: unknown) {
    return this._schema.parse(value);
  }

  public MinLength(len: number): Omit<this, "MinLength"> {
    this.addValidation("min", [len]);

    return this;
  }

  public MaxLength(len: number): Omit<this, "MaxLength"> {
    this.addValidation("max", [len]);
    return this;
  }
}

export class Base {}

export class ValidatorFactory {
  public schema: ZodType = null;

  constructor(private required: boolean = false) {}

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

  public Required() {
    return new ValidatorFactory(true);
  }

  public Optional() {
    return new ValidatorFactory(false);
  }

  public String(): StringValidator {
    return new StringValidator(this.required);
  }
}

export const Validator = new ValidatorFactory();

// Required  / Optional should be called first if needed
Validator.String().MinLength(3).MaxLength(10).schema.parse();

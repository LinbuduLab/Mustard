import { z } from "zod";
import type {
  ZodType,
  ZodBoolean,
  ZodNumber,
  ZodString,
  ZodNativeEnum,
  ZodOptional,
} from "zod";
import { Dictionary } from "./types/Shared.struct";

type AvaliableSchemaValidations =
  | keyof typeof z
  | keyof ZodString
  | keyof ZodNumber
  | keyof ZodBoolean
  | keyof ZodNativeEnum<Dictionary<string>>;

type ValidationItem = {
  type: AvaliableSchemaValidations;
  args?: unknown[];
};

type MaybeOptionalZodType<T extends ZodType<unknown>> = T | ZodOptional<T>;

abstract class BaseValidator<
  TValidationType extends ZodType,
  TParsedType extends unknown
> {
  _schema: TValidationType;

  constructor(required: boolean) {}

  abstract get schema(): TValidationType;

  abstract validate(value: unknown): TParsedType;

  abstract addValidation(type: keyof TValidationType, args?: unknown[]): void;
}

export class StringValidator implements BaseValidator<ZodType<String>, string> {
  _schema: ZodString;

  constructor(private required: boolean = false) {
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

export class BooleanValidator
  implements BaseValidator<ZodType<Boolean>, boolean>
{
  _schema: ZodBoolean;

  constructor(private required: boolean = false) {
    this._schema = z.boolean();
  }

  public get schema(): MaybeOptionalZodType<ZodBoolean> {
    return this.required ? this._schema : this._schema.optional();
  }

  public addValidation(type: keyof ZodBoolean, args?: unknown[]) {
    const validation: ValidationItem = {
      type,
      args,
    };

    this._schema = this._schema[validation.type](...validation.args);
  }

  public validate(value: unknown) {
    return this._schema.parse(value);
  }
}

export class NumberValidator implements BaseValidator<ZodType<Number>, number> {
  _schema: ZodNumber;

  constructor(private required: boolean = false) {
    this._schema = z.number();
  }

  public get schema(): MaybeOptionalZodType<ZodNumber> {
    return this.required ? this._schema : this._schema.optional();
  }

  public addValidation(type: keyof ZodNumber, args?: unknown[]) {
    const validation: ValidationItem = {
      type,
      args,
    };

    this._schema = this._schema[validation.type](...validation.args);
  }

  public validate(value: unknown) {
    return this._schema.parse(value);
  }
}

type CommonEnumType = ZodNativeEnum<Dictionary<string>>;

export class NativeEnumValidator {
  _schema: CommonEnumType;

  constructor(
    private required: boolean = false,
    private enumValues: Dictionary<string>
  ) {
    this._schema = z.nativeEnum(this.enumValues);
  }

  public get schema(): MaybeOptionalZodType<CommonEnumType> {
    return this.required ? this._schema : this._schema.optional();
  }

  public validate(value: unknown) {
    return this._schema.parse(value);
  }
}

export class ValidatorFactory {
  public schema: ZodType = null;

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

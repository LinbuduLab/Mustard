import { z } from "zod";

import type { ZodType, ZodBoolean, ZodNumber, ZodString } from "zod";

import type { BaseValidator, MaybeOptionalZodType } from "./Typings";
import type { ValidationTypes } from "../Typings/Shared.struct";

export class StringValidator implements BaseValidator<ZodType<String>, string> {
  _schema: ZodString;

  constructor(public required: boolean = false) {
    this._schema = z.string();
  }

  public get schema(): MaybeOptionalZodType<ZodString> {
    return this.required ? this._schema : this._schema.optional();
  }

  public addValidation(type: ValidationTypes<ZodString>, args: unknown[] = []) {
    const validation = {
      type,
      args,
    };

    // @ts-expect-error
    this._schema = this._schema[validation.type]?.(...validation.args);
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

  public Length(len: number): Omit<this, "Length"> {
    this.addValidation("length", [len]);
    return this;
  }

  public Email(): Omit<this, "Email"> {
    this.addValidation("email", []);
    return this;
  }

  public StartsWith(arg: string): Omit<this, "StartsWith"> {
    this.addValidation("startsWith", [arg]);
    return this;
  }

  public EndsWith(arg: string): Omit<this, "EndsWith"> {
    this.addValidation("endsWith", [arg]);
    return this;
  }
}

export class BooleanValidator
  implements BaseValidator<ZodType<Boolean>, boolean>
{
  _schema: ZodBoolean;

  constructor(public required: boolean = false) {
    this._schema = z.boolean();
  }

  public get schema() {
    return this.required ? this._schema : this._schema.optional();
  }

  public addValidation(
    type: ValidationTypes<ZodBoolean>,
    args: unknown[] = []
  ) {
    const validation = {
      type,
      args,
    };

    // @ts-expect-error
    this._schema = this._schema[validation.type]?.(...validation.args);
  }

  public validate(value: unknown) {
    return this._schema.parse(value);
  }
}

export class NumberValidator implements BaseValidator<ZodType<Number>, number> {
  _schema: ZodNumber;

  constructor(public required: boolean = false) {
    this._schema = z.number();
  }

  public get schema(): MaybeOptionalZodType<ZodNumber> {
    return this.required ? this._schema : this._schema.optional();
  }

  public addValidation(type: ValidationTypes<ZodNumber>, args: unknown[] = []) {
    const validation = {
      type,
      args,
    };

    // @ts-expect-error
    this._schema = this._schema[validation.type]?.(...validation.args);
  }

  public validate(value: unknown) {
    return this._schema.parse(value);
  }

  public Gt(compare: number): Omit<this, "Gt"> {
    this.addValidation("gt", [compare]);
    return this;
  }

  public Gte(compare: number): Omit<this, "Gte"> {
    this.addValidation("gte", [compare]);
    return this;
  }

  public Lt(compare: number): Omit<this, "Lt"> {
    this.addValidation("lt", [compare]);
    return this;
  }

  public Lte(compare: number): Omit<this, "Lte"> {
    this.addValidation("lte", [compare]);
    return this;
  }

  public Int(): Omit<this, "Int"> {
    this.addValidation("int", []);
    return this;
  }

  public Positive(): Omit<this, "Positive"> {
    this.addValidation("positive", []);
    return this;
  }

  public NonPositive(): Omit<this, "NonPositive"> {
    this.addValidation("nonpositive", []);
    return this;
  }

  public Negative(): Omit<this, "Negative"> {
    this.addValidation("negative", []);
    return this;
  }

  public NonNegative(): Omit<this, "NonNegative"> {
    this.addValidation("nonnegative", []);
    return this;
  }
}

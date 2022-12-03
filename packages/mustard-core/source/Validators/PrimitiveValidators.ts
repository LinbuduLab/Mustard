import { z } from "zod";
import type { ZodType, ZodBoolean, ZodNumber, ZodString } from "zod";
import { ValidationTypes } from "../Typings/Shared.struct";
import { BaseValidator, MaybeOptionalZodType, ValidationItem } from "./Typings";

export class StringValidator implements BaseValidator<ZodType<String>, string> {
  _schema: ZodString;

  constructor(private required: boolean = false) {
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
}

export class BooleanValidator
  implements BaseValidator<ZodType<Boolean>, boolean>
{
  _schema: ZodBoolean;

  constructor(private required: boolean = false) {
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

    this._schema = this._schema[validation.type]?.(...validation.args);
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

  public addValidation(type: ValidationTypes<ZodNumber>, args: unknown[] = []) {
    const validation = {
      type,
      args,
    };

    this._schema = this._schema[validation.type]?.(...validation.args);
  }

  public validate(value: unknown) {
    return this._schema.parse(value);
  }
}

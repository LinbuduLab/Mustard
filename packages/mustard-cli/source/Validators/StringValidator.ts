import { z } from "zod";

import type { ZodType, ZodString } from "zod";

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

  public URL(): Omit<this, "URL"> {
    this.addValidation("url", []);
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

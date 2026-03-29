import { z } from "zod";

import type { ZodDate } from "zod";
import type { BaseValidator, MaybeOptionalZodType } from "./Typings";
import type { ValidationTypes } from "../Typings/Shared.struct";

export class DateValidator implements BaseValidator<ZodDate, Date> {
  _schema: ZodDate;

  constructor(private required: boolean = false) {
    this._schema = z.date();
  }

  public get schema(): MaybeOptionalZodType<ZodDate> {
    return this.required ? this._schema : this._schema.optional();
  }

  public addValidation(type: ValidationTypes<ZodDate>, args: unknown[] = []) {
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

  public Min(date: Date): Omit<this, "Min"> {
    this.addValidation("min", [date]);
    return this;
  }

  public Max(date: Date): Omit<this, "Max"> {
    this.addValidation("max", [date]);
    return this;
  }
}

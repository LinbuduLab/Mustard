import { z } from "zod";

import type { ZodType, ZodBoolean } from "zod";

import type { BaseValidator, MaybeOptionalZodType } from "./Typings.js";
import type { ValidationTypes } from "../Typings/Shared.struct.js";

export class BooleanValidator
  implements BaseValidator<ZodType<Boolean>, boolean>
{
  _schema: ZodBoolean;

  constructor(public required: boolean = false) {
    this._schema = z.boolean();
  }

  public get schema(): MaybeOptionalZodType<ZodBoolean> {
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

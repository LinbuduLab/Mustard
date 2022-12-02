import { Dictionary } from "source/Typings/Shared.struct";
import { ZodNativeEnum, z } from "zod";
import { MaybeOptionalZodType } from "./Typings";

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

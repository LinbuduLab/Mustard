import type {
  z,
  ZodString,
  ZodNumber,
  ZodBoolean,
  ZodNativeEnum,
  ZodType,
  ZodOptional,
} from "zod";
import type { Dictionary, ValidationTypes } from "../Typings/Shared.struct";

export type AvaliableSchemaValidations =
  | keyof typeof z
  | keyof ZodString
  | keyof ZodNumber
  | keyof ZodBoolean
  | keyof ZodNativeEnum<Dictionary<string>>;

export type ValidationItem<
  TTypes extends AvaliableSchemaValidations = AvaliableSchemaValidations
> = {
  type: TTypes;
  args: unknown[];
};

export type MaybeOptionalZodType<T extends ZodType<unknown>> =
  | T
  | ZodOptional<T>;

export abstract class BaseValidator<
  TValidationType extends ZodType,
  TParsedType extends unknown
> {
  _schema!: TValidationType;

  constructor(required: boolean) {}

  abstract get schema(): MaybeOptionalZodType<TValidationType>;

  abstract validate(value: unknown): TParsedType;

  abstract addValidation(
    type: ValidationTypes<TValidationType>,
    args?: unknown[]
  ): void;
}

import { Dictionary } from "source/Types/Shared.struct";
import {
  z,
  ZodString,
  ZodNumber,
  ZodBoolean,
  ZodNativeEnum,
  ZodType,
  ZodOptional,
} from "zod";

export type AvaliableSchemaValidations =
  | keyof typeof z
  | keyof ZodString
  | keyof ZodNumber
  | keyof ZodBoolean
  | keyof ZodNativeEnum<Dictionary<string>>;

export type ValidationItem = {
  type: AvaliableSchemaValidations;
  args?: unknown[];
};

export type MaybeOptionalZodType<T extends ZodType<unknown>> =
  | T
  | ZodOptional<T>;

export abstract class BaseValidator<
  TValidationType extends ZodType,
  TParsedType extends unknown
> {
  _schema: TValidationType;

  constructor(required: boolean) {}

  abstract get schema(): TValidationType;

  abstract validate(value: unknown): TParsedType;

  abstract addValidation(type: keyof TValidationType, args?: unknown[]): void;
}

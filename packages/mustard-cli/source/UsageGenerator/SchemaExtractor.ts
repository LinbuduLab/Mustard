import { z } from "zod";

import type { Nullable } from "../Typings/Shared.struct.js";

export interface ConstraintCheck {
  kind: string;
  value?: string;
}

export type OptionConstraintType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "enum"
  | "unknown";

export interface OptionConstraints {
  required: boolean;

  type: OptionConstraintType;

  checks: Array<z.ZodStringCheck | z.ZodNumberCheck>;
}

export class SchemaExtractor {
  public static mapZodTypeName(
    typeName: z.ZodFirstPartyTypeKind
  ): OptionConstraintType {
    switch (typeName) {
      case "ZodString":
        return "string";
      case "ZodNumber":
        return "number";
      case "ZodBoolean":
        return "boolean";
      case "ZodDate":
        return "date";
      case "ZodUnknown":
        return "unknown";
      default:
        return "unknown";
    }
  }

  public static parseSchemaConstraints(
    schema?: z.Schema
  ): Nullable<OptionConstraints> {
    if (!schema) return null;

    const required = !schema.isOptional();

    const internalSchema: z.ZodType =
      schema instanceof z.ZodOptional ? schema.unwrap() : schema;

    if (
      internalSchema instanceof z.ZodString ||
      internalSchema instanceof z.ZodNumber
    ) {
      const type = SchemaExtractor.mapZodTypeName(internalSchema._def.typeName);
      const checks = internalSchema._def.checks;

      return {
        type,
        checks,
        required,
      };
    }

    if (internalSchema instanceof z.ZodBoolean) {
      return {
        type: "boolean",
        checks: [],
        required,
      };
    }

    if (internalSchema instanceof z.ZodDate) {
      return {
        type: "date",
        checks: [],
        required,
      };
    }

    return null;
  }
}

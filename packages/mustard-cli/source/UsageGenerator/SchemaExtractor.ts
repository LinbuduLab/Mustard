import { z } from "zod";

import type { Nullable } from "../Typings/Shared.struct.js";

export type OptionConstraintType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "enum"
  | "unknown";

export interface CheckDef {
  check: string;
  [key: string]: unknown;
}

export interface OptionConstraints {
  required: boolean;
  type: OptionConstraintType;
  checks: CheckDef[];
}

const TYPE_MAP: Record<string, OptionConstraintType> = {
  string: "string",
  number: "number",
  boolean: "boolean",
  date: "date",
};

export class SchemaExtractor {
  public static mapDefType(defType: string): OptionConstraintType {
    return TYPE_MAP[defType] ?? "unknown";
  }

  public static toJSONSchema(schema: z.ZodType) {
    return z.toJSONSchema(schema);
  }

  private static extractChecks(schema: z.ZodType): CheckDef[] {
    const rawChecks: unknown[] | undefined = (
      schema as unknown as { _zod: { def: { checks?: unknown[] } } }
    )._zod?.def?.checks;

    if (!Array.isArray(rawChecks)) return [];

    return rawChecks
      .map((c) => (c as { _zod?: { def?: CheckDef } })._zod?.def)
      .filter((def): def is CheckDef => def != null);
  }

  public static parseSchemaConstraints(
    schema?: z.ZodType,
  ): Nullable<OptionConstraints> {
    if (!schema) return null;

    const required = !schema.isOptional();

    const internalSchema =
      schema instanceof z.ZodOptional ? schema.unwrap() : schema;

    if (
      internalSchema instanceof z.ZodString ||
      internalSchema instanceof z.ZodNumber
    ) {
      return {
        type: SchemaExtractor.mapDefType(internalSchema._zod.def.type),
        checks: SchemaExtractor.extractChecks(internalSchema),
        required,
      };
    }

    if (internalSchema instanceof z.ZodBoolean) {
      return { type: "boolean", checks: [], required };
    }

    if (internalSchema instanceof z.ZodDate) {
      return { type: "date", checks: [], required };
    }

    return null;
  }
}

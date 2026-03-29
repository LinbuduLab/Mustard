// @ts-nocheck
import { z } from "zod";

interface OptionConstraints {
  required: boolean;
  type: "string" | "number" | "boolean" | "enum" | "unknown";
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  int?: true;
  enumValues?: readonly string[];
}

export class SchemaExtractor {
  public static extractOptionConstraints(
    schema?: z.ZodTypeAny
  ): OptionConstraints | null {
    if (!schema) return null;
    const required = !schema.isOptional();
    const baseSchema =
      schema instanceof z.ZodOptional ? schema.unwrap() : schema;
    if (baseSchema instanceof z.ZodString) {
      const checks = baseSchema._def.checks;

      console.log(checks);

      const min = checks.find((check) => check.kind === "min");
      const max = checks.find((check) => check.kind === "max");
      return {
        required,
        type: "string",
        minLength: min?.value,
        maxLength: max?.value,
      };
    }
    if (baseSchema instanceof z.ZodNumber) {
      const checks = baseSchema._def.checks;
      const gte = checks.find((check) => check.kind === "min");
      const lte = checks.find((check) => check.kind === "max");
      const isInt = checks.some((check) => check.kind === "int");
      return {
        required,
        type: "number",
        min: gte?.value,
        max: lte?.value,
        int: isInt ? true : undefined,
      };
    }
    if (baseSchema instanceof z.ZodBoolean) {
      return { required, type: "boolean" };
    }
    if (baseSchema instanceof z.ZodNativeEnum) {
      return {
        required,
        type: "enum",
        enumValues: Object.values(baseSchema._def.values).filter(
          (v): v is string => typeof v === "string"
        ),
      };
    }
    return { required, type: "unknown" };
  }
}

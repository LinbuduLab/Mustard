import { z } from "zod";

import type { ClassFieldDecoratorImpl } from "../Typings/Decorator.struct.js";
import { MustardInternalUtils } from "../Utils/Utils.js";
import { SchemaExtractor } from "../UsageGenerator/SchemaExtractor.js";

export class SchemaDecorators {
  public static Schema(zodSchema: z.ZodSchema): ClassFieldDecoratorImpl {
    return (_, context) => {
      MustardInternalUtils.createContextInitializer(
        context,
        "schema",
        zodSchema,
      );

      const schema = SchemaExtractor.toJSONSchema(zodSchema);

      const validate = zodSchema.safeParse("f");
      console.log("04-03 validate: ", validate);

      const pretty = z.prettifyError(validate.error!);
      console.log("04-03 pretty: ", pretty);

      return (initValue) => initValue;
    };
  }
}

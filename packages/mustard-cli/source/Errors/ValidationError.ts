import { z } from "zod";
import chalk from "chalk";

import type { ZodInvalidTypeIssue } from "zod";

export class ValidationError extends Error {
  public name = "ValidationError";

  constructor(
    private argName: string,
    private ageValue: unknown,
    private error: z.ZodError
  ) {
    super();
  }

  get message(): string {
    return ValidationError.format(this.argName, this.ageValue, this.error);
  }

  public static format(argName: string, ageValue: unknown, error: z.ZodError) {
    const issue = error.issues[0];

    const { expected, received, message } = <ZodInvalidTypeIssue>issue;

    if (expected && received) {
      return `Invalid input for argument '${argName}', expected: ${chalk.green(
        expected
      )}, received: ${chalk.yellow(received)}`;
    } else {
      return message ?? `Invalid input for argument '${argName}`;
    }
  }
}

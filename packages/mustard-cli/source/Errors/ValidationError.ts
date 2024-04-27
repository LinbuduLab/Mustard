import { z } from "zod";
import picocolors from "picocolors";

import type { ZodInvalidTypeIssue } from "zod";

export class ValidationError extends Error {
  public name = "ValidationError";

  constructor(
    private invalidOptionName: string,
    private invalidOptionValue: unknown,
    private msg: string
  ) {
    super();
    this.stack = undefined;
  }

  get message(): string {
    return picocolors.yellow(
      `Invalid input for option ${picocolors.bold(this.invalidOptionName)}`
    );
  }

  public static formatError(argName: string, error: z.ZodError) {
    const issue = error.issues[0];

    const { expected, received, message } = <ZodInvalidTypeIssue>issue;

    if (expected && received) {
      return `Invalid input for argument '${argName}', expected: ${picocolors.green(
        expected
      )}, received: ${picocolors.yellow(received)}`;
    } else {
      return message ?? `Invalid input for argument '${argName}`;
    }
  }
}

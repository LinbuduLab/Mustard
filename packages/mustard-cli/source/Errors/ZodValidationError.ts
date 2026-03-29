import { z } from "zod";
import chalk from "chalk";

import { MustardError } from "../Typings/MustardError.struct";

import type { ZodInvalidTypeIssue } from "zod";

export class ValidationError extends MustardError implements MustardError {
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
    return chalk.yellow(
      `Invalid input for option ${chalk.bold(this.invalidOptionName)}`
    );
  }

  get messageForAgent() {
    return ``;
  }

  public static formatError(argName: string, error: z.ZodError) {
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

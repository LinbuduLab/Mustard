import chalk from "chalk";
import { z, ZodInvalidTypeIssue } from "zod";

export class ValidationErrorFormatter {
  public static format(argName: string, ageValue: unknown, error: z.ZodError) {
    const issue = error.issues[0];

    const { expected, received } = <ZodInvalidTypeIssue>issue;

    return `Invalid input for argument ${argName}, expected: ${chalk.green(
      expected
    )}, received: ${chalk.yellow(received)}`;
  }
}

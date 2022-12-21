import type { Arguments } from "yargs-parser";

export class CommandNotFoundError extends Error {
  public name = "CommandNotFoundError";

  constructor(private parsedArgs: Arguments) {
    super();
  }

  get message(): string {
    return `Command not found with parsed args: ${JSON.stringify(
      this.parsedArgs,
      null,
      2
    )}`;
  }
}

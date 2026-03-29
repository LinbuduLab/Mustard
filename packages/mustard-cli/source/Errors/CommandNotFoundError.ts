import { MustardError } from "../Typings/MustardError.struct";

import type { Arguments } from "yargs-parser";

export class CommandNotFoundError extends MustardError implements MustardError {
  public name = "CommandNotFoundError";

  constructor(private parsedArgs: Arguments) {
    super();
  }

  get message() {
    return `Command not found with parsed args: ${JSON.stringify(
      this.parsedArgs,
      null,
      2
    )}`;
  }

  get messageForAgent() {
    return ``;
  }
}

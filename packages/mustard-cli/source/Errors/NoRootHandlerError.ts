import { MustardError } from "../Typings/MustardError.struct.js";

export class NoRootHandlerError extends MustardError implements MustardError {
  public name = "NoRootHandlerError";

  constructor() {
    super();
  }

  get message(): string {
    return `No root handler found, please provide command decorated with '@RootCommand' or enable option enableUsage for usage info generation.`;
  }

  get messageForAgent() {
    return ``;
  }
}

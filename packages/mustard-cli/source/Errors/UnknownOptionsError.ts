import { MustardError } from "../Typings/MustardError.struct.js";

export class UnknownOptionsError extends MustardError implements MustardError {
  public name = "UnknownOptionsError";

  constructor(private unknownOptions: string[]) {
    super();
  }

  get message(): string {
    return `Unknown options: ${this.unknownOptions.join(
      ", "
    )}. See --help for usage.`;
  }

  get messageForAgent() {
    return ``;
  }
}

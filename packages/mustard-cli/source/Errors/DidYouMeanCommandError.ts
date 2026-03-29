import { MustardError } from "../Typings/MustardError.struct";

export class DidYouMeanCommandError
  extends MustardError
  implements MustardError
{
  public name = "DidYouMeanCommandError";

  constructor(private unknownCommand: string, private didYouMean: string) {
    super();
  }

  get message(): string {
    return `Unknown command ${this.unknownCommand}, did you mean ${this.didYouMean}?`;
  }

  get messageForAgent() {
    return ``;
  }
}

import { MustardError } from "../Typings/MustardError.struct";

export class DidYouMeanOptionError
  extends MustardError
  implements MustardError
{
  public name = "DidYouMeanOptionError";

  constructor(private unknownOption: string, private didYouMean: string) {
    super();
  }

  get message(): string {
    return `Unknown option --${this.unknownOption}, did you mean --${this.didYouMean}?`;
  }

  get messageForAgent() {
    return ``;
  }
}

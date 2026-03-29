import { MustardError } from "../Typings/MustardError.struct";

export class MissingRequiredOptionError
  extends MustardError
  implements MustardError
{
  public name = "MissingRequiredOptionError";

  constructor() {
    super();
  }

  get message() {
    return ``;
  }

  get messageForAgent() {
    return ``;
  }
}

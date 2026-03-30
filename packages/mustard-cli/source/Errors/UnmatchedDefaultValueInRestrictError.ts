import { MustardError } from "../Typings/MustardError.struct.js";

export class UnmatchedDefaultValueInRestrictError
  extends MustardError
  implements MustardError
{
  public name = "UnmatchedDefaultValueInRestrictError";

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

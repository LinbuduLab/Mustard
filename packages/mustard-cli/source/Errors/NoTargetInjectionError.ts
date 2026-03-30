import { MustardError } from "../Typings/MustardError.struct.js";

export class NoTargetInjectionError
  extends MustardError
  implements MustardError
{
  public name = "NoTargetInjectionError";

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

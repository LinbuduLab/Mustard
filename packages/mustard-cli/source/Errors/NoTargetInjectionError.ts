import { MustardError } from "../Typings/MustardError.struct";

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

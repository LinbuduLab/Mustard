import { MustardError } from "../Typings/MustardError.struct";

import type { ClassStruct } from "../Typings/Shared.struct";

export class MultipleRootCommandError
  extends MustardError
  implements MustardError
{
  public name = "MultipleRootCommandError";

  constructor(
    private existClass: ClassStruct,
    private incomingClass: ClassStruct
  ) {
    super();
  }

  get message(): string {
    return `Multiple root command detected, RootCommand ${this.existClass.name} was already registered, and now ${this.incomingClass.name} is also registered as root command`;
  }

  get messageForAgent() {
    return ``;
  }
}

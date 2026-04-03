import { MustardError } from "../Typings/MustardError.struct.js";

import type { ClassStruct } from "../Typings/Shared.struct.js";

export class MultipleRootCommandError
  extends MustardError
  implements MustardError
{
  public name = "MultipleRootCommandError";

  constructor(
    private existingClass: ClassStruct,
    private incomingClass: ClassStruct,
  ) {
    super();
  }

  get message(): string {
    return `Multiple root command detected, RootCommand ${this.existingClass.name} was already registered, and now ${this.incomingClass.name} is also registered as root command`;
  }

  get messageForAgent() {
    return ``;
  }
}

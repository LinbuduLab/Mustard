import type { ClassStruct } from "../Typings/Shared.struct";

export class MultiRootCommandError extends Error {
  public name = "MultiRootCommandError";

  constructor(
    private existClass: ClassStruct,
    private incomingClass: ClassStruct
  ) {
    super();
  }

  get message(): string {
    return `Multiple root command detected, RootCommand ${this.existClass.name} was already registered, and now ${this.incomingClass.name} is also registered as root command`;
  }
}

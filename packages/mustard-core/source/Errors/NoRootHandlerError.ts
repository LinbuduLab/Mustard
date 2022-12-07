export class NoRootHandlerError extends Error {
  public name = "NoRootHandlerError";

  constructor() {
    super();
  }

  get message(): string {
    return `No root handler found, please provide command decorated with '@RootCommand' or enable option enableUsage for usage info generation.`;
  }
}

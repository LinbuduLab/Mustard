export class NullishFactoryOptionError extends Error {
  public name = "NullishFactoryOptionError";

  constructor() {
    super();
  }

  get message(): string {
    return `Mustard factory option not initialized, use @App to initialize entry class`;
  }
}

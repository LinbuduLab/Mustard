export class NullishAppFactoryOptionError extends Error {
  public name = "NullishAppFactoryOptionError";

  constructor() {
    super();
  }

  get message(): string {
    return `Mustard factory option not initialized, use @App to initialize entry class`;
  }
}

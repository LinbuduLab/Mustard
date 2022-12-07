export class UnknownOptionsError extends Error {
  public name = "UnknownOptionsError";

  constructor(private unknownOptions: string[]) {
    super();
  }

  get message(): string {
    return `Unknown options: ${this.unknownOptions.join(
      ", "
    )}. See --help for usage.`;
  }
}

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

export class DidYouMeanError extends Error {
  public name = "DidYouMeanError";

  constructor(private unknownOption: string, private didYouMean: string) {
    super();
  }

  get message(): string {
    return `Unknown option --${this.unknownOption}, did you mean --${this.didYouMean}?`;
  }
}

export abstract class MustardError extends Error {
  public name = "MustardError";

  abstract get message(): string;

  abstract get messageForAgent(): string;
}

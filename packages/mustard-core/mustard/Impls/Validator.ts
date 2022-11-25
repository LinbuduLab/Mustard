export class ValidatorFactory {
  // Omit from return type
  public Required() {
    return this;
  }

  public String() {
    return this;
  }

  public MinLength(len: number) {
    return this;
  }

  public MaxLength(len: number) {
    return this;
  }
}
export const Validator = new ValidatorFactory();

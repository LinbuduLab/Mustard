import { MustardError } from "../Typings/MustardError.struct";

export class NullishAppFactoryOptionError
  extends MustardError
  implements MustardError
{
  public name = "NullishAppFactoryOptionError";

  constructor() {
    super();
  }

  get message(): string {
    return `Mustard factory option not initialized, use @App to initialize entry class`;
  }

  get messageForAgent() {
    return ``;
  }
}

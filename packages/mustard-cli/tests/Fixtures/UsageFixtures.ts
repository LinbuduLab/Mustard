import { MustardFactory, Context, MustardUtils } from "../../Exports";
import {
  Command,
  RootCommand,
  Option,
  VariadicOption,
  App,
  Ctx,
  Input,
  Inject,
  Utils,
  Options,
} from "../../Exports/Decorators";
import { Validator } from "../../Exports/Validator";
import { CommandStruct, MustardApp } from "../../Exports/ComanndLine";

@RootCommand()
export class RootCommandHandle implements CommandStruct {
  @Option("d")
  public msg = "default value of msg";

  public run(): void {
    console.log("Root Command! ", this.msg);
  }
}

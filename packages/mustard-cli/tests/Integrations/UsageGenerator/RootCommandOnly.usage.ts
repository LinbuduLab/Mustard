import { MustardFactory } from "../../../Exports/index";
import {
  RootCommand,
  Option,
  VariadicOption,
  App,
  Input,
  Options,
} from "../../../Exports/Decorators";
import { CommandStruct } from "../../../Exports/ComanndLine";

@RootCommand()
class RootCommandHandle implements CommandStruct {
  @Option("msg", "m")
  public msg = "default value of msg";

  @Option()
  public notice = "default value of notice";

  @VariadicOption({ alias: "p" })
  public projects: string[] = [];

  @Input("description of inputs")
  public these_are_inputs: string;

  @Options()
  public options: unknown;

  public run(): void {}
}

@App({
  name: "mm",
  commands: [RootCommandHandle],
})
class Project {}

MustardFactory.init(Project).start();

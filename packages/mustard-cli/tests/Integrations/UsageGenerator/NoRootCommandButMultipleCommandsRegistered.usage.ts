import { MustardFactory } from "../../../Exports/index";
import {
  RootCommand,
  Option,
  VariadicOption,
  App,
  Input,
  Options,
  Command,
} from "../../../Exports/Decorators";
import { CommandStruct } from "../../../Exports/ComanndLine";

@Command("update", "u", "update command")
class UpdateCommandHandle implements CommandStruct {
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

@Command("sync", "s", "sync command")
class SyncCommandHandle implements CommandStruct {
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
  commands: [UpdateCommandHandle, SyncCommandHandle],
})
class Project {}

MustardFactory.init(Project).start();

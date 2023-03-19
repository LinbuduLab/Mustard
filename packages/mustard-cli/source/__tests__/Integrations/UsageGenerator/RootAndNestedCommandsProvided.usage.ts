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

@Command("account", "a", "update account commandxxx")
class UpdateAccountCommandHandle implements CommandStruct {
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

@Command("sys", "s", "update sys command")
class UpdateSysCommandHandle implements CommandStruct {
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

@Command("update", "u", "update command", [
  UpdateAccountCommandHandle,
  UpdateSysCommandHandle,
])
class UpdateCommandHandle implements CommandStruct {
  @Option("msg", "m")
  public msg = "default value of msg";

  @Option()
  public notice = "default value of notice";

  @VariadicOption({ alias: "p", description: "description of projects" })
  public projects: string[] = [];

  @Input("description of inputs")
  public these_are_inputs: string;

  @Options()
  public options: unknown;

  public run(): void {}
}

@App({
  name: "mm",
  commands: [
    RootCommandHandle,
    UpdateCommandHandle,
    UpdateAccountCommandHandle,
    UpdateSysCommandHandle,
  ],
})
class Project {}

MustardFactory.init(Project).start();

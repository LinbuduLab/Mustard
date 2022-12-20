import { MustardFactory } from "../../../Exports";
import {
  Command,
  RootCommand,
  Option,
  VariadicOption,
  App,
  Input,
  Options,
} from "../../../Exports/Decorators";
import { CommandStruct, MustardApp } from "../../../Exports/ComanndLine";

@Command("run")
class RunCommandHandle implements CommandStruct {
  @Option("msg", "m")
  public msg = "default value of msg";

  @VariadicOption({ alias: "p" })
  public projects: string[] = [];

  @Input()
  public inputs: string;

  @Options()
  public options: unknown;

  public run(): void {
    console.log(`--msg option: ${this.msg}`);

    console.log(`--projects option: ${this.projects.join(",")}`);

    console.log(`inputs: ${this.inputs}`);

    console.log(`options: ${JSON.stringify(this.options)}`);
  }
}

@Command("node", "n")
class UpdateDepNodeCommandHandle implements CommandStruct {
  public run(): void {}
}

@Command("dep", "d", [UpdateDepNodeCommandHandle])
class UpdateDepCommandHandle implements CommandStruct {
  public run(): void {}
}

@Command("sys", "s", [])
class UpdateSysCommandHandle implements CommandStruct {
  public run(): void {}
}

@Command("update", "u", [UpdateDepCommandHandle, UpdateSysCommandHandle])
class UpdateCommandHandle implements CommandStruct {
  public run(): void {}
}

@App({
  name: "LinbuduLab CLI",
  commands: [
    RunCommandHandle,
    UpdateCommandHandle,
    UpdateDepCommandHandle,
    UpdateSysCommandHandle,
    UpdateDepNodeCommandHandle,
  ],
  configurations: {
    allowUnknownOptions: true,
  },
  providers: [],
})
class Project implements MustardApp {
  onStart() {}

  onComplete() {}
}

MustardFactory.init(Project).start();

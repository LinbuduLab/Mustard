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

@RootCommand()
class RootCommandHandle implements CommandStruct {
  @Option()
  public pure = "default value of pure";

  @Option("msg")
  public msgOption = "default value of msg";

  @Input()
  public inputs: string;

  @Options()
  public options: unknown;

  public run(): void {
    console.log("Root Command");

    console.log(`--pure option: ${this.pure}`);

    console.log(`--msg option: ${this.msgOption}`);

    console.log(`inputs: ${JSON.stringify(this.inputs)}`);

    console.log(`options: ${JSON.stringify(this.options)}`);
  }
}

@Command("run", "r")
class RunCommandHandle implements CommandStruct {
  @Option()
  public pure = "default value of pure";

  @Option("msg")
  public msgOption = "default value of msg";

  @Input()
  public inputs: string;

  @Options()
  public options: unknown;

  public run(): void {
    console.log("Run Command");

    console.log(`--pure option: ${this.pure}`);

    console.log(`--msg option: ${this.msgOption}`);

    console.log(`inputs: ${JSON.stringify(this.inputs)}`);

    console.log(`options: ${JSON.stringify(this.options)}`);
  }
}

@Command("node", "n")
class UpdateDepNodeCommandHandle implements CommandStruct {
  @Option()
  public pure = "default value of pure";

  @Option("msg")
  public msgOption = "default value of msg";

  @Input()
  public inputs: string;

  @Options()
  public options: unknown;

  public run(): void {
    console.log("Update Dep Node Command");

    console.log(`--pure option: ${this.pure}`);

    console.log(`--msg option: ${this.msgOption}`);

    console.log(`inputs: ${JSON.stringify(this.inputs)}`);

    console.log(`options: ${JSON.stringify(this.options)}`);
  }
}

@Command("dep", "d", [UpdateDepNodeCommandHandle])
class UpdateDepCommandHandle implements CommandStruct {
  @Option()
  public pure = "default value of pure";

  @Option("msg")
  public msgOption = "default value of msg";

  @Input()
  public inputs: string;

  @Options()
  public options: unknown;

  public run(): void {
    console.log("Update Dep Command");

    console.log(`--pure option: ${this.pure}`);

    console.log(`--msg option: ${this.msgOption}`);

    console.log(`inputs: ${JSON.stringify(this.inputs)}`);

    console.log(`options: ${JSON.stringify(this.options)}`);
  }
}

@Command("sys", "s", [])
class UpdateSysCommandHandle implements CommandStruct {
  @Option()
  public pure = "default value of pure";

  @Option("msg")
  public msgOption = "default value of msg";

  @Input()
  public inputs: string;

  @Options()
  public options: unknown;

  public run(): void {
    console.log("Update Sys Command");

    console.log(`--pure option: ${this.pure}`);

    console.log(`--msg option: ${this.msgOption}`);

    console.log(`inputs: ${JSON.stringify(this.inputs)}`);

    console.log(`options: ${JSON.stringify(this.options)}`);
  }
}

@Command("update", "u", [UpdateDepCommandHandle, UpdateSysCommandHandle])
class UpdateCommandHandle implements CommandStruct {
  @Option("msg")
  public msg = "default value of msg";

  @Input()
  public inputs: string;

  @Options()
  public options: unknown;

  public run(): void {
    console.log("Update Command");

    console.log(`--msg option: ${this.msg}`);

    console.log(`inputs: ${JSON.stringify(this.inputs)}`);

    console.log(`options: ${JSON.stringify(this.options)}`);
  }
}

@App({
  name: "LinbuduLab CLI",
  commands: [
    RootCommandHandle,
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

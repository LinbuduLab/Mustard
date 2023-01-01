import { MustardFactory } from "../../../Exports";
import {
  RootCommand,
  Option,
  App,
  Input,
  Options,
} from "../../../Exports/Decorators";
import { CommandStruct, MustardApp } from "../../../Exports/ComanndLine";

@RootCommand()
class RootCommandHandle1 implements CommandStruct {
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
@RootCommand()
class RootCommandHandle2 implements CommandStruct {
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

@App({
  name: "LinbuduLab CLI",
  commands: [RootCommandHandle1, RootCommandHandle2],
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

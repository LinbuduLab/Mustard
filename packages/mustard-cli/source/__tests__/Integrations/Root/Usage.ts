import { MustardFactory } from "../../../Exports";
import {
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

@App({
  name: "LinbuduLab CLI",
  commands: [RootCommandHandle],
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

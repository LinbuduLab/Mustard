import { MustardFactory, Context, MustardUtils } from "../../../Exports";
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
} from "../../../Exports/Decorators";
import { Validator } from "../../../Exports/Validator";
import { CommandStruct, MustardApp } from "../../../Exports/ComanndLine";

@RootCommand()
class RootCommandHandle implements CommandStruct {
  @Option()
  public msg = "default value of msg";

  @VariadicOption()
  public projects: string[] = [];

  @Input()
  public inputs: string;

  public run(): void {
    console.log(
      `Root command with msg option: ${this.msg}, projects option: ${this.projects}, inputs: ${this.inputs}`
    );
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

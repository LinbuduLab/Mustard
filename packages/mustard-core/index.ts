import {
  Command,
  RootCommand,
  Option,
  Options,
  Context,
  Input,
  VariadicOption,
  Utils,
} from "./source/Exports/Decorators";
import { CLI, CommandStruct } from "./source/Exports/ComanndLine";
import { Validator } from "./source/Exports/Validator";

@Command("sync")
class RunSyncCommand implements CommandStruct {
  @Option("dry")
  public dryOption;

  @Input()
  public input;

  static usage() {
    return `run sync --dry`;
  }

  public run(): void {
    console.log("Nested! ", this.dryOption);
    console.log("this.input: ", this.input);
  }
}

@Command("run", "r", "run command", [RunSyncCommand])
class RunCommand implements CommandStruct {
  static usage() {
    return `run xxx --dry`;
  }

  // @Option("dry", "d")
  @Option("dry", Validator.Boolean())
  public dryOption;

  @VariadicOption("arr")
  public arrayOption;

  @Options()
  public allOptions;

  @Context()
  public context;

  @Input()
  public input;

  @Utils()
  public utils;

  public run(): void {
    console.log("this.arrayOption: ", this.arrayOption);
    console.log("this.input: ", this.input);
    // console.log("this.utils: ", this.utils);
    console.log("this.context: ", this.context);
    console.log("Hello World! ", this.dryOption);
    console.log("All Options! ", this.allOptions);
  }
}

@Command("check")
class CheckCommand {
  @Option("dry")
  public dry;

  static usage() {
    return `check --dry`;
  }

  public run(): void {
    console.log("Check Command! ", this.dry);
  }
}

@RootCommand()
class RootCommandHandle {
  @Option("dry", "dry option")
  public dry = "default value of dry";

  static usage() {
    return `x-cli --dry`;
  }

  public run(): void {
    console.log("Root Command! ", this.dry);
  }
}

const cli = new CLI("LinbuduLab CLI", [RootCommandHandle, RunCommand]);

cli.registerCommand([CheckCommand]);

cli.start();

cli.configure({});

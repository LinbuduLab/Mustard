#!/usr/bin/env node
import {
  Command,
  RootCommand,
  Option,
  Options,
  Input,
  VariadicOption,
  Utils,
  App,
} from "./source/Exports/Decorators";
import { CommandStruct, MustardApp } from "./source/Exports/ComanndLine";
import { Validator } from "./source/Exports/Validator";
import { MustardFactory, MustardUtils } from "./source/Exports";

@Command("git")
class RunSyncGitCommand implements CommandStruct {
  @Option("dry")
  public dryOption: boolean;

  @Input()
  public input: string[];

  static usage() {
    return `run sync --dry`;
  }

  public run(): void {
    console.log("Nested! ", this.dryOption);
    console.log("this.input: ", this.input);
  }
}

@Command("sync", "s", "run sync command", [RunSyncGitCommand])
class RunSyncCommand implements CommandStruct {
  @Option("dry")
  public dryOption: boolean;

  @Input()
  public input: string[];

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
  @Option("dry", "d", Validator.Number())
  public dryOption: boolean;

  // @VariadicOption("arr")
  // public arrayOption: unknown[];

  // @VariadicOption()
  // public variadic: unknown[];

  @Options()
  public allOptions: unknown[];

  // @Input()
  // public input: unknown[];

  // @Utils()
  // public utils: MustardUtils;

  public run(): void {
    // console.log("this.arrayOption: ", this.arrayOption);
    // console.log("this.input: ", this.input);
    // console.log("this.utils: ", this.utils);
    console.log("Hello World! ", this.dryOption);
    console.log("All Options! ", this.allOptions);
  }
}

@Command("check")
class CheckCommand {
  @Option("dry")
  public dry: boolean;

  static usage() {
    return `check --dry`;
  }

  public run(): void {
    console.log("Check Command! ", this.dry);
  }
}

@RootCommand()
class RootCommandHandle implements CommandStruct {
  @Option("dry", "dry option")
  public dry = "default value of dry";

  static usage() {
    return `x-cli --dry`;
  }

  public run(): void {
    console.log("Root Command! ", this.dry);
  }
}

@App({
  name: "LinbuduLab CLI",
  commands: [RootCommandHandle, RunCommand],
})
class Project implements MustardApp {}

MustardFactory.init(Project).start();
import { Command, RootCommand, Option, Options } from "./Impls/Decorators";
import { CLI } from "./Impls/CommandLine";
import { BaseCommand } from "./Impls/BaseCommand";
import { CommandStruct } from "./Impls/types/Command.struct";
import { Validator } from "./Impls/Validator";

@Command("sync")
class RunSyncCommand extends BaseCommand implements CommandStruct {
  constructor() {
    super();
  }

  // @Option("dry", Validator.Required().String().MinLength(3).MaxLength(5))
  public dryOption;

  static usage() {
    return `run sync --dry`;
  }

  public run(): void {
    console.log("Nested! ", this.dryOption);
  }
}

@Command("run", "r")
class RunCommand extends BaseCommand implements CommandStruct {
  constructor() {
    super();
  }

  static usage() {
    return `run xxx --dry`;
  }

  // @Option("dry", "d")
  @Option("dry", Validator.Required().String().MinLength(3).MaxLength(5))
  public dryOption;

  @Options()
  public allOptions;

  public run(): void {
    console.log("Hello World! ", this.dryOption);
    console.log("All Options! ", this.allOptions);
  }
}

@Command("check")
class CheckCommand extends BaseCommand {
  constructor() {
    super();
  }

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
class RootCommandHandle extends BaseCommand {
  constructor() {
    super();
  }

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

/**
 * - nested commands support
 * - option description
 * - validator related
 */

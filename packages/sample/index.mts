import { createRequire } from "module";

import { MustardApp } from "mustard-cli";
import {
  Command,
  RootCommand,
  Option,
  VariadicOption,
  App,
  Input,
  Restrict,
  XOR,
} from "mustard-cli/decorator";
import { Validator } from "mustard-cli/validator";

import type { MustardCommand } from "mustard-cli/cli";

import path from "path";

const require = createRequire(import.meta.url);

@RootCommand()
class RootCommandHandle implements MustardCommand {
  @Option(
    "msg",
    "m",
    Validator.Required().String().Email().MinLength(5).EndsWith(".com")
  )
  public msg = "default value of msg";

  @Option("msg2", Validator.Number())
  public msg2 = "default value of msg";

  @Option("msg3", Validator.Boolean())
  public msg3 = false;

  @Option("msg4", Validator.Date())
  public msg4 = false;

  @VariadicOption("msg5")
  public msg5: string[] = [];

  @XOR()
  @Option("msg6")
  @Restrict(["foo", "bar", "baz"])
  public msg6: string = "foo";

  public run(): void {
    console.log(`Root command executed with: msg: ${this.msg}`);
  }
}

@Command("update", "u", "update project dependencies")
class UpdateCommand implements MustardCommand {
  @Option("depth", "depth of packages to update", Validator.Number().Gte(1))
  public depth = 10;

  @Option(Validator.Boolean())
  public dry = false;

  @Option({ name: "target", alias: "t" })
  public targetOption: string;

  @Input()
  public input: string[] = [];

  @VariadicOption()
  public packages: string[] = [];

  public run(): void {
    console.log(
      `Update command executed with: depth: ${this.depth}, dry: ${
        this.dry
      }, targetOption: ${this.targetOption}, input: ${JSON.stringify(
        this.input
      )}, packages: ${JSON.stringify(this.packages)}`
    );
  }
}

@Command("sync", "s", "sync project")
class SyncCommand implements MustardCommand {
  @Option("depth", "depth of packages to update", Validator.Number().Gte(1))
  public depth = 10;

  @Option(Validator.Boolean())
  public dry = false;

  @Option({ name: "target", alias: "t" })
  public targetOption: string;

  @Input()
  public input: string[] = [];

  @VariadicOption()
  public packages: string[] = [];

  public run(): void {}
}

@App({
  name: "create-mustard-app",
  commands: [RootCommandHandle, UpdateCommand, SyncCommand],
  configurations: {
    allowUnknownOptions: true,
    enableUsage: true,
    enableVersion: require(path.resolve("./package.json")).version,
  },
})
class SampleApp {}

MustardApp.start(SampleApp);

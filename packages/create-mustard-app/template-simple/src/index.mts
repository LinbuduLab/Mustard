import { createRequire } from "module";

import { MustardFactory, MustardUtils } from "mustard-cli";
import { RootCommand, Option, App, Utils, Input } from "mustard-cli/decorator";
import type { CommandStruct, MustardApp } from "mustard-cli/cli";

const require = createRequire(import.meta.url); // construct the require method

@RootCommand()
class RootCommandHandle implements CommandStruct {
  @Option("dry", "d", "dry run command to see what will happen")
  public dry = false;

  @Utils()
  public utils!: MustardUtils;

  @Input()
  public input: string = "default";

  public run(): void {
    console.log(
      "awesome-mustard-app",
      this.utils.colors.white(`v ${require("../package.json").version}\n`)
    );
    console.log(`Input: ${this.input}`);
  }
}

@App({
  name: "awesome-mustard-app",
  commands: [RootCommandHandle],
})
class Project implements MustardApp {
  onError(error: Error): void {
    console.log(error);
  }
}

MustardFactory.init(Project).start();

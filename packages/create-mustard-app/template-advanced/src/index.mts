import { createRequire } from "module";

import { MustardFactory, MustardUtils } from "mustard-cli";
import {
  Command,
  Option,
  VariadicOption,
  App,
  Utils,
  Input,
} from "mustard-cli/decorator";
import type { CommandStruct, MustardApp } from "mustard-cli/cli";

const require = createRequire(import.meta.url); // construct the require method

@Command("run", "r")
class RunCommandHandle implements CommandStruct {
  @Option("dry", "d", "dry run command to see what will happen")
  public dry = false;

  @VariadicOption("projects", "p", "projects to run")
  public projects: string[] = [];

  @Utils()
  public utils!: MustardUtils;

  @Input()
  public input: string = "default";

  public run(): void {
    console.log(
      "awesome-mustard-app run command",
      this.utils.colors.white(`v ${require("../package.json").version}\n`)
    );
    console.log(`Input: ${this.input}`);
    console.log(`Run Projects: ${this.input}`);
  }
}

@Command("update", "u")
class UpdateCommandHandle implements CommandStruct {
  @Option("dry", "d", "dry run command to see what will happen")
  public dry = false;

  @VariadicOption("packages", "p", "packages to update")
  public packages: string[] = [];

  @Utils()
  public utils!: MustardUtils;

  @Input()
  public input: string = "default";

  public run(): void {
    console.log(
      "awesome-mustard-app update command",
      this.utils.colors.white(`v ${require("../package.json").version}\n`)
    );
    console.log(`Input: ${this.input}`);
    console.log(`Update Packages: ${this.input}`);
  }
}

@App({
  name: "awesome-mustard-app",
  commands: [RunCommandHandle, UpdateCommandHandle],
})
class Project implements MustardApp {
  onError(error: Error): void {
    console.log(error);
  }
}

MustardFactory.init(Project).start();

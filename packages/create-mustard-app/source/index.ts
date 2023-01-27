import { createRequire } from "module";
import fs from "fs-extra";
import path from "path";
import logSymbols from "log-symbols";

import { MustardFactory, MustardUtils } from "mustard-cli";
import { RootCommand, Option, App, Utils, Input } from "mustard-cli/decorator";
import { CommandStruct, MustardApp } from "mustard-cli/cli";

const require = createRequire(import.meta.url); // construct the require method

type Template = "simple" | "complete";

@RootCommand()
class RootCommandHandle implements CommandStruct {
  @Option("dry", "d", "dry run command to see what will happen")
  public dry = false;

  @Option("template", "t", "template to use, 'simple' or 'complete'")
  public template: Template = "simple";

  @Input("directory to create the project in")
  public dir: string = "./mustard-app";

  @Utils()
  public utils!: MustardUtils;

  public run(): void {
    console.log(
      "create-mustard-app",
      this.utils.colors.white(`v ${require("../package.json").version}\n`)
    );

    const createDir = path.resolve(this.dir);

    console.log(`Creating project in ${this.utils.colors.white(createDir)}...`);

    const template = ["simple", "complete"].includes(this.template)
      ? this.template
      : "simple";

    console.log(`Using template ${this.utils.colors.white(template)}...`);

    const templatePath = path.resolve(`./template-${template}`);

    try {
      fs.ensureDirSync(createDir);
      fs.copySync(templatePath, createDir, {});

      console.log("\n", logSymbols.success, "Project created successfully!");
    } catch (error) {
      fs.removeSync(createDir);
      console.log(
        logSymbols.error,
        "Project creation failed wtih following error:"
      );
      throw error;
    }
  }
}

@App({
  name: "create-mustard-app",
  commands: [RootCommandHandle],
  configurations: {
    allowUnknownOptions: true,
    enableUsage: true,
  },
})
class Project implements MustardApp {
  onStart() {}

  onComplete() {}

  onError(error: Error): void {
    console.log(error);
  }
}

MustardFactory.init(Project).start();

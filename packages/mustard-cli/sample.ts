#!/usr/bin/env node

import { MustardFactory, Context } from "mustard-cli";
import {
  Command,
  RootCommand,
  Option,
  VariadicOption,
  App,
  Ctx,
  Input,
  Inject,
} from "mustard-cli/Decorators";
import { Validator } from "mustard-cli/Validator";
import { CommandStruct, MustardApp } from "mustard-cli/ComanndLine";

@RootCommand()
class RootCommandHandle implements CommandStruct {
  @Option("d")
  public msg = "default value of msg";

  public run(): void {
    console.log("Root Command! ", this.msg);
  }
}

@Command("update", "u", "update project dependencies")
class UpdateCommand implements CommandStruct {
  @Option("depth", "depth of packages to update", Validator.Number().Gte(1))
  public depth = 10;

  @Option(Validator.Boolean())
  public dry = false;

  @Option("all")
  public applyAll: boolean;

  @Ctx()
  public context: Context;

  @Input()
  public input: string[];

  @Inject("DataService")
  public data: DataService;

  @VariadicOption()
  public packages: string[] = [];

  public run(): void {
    console.warn("DryRun Mode: ", this.dry);
    console.info("Execution Depth", this.depth);
    console.info("Specified Packages", this.packages);
    console.info("Additional Input", this.input);
    console.info("Injected Service", this.data.fetch());
    // console.info("Context", this.context);
  }
}

class DataService {
  public fetch() {
    return "FetchedData";
  }
}

@App({
  name: "LinbuduLab CLI",
  commands: [RootCommandHandle, UpdateCommand],
  configurations: {
    enableVersion: require("./package.json").version,
  },
  providers: [
    {
      identifier: DataService.name,
      value: DataService,
    },
  ],
})
class Project implements MustardApp {
  onStart() {}

  onComplete() {}
}

MustardFactory.init(Project).start();

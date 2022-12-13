#!/usr/bin/env node

import { MustardFactory, Context, MustardUtils } from "./source/Exports";
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
} from "./source/Exports/Decorators";
import { Validator } from "./source/Exports/Validator";
import { CommandStruct, MustardApp } from "./source/Exports/ComanndLine";
import path from "path";

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

  @Option({ alias: "d" })
  public define: boolean;

  @Option("all")
  public applyAll: boolean;

  @Options()
  public completeOptions: any;

  @Ctx()
  public context: Context;

  @Input()
  public input: string[];

  @Utils()
  public utils: MustardUtils;

  @Inject("DataService")
  public data: DataService;

  @Inject("SharedService")
  public shared: SharedService;

  @VariadicOption()
  public packages: string[] = [];

  public run(): void {
    console.log("Complete Options! ", this.completeOptions);
    // console.warn("DryRun Mode: ", this.dry);
    // console.info("Execution Depth", this.depth);
    // console.info("Specified Packages", this.packages);
    // console.info("Additional Input", this.input);
    // console.info("Injected DataService", this.data.fetch());
    // console.info("Injected SharedService", this.shared.execute());
    // console.info("Mustard Utils", this.utils.json.readSync);
    // console.info("Context", this.context);
  }
}

class DataService {
  public fetch() {
    return "FetchedData";
  }
}

class SharedService {
  public execute() {
    return "ExecuteSharedService";
  }
}

@App({
  name: "LinbuduLab CLI",
  commands: [RootCommandHandle, UpdateCommand],
  configurations: {
    allowUnknownOptions: true,
    enableVersion: require(path.resolve("./package.json")).version,
  },
  providers: [
    SharedService,
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

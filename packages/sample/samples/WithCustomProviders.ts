#!/usr/bin/env node

import { MustardFactory } from "mustard-cli";
import { Command, App, Inject } from "mustard-cli/decorator";
import { CommandStruct, MustardApp } from "mustard-cli/cli";

import path from "path";

@Command("update")
class UpdateCommand implements CommandStruct {
  @Inject("DataService")
  public data: DataService;

  @Inject("SharedService")
  public shared: SharedService;

  public run(): void {}
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
  name: "create-mustard-app",
  commands: [UpdateCommand],
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

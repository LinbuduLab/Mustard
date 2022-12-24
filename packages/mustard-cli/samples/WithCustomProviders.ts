#!/usr/bin/env node

import { MustardFactory } from "../source/Exports";
import { Command, App, Inject } from "../source/Exports/Decorators";
import { CommandStruct, MustardApp } from "../source/Exports/ComanndLine";
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
  name: "LinbuduLab CLI",
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

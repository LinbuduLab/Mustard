#!/usr/bin/env node

import { MustardFactory } from "mustard-cli";
import { Command, VariadicOption, App } from "mustard-cli/decorator";
import { CommandStruct, MustardApp } from "mustard-cli/cli";

@Command("dep", [])
class UpdateDepCommand implements CommandStruct {
  @VariadicOption()
  public packages: string[] = [];

  public run(): void {}
}

@Command("update", [UpdateDepCommand])
class UpdateCommand implements CommandStruct {
  @VariadicOption()
  public packages: string[] = [];

  public run(): void {}
}

@App({
  name: "LinbuduLab CLI",
  commands: [UpdateCommand],
  configurations: {
    allowUnknownOptions: true,
  },
  providers: [],
})
class Project implements MustardApp {
  onStart() {}

  onComplete() {}
}

MustardFactory.init(Project).start();

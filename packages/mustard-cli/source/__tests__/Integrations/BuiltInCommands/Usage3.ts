import { MustardFactory } from "../../../Exports";
import { RootCommand, App, Command, Option } from "../../../Exports/Decorators";
import { CommandStruct, MustardApp } from "../../../Exports/ComanndLine";

@Command("update", "execute update command")
class UpdateCommandHandle implements CommandStruct {
  @Option("name", "name of the project")
  public name: string;

  @Option("version", "version of the project")
  public version: string;

  public run(): void {}
}

@Command("sync", "execute update command")
class SyncCommandHandle implements CommandStruct {
  @Option("name", "n", "name of the project")
  public name: string;

  @Option("type", "t", "type of the project")
  public type: string;

  public run(): void {}
}

@RootCommand()
class RootCommandHandle implements CommandStruct {
  public run(): void {}
}

@App({
  name: "LinbuduLab CLI",
  commands: [RootCommandHandle, UpdateCommandHandle, SyncCommandHandle],
  configurations: {
    allowUnknownOptions: true,
    enableVersion() {
      return "10.11.0";
    },
  },
  providers: [],
})
class Project implements MustardApp {
  onStart() {}

  onComplete() {}
}

MustardFactory.init(Project).start();

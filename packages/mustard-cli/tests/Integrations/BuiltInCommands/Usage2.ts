import { MustardFactory } from "../../../Exports";
import { RootCommand, App } from "../../../Exports/Decorators";
import { CommandStruct, MustardApp } from "../../../Exports/ComanndLine";

@RootCommand()
class RootCommandHandle implements CommandStruct {
  public run(): void {}
}

@App({
  name: "LinbuduLab CLI",
  commands: [RootCommandHandle],
  configurations: {
    allowUnknownOptions: true,
    enableVersion() {
      return "10.11.0";
    },
    enableUsage(registration) {
      if (!registration) {
        return "Usage: mustard [options] [command]";
      }
      return `Usage: ${registration.commandInvokeName}`;
    },
  },
  providers: [],
})
class Project implements MustardApp {
  onStart() {}

  onComplete() {}
}

MustardFactory.init(Project).start();

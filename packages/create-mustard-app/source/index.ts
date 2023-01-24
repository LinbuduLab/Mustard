import { MustardFactory, MustardUtils } from "mustard-cli";
import { RootCommand, Option, App, Utils } from "mustard-cli/decorator";
import { CommandStruct, MustardApp } from "mustard-cli/cli";

type Template = "simple" | "template";

@RootCommand()
class RootCommandHandle implements CommandStruct {
  @Option("dry", "d", "dry run command to see what will happen")
  public dry = false;

  @Option("template", "t", "template to use, 'simple' or 'complete'")
  public template: Template = "simple";

  @Utils()
  public utils!: MustardUtils;

  public run(): void {
    console.log(this.utils.colors.green("Hello World"));
    console.log(this.dry, this.template);
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

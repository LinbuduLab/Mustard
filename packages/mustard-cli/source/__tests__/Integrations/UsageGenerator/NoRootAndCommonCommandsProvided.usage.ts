import { MustardFactory } from "../../../index";
import { App } from "../../../Exports/Decorators";

@App({
  name: "mm",
  commands: [],
  configurations: {},
})
class Project {}

MustardFactory.init(Project).start();

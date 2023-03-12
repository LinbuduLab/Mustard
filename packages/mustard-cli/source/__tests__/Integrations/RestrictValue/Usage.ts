import { MustardFactory } from "../../../Exports/index";
import {
  RootCommand,
  Option,
  Restrict,
  App,
} from "../../../Exports/Decorators";
import { CommandStruct, MustardApp } from "../../../Exports/ComanndLine";

const restrictArray = ["foo", "bar", "baz"] as const;

const restrictObject = {
  foo: "foo",
  bar: "bar",
  baz: "baz",
} as const;

enum RestrictEnum {
  Foo = "foo",
  Bar = "bar",
  Baz = "baz",
}

type RestrictArrayType = (typeof restrictArray)[number];
type RestrictObjectType = (typeof restrictObject)[keyof typeof restrictObject];

@RootCommand()
class RootCommandHandle implements CommandStruct {
  @Option()
  public notRestrict: string = "default value of notRestrict";

  @Restrict(restrictArray)
  @Option()
  public restrictedArrayTypeOption: RestrictArrayType = "foo";

  @Restrict(restrictObject)
  @Option()
  public restrictedObjectTypeOption: RestrictObjectType = "foo";

  @Restrict(RestrictEnum)
  @Option()
  public restrictedEnumTypeOption: RestrictEnum = RestrictEnum.Foo;

  public run(): void {
    console.log("Root Command");
    console.log(`--notRestrict option: ${this.notRestrict}`);
    console.log(
      `--restrictedArrayTypeOption option: ${this.restrictedArrayTypeOption}`
    );
    console.log(
      `--restrictedObjectTypeOption option: ${this.restrictedObjectTypeOption}`
    );
    console.log(
      `--restrictedEnumTypeOption option: ${this.restrictedEnumTypeOption}`
    );
  }
}

@App({
  name: "LinbuduLab CLI",
  commands: [RootCommandHandle],
})
class Project implements MustardApp {
  onStart() {}

  onComplete() {}
}

MustardFactory.init(Project).start();

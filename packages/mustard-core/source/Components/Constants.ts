// todo: error
enum MustardEvents {
  Start = "start",
  BeforeParse = "parse:before",
  AfterParse = "parse:after",
  CommandDispatch = "command:dispatch",
  CommandExecute = "command:execute",
  OptionCheck = "option:check",
  OptionInject = "option:inject",
  OptionValidate = "option:validate",
  OptionInstantiate = "option:instantiate",
  CommandComplete = "command:complete",
}

export type InstanceFieldDecorationTypesUnion =
  typeof MustardConstanst.InstanceFieldDecorationTypes[number];

export class MustardConstanst {
  public static InstanceFieldDecorationTypes = <const>[
    "Option",
    "Options",
    "VariadicOption",
    "Input",
    "Context",
    "Utils",
  ];

  public static RootCommandRegistryKey = "root";
}

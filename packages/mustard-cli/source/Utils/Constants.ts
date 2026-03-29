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
    "Inject",
  ];

  public static RootCommandRegistryKey = "root";

  public static InternalHelpFlag = "MUSTARD_SPECIFIED_HELP_FLAG";

  public static InternalVersionFlag = "MUSTARD_SPECIFIED_VERSION_FLAG";
}

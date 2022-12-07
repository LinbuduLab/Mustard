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

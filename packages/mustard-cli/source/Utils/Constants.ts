export enum InstanceFieldDecorationTypes {
  Option = "Option",
  Options = "Options",
  VariadicOption = "VariadicOption",
  Input = "Input",
  Context = "Context",
  Utils = "Utils",
  Inject = "Inject",
}

export function isInstanceFieldDecorationType(
  type: string
): type is InstanceFieldDecorationTypes {
  return Object.values(InstanceFieldDecorationTypes).includes(
    type as InstanceFieldDecorationTypes
  );
}

export class MustardConstanst {
  public static RootCommandRegistryKey = "root";

  public static InternalHelpFlag = "MUSTARD_SPECIFIED_HELP_FLAG";

  public static InternalVersionFlag = "MUSTARD_SPECIFIED_VERSION_FLAG";
}

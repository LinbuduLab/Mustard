export enum InstanceFieldDecorationTypes {
  Option = "Mustard:Field:Option",

  Options = "Mustard:Field:Options",

  VariadicOption = "Mustard:Field:VariadicOption",

  Input = "Mustard:Field:Input",

  Context = "Mustard:Field:Context",

  Utils = "Mustard:Field:Utils",

  Inject = "Mustard:Field:Inject",
}

export enum InstanceFieldAdditionalDecorationTypes {
  Description = "Mustard:Field:Description",

  Validator = "Mustard:Field:Validator",
}

export function isInstanceFieldDecorationType(
  type: string,
): type is InstanceFieldDecorationTypes {
  return Object.values(InstanceFieldDecorationTypes).includes(
    type as InstanceFieldDecorationTypes,
  );
}

export class MustardConstanst {
  public static RootCommandRegistryKey = "root";

  public static InternalHelpFlag = "MUSTARD_SPECIFIED_HELP_FLAG";

  public static InternalVersionFlag = "MUSTARD_SPECIFIED_VERSION_FLAG";
}

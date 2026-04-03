import { Dictionary } from "../Typings/Shared.struct.js";

export class GlobalRegistry {
  public static VariadicOptions = new Set<string>();

  // raw - alias
  public static OptionAliasMap: Dictionary<string> = {};
}

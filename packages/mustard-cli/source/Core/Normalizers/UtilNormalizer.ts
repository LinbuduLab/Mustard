import { MustardUtilsProvider } from "../MustardUtilsProvider.js";
import { MustardInternalUtils } from "../../Utils/Utils.js";

import type { MustardCommand } from "../../Typings/Command.struct.js";

export class UtilNormalizer {
  public static normalize(instance: MustardCommand, instanceField: string) {
    MustardInternalUtils.setInstanceFieldValue(
      instance,
      instanceField,
      MustardUtilsProvider.produce()
    );
  }
}

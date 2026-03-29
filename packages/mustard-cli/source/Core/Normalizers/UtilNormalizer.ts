import { MustardUtilsProvider } from "../MustardUtilsProvider";
import { MustardInternalUtils } from "../../Utils/Utils";

import type { MustardCommand } from "../../Typings/Command.struct";

export class UtilNormalizer {
  public static normalize(instance: MustardCommand, instanceField: string) {
    MustardInternalUtils.setInstanceFieldValue(
      instance,
      instanceField,
      MustardUtilsProvider.produce()
    );
  }
}

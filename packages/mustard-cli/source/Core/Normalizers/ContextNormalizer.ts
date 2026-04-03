import { MustardInternalUtils } from "../../Utils/Utils.js";

import type { Context } from "../../Typings/Context.struct.js";
import type { MustardCommand } from "../../Typings/Command.struct.js";

export class ContextNormalizer {
  public static normalize(instance: MustardCommand, instanceField: string) {
    MustardInternalUtils.setInstanceFieldValue(instance, instanceField, {
      cwd: process.cwd(),
      argv: process.argv,
      inputArgv: process.argv.slice(2),
      env: process.env,
    } satisfies Context);
  }
}

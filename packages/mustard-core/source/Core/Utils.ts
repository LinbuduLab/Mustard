import { TaggedDecoratedInstanceFields } from "source/Typings/Utils.struct";
import parse from "yargs-parser";
import { MustardConstanst } from "../Components/Constants";
import { Dictionary } from "../Typings/Shared.struct";

export class MustardUtils {
  public static getInstanceFields(target: Dictionary) {
    return Reflect.ownKeys(target);
  }

  public static getInstanceFieldValue(target: Dictionary, prop: string) {
    return Reflect.get(target, prop);
  }

  public static setInstanceFieldValue(
    target: Dictionary,
    prop: string,
    value: unknown
  ) {
    Reflect.set(target, prop, value);

    return MustardUtils.getInstanceFieldValue(target, prop);
  }

  public static parseFromProcessArgs(withVariadic: string[] = []) {
    const parsed = parse(process.argv.slice(2), {
      array: Array.from(withVariadic),
      configuration: {
        "greedy-arrays": true,
      },
    });

    return parsed;
  }

  public static filterDecoratedInstanceFields(
    target
  ): TaggedDecoratedInstanceFields[] {
    const fields = <string[]>MustardUtils.getInstanceFields(target);

    return fields.map((field: string) => {
      const value = <TaggedDecoratedInstanceFields>(
        MustardUtils.getInstanceFieldValue(target, field)
      );

      if (MustardConstanst.InstanceFieldDecorationTypes.includes(value.type)) {
        return {
          key: field,
          type: value.type,
          value,
        };
      }
    });
  }

  public static uniq() {}
}

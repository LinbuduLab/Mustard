export class MustardUtils {
  public static getInstanceFields(target) {
    return Reflect.ownKeys(target);
  }

  public static getInstanceFieldValue(target, prop) {
    return Reflect.get(target, prop);
  }

  public static setInstanceFieldValue(target, prop, value) {
    Reflect.set(target, prop, value);

    return MustardUtils.getInstanceFieldValue(target, prop);
  }

  public static filterDecoratedInstanceFields(target) {
    const fields = MustardUtils.getInstanceFields(target) as string[];

    return fields.map((field: string) => {
      const value = MustardUtils.getInstanceFieldValue(target, field);

      if (
        [
          "Option",
          "Options",
          "VariadicOption",
          "Input",
          "Context",
          "Utils",
        ].includes(value.type)
      ) {
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

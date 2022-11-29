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

  public static uniq() {}
}

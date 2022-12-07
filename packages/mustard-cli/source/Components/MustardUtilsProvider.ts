/**
 * @Utils
 * @Utils.Json
 * @Utils.PackageJson
 * @Utils.TmpFile
 */
export class MustardUtilsProvider {
  public static produce() {
    return {
      tmpFile: MustardUtilsProvider.tmpFile,
      json: MustardUtilsProvider.json,
      npm: MustardUtilsProvider.npm,
    };
  }

  public static get tmpFile() {
    return {};
  }

  public static get json() {
    return {
      readSync: () => {},
      writeSync: () => {},
      readPackageJson: () => {},
      JsonEditor: () => {},
    };
  }

  public static get npm() {
    return {
      getPackageManager: () => {},
      install: () => {},
      uninstall: () => {},
      installDev: () => {},
    };
  }
}

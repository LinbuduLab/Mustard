import fs from "fs";
import { EOL } from "os";

class JSONHelper {
  public static readJsonSync<TParsedContent = Record<string, unknown>>(
    filePath: string,
    options?: {
      encoding?: null | undefined;
      flag?: string | undefined;
      throw?: boolean;
      parserOptions?: string;
      reviver?: (key: string, value: any) => any;
    } | null
  ): TParsedContent {
    const content = fs
      .readFileSync(filePath, {
        ...options,
        encoding: "utf-8",
      })
      .replace(/^\uFEFF/, "");

    let parsed: any;

    try {
      parsed = JSON.parse(content, options?.reviver);
    } catch (error: any) {
      if (options?.throw) {
        error.message = `${filePath}: ${error.message}`;
        throw error;
      } else {
        return {} as TParsedContent;
      }
    }

    return parsed;
  }

  public static writeJsonSync(
    filePath: string,
    content: any,
    options?: fs.WriteFileOptions
  ): void {
    const contentStr =
      JSON.stringify(content, null, 2).replace(/\n/g, EOL) + EOL;

    fs.writeFileSync(filePath, contentStr, options);
  }
}

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
      readSync: JSONHelper.readJsonSync,
      writeSync: JSONHelper.writeJsonSync,
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

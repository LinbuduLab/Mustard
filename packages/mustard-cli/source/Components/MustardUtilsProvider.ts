import fs from "fs";
import fsp from "fs/promises";
import { EOL } from "os";

import type { Nullable } from "../Typings/Shared.struct";

interface ReadJsonOptions {
  encoding?: null | undefined;
  flag?: string | undefined;
  throw?: boolean;
  parserOptions?: string;
  reviver?: (key: string, value: any) => any;
}

export class JSONHelper {
  public static async readJson<TParsedContent = Record<string, unknown>>(
    filePath: string,
    options?: Nullable<ReadJsonOptions>
  ): Promise<TParsedContent> {
    return new Promise<TParsedContent>((resolve, reject) => {
      fsp.readFile(filePath).then((content) => {
        let parsed: any;
        try {
          parsed = JSON.parse(
            content.toString().replace(/^\uFEFF/, ""),
            options?.reviver
          );
          resolve(parsed);
        } catch (error: any) {
          if (options?.throw) {
            error.message = `${filePath}: ${error.message}`;
            reject(error);
          } else {
            resolve({} as TParsedContent);
          }
        }
      });
    });
  }

  public static readJsonSync<TParsedContent = Record<string, unknown>>(
    filePath: string,
    options?: Nullable<ReadJsonOptions>
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

  public static async writeJson(
    filePath: string,
    content: any,
    options?: fs.WriteFileOptions
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const contentStr =
        JSON.stringify(content, null, 2).replace(/\n/g, EOL) + EOL;

      fsp.writeFile(filePath, contentStr, options).then(resolve).catch(reject);
    });
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
 */
export class MustardUtilsProvider {
  public static produce() {
    return {
      json: MustardUtilsProvider.json,
    };
  }

  public static get json() {
    return {
      readSync: JSONHelper.readJsonSync,
      read: JSONHelper.readJson,
      writeSync: JSONHelper.writeJsonSync,
      write: JSONHelper.writeJson,
    };
  }
}

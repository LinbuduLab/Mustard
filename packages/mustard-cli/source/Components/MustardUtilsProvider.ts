import fs from "fs";
import fsp from "fs/promises";
import tty from "tty";
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

// source: https://github.com/alexeyraspopov/picocolors/blob/main/picocolors.js
export class ColorsHelper {
  public static get isColorSupported(): boolean {
    return (
      !("NO_COLOR" in process.env || process.argv.includes("--no-color")) &&
      ("FORCE_COLOR" in process.env ||
        process.argv.includes("--color") ||
        process.platform === "win32" ||
        (tty.isatty(1) && process.env["TERM"] !== "dumb") ||
        "CI" in process.env)
    );
  }

  private static replaceClose = (
    string: string,
    close: string,
    replace: string,
    index: number
  ): string => {
    let start = string.substring(0, index) + replace;
    let end = string.substring(index + close.length);
    let nextIndex = end.indexOf(close);
    return ~nextIndex
      ? start + ColorsHelper.replaceClose(end, close, replace, nextIndex)
      : start + end;
  };

  private static formatter =
    (open: string, close: string, replace: string = open) =>
    (input: string) => {
      let string = "" + input;
      let index = string.indexOf(close, open.length);
      return ~index
        ? open +
            ColorsHelper.replaceClose(string, close, replace, index) +
            close
        : open + string + close;
    };

  private static factory = (open: string): ((input: string) => string) => {
    return ColorsHelper.isColorSupported
      ? ColorsHelper.formatter(open, "\x1b[39m")
      : String;
  };

  private static bgFactory = (open: string): ((input: string) => string) => {
    return ColorsHelper.isColorSupported
      ? ColorsHelper.formatter(open, "\x1b[49m")
      : String;
  };

  public static bold = ColorsHelper.isColorSupported
    ? ColorsHelper.formatter("\x1b[1m", "\x1b[22m", "\x1b[22m\x1b[1m")
    : String;
  public static dim = ColorsHelper.isColorSupported
    ? ColorsHelper.formatter("\x1b[2m", "\x1b[22m", "\x1b[22m\x1b[2m")
    : String;
  public static italic = ColorsHelper.isColorSupported
    ? ColorsHelper.formatter("\x1b[3m", "\x1b[23m")
    : String;
  public static underline = ColorsHelper.isColorSupported
    ? ColorsHelper.formatter("\x1b[4m", "\x1b[24m")
    : String;
  public static inverse = ColorsHelper.isColorSupported
    ? ColorsHelper.formatter("\x1b[7m", "\x1b[27m")
    : String;
  public static hidden = ColorsHelper.isColorSupported
    ? ColorsHelper.formatter("\x1b[8m", "\x1b[28m")
    : String;
  public static strikethrough = ColorsHelper.isColorSupported
    ? ColorsHelper.formatter("\x1b[9m", "\x1b[29m")
    : String;

  public static black = ColorsHelper.factory("\x1b[30m");

  public static red = ColorsHelper.factory("\x1b[31m");

  public static green = ColorsHelper.factory("\x1b[32m");

  public static yellow = ColorsHelper.factory("\x1b[33m");

  public static blue = ColorsHelper.factory("\x1b[34m");

  public static magenta = ColorsHelper.factory("\x1b[35m");

  public static cyan = ColorsHelper.factory("\x1b[36m");

  public static white = ColorsHelper.factory("\x1b[37m");

  public static gray = ColorsHelper.factory("\x1b[90m");

  public static bgRed = ColorsHelper.bgFactory("\x1b[41m");

  public static bgGreen = ColorsHelper.bgFactory("\x1b[42m");

  public static bgYellow = ColorsHelper.bgFactory("\x1b[43m");

  public static bgBlue = ColorsHelper.bgFactory("\x1b[44m");

  public static bgMagenta = ColorsHelper.bgFactory("\x1b[45m");

  public static bgCyan = ColorsHelper.bgFactory("\x1b[46m");

  public static bgWhite = ColorsHelper.bgFactory("\x1b[47m");
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
      colors: MustardUtilsProvider.colors,
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

  public static get colors() {
    return ColorsHelper;
  }
}

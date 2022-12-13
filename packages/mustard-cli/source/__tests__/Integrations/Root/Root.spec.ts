import { describe, it, expect, vi, beforeEach } from "vitest";
import { MustardFactory, Context, MustardUtils } from "../../../Exports";
import { execaCommand } from "execa";
import {
  Command,
  RootCommand,
  Option,
  VariadicOption,
  App,
  Ctx,
  Input,
  Inject,
  Utils,
  Options,
} from "../../../Exports/Decorators";
import { Validator } from "../../../Exports/Validator";
import { CommandStruct, MustardApp } from "../../../Exports/ComanndLine";
import path from "path";

const UsagePath = path.resolve(__dirname, "./Usage.ts");

describe("IntegrationTesting:RootCommandHandle", () => {
  it("should use root command as handler", async () => {
    const { stdout: stdout1 } = await execaCommand(`ts-node-esm ${UsagePath}`);
    expect(stdout1).toBe(
      "Root command with msg option: default value of msg, projects option: , inputs: "
    );

    const { stdout: stdout2 } = await execaCommand(
      `ts-node-esm ${UsagePath} --msg Hello`
    );
    expect(stdout2).toBe(
      "Root command with msg option: Hello, projects option: , inputs: "
    );

    const { stdout: stdout3 } = await execaCommand(
      `ts-node-esm ${UsagePath} --msg Hello --projects app1 app2 app3`
    );
    expect(stdout3).toBe(
      "Root command with msg option: Hello, projects option: app1,app2,app3, inputs: "
    );

    const { stdout: stdout4 } = await execaCommand(
      `ts-node-esm ${UsagePath} enhance --msg Hello --projects app1 app2 app3`
    );
    expect(stdout4).toBe(
      "Root command with msg option: Hello, projects option: app1,app2,app3, inputs: enhance"
    );
  });
});

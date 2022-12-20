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

const UsagePath1 = path.resolve(__dirname, "./Usage1.ts");

describe("IntegrationTesting:RootCommandHandle", () => {
  it("should use root command as handler", async () => {
    const { stdout: stdout1 } = await execaCommand(`ts-node-esm ${UsagePath1}`);
    expect(stdout1).toMatchInlineSnapshot(
      `
      "withVariadic:  [ 'projects', 'p' ]
      --msg option: default value of msg
      --projects option: 
      inputs: 
      options: {}"
    `
    );

    const { stdout: stdout2 } = await execaCommand(
      `ts-node-esm ${UsagePath1} --msg Hello`
    );
    expect(stdout2).toMatchInlineSnapshot(
      `
      "withVariadic:  [ 'projects', 'p' ]
      --msg option: Hello
      --projects option: 
      inputs: 
      options: {\\"msg\\":\\"Hello\\"}"
    `
    );

    const { stdout: stdout3 } = await execaCommand(
      `ts-node-esm ${UsagePath1} --msg Hello --projects app1 app2 app3`
    );
    expect(stdout3).toMatchInlineSnapshot(
      `
      "withVariadic:  [ 'projects', 'p' ]
      --msg option: Hello
      --projects option: app1,app2,app3
      inputs: 
      options: {\\"msg\\":\\"Hello\\",\\"projects\\":[\\"app1\\",\\"app2\\",\\"app3\\"]}"
    `
    );

    const { stdout: stdout4 } = await execaCommand(
      `ts-node-esm ${UsagePath1} enhance --msg Hello --projects app1 app2 app3`
    );
    expect(stdout4).toMatchInlineSnapshot(
      `
      "withVariadic:  [ 'projects', 'p' ]
      --msg option: Hello
      --projects option: app1,app2,app3
      inputs: enhance
      options: {\\"msg\\":\\"Hello\\",\\"projects\\":[\\"app1\\",\\"app2\\",\\"app3\\"]}"
    `
    );

    const { stdout: stdout5 } = await execaCommand(
      `ts-node-esm ${UsagePath1} enhance -m Hello -p app1 app2 app3`
    );
    expect(stdout5).toMatchInlineSnapshot(
      `
      "withVariadic:  [ 'projects', 'p' ]
      --msg option: Hello
      --projects option: app1,app2,app3
      inputs: enhance
      options: {\\"msg\\":\\"Hello\\",\\"p\\":[\\"app1\\",\\"app2\\",\\"app3\\"]}"
    `
    );
  });
});

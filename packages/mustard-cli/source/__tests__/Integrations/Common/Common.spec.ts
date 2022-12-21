import { describe, it, expect } from "vitest";
import { execaCommand } from "execa";
import path from "path";

const UsagePath = path.resolve(__dirname, "./Usage.ts");

describe("IntegrationTesting:CommonCommandHandle", () => {
  it("should dispatch command", async () => {
    const { stdout: stdout1 } = await execaCommand(
      `ts-node-esm ${UsagePath} run`
    );
    expect(stdout1).toMatchInlineSnapshot(
      `
      "Run Command
      --pure option: default value of pure
      --msg option: default value of msg
      --projects option: 
      inputs: 
      options: {}"
    `
    );

    const { stdout: stdout2 } = await execaCommand(
      `ts-node-esm ${UsagePath} run input1 input2 --msg Hello --pure pureValue --projects app1 app2 app3 --projects app4`
    );
    expect(stdout2).toMatchInlineSnapshot(
      `
      "Run Command
      --pure option: pureValue
      --msg option: Hello
      --projects option: app1,app2,app3,app4
      inputs: input1,input2
      options: {\\"msg\\":\\"Hello\\",\\"pure\\":\\"pureValue\\",\\"projects\\":[\\"app1\\",\\"app2\\",\\"app3\\",\\"app4\\"]}"
    `
    );

    const { stdout: stdout3 } = await execaCommand(
      `ts-node-esm ${UsagePath} update input1 input2 --msg Hello --pure pureValue --projects app1 app2 app3 --projects app4`
    );
    expect(stdout3).toMatchInlineSnapshot(
      `
      "Update Command
      --msg option: Hello
      --projects option: app1,app2,app3,app4
      inputs: input1,input2
      options: {\\"msg\\":\\"Hello\\",\\"pure\\":\\"pureValue\\",\\"projects\\":[\\"app1\\",\\"app2\\",\\"app3\\",\\"app4\\"]}"
    `
    );

    const { stdout: stdout4 } = await execaCommand(
      `ts-node-esm ${UsagePath} update input1 input2 --msg Hello --pure pureValue --projects app1 app2 app3 --projects app4`
    );
    expect(stdout4).toMatchInlineSnapshot(
      `
      "Update Command
      --msg option: Hello
      --projects option: app1,app2,app3,app4
      inputs: input1,input2
      options: {\\"msg\\":\\"Hello\\",\\"pure\\":\\"pureValue\\",\\"projects\\":[\\"app1\\",\\"app2\\",\\"app3\\",\\"app4\\"]}"
    `
    );

    const { stdout: stdout5 } = await execaCommand(
      `ts-node-esm ${UsagePath} update dep input1 input2 --msg Hello --pure pureValue --projects app1 app2 app3 --projects app4`
    );
    expect(stdout5).toMatchInlineSnapshot(
      `
      "Update Dep Command
      --pure option: pureValue
      --msg option: Hello
      --projects option: app1,app2,app3,app4
      inputs: input1,input2
      options: {\\"msg\\":\\"Hello\\",\\"pure\\":\\"pureValue\\",\\"projects\\":[\\"app1\\",\\"app2\\",\\"app3\\",\\"app4\\"]}"
    `
    );

    const { stdout: stdout6 } = await execaCommand(
      `ts-node-esm ${UsagePath} update dep node input1 input2 --msg Hello --pure pureValue --projects app1 app2 app3 --projects app4`
    );
    expect(stdout6).toMatchInlineSnapshot(
      `
      "Update Dep Node Command
      --pure option: pureValue
      --msg option: Hello
      --projects option: app1,app2,app3,app4
      inputs: input1,input2
      options: {\\"msg\\":\\"Hello\\",\\"pure\\":\\"pureValue\\",\\"projects\\":[\\"app1\\",\\"app2\\",\\"app3\\",\\"app4\\"]}"
    `
    );

    const { stdout: stdout7 } = await execaCommand(
      `ts-node-esm ${UsagePath} update sys input1 input2 --msg Hello --pure pureValue --projects app1 app2 app3 --projects app4`
    );
    expect(stdout7).toMatchInlineSnapshot(
      `
      "Update Sys Command
      --pure option: pureValue
      --msg option: Hello
      --projects option: app1,app2,app3,app4
      inputs: input1,input2
      options: {\\"msg\\":\\"Hello\\",\\"pure\\":\\"pureValue\\",\\"projects\\":[\\"app1\\",\\"app2\\",\\"app3\\",\\"app4\\"]}"
    `
    );

    const { stdout: stdout8 } = await execaCommand(
      `ts-node-esm ${UsagePath} run`
    );
    expect(stdout8).toMatchInlineSnapshot(
      `
      "Run Command
      --pure option: default value of pure
      --msg option: default value of msg
      --projects option: 
      inputs: 
      options: {}"
    `
    );

    const { stdout: stdout9 } = await execaCommand(
      `ts-node-esm ${UsagePath} r input1 input2 --msg Hello --pure pureValue --projects app1 app2 app3 --projects app`
    );
    expect(stdout9).toMatchInlineSnapshot(
      `
      "Run Command
      --pure option: pureValue
      --msg option: Hello
      --projects option: app1,app2,app3,app
      inputs: input1,input2
      options: {\\"msg\\":\\"Hello\\",\\"pure\\":\\"pureValue\\",\\"projects\\":[\\"app1\\",\\"app2\\",\\"app3\\",\\"app\\"]}"
    `
    );

    const { stdout: stdout10 } = await execaCommand(
      `ts-node-esm ${UsagePath} u d input1 input2 --msg Hello --pure pureValue --projects app1 app2 app3 --projects app4`
    );
    expect(stdout10).toMatchInlineSnapshot(
      `
      "Update Dep Command
      --pure option: pureValue
      --msg option: Hello
      --projects option: app1,app2,app3,app4
      inputs: input1,input2
      options: {\\"msg\\":\\"Hello\\",\\"pure\\":\\"pureValue\\",\\"projects\\":[\\"app1\\",\\"app2\\",\\"app3\\",\\"app4\\"]}"
    `
    );

    const { stdout: stdout11 } = await execaCommand(
      `ts-node-esm ${UsagePath} u d n input1 input2 --msg Hello --pure pureValue --projects app1 app2 app3 --projects app4`
    );
    expect(stdout11).toMatchInlineSnapshot(
      `
      "Update Dep Node Command
      --pure option: pureValue
      --msg option: Hello
      --projects option: app1,app2,app3,app4
      inputs: input1,input2
      options: {\\"msg\\":\\"Hello\\",\\"pure\\":\\"pureValue\\",\\"projects\\":[\\"app1\\",\\"app2\\",\\"app3\\",\\"app4\\"]}"
    `
    );
  });
});

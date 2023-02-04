import { describe, it, expect } from "vitest";
import { execaCommand } from "execa";
import { TestHelper } from "../../Fixtures/TestHelper";
import path from "path";

const UsagePath = path.resolve(__dirname, "./Usage.ts");

describe("IntegrationTesting:NonCompleteParse", () => {
  it("should dispatch command", async () => {
    const { stdout: stdoutWithRoot1 } = await execaCommand(
      `${TestHelper.IntegrationExecutor} ${UsagePath}`
    );
    expect(stdoutWithRoot1).toMatchInlineSnapshot(
      `
      "Root Command
      --pure option: default value of pure
      --msg option: default value of msg
      inputs: []
      options: {\\"pure\\":\\"default value of pure\\",\\"msg\\":\\"default value of msg\\"}"
    `
    );

    const { stdout: stdoutWithRoot2 } = await execaCommand(
      `${TestHelper.IntegrationExecutor} ${UsagePath} input1 input2 input3`
    );
    expect(stdoutWithRoot2).toMatchInlineSnapshot(
      `
      "Root Command
      --pure option: default value of pure
      --msg option: default value of msg
      inputs: [\\"input1\\",\\"input2\\",\\"input3\\"]
      options: {\\"pure\\":\\"default value of pure\\",\\"msg\\":\\"default value of msg\\"}"
    `
    );

    const { stdout: stdoutWithRoot3 } = await execaCommand(
      `${TestHelper.IntegrationExecutor} ${UsagePath} input1 input2 input3 --msg Hello --pure pureValue`
    );
    expect(stdoutWithRoot3).toMatchInlineSnapshot(
      `
      "Root Command
      --pure option: default value of pure
      --msg option: default value of msg
      inputs: [\\"input1\\",\\"input2\\",\\"input3\\"]
      options: {\\"pure\\":\\"pureValue\\",\\"msg\\":\\"Hello\\"}"
    `
    );

    const { stdout: stdout1 } = await execaCommand(
      `${TestHelper.IntegrationExecutor} ${UsagePath} run`
    );
    expect(stdout1).toMatchInlineSnapshot(
      `
      "Run Command
      --pure option: default value of pure
      --msg option: default value of msg
      inputs: []
      options: {\\"pure\\":\\"default value of pure\\",\\"msg\\":\\"default value of msg\\"}"
    `
    );

    const { stdout: stdout2 } = await execaCommand(
      `${TestHelper.IntegrationExecutor} ${UsagePath} run input1 input2 --msg Hello --pure pureValue`
    );
    expect(stdout2).toMatchInlineSnapshot(
      `
      "Run Command
      --pure option: default value of pure
      --msg option: default value of msg
      inputs: [\\"input1\\",\\"input2\\"]
      options: {\\"pure\\":\\"pureValue\\",\\"msg\\":\\"Hello\\"}"
    `
    );

    const { stdout: stdout3 } = await execaCommand(
      `${TestHelper.IntegrationExecutor} ${UsagePath} update input1 input2 --msg Hello --pure pureValue`
    );
    expect(stdout3).toMatchInlineSnapshot(
      `
      "Update Command
      --msg option: default value of msg
      inputs: [\\"input1\\",\\"input2\\"]
      options: {\\"msg\\":\\"Hello\\"}"
    `
    );

    const { stdout: stdout4 } = await execaCommand(
      `${TestHelper.IntegrationExecutor} ${UsagePath} update input1 input2 --msg Hello --pure pureValue`
    );
    expect(stdout4).toMatchInlineSnapshot(
      `
      "Update Command
      --msg option: default value of msg
      inputs: [\\"input1\\",\\"input2\\"]
      options: {\\"msg\\":\\"Hello\\"}"
    `
    );

    const { stdout: stdout5 } = await execaCommand(
      `${TestHelper.IntegrationExecutor} ${UsagePath} update dep input1 input2 --msg Hello --pure pureValue`
    );
    expect(stdout5).toMatchInlineSnapshot(
      `
      "Update Dep Command
      --pure option: default value of pure
      --msg option: default value of msg
      inputs: [\\"input1\\",\\"input2\\"]
      options: {\\"pure\\":\\"pureValue\\",\\"msg\\":\\"Hello\\"}"
    `
    );

    const { stdout: stdout6 } = await execaCommand(
      `${TestHelper.IntegrationExecutor} ${UsagePath} update dep node input1 input2 --msg Hello --pure pureValue`
    );
    expect(stdout6).toMatchInlineSnapshot(
      `
      "Update Dep Node Command
      --pure option: default value of pure
      --msg option: default value of msg
      inputs: [\\"input1\\",\\"input2\\"]
      options: {\\"pure\\":\\"pureValue\\",\\"msg\\":\\"Hello\\"}"
    `
    );

    const { stdout: stdout7 } = await execaCommand(
      `${TestHelper.IntegrationExecutor} ${UsagePath} update sys input1 input2 --msg Hello --pure pureValue`
    );
    expect(stdout7).toMatchInlineSnapshot(
      `
      "Update Sys Command
      --pure option: default value of pure
      --msg option: default value of msg
      inputs: [\\"input1\\",\\"input2\\"]
      options: {\\"pure\\":\\"pureValue\\",\\"msg\\":\\"Hello\\"}"
    `
    );

    const { stdout: stdout8 } = await execaCommand(
      `${TestHelper.IntegrationExecutor} ${UsagePath} run`
    );
    expect(stdout8).toMatchInlineSnapshot(
      `
      "Run Command
      --pure option: default value of pure
      --msg option: default value of msg
      inputs: []
      options: {\\"pure\\":\\"default value of pure\\",\\"msg\\":\\"default value of msg\\"}"
    `
    );

    const { stdout: stdout9 } = await execaCommand(
      `${TestHelper.IntegrationExecutor} ${UsagePath} r input1 input2 --msg Hello --pure pureValue --projects app1 app2 app3 --projects app`
    );
    expect(stdout9).toMatchInlineSnapshot(
      `
      "Run Command
      --pure option: default value of pure
      --msg option: default value of msg
      inputs: [\\"input1\\",\\"input2\\",\\"app2\\",\\"app3\\"]
      options: {\\"pure\\":\\"pureValue\\",\\"msg\\":\\"Hello\\"}"
    `
    );

    const { stdout: stdout10 } = await execaCommand(
      `${TestHelper.IntegrationExecutor} ${UsagePath} u d input1 input2 --msg Hello --pure pureValue`
    );
    expect(stdout10).toMatchInlineSnapshot(
      `
      "Update Dep Command
      --pure option: default value of pure
      --msg option: default value of msg
      inputs: [\\"input1\\",\\"input2\\"]
      options: {\\"pure\\":\\"pureValue\\",\\"msg\\":\\"Hello\\"}"
    `
    );

    const { stdout: stdout11 } = await execaCommand(
      `${TestHelper.IntegrationExecutor} ${UsagePath} u d n input1 input2 --msg Hello --pure pureValue`
    );
    expect(stdout11).toMatchInlineSnapshot(
      `
      "Update Dep Node Command
      --pure option: default value of pure
      --msg option: default value of msg
      inputs: [\\"input1\\",\\"input2\\"]
      options: {\\"pure\\":\\"pureValue\\",\\"msg\\":\\"Hello\\"}"
    `
    );
  });
});

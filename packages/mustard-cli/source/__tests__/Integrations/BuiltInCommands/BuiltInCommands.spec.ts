import { describe, it, expect } from "vitest";
import { execaCommand } from "execa";
import path from "path";

const UsagePath1 = path.resolve(__dirname, "./Usage1.ts");
const UsagePath2 = path.resolve(__dirname, "./Usage2.ts");

describe("IntegrationTesting:BuiltInCommandsHandle", () => {
  it("Usage 1", async () => {
    const { stdout: stdout1 } = await execaCommand(
      `ts-node-esm ${UsagePath1} -v`
    );
    expect(stdout1).toMatchInlineSnapshot(
      '"V 10.11.0"'
    );

    const { stdout: stdout2 } = await execaCommand(
      `ts-node-esm ${UsagePath1} --version`
    );
    expect(stdout2).toMatchInlineSnapshot(
      '"V 10.11.0"'
    );

    const { stdout: stdout3 } = await execaCommand(
      `ts-node-esm ${UsagePath1} -h`
    );
    expect(stdout3).toMatchInlineSnapshot(
      `
      "
      Command: root 

      Options: 

      "
    `
    );

    const { stdout: stdout4 } = await execaCommand(
      `ts-node-esm ${UsagePath1} --help`
    );
    expect(stdout4).toMatchInlineSnapshot(
      `
      "
      Command: root 

      Options: 

      "
    `
    );
  });

  it("Usage 2", async () => {
    const { stdout: stdout1 } = await execaCommand(
      `ts-node-esm ${UsagePath2} --help`
    );
    expect(stdout1).toMatchInlineSnapshot(
      `
      "
      Command: root 

      Options: 

      "
    `
    );
  });
});

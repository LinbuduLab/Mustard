import { describe, it, expect } from "vitest";
import { execaCommand } from "execa";
import path from "path";

const UsagePath1 = path.resolve(__dirname, "./Usage1.ts");
const UsagePath2 = path.resolve(__dirname, "./Usage2.ts");
const UsagePath3 = path.resolve(__dirname, "./Usage3.ts");

describe("IntegrationTesting:BuiltInCommandsHandle", () => {
  it("Usage 1", async () => {
    const { stdout: stdout1 } = await execaCommand(
      `ts-node-esm ${UsagePath1} -v`
    );
    expect(stdout1).toMatchInlineSnapshot('"V 10.11.0"');

    const { stdout: stdout2 } = await execaCommand(
      `ts-node-esm ${UsagePath1} --version`
    );
    expect(stdout2).toMatchInlineSnapshot('"V 10.11.0"');

    const { stdout: stdout3 } = await execaCommand(
      `ts-node-esm ${UsagePath1} -h`
    );
    expect(stdout3).toMatchInlineSnapshot(
      `
      "
      Usage:

      create-mustard-app

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
      Usage:

      create-mustard-app

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
      '"Usage: root"'
    );
  });

  it("Usage 3", async () => {
    const { stdout: stdout2 } = await execaCommand(
      `ts-node-esm ${UsagePath3} update --help`
    );
    expect(stdout2).toMatchInlineSnapshot(
      `
      "
      Command:

      update execute update command

      --name, name of the project
      --version, version of the project
      "
    `
    );

    const { stdout: stdout3 } = await execaCommand(
      `ts-node-esm ${UsagePath3} sync --help`
    );
    expect(stdout3).toMatchInlineSnapshot(
      `
      "
      Command:

      sync execute update command

      --name, -n, name of the project
      --type, -t, type of the project
      "
    `
    );
  });
});

import { describe, it, expect } from "vitest";
import { execaCommand } from "execa";
import path from "path";
import { TestHelper } from "../../Fixtures/TestHelper";

const UsagePath1 = path.resolve(__dirname, "./Usage1.ts");
const UsagePath2 = path.resolve(__dirname, "./Usage2.ts");
const UsagePath3 = path.resolve(__dirname, "./Usage3.ts");

describe("IntegrationTesting:BuiltInCommandsHandle", () => {
  it("Usage 1", async () => {
    const { stdout: stdout1 } = await execaCommand(
      `${TestHelper.IntegrationExecutor} ${UsagePath1} -v`
    );
    expect(stdout1).toMatchInlineSnapshot('"V 10.11.0"');

    const { stdout: stdout2 } = await execaCommand(
      `${TestHelper.IntegrationExecutor} ${UsagePath1} --version`
    );
    expect(stdout2).toMatchInlineSnapshot('"V 10.11.0"');

    const { stdout: stdout3 } = await execaCommand(
      `${TestHelper.IntegrationExecutor} ${UsagePath1} -h`
    );
    expect(stdout3).toMatchInlineSnapshot(
      `
      "this.options:  {
        allowUnknownOptions: true,
        enableVersion: [Function: enableVersion],
        lifeCycles: {
          onStart: [Function: onStart],
          onError: undefined,
          onComplete: [Function: onComplete]
        },
        didYouMean: true,
        enableUsage: false,
        ignoreValidationErrors: false
      }

      Usage:

        $ create-mustard-app 

      Options: 
      "
    `
    );

    const { stdout: stdout4 } = await execaCommand(
      `${TestHelper.IntegrationExecutor} ${UsagePath1} --help`
    );
    expect(stdout4).toMatchInlineSnapshot(
      `
      "this.options:  {
        allowUnknownOptions: true,
        enableVersion: [Function: enableVersion],
        lifeCycles: {
          onStart: [Function: onStart],
          onError: undefined,
          onComplete: [Function: onComplete]
        },
        didYouMean: true,
        enableUsage: false,
        ignoreValidationErrors: false
      }

      Usage:

        $ create-mustard-app 

      Options: 
      "
    `
    );
  });

  it("Usage 2", async () => {
    const { stdout: stdout1 } = await execaCommand(
      `${TestHelper.IntegrationExecutor} ${UsagePath2} --help`
    );
    expect(stdout1).toMatchInlineSnapshot(`
      "this.options:  {
        allowUnknownOptions: true,
        enableVersion: [Function: enableVersion],
        lifeCycles: {
          onStart: [Function: onStart],
          onError: undefined,
          onComplete: [Function: onComplete]
        },
        didYouMean: true,
        enableUsage: [Function: enableUsage],
        ignoreValidationErrors: false
      }
      Usage: root"
    `);
  });

  it("Usage 3", async () => {
    const { stdout: stdout2 } = await execaCommand(
      `${TestHelper.IntegrationExecutor} ${UsagePath3} update --help`
    );
    expect(stdout2).toMatchInlineSnapshot(
      `
      "
      Usage:

        $ LinbuduLab CLI update  [options]

      Command:
        update execute update command

      Options:
        --name, name of the project
        --version, version of the project
      "
    `
    );

    const { stdout: stdout3 } = await execaCommand(
      `${TestHelper.IntegrationExecutor} ${UsagePath3} sync --help`
    );
    expect(stdout3).toMatchInlineSnapshot(
      `
      "
      Usage:

        $ LinbuduLab CLI sync  [options]

      Command:
        sync execute update command

      Options:
        --name, -n, name of the project
        --type, -t, type of the project
      "
    `
    );
  });
});

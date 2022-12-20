import { describe, it, expect } from "vitest";
import { execaCommand } from "execa";
import path from "path";

const UsagePath1 = path.resolve(__dirname, "./Usage.ts");

describe("IntegrationTesting:CommonCommandHandle", () => {
  it("should dispatch command", async () => {
    const { stdout: stdout1 } = await execaCommand(
      `ts-node-esm ${UsagePath1} run`
    );
    expect(stdout1).toMatchInlineSnapshot(
      `
      "--msg option: default value of msg
      --projects option: 
      inputs: 
      options: {}"
    `
    );
  });
});

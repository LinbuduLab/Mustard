import { describe, it, expect } from "vitest";
import { execaCommand } from "execa";
import path from "path";

const UsagePath1 = path.resolve(__dirname, "./Usage.ts");

describe("IntegrationTesting:RootCommandHandle", () => {
  it("should use root command as handler", async () => {
    const { stdout: stdout1 } = await execaCommand(`ts-node-esm ${UsagePath1}`);
    expect(stdout1).toMatchInlineSnapshot(
      `
      "--msg option: default value of msg
      --projects option: 
      inputs: 
      options: {\\"msg\\":\\"default value of msg\\",\\"projects\\":[]}"
    `
    );

    const { stdout: stdout2 } = await execaCommand(
      `ts-node-esm ${UsagePath1} --msg Hello`
    );
    expect(stdout2).toMatchInlineSnapshot(
      `
      "--msg option: Hello
      --projects option: 
      inputs: 
      options: {\\"msg\\":\\"Hello\\",\\"projects\\":[]}"
    `
    );

    const { stdout: stdout3 } = await execaCommand(
      `ts-node-esm ${UsagePath1} --msg Hello --projects app1 app2 app3`
    );
    expect(stdout3).toMatchInlineSnapshot(
      `
      "--msg option: Hello
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
      "--msg option: Hello
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
      "--msg option: Hello
      --projects option: app1,app2,app3
      inputs: enhance
      options: {\\"msg\\":\\"Hello\\",\\"projects\\":[]}"
    `
    );
  });
});

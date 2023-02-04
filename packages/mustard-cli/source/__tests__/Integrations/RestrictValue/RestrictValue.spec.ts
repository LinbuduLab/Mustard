import { describe, it, expect } from "vitest";
import { execaCommand } from "execa";
import { TestHelper } from "../../Fixtures/TestHelper";
import path from "path";

const UsagePath = path.resolve(__dirname, "./Usage.ts");

describe("IntegrationTesting:RestrictedValues", () => {
  it("should apply restriction", async () => {
    const { stdout: stdoutWithRoot1 } = await execaCommand(
      `${TestHelper.IntegrationExecutor} ${UsagePath}`
    );
    expect(stdoutWithRoot1).toMatchInlineSnapshot(`
      "Root Command
      --notRestrict option: default value of notRestrict
      --restrictedArrayTypeOption option: foo
      --restrictedObjectTypeOption option: foo
      --restrictedEnumTypeOption option: foo"
    `);

    const { stdout: stdoutWithRoot2 } = await execaCommand(
      `${TestHelper.IntegrationExecutor} ${UsagePath} --notRestrict foo --restrictedArrayTypeOption foo --restrictedObjectTypeOption foo --restrictedEnumTypeOption foo`
    );
    expect(stdoutWithRoot2).toMatchInlineSnapshot(`
      "Root Command
      --notRestrict option: default value of notRestrict
      --restrictedArrayTypeOption option: foo
      --restrictedObjectTypeOption option: foo
      --restrictedEnumTypeOption option: foo"
    `);

    const { stdout: stdoutWithRoot3 } = await execaCommand(
      `${TestHelper.IntegrationExecutor} ${UsagePath} --notRestrict foo --restrictedArrayTypeOption foo --restrictedObjectTypeOption foo --restrictedEnumTypeOption foo`
    );
    expect(stdoutWithRoot3).toMatchInlineSnapshot(`
      "Root Command
      --notRestrict option: default value of notRestrict
      --restrictedArrayTypeOption option: foo
      --restrictedObjectTypeOption option: foo
      --restrictedEnumTypeOption option: foo"
    `);

    const { stdout: stdoutWithRoot4 } = await execaCommand(
      `${TestHelper.IntegrationExecutor} ${UsagePath} --notRestrict qux --restrictedArrayTypeOption qux --restrictedObjectTypeOption qux --restrictedEnumTypeOption qux`
    );
    expect(stdoutWithRoot4).toMatchInlineSnapshot(`
      "Root Command
      --notRestrict option: default value of notRestrict
      --restrictedArrayTypeOption option: foo
      --restrictedObjectTypeOption option: foo
      --restrictedEnumTypeOption option: foo"
    `);
  });
});

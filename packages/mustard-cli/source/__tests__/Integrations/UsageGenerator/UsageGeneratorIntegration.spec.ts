import { test, it, expect } from "vitest";
import { execaCommand } from "execa";
import { TestHelper } from "../../Fixtures/TestHelper";
import path from "path";

test("IntegrationTesting:UsageGenerator:NoRootAndCommonCommandsProvidedAndDisableUsageInfo", async () => {
  const UsagePath = path.resolve(
    __dirname,
    "./NoRootAndCommonCommandsProvidedAndDisableUsageInfo.usage.ts"
  );

  try {
    await execaCommand(`${TestHelper.IntegrationExecutor} ${UsagePath}`);
  } catch (error) {
    expect(error.stderr).toMatchInlineSnapshot(`
      "file:///Users/linbudu/Desktop/OpenSource/Mustard/packages/mustard-cli/source/Commands/CommandLine.ts:229
            throw new NoRootHandlerError();
                  ^
      NoRootHandlerError: No root handler found, please provide command decorated with '@RootCommand' or enable option enableUsage for usage info generation.
          at CLI.dispatchRootHandler (file:///Users/linbudu/Desktop/OpenSource/Mustard/packages/mustard-cli/source/Commands/CommandLine.ts:229:13)
          at CLI.start (file:///Users/linbudu/Desktop/OpenSource/Mustard/packages/mustard-cli/source/Commands/CommandLine.ts:142:26)
          at file:///Users/linbudu/Desktop/OpenSource/Mustard/packages/mustard-cli/source/__tests__/Integrations/UsageGenerator/NoRootAndCommonCommandsProvidedAndDisableUsageInfo.usage.ts:13:30
          at ModuleJob.run (node:internal/modules/esm/module_job:194:25)"
    `);
  }
});
test("IntegrationTesting:UsageGenerator:NoRootAndCommonCommandsProvided", async () => {
  const UsagePath = path.resolve(
    __dirname,
    "./NoRootAndCommonCommandsProvided.usage.ts"
  );

  const { stdout } = await execaCommand(
    `${TestHelper.IntegrationExecutor} ${UsagePath}`
  );
  expect(stdout).toMatchInlineSnapshot(`
    "
    Usage:

      $ mm [command] [--options]
    "
  `);
});

test("IntegrationTesting:UsageGenerator:NoRootCommandButAtLeastOneCommandProvided", async () => {
  const UsagePath = path.resolve(
    __dirname,
    "./NoRootCommandButAtLeastOneCommandProvided.usage.ts"
  );

  const { stdout } = await execaCommand(
    `${TestHelper.IntegrationExecutor} ${UsagePath}`
  );
  expect(stdout).toMatchInlineSnapshot(`
    "
    Usage:

      $ mm [command] [--options]

    Command:
      update, u, update command

    Options:
      --msg, -m, default: \\"default value of msg\\"
      --notice, default: \\"default value of notice\\"
      --projects, -p, default: []
    "
  `);
});

test("IntegrationTesting:UsageGenerator:NoRootCommandButMultipleCommandsRegistered", async () => {
  const UsagePath = path.resolve(
    __dirname,
    "./NoRootCommandButMultipleCommandsRegistered.usage.ts"
  );

  const { stdout } = await execaCommand(
    `${TestHelper.IntegrationExecutor} ${UsagePath}`
  );
  expect(stdout).toMatchInlineSnapshot(`
    "
    Usage:

      $ mm [command] [--options]

    Command:
      update, u, update command

    Options:
      --msg, -m, default: \\"default value of msg\\"
      --notice, default: \\"default value of notice\\"
      --projects, -p, default: []

    Command:
      sync, s, sync command

    Options:
      --msg, -m, default: \\"default value of msg\\"
      --notice, default: \\"default value of notice\\"
      --projects, -p, default: []
    "
  `);
});

test.only("IntegrationTesting:UsageGenerator:RootAndNestedCommandsProvided", async () => {
  const UsagePath = path.resolve(
    __dirname,
    "./RootAndNestedCommandsProvided.usage.ts"
  );

  const { stdout: stdout1 } = await execaCommand(
    `${TestHelper.IntegrationExecutor} ${UsagePath} --help`
  );
  expect(stdout1).toMatchInlineSnapshot(`
    "
    Usage:

      $ mm [these_are_inputs, description of inputs]

    Options: 
      --msg -m, default: \\"default value of msg\\"
      --notice, default: \\"default value of notice\\"
      --projects -p, default: []
    "
  `);

  const { stdout: stdout2 } = await execaCommand(
    `${TestHelper.IntegrationExecutor} ${UsagePath} update --help`
  );
  expect(stdout2).toMatchInlineSnapshot(`
    "
    Usage:

      $ mm update [these_are_inputs] [options]


    Command:
      update, u, update command

    Child Command:
      account, a, update account commandxxx
      sys, s, update sys command

    Run 'mm update [child command] --help' for more information on child command.

    Options:
      --msg, -m, default: \\"default value of msg\\"
      --notice, default: \\"default value of notice\\"
      --projects, -p, description of projects, default: []
    "
  `);

  const { stdout: stdout3 } = await execaCommand(
    `${TestHelper.IntegrationExecutor} ${UsagePath} update account --help`
  );
  expect(stdout3).toMatchInlineSnapshot(`
    "
    Usage:

      $ mm account [these_are_inputs] [options]


    Command:
      account, a, update account commandxxx

    Options:
      --msg, -m, default: \\"default value of msg\\"
      --notice, default: \\"default value of notice\\"
      --projects, -p, default: []
    "
  `);
});

test("IntegrationTesting:UsageGenerator:RootCommandAndCommonCommandsProvided", async () => {
  const UsagePath = path.resolve(
    __dirname,
    "./RootCommandAndCommonCommandsProvided.usage.ts"
  );

  const { stdout: stdout1 } = await execaCommand(
    `${TestHelper.IntegrationExecutor} ${UsagePath}`
  );
  expect(stdout1).toMatchInlineSnapshot('""');

  const { stdout: stdout2 } = await execaCommand(
    `${TestHelper.IntegrationExecutor} ${UsagePath} --help`
  );
  expect(stdout2).toMatchInlineSnapshot(`
    "
    Usage:

      $ mm [these_are_inputs, description of inputs]

    Options: 
      --msg -m, default: \\"default value of msg\\"
      --notice, default: \\"default value of notice\\"
      --projects -p, default: []
    "
  `);

  const { stdout: stdout3 } = await execaCommand(
    `${TestHelper.IntegrationExecutor} ${UsagePath} update --help`
  );
  expect(stdout3).toMatchInlineSnapshot(`
    "
    Usage:

      $ mm update


    Command:
      update, u, update command

    Options:
      --msg, -m, default: \\"default value of msg\\"
      --notice, default: \\"default value of notice\\"
      --projects, -p, default: []
    "
  `);
});

test("IntegrationTesting:UsageGenerator:RootCommandOnly", async () => {
  const UsagePath = path.resolve(__dirname, "./RootCommandOnly.usage.ts");

  const { stdout } = await execaCommand(
    `${TestHelper.IntegrationExecutor} ${UsagePath} --help`
  );
  expect(stdout).toMatchInlineSnapshot(`
    "
    Usage:

      $ mm [these_are_inputs, description of inputs]

    Options: 
      --msg -m, default: \\"default value of msg\\"
      --notice, default: \\"default value of notice\\"
      --projects -p, default: []
    "
  `);
});

import { describe, it, expect } from "vitest";
import { execaCommand } from "execa";
import path from "path";

const UsagePath = path.resolve(__dirname, "./Usage.ts");

describe("IntegrationTesting:MultiRootCommands", () => {
  it("should throw error", async () => {
    const { stderr } = await execaCommand(`ts-node-esm ${UsagePath}`, {
      reject: false,
    });
    expect(stderr).toMatchInlineSnapshot(
      `
        "/Users/linbudu/Desktop/OpenSource/Mustard/packages/mustard-cli/source/__tests__/Integrations/MultiRootCommands/Usage.ts:13
          @Option()
                                               ^
        MultiRootCommandError: Multiple root command detected, RootCommand RootCommandHandle1 was already registered, and now RootCommandHandle2 is also registered as root command
            at /Users/linbudu/Desktop/OpenSource/Mustard/packages/mustard-cli/source/Decorators/Command.ts:218:15
            at __esDecorate (/Users/linbudu/Desktop/OpenSource/Mustard/packages/mustard-cli/source/__tests__/Integrations/MultiRootCommands/Usage.ts:13:40)
            at /Users/linbudu/Desktop/OpenSource/Mustard/packages/mustard-cli/source/__tests__/Integrations/MultiRootCommands/Usage.ts:38:1
            at /Users/linbudu/Desktop/OpenSource/Mustard/packages/mustard-cli/source/__tests__/Integrations/MultiRootCommands/Usage.ts:130:7
            at Object.<anonymous> (/Users/linbudu/Desktop/OpenSource/Mustard/packages/mustard-cli/source/__tests__/Integrations/MultiRootCommands/Usage.ts:132:3)
            at Module._compile (internal/modules/cjs/loader.js:1085:14)
            at Module.m._compile (/Users/linbudu/Desktop/OpenSource/Mustard/node_modules/.pnpm/ts-node@10.9.1_3wpmmxphde7mszzmvhplwryuka/node_modules/ts-node/src/index.ts:1618:23)
            at Module._extensions..js (internal/modules/cjs/loader.js:1114:10)
            at Object.require.extensions.<computed> [as .ts] (/Users/linbudu/Desktop/OpenSource/Mustard/node_modules/.pnpm/ts-node@10.9.1_3wpmmxphde7mszzmvhplwryuka/node_modules/ts-node/src/index.ts:1621:12)
            at Module.load (internal/modules/cjs/loader.js:950:32) {
          existClass: [class RootCommandHandle1],
          incomingClass: [class RootCommandHandle2]
        }"
      `
    );
  });
});

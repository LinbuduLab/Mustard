import { describe, it, expect, vi, beforeEach } from "vitest";
import { MustardFactory, Context, MustardUtils } from "../../Exports";
import {
  Command,
  RootCommand,
  Option,
  VariadicOption,
  App,
  Ctx,
  Input,
  Inject,
  Utils,
  Options,
} from "../../Exports/Decorators";
import { Validator } from "../../Exports/Validator";
import { CommandStruct, MustardApp } from "../../Exports/ComanndLine";
import { RootCommandHandle } from "../Fixtures/UsageFixtures";

describe("IntegrationTesting:NestingCommandInputs", () => {
  it("should handle nested commands", () => {});
});

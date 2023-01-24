import { describe, it, expect, vi, beforeEach } from "vitest";

import { CommandNotFoundError } from "../Errors/CommandNotFoundError";
import { MultiRootCommandError } from "../Errors/MultiRootCommandError";
import { NoRootHandlerError } from "../Errors/NoRootHandlerError";
import { NullishFactoryOptionError } from "../Errors/NullishFactoryOptionError";
import { UnknownOptionsError } from "../Errors/UnknownOptionsError";
import { ValidationError } from "../Errors/ValidationError";

describe("Mustard Errors", () => {
  it("should produce CommandNotFoundError", () => {
    const error = new CommandNotFoundError({ _: [] });
    expect(error.name).toBe("CommandNotFoundError");
    expect(error.message).toMatchInlineSnapshot(`
      "Command not found with parsed args: {
        \\"_\\": []
      }"
    `);
  });

  it("should produce MultiRootCommandError", () => {
    class Foo {}

    class Bar {}
    const error = new MultiRootCommandError(Foo, Bar);
    expect(error.name).toBe("MultiRootCommandError");
    expect(error.message).toMatchInlineSnapshot(
      '"Multiple root command detected, RootCommand Foo was already registered, and now Bar is also registered as root command"'
    );
  });

  it("should produce NoRootHandlerError", () => {
    const error = new NoRootHandlerError();
    expect(error.name).toBe("NoRootHandlerError");
    expect(error.message).toMatchInlineSnapshot(
      "\"No root handler found, please provide command decorated with '@RootCommand' or enable option enableUsage for usage info generation.\""
    );
  });

  it("should produce NullishFactoryOptionError", () => {
    const error = new NullishFactoryOptionError();
    expect(error.name).toBe("NullishFactoryOptionError");
    expect(error.message).toMatchInlineSnapshot(
      '"Mustard factory option not initialized, use @App to initialize entry class"'
    );
  });

  it("should produce UnknownOptionsError", () => {
    const error = new UnknownOptionsError(["foo", "bar"]);
    expect(error.name).toBe("UnknownOptionsError");
    expect(error.message).toMatchInlineSnapshot(
      '"Unknown options: foo, bar. See --help for usage."'
    );
  });
});

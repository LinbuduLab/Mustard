import { describe, it, expect, vi, beforeEach } from "vitest";
import { CommandRegistry } from "../Components/Registry";

describe("Registry", () => {
  it("should register and provide init payload", () => {
    const payload = {
      description: "foo",
      handler: () => {},
      run: () => {},
    };

    CommandRegistry.registerInit("foo", payload);

    expect(CommandRegistry.provideInit("foo")).toEqual(payload);
    expect(Array.from(CommandRegistry.provideInit().keys())).toEqual(["foo"]);
    expect(Array.from(CommandRegistry.provideInit().values())).toEqual([
      payload,
    ]);
  });

  it("should register and provide", () => {
    const payload = {
      description: "foo",
      handler: () => {},
      run: () => {},
    };

    CommandRegistry.register("foo", payload);

    expect(CommandRegistry.provide("foo")).toEqual(payload);
    expect(Array.from(CommandRegistry.provide().keys())).toEqual(["foo"]);
    expect(Array.from(CommandRegistry.provide().values())).toEqual([payload]);
  });

  it("should upsert from registry", () => {
    const payload = {
      description: "foo",
      handler: () => {},
      run: () => {},
    };

    CommandRegistry.register("foo", payload);

    CommandRegistry.upsert("foo", { description: "bar" });
    CommandRegistry.upsert("bar", { description: "bar" });

    expect(CommandRegistry.provide("foo").description).toBe("bar");
    expect(CommandRegistry.provide("bar").description).toBe("bar");
  });

  it("should handle root", () => {
    CommandRegistry.register("root", { description: "root" });

    expect(CommandRegistry.provideRootCommand()).toEqual({
      description: "root",
    });
  });
});

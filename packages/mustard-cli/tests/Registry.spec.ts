import { describe, it, expect, vi, beforeEach } from "vitest";
import { MustardRegistry } from "../Components/Registry";

describe("Registry", () => {
  it("should register and provide init payload", () => {
    const payload = {
      description: "foo",
      handler: () => {},
      run: () => {},
    };

    MustardRegistry.registerInit("foo", payload);

    expect(MustardRegistry.provideInit("foo")).toEqual(payload);
    expect(Array.from(MustardRegistry.provideInit().keys())).toEqual(["foo"]);
    expect(Array.from(MustardRegistry.provideInit().values())).toEqual([
      payload,
    ]);
  });

  it("should register and provide", () => {
    const payload = {
      description: "foo",
      handler: () => {},
      run: () => {},
    };

    MustardRegistry.register("foo", payload);

    expect(MustardRegistry.provide("foo")).toEqual(payload);
    expect(Array.from(MustardRegistry.provide().keys())).toEqual(["foo"]);
    expect(Array.from(MustardRegistry.provide().values())).toEqual([payload]);
  });

  it("should upsert from registry", () => {
    const payload = {
      description: "foo",
      handler: () => {},
      run: () => {},
    };

    MustardRegistry.register("foo", payload);

    MustardRegistry.upsert("foo", { description: "bar" });
    MustardRegistry.upsert("bar", { description: "bar" });

    expect(MustardRegistry.provide("foo").description).toBe("bar");
    expect(MustardRegistry.provide("bar").description).toBe("bar");
  });

  it("should handle root", () => {
    MustardRegistry.register("root", { description: "root" });

    expect(MustardRegistry.provideRootCommand()).toEqual({
      description: "root",
    });
  });
});

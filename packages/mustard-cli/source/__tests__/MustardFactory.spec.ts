import { describe, it, expect, vi, beforeEach } from "vitest";

import { MustardApp } from "../Exports/ComanndLine";
import { NullishFactoryOptionError } from "../Errors/NullishFactoryOptionError";
import { MustardFactory } from "../Components/MustardFactory";

const fn1 = vi.fn();
const fn2 = vi.fn();
const fn3 = vi.fn();

vi.mock("../Command/CommandLine.ts", () => {
  return {
    CLI: class CLI {
      constructor(...args: unknown[]) {
        fn1(...args);
      }
      registerProvider(providers: unknown[]) {
        fn2(providers);
      }
      configure(config: unknown) {
        fn3(config);
      }
    },
  };
});

describe.skip("Mustard Factory", () => {
  it("should throw on no config provided", () => {
    try {
      class Project implements MustardApp {}
      MustardFactory.init(Project);
    } catch (error) {
      expect(error).toBeInstanceOf(NullishFactoryOptionError);
    }
  });
  it("should handle factory initialization", () => {
    @MustardFactory.App({
      name: "Project",
      commands: [],
      configurations: {
        allowUnknownOptions: true,
      },
      providers: [],
    })
    class Project implements MustardApp {}

    MustardFactory.init(Project);

    expect(fn1).toBeCalledWith("Project", [], {
      allowUnknownOptions: true,
    });

    expect(fn2).toBeCalledWith([]);

    expect(fn3).toBeCalledWith({
      lifeCycles: {
        onStart: undefined,
        onError: undefined,
        onComplete: undefined,
      },
    });

    try {
      MustardFactory.init(Project);
    } catch (error) {
      expect(error).toBeInstanceOf(NullishFactoryOptionError);
    }
  });
});

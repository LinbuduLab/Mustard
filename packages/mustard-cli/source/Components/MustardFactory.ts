import { CLI } from "../Command/CommandLine";

import type { MustardLifeCycle } from "../Typings/Factory.struct";
import type { AppFactoryOptions } from "../Typings/configuration.struct";
import type { Constructable } from "../Typings/Shared.struct";
import type { AnyClassDecoratorReturnType } from "../Typings/Temp";

export class MustardFactory {
  private static FactoryOptions: AppFactoryOptions;

  public static App(
    configuration: AppFactoryOptions
  ): AnyClassDecoratorReturnType {
    return (target, context) => {
      MustardFactory.FactoryOptions = configuration;
    };
  }

  public static init(Cls: Constructable<MustardLifeCycle>): CLI {
    const ins = new Cls();

    const {
      name,
      commands,
      configurations = {},
    } = MustardFactory.FactoryOptions;

    const cli = new CLI(name ?? "", commands, configurations);

    cli.configure({
      lifeCycles: {
        onStart: ins.onStart,
        onError: ins.onError,
        onComplete: ins.onComplete,
      },
    });

    return cli;
  }
}

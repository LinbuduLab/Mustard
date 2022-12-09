import { CLI } from "../Command/CommandLine";

import type { MustardApp } from "../Typings/Factory.struct";
import type { AppFactoryOptions } from "../Typings/configuration.struct";
import type { Constructable } from "../Typings/Shared.struct";
import type { AnyClassDecoratorReturnType } from "../Typings/Temp";

export class MustardFactory {
  private static FactoryOptions: AppFactoryOptions;

  public static App(
    configuration: AppFactoryOptions
  ): AnyClassDecoratorReturnType {
    return () => {
      MustardFactory.FactoryOptions = configuration;
    };
  }

  public static init(Cls: Constructable<MustardApp>): CLI {
    const ins = new Cls();

    const {
      name,
      commands,
      configurations = {},
      providers = [],
    } = MustardFactory.FactoryOptions;

    const cli = new CLI(name ?? "", commands, configurations);

    cli.registerProvider(providers);

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

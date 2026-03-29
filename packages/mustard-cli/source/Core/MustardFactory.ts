import { CLI } from "./CommandLine";
import { NullishFactoryOptionError } from "../Errors/NullishFactoryOptionError";

import type { MustardApp } from "../Typings/Factory.struct";
import type { AppFactoryOptions } from "../Typings/Configuration.struct";
import type { Constructable, Nullable } from "../Typings/Shared.struct";
import type { ClassDecoratorImpl } from "../Typings/Decorator.struct";

export class MustardFactory {
  private static FactoryOptions: Nullable<AppFactoryOptions> = null;

  /**
   * Register application entry handler
   * @returns
   */
  public static App(configuration: AppFactoryOptions): ClassDecoratorImpl {
    return () => {
      MustardFactory.FactoryOptions = configuration;
    };
  }

  private static flush(): void {
    MustardFactory.FactoryOptions = null;
  }

  /**
   * Initialize application
   * @param Cls
   * @returns
   */
  public static init(Cls: Constructable<MustardApp>): CLI {
    if (!MustardFactory.FactoryOptions) throw new NullishFactoryOptionError();

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

    MustardFactory.flush();

    return cli;
  }
}

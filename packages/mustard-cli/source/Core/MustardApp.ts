import { MustardCommandLine } from "./CommandLine.js";
import { NullishAppFactoryOptionError } from "../Errors/NullishAppFactoryOptionError.js";

import type { MustardLifecycle } from "../Typings/Lifecycle.struct.js";
import type { AppFactoryOptions } from "../Typings/Configuration.struct.js";
import type { Constructable, Nullable } from "../Typings/Shared.struct.js";
import type { ClassDecoratorImpl } from "../Typings/Decorator.struct.js";

export class MustardApp {
  private static AppFactoryOptions: Nullable<AppFactoryOptions> = null;

  /**
   * Register application entry handler
   * @returns
   */
  public static App(appFactoryOptions: AppFactoryOptions): ClassDecoratorImpl {
    return () => {
      MustardApp.AppFactoryOptions = appFactoryOptions;
    };
  }

  private static flush(): void {
    MustardApp.AppFactoryOptions = null;
  }

  /**
   * Initialize application
   * @param Cls
   * @returns
   */
  public static start(
    Cls: Constructable<MustardLifecycle>,
  ): MustardCommandLine {
    if (!MustardApp.AppFactoryOptions) throw new NullishAppFactoryOptionError();

    const ins = new Cls();

    const {
      name,
      commands,
      configurations = {},

      providers = [],
    } = MustardApp.AppFactoryOptions;

    const cli = new MustardCommandLine(name ?? "", commands, configurations);

    cli.registerProvider(providers);

    cli.configure({
      lifeCycles: {
        onStart: ins.onStart,
        onError: ins.onError,
        onComplete: ins.onComplete,
      },
    });

    MustardApp.flush();

    cli.startCommandLine();

    return cli;
  }
}

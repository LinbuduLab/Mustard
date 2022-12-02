import { AppFactoryOptions } from "source/Typings/configuration.struct";
import { MustardLifeCycle } from "source/Typings/Factory.struct";
import { Constructable, Dictionary } from "source/Typings/Shared.struct";
import { AnyClassDecoratorReturnType } from "source/Typings/Temp";
import { CLI } from "../Command/CommandLine";

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

    const cli = new CLI(name, commands, configurations);

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

import { AppFactoryOptions } from "source/Typings/configuration.struct";
import { Dictionary } from "source/Typings/Shared.struct";
import { CLI } from "../Command/CommandLine";

export abstract class IMustardLifeCycle {
  abstract onStart?(): void;
  abstract onError?(): void;
  abstract onComplete?(): void;
}

export class MustardFactory {
  private static FactoryOptions: AppFactoryOptions;

  public static App(
    configuration: AppFactoryOptions
  ): ClassDecoratorFunction<{}, any> {
    return (target, context) => {
      MustardFactory.FactoryOptions = configuration;
    };
  }

  public static init(Cls: new () => IMustardLifeCycle): CLI {
    const ins = new Cls();

    ins.onStart?.();

    // 这个 Cls 肯定不能完全没作用，要不把生命周期放这里？
    const {
      name,
      commands,
      configurations = {},
    } = MustardFactory.FactoryOptions;

    const cli = new CLI(name, commands, configurations);

    return cli;
  }
}

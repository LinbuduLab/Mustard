import { Dictionary } from "source/Typings/Shared.struct";
import { CLI } from "../Command/CommandLine";

export abstract class IMustardLifeCycle {
  abstract onStart?(): void;
  abstract onError?(): void;
  abstract onComplete?(): void;
}

export class MustardFactory {
  private static infoCollection: Dictionary = {};

  public static App(info: Dictionary): ClassDecoratorFunction<{}, any> {
    return (target, context) => {
      MustardFactory.infoCollection = info;
    };
  }

  public static init(Cls: new () => IMustardLifeCycle): CLI {
    const ins = new Cls();

    ins.onStart?.();

    // 这个 Cls 肯定不能完全没作用，要不把生命周期放这里？
    const { name, commands } = MustardFactory.infoCollection;

    const cli = new CLI(name as string, commands as any[]);

    return cli;
  }
}

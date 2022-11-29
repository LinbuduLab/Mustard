import { MustardConstanst } from "source/Components/Constants";
import { CommandRegistryPayload } from "source/types/Command.struct";
import { CommandRegistry } from "../Types/Instantiation.struct";

export class MustardRegistry {
  private static _CommandRegistry = new CommandRegistry();

  public static get CommandRegistry() {
    return MustardRegistry._CommandRegistry;
  }

  public static register(identifier: string, payload: CommandRegistryPayload) {
    MustardRegistry._CommandRegistry.set(identifier, payload);
  }

  public static provide(identifier: string) {
    return MustardRegistry._CommandRegistry.get(identifier);
  }

  public static provideRootCommand(): CommandRegistryPayload {
    return MustardRegistry.provide(MustardConstanst.RootCommandRegistryKey);
  }
}

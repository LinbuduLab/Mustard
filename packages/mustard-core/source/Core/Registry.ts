import { MustardConstanst } from "source/Components/Constants";
import { CommandRegistryPayload } from "source/Typings/Command.struct";
import { CommandRegistry } from "../Typings/Instantiation.struct";

export class MustardRegistry {
  private static _CommandRegistry = new CommandRegistry();

  public static get CommandRegistry() {
    return MustardRegistry._CommandRegistry;
  }

  public static register(identifier: string, payload: CommandRegistryPayload) {
    MustardRegistry._CommandRegistry.set(identifier, payload);
  }

  public static upsert(
    identifier: string,
    payload: Partial<CommandRegistryPayload>
  ) {
    const prev = MustardRegistry.provide(identifier);

    if (prev) {
      MustardRegistry.register(identifier, {
        ...prev,
        ...payload,
      });
    } else {
      MustardRegistry.register(identifier, payload as CommandRegistryPayload);
    }
  }

  public static provide(): Map<string, CommandRegistryPayload>;
  public static provide(identifier: string): CommandRegistryPayload;
  public static provide(identifier?: string) {
    return identifier
      ? MustardRegistry._CommandRegistry.get(identifier)
      : MustardRegistry._CommandRegistry;
  }

  public static provideRootCommand(): CommandRegistryPayload {
    return MustardRegistry.provide(MustardConstanst.RootCommandRegistryKey);
  }

  public static VariadicOptions = new Set<string>();

  public static ExternalProviderRegistry = new Map<string, unknown>();
}

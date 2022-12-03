import { MustardConstanst } from "../Components/Constants";

import type { CommandRegistryPayload } from "../Typings/Command.struct";

const CommandRegistry = Map<string, CommandRegistryPayload>;

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
      MustardRegistry.register(identifier, <CommandRegistryPayload>payload);
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

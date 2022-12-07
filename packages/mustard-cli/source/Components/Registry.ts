import { MustardConstanst } from "./Constants";

import type { CommandRegistryPayload } from "../Typings/Command.struct";
import type { Dictionary } from "../Typings/Shared.struct";

const CommandRegistry = Map<string, CommandRegistryPayload>;

export class MustardRegistry {
  private static InitCommandRegistry = new CommandRegistry();

  private static CommandRegistry = new CommandRegistry();

  public static registerInit(
    identifier: string,
    payload: CommandRegistryPayload
  ) {
    MustardRegistry.InitCommandRegistry.set(identifier, payload);
  }

  public static register(identifier: string, payload: CommandRegistryPayload) {
    MustardRegistry.CommandRegistry.set(identifier, payload);
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

  public static provideInit(): Map<string, CommandRegistryPayload>;
  public static provideInit(identifier: string): CommandRegistryPayload;
  public static provideInit(identifier?: string) {
    return identifier
      ? MustardRegistry.InitCommandRegistry.get(identifier)
      : MustardRegistry.InitCommandRegistry;
  }

  public static provide(): Map<string, CommandRegistryPayload>;
  public static provide(identifier: string): CommandRegistryPayload;
  public static provide(identifier?: string) {
    return identifier
      ? MustardRegistry.CommandRegistry.get(identifier)
      : MustardRegistry.CommandRegistry;
  }

  public static provideRootCommand(): CommandRegistryPayload {
    return MustardRegistry.provide(MustardConstanst.RootCommandRegistryKey);
  }

  public static VariadicOptions = new Set<string>();

  // raw - alias
  public static OptionAliasMap: Dictionary<string> = {};

  public static ExternalProviderRegistry = new Map<string, unknown>();
}

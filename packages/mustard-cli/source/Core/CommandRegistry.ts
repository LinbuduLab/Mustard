import { MustardConstanst } from "../Utils/Constants.js";

import type { CommandRegistryPayload } from "../Typings/Command.struct.js";
import type { Dictionary } from "../Typings/Shared.struct.js";

const CommandRegistryMap = Map<string, Partial<CommandRegistryPayload>>;

export class CommandRegistry {
  private static InitCommandRegistry = new CommandRegistryMap();

  private static CommandRegistry = new CommandRegistryMap();

  public static registerInit(
    identifier: string,
    payload: Partial<CommandRegistryPayload>
  ) {
    CommandRegistry.InitCommandRegistry.set(identifier, payload);
  }

  public static register(
    identifier: string,
    payload: Partial<CommandRegistryPayload>
  ) {
    CommandRegistry.CommandRegistry.set(identifier, payload);
  }

  public static upsert(
    identifier: string,
    payload: Partial<CommandRegistryPayload>
  ) {
    const prev = CommandRegistry.provide(identifier);

    if (prev) {
      CommandRegistry.register(identifier, {
        ...prev,
        ...payload,
      });
    } else {
      CommandRegistry.register(identifier, <CommandRegistryPayload>payload);
    }
  }

  public static provideInit(): Map<string, CommandRegistryPayload>;
  public static provideInit(identifier: string): CommandRegistryPayload;
  public static provideInit(identifier?: string) {
    return identifier
      ? CommandRegistry.InitCommandRegistry.get(identifier)
      : CommandRegistry.InitCommandRegistry;
  }

  public static provide(): Map<string, CommandRegistryPayload>;
  public static provide(identifier: string): CommandRegistryPayload;
  public static provide(identifier?: string) {
    return identifier
      ? CommandRegistry.CommandRegistry.get(identifier)
      : CommandRegistry.CommandRegistry;
  }

  public static provideRootCommand(): CommandRegistryPayload {
    return CommandRegistry.provide(MustardConstanst.RootCommandRegistryKey);
  }
}

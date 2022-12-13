import type { MaybeFactory, Constructable } from "./Shared.struct";

export type Provider =
  | {
      identifier: unknown;
      value: MaybeFactory<unknown>;
      // value: MaybeFactory<unknown> | MaybeAsyncFactory<unknown>;
    }
  | Constructable;

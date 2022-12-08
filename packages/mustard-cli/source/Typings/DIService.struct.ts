import type { MaybeFactory, MaybeAsyncFactory } from "./Shared.struct";

export type Provider = {
  identifier: unknown;
  value: MaybeFactory<unknown>;
  // value: MaybeFactory<unknown> | MaybeAsyncFactory<unknown>;
};

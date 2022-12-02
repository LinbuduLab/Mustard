export type Dictionary<T = unknown> = Record<string, T>;

export type FuncStruct<
  TArgs extends unknown[] = unknown[],
  TReturnType extends unknown = unknown
> = (...args: TArgs) => Promise<TReturnType>;

export type ClassStruct<TInstanceType extends unknown = unknown> = new (
  ...args: any[]
) => TInstanceType;

export type Nullable<T> = T | null;

export type MaybeFactory<T> = T | (() => T);

export type MaybePromise<T> = T | Promise<T>;

export type Constructable<T> = new (...args: any[]) => T;

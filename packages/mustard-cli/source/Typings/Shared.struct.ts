import { ZodType } from "zod";

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

export type MaybeArray<T> = T | T[];

export type MaybeAsyncFactory<T> = T | (() => Promise<T>);

export type MaybePromise<T> = T | Promise<T>;

export type Constructable<T = any> = new (...args: any[]) => T;

export type ExpectedPropKeys<T extends object, ValueType> = {
  [Key in keyof T]-?: T[Key] extends ValueType ? Key : never;
}[keyof T];

export type CallableKeys<T extends object> = ExpectedPropKeys<T, Function>;

export type ValidationTypes<T extends ZodType> = Extract<
  keyof WritablePart<T>,
  CallableKeys<WritablePart<T>>
>;

type IfEquals<X, Y, A, B> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? A
  : B;

type WritableKeysOf<T> = {
  [P in keyof T]: IfEquals<
    { [Q in P]: T[P] },
    { -readonly [Q in P]: T[P] },
    P,
    never
  >;
}[keyof T];

type WritablePart<T> = Pick<T, WritableKeysOf<T>>;

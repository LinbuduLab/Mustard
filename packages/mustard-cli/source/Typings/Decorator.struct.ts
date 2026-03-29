import type { Constructable } from "./Shared.struct";

/**
 * ref: https://github.com/tc39/proposal-decorators?tab=readme-ov-file#classes
 */
export type ClassDecoratorImpl = (
  target: Constructable,
  context: ClassDecoratorContext
) => void;

/**
 * ref: https://github.com/tc39/proposal-decorators?tab=readme-ov-file#class-methods
 */
export type ClassMethodDecoratorImpl = (
  self: Function,
  context: ClassMethodDecoratorContext
) => Function | void;

/**
 * ref: https://github.com/tc39/proposal-decorators?tab=readme-ov-file#class-fields
 */
export type ClassFieldDecoratorImpl = (
  _value: undefined,
  context: ClassFieldDecoratorContext
) => (initialValue: any) => any | void;

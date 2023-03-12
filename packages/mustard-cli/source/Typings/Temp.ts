export type AnyClassDecoratorReturnType = (
  target: any,
  context: ClassDecoratorContext
) => void;

export type AnyClassMethodDecoratorReturnType = (
  self: Function,
  context: ClassMemberDecoratorContext
) => Function | void;

export type AnyClassGetterDecoratorReturnType = (
  self: Function,
  context: ClassMemberDecoratorContext
) => Function | void;

export type AnyClassSetterDecoratorReturnType = (
  self: Function,
  context: ClassMemberDecoratorContext
) => Function | void;

export type AnyClassFieldDecoratorReturnType = (
  a1: undefined,
  context: ClassFieldDecoratorContext
) => (initialValue: any) => any | void;

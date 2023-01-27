export type AnyClassFieldDecoratorReturnType = (
  a1: undefined,
  context: ClassFieldDecoratorContext
) => (initialValue: unknown) => unknown | void;

export type AnyClassDecoratorReturnType = (
  target: any,
  context: ClassDecoratorContext
) => void;

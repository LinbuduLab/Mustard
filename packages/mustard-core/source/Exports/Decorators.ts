import { DecoratorImpl } from "../Core/DecoratorImpl";
import { MustardFactory } from "../Components/MustardFactory";

export const { App } = MustardFactory;

export const {
  Command,
  RootCommand,
  VariadicOption,
  Option,
  Options,
  Context,
  Input,
  Utils,
} = DecoratorImpl;

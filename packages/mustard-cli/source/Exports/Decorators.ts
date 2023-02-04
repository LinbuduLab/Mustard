import { BuiltInDecorators } from "../Decorators/BuiltIn";
import { CommandDecorators } from "../Decorators/Command";
import { InputDecorator } from "../Decorators/Input";
import { OptionDecorators } from "../Decorators/Option";
import { DIServiceDecorators } from "../Decorators/DIService";
import { ControllerDecorators } from "../Decorators/Controller";

import { MustardFactory } from "../Components/MustardFactory";

export const { App } = MustardFactory;
export const { Command, RootCommand } = CommandDecorators;
export const { Option, Options, VariadicOption } = OptionDecorators;
export const { Input } = InputDecorator;
export const { Provide, Inject } = DIServiceDecorators;
export const { Ctx, Utils } = BuiltInDecorators;
export const { Restrict } = ControllerDecorators;

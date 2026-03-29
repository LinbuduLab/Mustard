import { BuiltInDecorators } from "../Decorators/BuiltIn";
import { CommandDecorators } from "../Decorators/Command";
import { InputDecorator } from "../Decorators/Input";
import { OptionDecorators } from "../Decorators/Option";
import { DIServiceDecorators } from "../Decorators/DIService";
import { ControllerDecorators } from "../Decorators/Controller";
import { RelationDecorators } from "../Decorators/Relation";

import { MustardApp } from "../Core/MustardApp";

export const { App } = MustardApp;
export const { Command, RootCommand } = CommandDecorators;
export const { Option, Options, VariadicOption } = OptionDecorators;
export const { Input } = InputDecorator;
export const { Provide, Inject } = DIServiceDecorators;
export const { Ctx, Utils } = BuiltInDecorators;
export const { Restrict } = ControllerDecorators;
export const { XOR } = RelationDecorators;

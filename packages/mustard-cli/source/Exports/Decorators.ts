import { BuiltInDecorators } from "../Decorators/BuiltIn.js";
import { CommandDecorators } from "../Decorators/Command.js";
import { InputDecorator } from "../Decorators/Input.js";
import { OptionDecorators } from "../Decorators/Option.js";
import { DIServiceDecorators } from "../Decorators/DIService.js";
import { ControllerDecorators } from "../Decorators/Controller.js";
import { RelationDecorators } from "../Decorators/Relation.js";
import { SharedDecorators } from "../Decorators/Shared.js";

import { MustardApp } from "../Core/MustardApp.js";

export const { App } = MustardApp;
export const { Command, RootCommand } = CommandDecorators;
export const { Option, Options, VariadicOption } = OptionDecorators;
export const { Input } = InputDecorator;
export const { Provide, Inject } = DIServiceDecorators;
export const { Ctx, Utils } = BuiltInDecorators;
export const { Restrict } = ControllerDecorators;
export const { XOR } = RelationDecorators;
export const { Description } = SharedDecorators;

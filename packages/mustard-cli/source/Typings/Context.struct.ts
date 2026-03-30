import { InstanceFieldDecorationTypes } from "../Utils/Constants.js";

export type PackageManagerUtils = {
  install: () => void;
  uninstall: () => void;
  update: () => void;
  getUsingPackageManager: () => void;
};

export type JSONUtils = {
  readSync: () => void;
  read: () => Promise<void>;

  writeSync: () => void;
  write: () => Promise<void>;
};

export type BuiltInUtils = {
  pm: PackageManagerUtils;
  json: JSONUtils;
};

export type Context = {
  cwd: string;
  argv: string[];
  inputArgv: string[];
  env: NodeJS.ProcessEnv;
};

export type ContextInitializerPlaceHolder = {
  type: InstanceFieldDecorationTypes.Context;
};

export type InputInitializerPlaceHolder = {
  type: InstanceFieldDecorationTypes.Input;
};

export type UtilsInitializerPlaceHolder = {
  type: InstanceFieldDecorationTypes.Utils;
};

export type InjectInitializerPlaceHolder = {
  type: InstanceFieldDecorationTypes.Inject;
  identifier: string;
};

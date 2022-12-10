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
  type: "Context";
};

export type InputInitializerPlaceHolder = {
  type: "Input";
};

export type UtilsInitializerPlaceHolder = {
  type: "Utils";
};

export type InjectInitializerPlaceHolder = {
  type: "Inject";
  identifier: string;
};

export type ProvideInitializerPlaceHolder = {
  type: "Provide";
};

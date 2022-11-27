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

// todo: rename to context
export type BuiltInUtils = {
  pm: PackageManagerUtils;
  json: JSONUtils;
};

export type ExecutionContext = {};

export type ContextInitializerPlaceHolder = {
  type: "Context";
};

export type InputInitializerPlaceHolder = {
  type: "Input";
};

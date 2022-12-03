# Mustard

> **This is an incubating project of [@LinbuduLab](https://github.com/LinbuduLab).**

IoC &amp; native ecmascript decotator based command-line app builder.

## Todos

- [x] 完善类型定义
- [ ] 自定义错误处理
- [ ] Logger
- [x] 生命周期
- [ ] Usage

- https://github.com/tj/commander.js/blob/HEAD/Readme_zh-CN.md#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B8%AE%E5%8A%A9
- custom provider by @Provide @Inject

- 两种模式？按需和全量？

## Notes

- packages
  - mustard-validator
    - class validator in es native decorator impl
  - mustard
    - IoC container
  - mustard-cli
    - re-export package
  - mustard-core
    - command-line
  - mustard-

## Getting Started

```typescript
import {
  App,
  Command,
  RootCommand,
  Option,
  Options,
  VariadicOption,
} from "mustard/decorators";
import { Validator } from "mustard/validator";
import { IMustardLifeCycle } from "mustard/core";

@Command("update", "u", "update project dependencies")
class UpdateCommand {
  @Option("depth", "depth of packages to update", Validator.Number().Min(1))
  public depth = 10;

  @Option(Validator.Boolean())
  public dry = false;

  @Option("all")
  public applyAll;

  @VariadicOption()
  public packages: string[];

  public run(): void {
    this.logger.warn("DryRun Mode: ", this.dry);
    this.logger.info("Execution Depth", this.depth);
    this.logger.info("Specified Packages", this.packages);
  }
}

@RootCommand()
class RootCommandHandle {
  public run(): void {
    this.logger.info("Root Command");
  }
}

@App({
  name: "LinbuduLab CLI",
  commands: [RootCommandHandle, UpdateCommand],
})
class Project implements IMustardLifeCycle {
  onStart() {}

  onComplete() {}
}

MustardFactory.init(Project).start();
```

```bash
$ mm
$ mm update --depth=1 --dry --all
```

## License

[MIT](LICENSE)

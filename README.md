# Mustard

> **This is an incubating project of [@LinbuduLab](https://github.com/LinbuduLab).**

IoC &amp; native ecmascript decotator based command-line app builder.

## Todos

- option alias / description
- https://github.com/tj/commander.js/blob/HEAD/Readme_zh-CN.md#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B8%AE%E5%8A%A9
- events
- nest commander 相关
- start by decorators @App
- root / RootCommand
- custom provider
- 需要进行进一步逻辑拆分

```typescript
@App({
  commands: [],
  config: {},
})
class AppModule {}

const app = MustardFactory.init(AppModule);

app.start();
```

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
import { CLI } from "MustardJs/CommandLine";
import { Command, RootCommand, Option, Options, VariadicOption } from "MustardJs/Decorators";
import { Validator } from "MustardJs/Validator";

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

const cli = new CLI("mm", [RootCommandHandle, UpdateCommand]);

cli.start();
```

```bash
$ mm
$ mm update --depth=1 --dry --all
```

## License

[MIT](LICENSE)

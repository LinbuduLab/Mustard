# Mustard

> **This is an incubating project of [@LinbuduLab](https://github.com/LinbuduLab).**

IoC &amp; native ecmascript decotator based command-line app builder.

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
import { CLI, BaseCommand } from "MustardJs/CommandLine";
import { Command, RootCommand, Option, Options } from "MustardJs/Decorators";
import { Validator } from "MustardJs/Validator";

@Command("update", "u", "update project dependencies")
class UpdateCommand extends BaseCommand {
  constructor() {
    super();
  }

  static usage() {
    // collected as usage info text:
    // mm update --depth=1 --dry --all
    return `update --depth=1 --dry --all`;
  }

  @Option("depth", "depth of packages to update", Validator.Number().Min(1))
  public depth;

  @Option(Validator.Boolean())
  public dry = false;

  @Option("all")
  public applyAll;

  public run(): void {
    this.logger.warn("DryRun Mode: ", this.dry);
    this.logger.info("Execution Depth", this.depth);
  }
}

@RootCommand()
class RootCommandHandle extends BaseCommand {
  constructor() {
    super();
  }

  static usage() {
    // collected as usage info text:
    // mm [command] [options]
    return `[command] [options]`;
  }

  public run(): void {
    this.logger.info("Root Command");
  }
}

const cli = new CLI("mm", [RootCommandHandle, UpdateCommand]);

// enable mm --help to show usage info
cli.enableHelp();
// enable mm --version to show version info
cli.enableVersion();

cli.start();
```

```bash
$ mm
$ mm update --depth=1 --dry --all
```

## License

[MIT](LICENSE)

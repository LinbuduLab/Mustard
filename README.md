# Mustard

> **This is an incubating project of [@LinbuduLab](https://github.com/LinbuduLab).**

IoC & [Native ECMAScript Decotator](https://github.com/tc39/proposal-decorators) based command line app builder.

## WIP

- Object type configurations
- Usage info generation
- Parse enhancement
- Publish related

## Features

- Nest command support
- Born to be type safe
- Validator support by [Zod](https://github.com/colinhacks/zod)
- Automatic usage info generation
- Build decoupled applications using IoC concepts
- Essential built-in utils for CLI app

## Getting Started

You will need to use a wip version of typescript to use this library:

```json
"devDependencies": {
   "typescript": "npm:@typescript-deploys/pr-build@5.0.0-pr-50820-31"
}
```

```bash
npm i mustard-cli
```

```typescript
#!/usr/bin/env node

import { MustardFactory } from "mustard-cli";
import {
  Command,
  RootCommand,
  Option,
  VariadicOption,
  App,
} from "mustard-cli/Decorators";
import { Validator } from "mustard-cli/Validator";
import { CommandStruct, MustardApp } from "mustard-cli/ComanndLine";

@RootCommand()
class RootCommandHandle implements CommandStruct {
  @Option()
  public msg = "default value of msg";

  public run(): void {
    console.log("Root Command! ", this.msg);
  }
}

@Command("update", "u", "update project dependencies")
class UpdateCommand implements CommandStruct {
  @Option("depth", "depth of packages to update", Validator.Number().Gte(1))
  public depth = 10;

  @Option(Validator.Boolean())
  public dry = false;

  @Option("all")
  public applyAll: boolean;

  @VariadicOption()
  public packages: string[];

  public run(): void {
    console.warn("DryRun Mode: ", this.dry);
    console.info("Execution Depth", this.depth);
    console.info("Specified Packages", this.packages);
  }
}

@App({
  name: "LinbuduLab CLI",
  commands: [RootCommandHandle, UpdateCommand],
})
class Project implements MustardApp {
  onStart() {}

  onComplete() {}
}

MustardFactory.init(Project).start();
```

```bash
$ mm
# Root Command!  default value of msg
$ mm update --depth=1 --all --packages p1 p2 p3
# DryRun Mode:  false
# Execution Depth 1
# Specified Packages [ 'p1', 'p2', 'p3' ]
```

## License

[MIT](LICENSE)

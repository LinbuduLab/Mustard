<p align="center">
<img width="400" src="https://raw.githubusercontent.com/LinbuduLab/Mustard/main/logo.png">
</p>

IoC & [Native ECMAScript Decorator](https://github.com/tc39/proposal-decorators) based command line app builder.

## Requires

- **Node.js >= 16.0.0**
- **TypeScript >= 5.0.0**

Before TypeScript 5.0 released, you may need to configure the used TypeScript version like below in `.vscode/settings.json`:

```json
{
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Features

- Born to be type safe
- Nest command support
- Validator support by [Zod](https://github.com/colinhacks/zod)
- Automatic usage info generation
- Build decoupled applications using IoC concepts
- Essential built-in utils for CLI app

## Getting Started

- [Documentation](https://mustard-cli.netlify.app/)

> Complete documentation will be provided after TypeScript 5.0 is officially released.

## Samples

You can find more samples [Here](packages/sample/samples/).

## License

[MIT](LICENSE)

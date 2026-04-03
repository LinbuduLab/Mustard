# Mustard CLI 内部处理流程

本文档基于 `packages/sample` 下的几种 CLI 应用构建方式，梳理 mustard-cli 框架从装饰器元数据采集到命令执行的完整内部流程。

---

## 目录

- [总体架构](#总体架构)
- [阶段一：装饰器元数据采集](#阶段一装饰器元数据采集)
  - [命令注册 @Command / @RootCommand](#命令注册)
  - [选项注册 @Option / @VariadicOption / @Options](#选项注册)
  - [输入注册 @Input](#输入注册)
  - [依赖注入 @Inject / @Provide](#依赖注入装饰器)
  - [控制器 @Restrict](#控制器装饰器)
- [阶段二：应用引导](#阶段二应用引导)
- [阶段三：命令分发与执行](#阶段三命令分发与执行)
- [阶段四：字段归一化](#阶段四字段归一化)
- [示例模式详解](#示例模式详解)
  - [模式一：全功能应用 (index.mts)](#模式一全功能应用)
  - [模式二：通用模式 (Common.ts)](#模式二通用模式)
  - [模式三：嵌套子命令 (Nested.ts)](#模式三嵌套子命令)
  - [模式四：依赖注入 (WithCustomProviders.ts)](#模式四依赖注入)

---

## 总体架构

```mermaid
flowchart TB
    subgraph Phase1["阶段一：类加载 · 装饰器元数据采集"]
        D1["@Command / @RootCommand<br/>→ CommandRegistry.registerInit()"]
        D2["@Option / @VariadicOption<br/>→ 返回占位对象 + 写入 AliasMap / VariadicOptions"]
        D3["@Options / @Input<br/>→ 返回占位对象"]
        D4["@Inject<br/>→ 返回 Inject 占位对象"]
        D5["@Restrict<br/>→ addInitializer 合并 restrictValues"]
    end

    subgraph Phase2["阶段二：应用引导"]
        A1["@App() 存储 FactoryOptions"]
        A2["MustardFactory.init(Project)"]
        A3["new CLI(name, commands, config)"]
        A4["registerCommand → InitRegistry → CommandRegistry"]
        A5["registerProvider → ExternalProviderRegistry"]
        A6["configure lifeCycles"]
    end

    subgraph Phase3["阶段三：启动 · 命令分发"]
        S1["cli.start()"]
        S2["onStart 生命周期"]
        S3["instantiateWithParse:<br/>new Class() + parseFromProcessArgs"]
        S4{"parsedArgs._ 为空?"}
        S5["dispatchRootHandler"]
        S6["dispatchCommand:<br/>findHandlerCommandWithInputs"]
    end

    subgraph Phase4["阶段四：字段归一化 · 执行"]
        N1["throwOnUnknownOptions<br/>(可选)"]
        N2["normalizeDecoratedFields"]
        N3["handler.run()"]
        N4["onComplete / onError"]
    end

    Phase1 --> Phase2
    Phase2 --> Phase3

    A1 --> A2 --> A3
    A3 --> A4 --> A5 --> A6

    S1 --> S2 --> S3 --> S4
    S4 -->|是| S5
    S4 -->|否| S6
    S5 --> N1
    S6 --> N1

    N1 --> N2 --> N3 --> N4
```

---

## 阶段一：装饰器元数据采集

### 命令注册

`@Command` 和 `@RootCommand` 在类加载时将命令元数据写入 `CommandRegistry.InitCommandRegistry`。

```mermaid
flowchart LR
    subgraph RootCommand["@RootCommand()"]
        RC1["检查是否已有 Root"]
        RC2{"重复?"}
        RC3["MultiRootCommandError"]
        RC4["registerInit(className,<br/>{commandInvokeName: 'root',<br/>Class, root: true})"]
    end

    RC1 --> RC2
    RC2 -->|是| RC3
    RC2 -->|否| RC4

    subgraph CommandDec["@Command(name, alias?, desc?, children?)"]
        C1["解析重载参数<br/>name / alias / description / childCommandList"]
        C2["registerCommandImpl"]
        C3["registerInit(className,<br/>{commandInvokeName, commandAlias,<br/>description, Class, childCommandList})"]
    end

    C1 --> C2 --> C3
```

**别名判定规则**：当第二个字符串参数长度 ≤ 2 时视为 alias，否则视为 description。

### 选项注册

`@Option` / `@VariadicOption` / `@Options` 都通过**字段装饰器初始化函数**返回带有 `type` 标记的占位对象，同时在全局注册表中记录别名和可变参数信息。

```mermaid
flowchart TB
    subgraph OptionDec["@Option(name?, alias?, desc?, validator?)"]
        O1["解析重载参数"]
        O2["OptionImpl(name, alias, desc, validator)"]
        O3["返回 field initializer"]
        O4["alias → CommandRegistry.OptionAliasMap"]
        O5["返回占位对象:<br/>{type: 'Option', optionName,<br/>optionAlias, initValue, schema, description}"]
    end

    O1 --> O2 --> O3
    O3 --> O4
    O3 --> O5

    subgraph VariadicDec["@VariadicOption(name?, alias?, desc?)"]
        V1["解析重载参数"]
        V2["VariadicOptionImpl"]
        V3["CommandRegistry.VariadicOptions.add(name)"]
        V4["alias → VariadicOptions.add(alias)"]
        V5["返回占位对象:<br/>{type: 'VariadicOption', optionName,<br/>optionAlias, description, initValue}"]
    end

    V1 --> V2
    V2 --> V3
    V2 --> V4
    V2 --> V5

    subgraph OptionsDec["@Options()"]
        OS1["返回 field initializer"]
        OS2["返回占位对象:<br/>{type: 'Options', initValue}"]
    end

    OS1 --> OS2
```

### 输入注册

```mermaid
flowchart LR
    subgraph InputDec["@Input(description?)"]
        I1["返回 field initializer"]
        I2["返回占位对象:<br/>{type: 'Input', initValue, description}"]
    end
    I1 --> I2
```

### 依赖注入装饰器

```mermaid
flowchart LR
    subgraph InjectDec["@Inject(identifier?)"]
        IJ1["返回 field initializer"]
        IJ2["返回占位对象:<br/>{type: 'Inject',<br/>identifier: identifier ?? context.name}"]
    end
    IJ1 --> IJ2

    subgraph ProvideDec["@Provide(identifier?)"]
        P1["ExternalProviderRegistry.set(<br/>identifier ?? context.name, target)"]
    end
```

### 控制器装饰器

```mermaid
flowchart LR
    subgraph RestrictDec["@Restrict(restrictValues)"]
        R1["context.addInitializer"]
        R2["读取当前字段值"]
        R3{"isOptionInitializer?"}
        R4["合并 restrictValues 到占位对象"]
        R5["跳过"]
    end
    R1 --> R2 --> R3
    R3 -->|是| R4
    R3 -->|否| R5
```

---

## 阶段二：应用引导

`@App` 装饰器仅存储配置，`MustardFactory.init()` 才真正启动应用构建。

```mermaid
sequenceDiagram
    participant User as 用户代码
    participant App as @App 装饰器
    participant Factory as MustardFactory
    participant CLIClass as CLI
    participant Registry as CommandRegistry

    User->>App: @App({ name, commands, configurations, providers })
    App->>Factory: 存储 FactoryOptions (静态变量)

    User->>Factory: MustardFactory.init(Project)
    Factory->>Factory: new Project() (触发 @App 生效)
    Factory->>Factory: 读取 FactoryOptions

    Factory->>CLIClass: new CLI(name, commands, config)
    CLIClass->>CLIClass: normalizeConfigurations()<br/>填充默认值

    loop 每个 Command 类
        CLIClass->>Registry: provideInit(Class.name)
        Registry-->>CLIClass: InitCommandRegistry 中的 payload
        CLIClass->>Registry: register(commandInvokeName, payload)
        alt 有 alias
            CLIClass->>Registry: register(alias, payload)
        end
        alt 有 childCommandList
            CLIClass->>CLIClass: 递归 registerCommand(children)
        end
    end

    Factory->>CLIClass: registerProvider(providers)
    loop 每个 Provider
        alt 是构造函数
            CLIClass->>Registry: ExternalProviderRegistry.set(name, provider)
        else 是 {identifier, value} 对象
            CLIClass->>Registry: ExternalProviderRegistry.set(identifier, value)
        end
    end

    Factory->>CLIClass: configure({ lifeCycles: { onStart, onError, onComplete } })
    Factory->>Factory: flush() 清空 FactoryOptions
    Factory-->>User: 返回 CLI 实例
```

---

## 阶段三：命令分发与执行

```mermaid
flowchart TB
    Start["cli.start()"] --> OnStart["lifeCycles.onStart?.()"]
    OnStart --> Instantiate["instantiateWithParse()"]

    subgraph Instantiate_Detail["实例化与参数解析"]
        Inst1["遍历 CommandRegistry"]
        Inst2["new commandRegistration.Class()"]
        Inst3["filterDecoratedInstanceFields(instance)<br/>收集所有带 type 标记的占位字段"]
        Inst4["CommandRegistry.upsert(key, { instance, decoratedInstanceFields })"]
        Inst5["parseFromProcessArgs(VariadicOptions, OptionAliasMap)"]
        Inst6{"存在 VariadicOptions<br/>或 AliasMap?"}
        Inst7["使用 yargs-parser<br/>(array + alias + greedy-arrays)"]
        Inst8["使用 mri<br/>(轻量解析)"]
    end

    Instantiate --> Inst1 --> Inst2 --> Inst3 --> Inst4
    Inst4 --> Inst5 --> Inst6
    Inst6 -->|是| Inst7
    Inst6 -->|否| Inst8

    Inst7 --> Version
    Inst8 --> Version

    Version["BuiltInCommands.useVersionCommand<br/>(--version / -v)"]
    Version --> CheckRoot{"parsedArgs._.length === 0?"}

    CheckRoot -->|是| RootPath
    CheckRoot -->|否| CmdPath

    subgraph RootPath["根命令分发"]
        R1["provideRootCommand()"]
        R2{"有 RootCommand?"}
        R3["useHelpCommand (--help)"]
        R4["executeCommandFromRegistration"]
        R5{"enableUsage?"}
        R6["打印全局帮助"]
        R7["NoRootHandlerError"]
    end

    R1 --> R2
    R2 -->|是| R3 --> R4
    R2 -->|否| R5
    R5 -->|是| R6
    R5 -->|否| R7

    subgraph CmdPath["子命令分发"]
        C1["findHandlerCommandWithInputs(parsedArgs._)"]
        C2{"命中命令?"}
        C3["CommandNotFoundError"]
        C4["useHelpCommand (--help)"]
        C5["handleCommandExecution"]
    end

    C1 --> C2
    C2 -->|否| C3
    C2 -->|是| C4 --> C5
```

### 子命令匹配算法

```mermaid
flowchart TB
    Input["parsedArgs._ = ['update', 'dep', 'extra']"]
    Step1["取第一个 token: 'update'"]
    Step2{"在 CommandRegistry 中查找 'update'"}
    Step3["命中 → 检查 childCommandList"]
    Step4{"childCommandList<br/>不为空?"}
    Step5["取下一个 token: 'dep'"]
    Step6{"在 registry 中找到<br/>子命令 'dep'?"}
    Step7["命中子命令 'dep'<br/>inputs = ['extra']"]
    Step8["未命中子命令<br/>当前命令 = 'update'<br/>inputs = ['dep', 'extra']"]
    Step9["未命中任何命令<br/>回退 RootCommand<br/>inputs = 全部 tokens"]

    Input --> Step1 --> Step2
    Step2 -->|命中| Step3 --> Step4
    Step4 -->|是| Step5 --> Step6
    Step6 -->|是| Step7
    Step6 -->|否| Step8
    Step2 -->|未命中| Step9
    Step4 -->|否| Step8
```

---

## 阶段四：字段归一化

`DecoratedClassFieldsNormalizer.normalizeDecoratedFields` 根据占位对象的 `type` 分发到不同的归一化策略。

```mermaid
flowchart TB
    Entry["normalizeDecoratedFields(command, inputs, parsedArgs)"]
    Loop["遍历 decoratedInstanceFields"]
    Entry --> Loop

    Loop --> Switch{"field.type"}

    Switch -->|Context| Ctx["normalizeContextField<br/>注入 { cwd, argv, inputArgv, env }"]
    Switch -->|Utils| Util["normalizeUtilField<br/>注入 MustardUtilsProvider.produce()"]
    Switch -->|Inject| Inj["normalizeInjectField"]
    Switch -->|Input| Inp["normalizeInputField"]
    Switch -->|Option / VariadicOption| Opt["normalizeOption"]
    Switch -->|Options| Opts["normalizeOptions"]

    subgraph InjectFlow["Inject 归一化"]
        IJ1["读取占位对象的 identifier"]
        IJ2["ExternalProviderRegistry.get(identifier)"]
        IJ3{"typeof providerFactory"}
        IJ4["isConstructable → new factory()"]
        IJ5["callable → factory()"]
        IJ6["直接使用值"]
        IJ7{"结果是 Promise?"}
        IJ8["await 后赋值"]
        IJ9["同步赋值"]
    end

    Inj --> IJ1 --> IJ2 --> IJ3
    IJ3 -->|function| IJ4
    IJ3 -->|function| IJ5
    IJ3 -->|other| IJ6
    IJ4 --> IJ7
    IJ5 --> IJ7
    IJ6 --> IJ9
    IJ7 -->|是| IJ8
    IJ7 -->|否| IJ9

    subgraph InputFlow["Input 归一化"]
        IN1{"inputs 数量"}
        IN2["0 → 使用 initValue"]
        IN3["1 → 使用 inputs[0]"]
        IN4[">1 → 使用 inputs 数组"]
    end

    Inp --> IN1
    IN1 --> IN2
    IN1 --> IN3
    IN1 --> IN4

    subgraph OptionFlow["Option 归一化"]
        OP1{"parsedArgs 中存在<br/>optionName 或 alias?"}
        OP2["取值 argValue"]
        OP3{"有 schema (Zod)?"}
        OP4["schema.safeParse(argValue)"]
        OP5{"校验通过?"}
        OP6["使用校验后的值"]
        OP7{"ignoreValidationErrors?"}
        OP8["使用原始值"]
        OP9["抛出 ValidationError"]
        OP10["applyRestrictions<br/>(若有 @Restrict)"]
        OP11["赋值到实例字段"]
        OP12{"是 required 字段?"}
        OP13["抛出 ValidationError:<br/>Required field not specified"]
        OP14["使用 initValue ?? undefined"]
    end

    Opt --> OP1
    OP1 -->|是| OP2 --> OP3
    OP3 -->|是| OP4 --> OP5
    OP5 -->|是| OP6 --> OP10
    OP5 -->|否| OP7
    OP7 -->|是| OP8 --> OP10
    OP7 -->|否| OP9
    OP3 -->|否| OP10
    OP10 --> OP11
    OP1 -->|否| OP12
    OP12 -->|是| OP13
    OP12 -->|否| OP14

    subgraph OptionsFlow["Options 聚合归一化"]
        OS1["收集所有 Option/VariadicOption<br/>字段的 initValue"]
        OS2["与 parsedArgs (去除 _) 合并"]
        OS3["赋值到 @Options() 字段"]
    end

    Opts --> OS1 --> OS2 --> OS3
```

---

## 示例模式详解

### 模式一：全功能应用

**对应文件**: `index.mts`

**特征**: RootCommand + 多个子命令 + Validator 校验链 + Input + VariadicOption + enableUsage/enableVersion

```mermaid
flowchart TB
    subgraph ClassLoad["类加载阶段"]
        CL1["@RootCommand()<br/>class RootCommandHandle"]
        CL2["@Command('update', 'u', ...)<br/>class UpdateCommand"]
        CL3["@Command('sync', 's', ...)<br/>class SyncCommand"]

        CL1 --> R1["InitRegistry.set('RootCommandHandle',<br/>{root: true, commandInvokeName: 'root'})"]

        CL2 --> R2["InitRegistry.set('UpdateCommand',<br/>{commandInvokeName: 'update',<br/>commandAlias: 'u'})"]

        CL3 --> R3["InitRegistry.set('SyncCommand',<br/>{commandInvokeName: 'sync',<br/>commandAlias: 's'})"]
    end

    subgraph FieldDec["字段装饰器"]
        F1["@Option('msg', 'm',<br/>Validator.Required().String().MinLength(5))<br/>→ OptionAliasMap['msg'] = 'm'<br/>→ 占位: {type: 'Option', schema: z.string().min(5)}"]

        F2["@Option('depth', ..., Validator.Number().Gte(1))<br/>→ 占位: {type: 'Option', schema: z.number().gte(1)}"]

        F3["@Option(Validator.Boolean())<br/>→ 占位: {type: 'Option', schema: z.boolean()}"]

        F4["@Option({ name: 'target', alias: 't' })<br/>→ OptionAliasMap['target'] = 't'"]

        F5["@Input()<br/>→ 占位: {type: 'Input'}"]

        F6["@VariadicOption()<br/>→ VariadicOptions.add('packages')"]
    end

    subgraph Bootstrap["引导阶段"]
        B1["@App({<br/>  name: 'create-mustard-app',<br/>  commands: [Root, Update, Sync],<br/>  configurations: {<br/>    allowUnknownOptions: true,<br/>    enableUsage: true,<br/>    enableVersion: '1.0.0'<br/>  }<br/>})"]

        B2["MustardFactory.init(Project).start()"]
    end

    subgraph Runtime["运行时: bin update --depth=5 --dry pkg1 pkg2"]
        RT1["parseFromProcessArgs<br/>使用 yargs-parser<br/>(因为有 VariadicOptions + AliasMap)"]
        RT2["parsedArgs = {<br/>  _: ['update'],<br/>  depth: 5,<br/>  dry: true,<br/>  packages: ['pkg1', 'pkg2']<br/>}"]
        RT3["findHandlerCommandWithInputs<br/>→ 命中 UpdateCommand"]
        RT4["normalizeDecoratedFields"]
        RT5["depth: schema.safeParse(5) ✓<br/>dry: schema.safeParse(true) ✓<br/>packages: ['pkg1', 'pkg2']<br/>input: []"]
        RT6["UpdateCommand.run()"]
    end

    ClassLoad --> FieldDec --> Bootstrap --> Runtime
    RT1 --> RT2 --> RT3 --> RT4 --> RT5 --> RT6
```

### 模式二：通用模式

**对应文件**: `samples/Common.ts`

**特征**: @Options() 聚合全部选项 + shebang 脚本入口

```mermaid
flowchart TB
    subgraph Decorators["装饰器"]
        D1["@RootCommand() → RootCommandHandle"]
        D2["@Command('update', 'u', ...) → UpdateCommand"]
    end

    subgraph Fields["UpdateCommand 字段"]
        F1["@Option('depth', Validator.Number().Gte(1))<br/>→ 占位 Option"]
        F2["@Option(Validator.Boolean())<br/>→ 占位 Option"]
        F3["@Options()<br/>→ 占位 Options (聚合)"]
        F4["@Input()<br/>→ 占位 Input"]
        F5["@VariadicOption()<br/>→ 占位 VariadicOption"]
    end

    subgraph OptionsNormalize["@Options() 归一化流程"]
        ON1["收集同级 @Option 字段的 initValue:<br/>{ depth: 10, dry: false }"]
        ON2["合并 parsedArgs (去除 _):<br/>{ depth: 5, dry: true, packages: [...] }"]
        ON3["赋值到 completeOptions 字段"]
    end

    subgraph Runtime["运行时: bin update --depth=5 --dry"]
        RT1["parsedArgs._ = ['update']"]
        RT2["命中 UpdateCommand"]
        RT3["normalizeDecoratedFields"]
        RT4["单个 @Option 字段各自归一化"]
        RT5["@Options() 字段执行聚合归一化"]
        RT6["两者独立赋值，不冲突"]
    end

    Decorators --> Fields --> Runtime
    RT1 --> RT2 --> RT3
    RT3 --> RT4
    RT3 --> RT5
    RT5 --> OptionsNormalize
    ON1 --> ON2 --> ON3
    RT4 --> RT6
    ON3 --> RT6
```

### 模式三：嵌套子命令

**对应文件**: `samples/Nested.ts`

**特征**: `@Command(name, childCommandList)` 构建命令树

```mermaid
flowchart TB
    subgraph Registration["注册阶段"]
        R1["@Command('dep', [])<br/>class UpdateDepCommand"]
        R2["@Command('update', [UpdateDepCommand])<br/>class UpdateCommand"]
        R3["InitRegistry:<br/>'UpdateDepCommand' → {commandInvokeName: 'dep'}<br/>'UpdateCommand' → {commandInvokeName: 'update',<br/>childCommandList: [UpdateDepCommand]}"]
    end

    subgraph CLIRegister["CLI.registerCommand 递归"]
        CR1["register('update', payload)"]
        CR2["childCommandList = [UpdateDepCommand]"]
        CR3["递归: register('dep', depPayload)"]
    end

    subgraph CommandTree["命令树"]
        CT1["CommandRegistry"]
        CT2["'update' → UpdateCommand (children: [dep])"]
        CT3["'dep' → UpdateDepCommand"]
    end

    Registration --> CLIRegister
    CR1 --> CR2 --> CR3
    CLIRegister --> CommandTree

    subgraph Dispatch["分发: bin update dep --packages a b"]
        DS1["parsedArgs._ = ['update', 'dep']"]
        DS2["第一层: 'update' 命中"]
        DS3["检查 childCommandList"]
        DS4["第二层: 'dep' 在子命令中命中"]
        DS5["最终 handler = UpdateDepCommand<br/>inputs = []"]
        DS6["normalizeDecoratedFields → run()"]
    end

    DS1 --> DS2 --> DS3 --> DS4 --> DS5 --> DS6

    subgraph DispatchFallback["分发: bin update foo"]
        DF1["parsedArgs._ = ['update', 'foo']"]
        DF2["第一层: 'update' 命中"]
        DF3["检查 childCommandList"]
        DF4["第二层: 'foo' 不在子命令中"]
        DF5["回退 handler = UpdateCommand<br/>inputs = ['foo']"]
    end

    DF1 --> DF2 --> DF3 --> DF4 --> DF5
```

### 模式四：依赖注入

**对应文件**: `samples/WithCustomProviders.ts`

**特征**: `@Inject` + `providers` 配置实现服务注入

```mermaid
flowchart TB
    subgraph ProviderSetup["Provider 注册"]
        PS1["@App 配置中的 providers"]
        PS2["SharedService (构造函数)<br/>→ ExternalProviderRegistry.set(<br/>'SharedService', SharedService)"]
        PS3["{identifier: 'DataService', value: DataService}<br/>→ ExternalProviderRegistry.set(<br/>'DataService', DataService)"]
    end

    PS1 --> PS2
    PS1 --> PS3

    subgraph InjectSetup["@Inject 装饰器"]
        IS1["@Inject('DataService')<br/>public data: DataService<br/>→ 占位: {type: 'Inject', identifier: 'DataService'}"]
        IS2["@Inject('SharedService')<br/>public shared: SharedService<br/>→ 占位: {type: 'Inject', identifier: 'SharedService'}"]
    end

    subgraph Resolution["归一化阶段: normalizeInjectField"]
        R1["读取占位对象 identifier"]
        R2["ExternalProviderRegistry.get(identifier)"]
        R3{"返回值类型"}
        R4["构造函数 → isConstructable"]
        R5{"可 new?"}
        R6["new providerFactory()"]
        R7["providerFactory() 直接调用"]
        R8["非函数 → 直接使用"]
        R9["赋值到实例字段"]
    end

    InjectSetup --> Resolution
    R1 --> R2 --> R3
    R3 -->|function| R4 --> R5
    R5 -->|是| R6 --> R9
    R5 -->|否| R7 --> R9
    R3 -->|非 function| R8 --> R9

    subgraph Example["示例: UpdateCommand.run()"]
        E1["this.data → DataService 实例<br/>this.data.fetch() → 'FetchedData'"]
        E2["this.shared → SharedService 实例<br/>this.shared.execute() → 'ExecuteSharedService'"]
    end

    R9 --> Example
```

---

## 参数解析器选择策略

mustard-cli 内部根据是否注册了 `VariadicOption` 或 `OptionAlias` 来选择不同的参数解析器：

```mermaid
flowchart LR
    Check{"VariadicOptions.size > 0<br/>或 OptionAliasMap 非空?"}
    YP["yargs-parser<br/>• 支持 array 展开<br/>• 支持 alias 映射<br/>• greedy-arrays 模式<br/>• strip-aliased 去重"]
    MRI["mri<br/>• 轻量快速<br/>• 基础 flag 解析"]

    Check -->|是| YP
    Check -->|否| MRI
```

## 完整生命周期时序

```mermaid
sequenceDiagram
    participant Dec as 装饰器 (类加载)
    participant App as @App
    participant Factory as MustardFactory
    participant CLI as CLI
    participant Registry as CommandRegistry
    participant Normalizer as DecoratedFieldsNormalizer
    participant Handler as CommandHandler

    Note over Dec: 阶段一：元数据采集
    Dec->>Registry: @Command → registerInit(className, payload)
    Dec->>Dec: @Option → 返回占位 initializer
    Dec->>Registry: @Option(alias) → OptionAliasMap
    Dec->>Registry: @VariadicOption → VariadicOptions
    Dec->>Dec: @Input → 返回占位 initializer
    Dec->>Dec: @Inject → 返回占位 initializer

    Note over App, Factory: 阶段二：应用引导
    App->>Factory: 存储 FactoryOptions
    Factory->>CLI: new CLI(name, commands, config)
    CLI->>CLI: normalizeConfigurations()
    CLI->>Registry: registerCommand (Init → Command)
    CLI->>Registry: registerProvider → ExternalProviderRegistry
    CLI->>CLI: configure({ lifeCycles })

    Note over CLI, Handler: 阶段三：启动与分发
    CLI->>CLI: start() → onStart()
    CLI->>CLI: instantiateWithParse()
    CLI->>Registry: 遍历 CommandRegistry → new Class()
    CLI->>CLI: parseFromProcessArgs()
    CLI->>CLI: useVersionCommand (--version)

    alt 无子命令 token
        CLI->>CLI: dispatchRootHandler()
    else 有子命令 token
        CLI->>CLI: findHandlerCommandWithInputs()
    end

    Note over Normalizer, Handler: 阶段四：归一化与执行
    CLI->>Normalizer: throwOnUnknownOptions (可选)
    CLI->>Normalizer: normalizeDecoratedFields(command, inputs, parsedArgs)
    Normalizer->>Normalizer: Context → 注入进程信息
    Normalizer->>Normalizer: Utils → 注入工具实例
    Normalizer->>Registry: Inject → ExternalProviderRegistry 查找并实例化
    Normalizer->>Normalizer: Input → 注入位置参数
    Normalizer->>Normalizer: Option → 解析 + Zod 校验 + Restrict
    Normalizer->>Normalizer: Options → 聚合所有选项
    CLI->>Handler: await handler.run()
    Handler-->>CLI: onComplete() / onError()
```

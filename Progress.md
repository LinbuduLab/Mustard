# Handle Progress

- CAC 是采用的哪一种解析模式？
- 可以参考下 CAC 中的 mri 解析方法



按需加载模式：

- 调用 start 方法
- 解析输入参数
- 尝试匹配命令，仅使用 _ 的首个元素进行查找
  - 匹配成功
    - 若匹配命令注册了子命令，则递归进行查找，将查找到的最后一个命令后所有的元素，作为 @Input
    - 否则，直接将所有剩下元素作为 @Input
  - 匹配失败，没有注册的命令
    - 执行根命令，并将 _ 全部作为 @Input
    - 无根命令，执行 UsagePrinter
- 实例化 Command
- 检查是否存在未注册的选项
- 为此实例已注册的选项进行注入
- 分组，Internal（Context、Input、Utils）、Variadic、Common
  - 对于 VariadicOption，每次调用均会存储其键名，在注入选项时重新进行一次 parse 
    - → 有没有办法在 start 方法调用时就收集到？
    - 感觉还是得全量
      - 用一个 useVariadicOptions 控制，默认为 true，如果确定没有使用，再让用户自己关闭
    - useVariadicOptions 启用时，会全量解析命令内部的 VariadicOptions 属性，再基于其进行解析
    - 禁用时，按需解析命令，不会处理 VariadicOptions 标记的选项，throwError



全量加载模式：

- CommandRegistryPayload + instance + decoratedInstanceFields
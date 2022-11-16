# babel-plugin-istanbul
基于官方[babel-plugin-istanbul](https://github.com/istanbuljs/babel-plugin-istanbul)二次开发，因为业务有两个需求：
* 1.不需要函数覆盖率和分支覆盖率，也能减少数据量
* 2.语句覆盖率需要支持根据git提交的行号来精准插桩


新增参数：
```
[
  require.resolve("@tencent/babel-plugin-istanbul"),
  {
    // include支持传入行号，用来过滤需要插桩的行
    include: [{file: "xxx.js", lines: [1, 3, 4]}],
    // 配置是否需要三个维度的插桩
    cover: { function: false, branch: false, statement: true }
  }
]
```
# vue-bill-manager-webpack4 个人记账及资产管理
- 基于webpack4和vue2实现的一套个人账单管理系统，后端项目见[BillDubbo](https://github.com/TonyJiangWJ/BillingDubbo)
- 账单可以直接导入支付宝PC版下载的账单zip文件，也可以直接录入账单信息
- 针对不同的账单记录可以添加自定义标签，然后进行预算管理或者快速检索
- 提供预算管理功能：管理每个月的预算，可以了解收支赤字，通过标签和账单关联
- 资产管理功能：管理自己各个APP下的资产、以及分期等负债，通过净资产了解实际资产情况，避免因为分期而大手大脚的花钱。分期列表按月计算，展示每月负债和月底净资产合理安排消费。
- 其他附加小工具不赘述

## demo运行步骤
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

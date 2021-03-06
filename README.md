# vue-bill-manager-webpack4 个人记账及资产管理

- 基于webpack4和vue2实现的一套个人账单管理系统，后端项目见[BillDubbo](https://github.com/TonyJiangWJ/BillingDubbo)
- 账单可以直接导入支付宝PC版下载的账单zip文件，也可以直接录入账单信息
- 针对不同的账单记录可以添加自定义标签，然后进行预算管理或者快速检索
- 提供预算管理功能：管理每个月的预算，可以了解收支赤字，通过标签和账单关联
- 资产管理功能：管理自己各个APP下的资产、以及分期等负债，通过净资产了解实际资产情况，避免因为分期而大手大脚的花钱。分期列表按月计算，展示每月负债和月底净资产合理安排消费。
- 其他附加小工具不赘述
- [在线演示](https://tonyjiangj.github.io/#) 其中账单功能需要允许加载不安全的脚本，因为没有域名直接http访问的IP地址
  ![加载不安全的脚本](./resources/演示图片1.png)

## 项目开发部署步骤

- 先启动后台项目 见[BillingDubbo](https://github.com/TonyJiangWJ/BillingDubbo)
- 然后运行`npm install` 安装依赖
- 修改 `config.js` 中的host信息，RSA公钥信息见[BillingDubbo](https://github.com/TonyJiangWJ/BillingDubbo)
- 运行项目

  ```shell
  npm run serve
  ```

- 打包项目

  ```shell
  npm run build
  ```

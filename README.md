<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>



# enum-loader

`enum-loader` 将对 typescript 的枚举（enum）进行处理

# 开始

你需要先下载`enum-loader`

```console
npm install --save-dev enum-loader 或 yarn add --save-dev enum-loader
```

# 配置

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        use: ["enum-loader"],
      },
    ],
  },
};
```

### 在 umi3 项目中

**.umirc.ts**
```js
chainWebpack(config: any) {
    config.module
    .rule('enum-loader')
    .test(/.(ts|tsx)$/)
    .pre()
    .include.add([
      path.resolve(process.cwd(), 'src'),
      path.resolve(process.cwd(), 'config'),
      ])
      .end()
      .use('enum-loader')
      .loader(require.resolve('enum-loader'));
}
```

# 功能
`enum-loader` 会将在typescript中加了@name和@description注解的枚举进行`反射`处理，并向该枚举添加`toArray`和`toDictionary`静态方法。

#### toArray
将添加了注解@name 和 @description的枚举转换为数组，数组格式为`{label: string, value: string}[]`,其中`label`属性使用的是注解`@description`的值，`value`属性使用的是枚举的 `值`.

#### toDictionary
将添加了注解@name 和 @description的枚举转换为数组，数组格式为`{[key: string]: {label: string, value: string}}`,以枚举的`值`为key，字典的值为toArray方法的{label: string, value: string}.

# 示例
定义枚举
```js
enum ENUM_TEST {
  /**
   * @name TEST
   * @description 测试
  */
 TEST = 'TEST',
 /**
  * @name STATUS
  * @description 状态
 */
 STATUS = 1,
  /**
  * @name ALL
  * @description 全部
 */
 ALL = 'ALL',
}
```
经过`enum-loader`处理之后，
```js
// 调用枚举的toArray方法，目前需要忽略tslint的检测

// @ts-ignore
ENUM_TEST.toArray();

//输出
[
  {
    "label": "测试",
    "value": "TEST"
  },
  {
    "label": "状态",
    "value": "1"
  },
  {
    "label": "全部",
    "value": "ALL"
  }
]

//@ts-ignore
ENUM_TEST.toDictionary();

// 输出
{
  1: {label: "状态", value: "1"}
  ALL: {label: "全部", value: "ALL"}
  TEST: {label: "测试", value: "TEST"}
}
```

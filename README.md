# Puella Text Editor

一个源码简单、可理解、有中文注释的代码编辑器（code editor）。

# 使用

```html
<script setup>
import PuellaEditor from 'PuellaEditor'
</script>
<template>
  <div class="editor" style="
        width: calc(100vw - 20px);
        height: calc(100vh - 20px);
        padding: 10px;
        background: url(/puella-magic.webp) no-repeat center;
        background-size: cover;
  ">
    <PuellaEditor language="typescript" <!-- 设定语言，指定语法高亮和短语集 -->
      style="backdrop-filter: blur(10px) brightness(0.5)" <!-- 让背景模糊 -->
    />
  </div>
</template>
```


## 特色功能:

__Puella Editor__ 有多个强大的功能。

### 函数式短语（functional snippets）

__Puella Editor__ 支持短语。让您只需输入几个字符，就生成大量代码片段。

支持使用正则表达式匹配文本、使用函数生成代码片段。

短语定义格式如下：

```ts
type Snippets = {
  // 匹配模式。静态文本、正则模式、多个字符串（只要匹配其中一个）
  match: string | RegExp | string[]
  // 生成的片段
  body:
    | string
    | Function<[matcheds: string, ctx: object], string>
}
```

#### 静态短语。 `match: string, body: string`

片段例子：

函数定义

```js
{
  match: 'function',
  body: `
    function ##(##) {
      ##
    }
  `
}
```

假设您输入了 `function`，并且光标在 `function|` 中 `|` 的位置。

您按下 `Tab`，会自动 展开成片段定义中的 `body` 文本值。

展开后，光标将在 __插槽__ `##` 处，按下 `Enter` 将跳转到下一个插槽。

#### 函数式短语 `match: RegExp | string[], body: function`

如定义，当你按下 `Tab` 时，进行模式匹配，匹配通过 则使用函数生成代码片段。

片段例子：

for 循环，输入 `for i in 1..10`，按 `tab` 生成

```js
for (const i = 1; i <= 10; i++) {
  // 光标位置
}
```

可以定义：

```ts
{
  // 我们有三个迭代器变量名，初始值、结束值。
  match: /for (\w) in (\d+)\.\.(\d+)/,
  body: ([_, idx, from, to]) => `
    for(const ${idx} = ${from}; ${idx} <= ${to}; ${idx}++) {
      ##
    }
  `,
}
```

## 基本功能：
- 括号补全
- 换行缩进

## 计划：
- 多光标
- 撤回、重做
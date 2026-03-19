function q(strings, ...args) {
  let s = ''
  for (let i in args) {
    s += strings[i]
    s += args[i] instanceof Function ? args[i]() : args[i]
  }
  s += strings[strings.length - 1]
  return s;
}

const htmlTags = [
  // 文档元数据
  "html", "head", "title", "base", "link", "meta", "style",
  // 脚本
  "script", "noscript", "template",
  // 章节根内容
  "body",
  // 内容分级
  "article", "section", "nav", "aside", "h1", "h2", "h3", "h4", "h5", "h6", "header", "footer", "address", "main",
  // 文本内容
  "p", "hr", "pre", "blockquote", "ol", "ul", "menu", "li", "dl", "dt", "dd", "figure", "figcaption", "div",
  // 内联文本语义
  "a", "em", "strong", "small", "s", "cite", "q", "dfn", "abbr", "ruby", "rt", "rp", "data", "time", "code", "var", "samp", "kbd", "sub", "sup", "i", "b", "u", "mark", "bdi", "bdo", "span", "br", "wbr",
  // 图片与多媒体
  "picture", "source", "img", "iframe", "embed", "object", "param", "video", "audio", "track", "canvas",
  // 表格内容
  "table", "caption", "colgroup", "col", "tbody", "thead", "tfoot", "tr", "td", "th",
  // 表单
  "form", "label", "input", "button", "select", "datalist", "optgroup", "option", "textarea", "output", "progress", "meter", "fieldset", "legend",
  // 交互元素
  "details", "summary", "dialog",
  // Web 组件 (过时或特殊的除外)
  "slot", "element"
];

type Snippet = {
  match: string | RegExp | (string | RegExp)[],
  body: string | ((matches: string[], preset: object) => string),
  goto?: string,
}

import ruby from './tab-snippets-ruby'
import markdown from './tab-snippets-markdown'

export const PuellaTabSnippets: Record<string, Snippet[]> = {
  global: [
    {match: '"', body: '"##"'},
    {match: "'", body: "'##'"},
    {match: "{", body: "{##}"},
    {match: "(", body: "(##)"},
    {match: "[", body: "[##]"},
    {match: "<%", body: "<% ## %>"},
  ],
  html: [
    {
      match: /<(\w+)/,
      body: ([_, tag]) => `<${tag} ##>##</${tag}>`,
    },
    {
      match: htmlTags,
      body: ([tag]) => `<${tag} ##>##</${tag}>`,
    },
  ],
  property: [
    {
      match: /\w+/,
      body: ([name]) => `${name}="##" ##`,
    }
  ],
  javascript: [
    {
      match: 'function',
      body: (_, $) => `function ##(##) {\n${$.moreIndent}##\n${$.indent}}\n`
    },
    {
      match: 'class',
      body: (_,$) => `class ## {\n${$.moreIndent}##\n${$.indent}}`,
      goto: 'class',
    },
    {
      match: 'type',
      body: `type ## = ##;`
    },
    {
      match: 'interface',
      body: `
      interface ## {
        ##
      }`
    },
  ],
  function: [
    {
      match: 'return',
      body: `return ##;`
    },
  ],
  class: [
    {
      match: 'static',
      body: `static ##: ## = ##;`
    },
    {
      match: /\w+/,
      body: ([name]) => `
      ${name}(##) {
        ##
      }
      `,
      goto: 'function',
    },
  ],
  markdown,
  ruby,

}

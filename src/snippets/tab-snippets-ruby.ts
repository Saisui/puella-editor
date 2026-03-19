export default ([
  {
    match: 'def',
    body: (_, $) => `def ##(##)\n${$.moreIndent}##\n${$.indent}end\n`
  },
  {
    match: 'class',
    body: (_, $) => `class ##\n${$.indentMore(1)}def initialize(##)\n${$.indentMore(2)}##\n${$.indentMore(1)}end\n${$.indent}end\n`
  },
  {
    match: 'module',
    body: (_, $) => `module ##\n${$.indentMore(1)}##\n${$.indent}end\n`
  },
  {
    match: 'if',
    body: (_, $) => `if ##\n${$.indentMore(1)}##\n${$.indent}end\n`
  },
  {
    match: 'if else',
    body: (_, $) => `if ##\n${$.indentMore(1)}##\n${$.indent}else\n${$.indentMore(1)}##\n${$.indent}end\n`
  },
  {
    match: 'case',
    body: (_, $) => `case ##\n${$.indent}when ##\n${$.indentMore(1)}##\n${$.indent}else\n${$.indentMore(1)}##\n${$.indent}end\n`
  },
  {
    match: 'when',
    body: (_, $) => `\n${' '.repeat($.indent.lengh - 2)}when ##\n${$.indentMore(0)}##`
  },
])
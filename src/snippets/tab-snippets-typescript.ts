export default [
  {
    match: 'function',
    body: (_, $) => `
    function ##(##) {
      ##
    }`
  },
  {
    match: 'function:',
    body: (_, $) => `
    function ##(##): ## {
      ##
    }`
  },
  {
    match: 'class',
    body: (_,$) => `
    class ## {
      ##
    }`,
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
  {
    match: 'static',
    body: `static ##: ## = ##;`
  },
  {
    match: 'for in',
    body: (_, $) => `
    for (const ## in ##) {
      ##
    }`
  },
  {
    match: 'for',
    body: (_, $) => `
    for (##; ##; ##) {
      ##
    }`
  },
  {
    match: 'for of',
    body: (_, $) => `
    for (const ## of ##) {
      ##
    }`
  },
  {
    match: 'if',
    body: (_, $) => `
    if (##) {
      ##
    }`
  },
  {
    match: /if\*(\d+)/,
    body: ([_, d], $) => `
    if (##) {
      ##
    }
    `.repeat(+d)
  },
  {
    match: 'if else',
    body: `
    if (##) {
      ##
    } else {
      ##
    }`
  },
  {
    match: /if *else\*(\d+)/,
    body: ([_, d], $) => `
    if (##) {
      ##` +
    `
    } else if (##) {
    `.repeat(+d - 1) + `
    } else {
      ##
    }`
  },
  {
    match: 'while',
    body: (_, $) => `
    while (##) {
      ##
    }`
  },
  {
    match: /for (\w+) in (-?\d*)\.\.(=|\^|\.|)(-?\d+)/,
    body: ([_, n, a, s, b], $) => {
      a ||= 0;
      s = s == '^' || s == '.' ? '' : '='
      if(+a > +b) {
        return `
      for (let ${n} = ${a}; ${n} >${s} ${b}; ${n}--) {
        ##
      }`
      } else {
        return `
      for (let ${n} = ${a}; ${n} <${s} ${b}; ${n}++) {
        ##
      }`
      }
    }
  },
  {
    match: /for (\w+) in (\w+)-->(\w+)/,
    body: ([_, n, a, b], $) => {
      a ||= 0;
      return `
      for (let ${n} = ${a}; ${n} > ${b}; ${n}--) {
        ##
      }`
    }
  },
  {
    match: /for (\w+) in (\w+)\+\+>(\w+)/,
    body: ([_, n, a, b], $) => {
      a ||= 0;
      return `
      for (let ${n} = ${a}; ${n} < ${b}; ${n}++) {
        ##
      }`
    }
  },
  {
    match: /for (\w+), (\w+) \+= (\w+)/,
    body: ([_, i, n, b], $) => {
      return `
      let ${n} = ${b}[0].constructor == String ? '' : 0;
      for (let ${i} in ${b}) {
        let ${n} += ${b}[${i}];
        ##
      }`
    }
  },
  {
    match: /for (\w+) in (\w+)\.\.(=|\^|\.|)(\w+)/,
    body: ([_, n, a, s, b], $) => {
      a ||= 0;
      s = s == '^' || s == '.' ? '' : '='
      return `
      for (let ${n} = ${a}; ${n} >${s} ${b}; ${n}++) {
        ##
      }`
    }
  },
  {
    match: /for (\w+) in (\w+)/,
    body: ([_, i, arr], $) => `
    for (const ${i} in ${arr}) {
      ##
    }`
  },
  {
    match: /for (\w+), *(\w+) in (.+)/,
    // body: ([_, key, val, kvs], $) => `for (const ${key} in ${kvs}) {\n${$.moreIndent}const ${val} = ${kvs}[${key}];\n${$.moreIndent}##\n${$.indent}}\n`
    body: ([_, key, val, kvs], $) => `
    for (const ${key} in ${kvs}) {
      const ${val} = ${kvs}[${key}];
      ##
    }
    `
  },
  {
    name: 'block do scope',
    match: 'do',
    body: `
    (()=>{
      ##
    })()`
  }
]
export default [
  {
    match: /^ *```+$/,
    body: ([m], $) => `${m}\n##\n${m}`
  },
  {
    match: /^( *```+)\w+$/,
    body: ([m, pre]) => `${m}\n##\n${pre}`
  }
]
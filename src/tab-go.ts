import {PuellaTabSnippets} from "./snippets/tab-snippets.ts";

/**
 *
 * 使用 snipet 集合来匹配文本，展开完全文本。
 * @param preText 要匹配的文本
 * @param wherePlace 在哪个上下文，如 javascript、html
 * @param snippetSet 使用 哪个 snippet 集
 * @return matched 所匹配的文本
 * @return fragments 输出的带插槽片段
 */
export function tabGoOutput(preText: string, wherePlace: string, snippetSet = PuellaTabSnippets): [string, string[]] {
  let fragments: string[] | undefined;
  let matched: string | undefined;
  let matches;
  const lastLine = preText.split('\n').slice(-1)[0];
  const indent = lastLine?.match(/^ */)[0];
  const ctx = {
    indent: indent,
    moreIndent: indent + '  ',
    lastLine,
    indentMore(offset) {
      return ctx.indent + ' '.repeat(offset * 2);
    }
  }

  function fixIndent(s) {
    let lines = s.split("\n")
    if(lines[0].trim() == '') lines.shift();
    if(lines.slice(-1)[0].trim() == '') lines.pop();
    const fake_indent = lines[0].match(/^ */)[0]
    return lines.map(s => s.replaceAll(new RegExp(`^${fake_indent}`, 'g'), ctx.indent)).join('\n')

  }
  function matchGo(snippet) {
    const { match, body } = snippet;

    if (match.constructor === String && lastLine.slice(-match.length) == match) {
      matched = match;
      if (body.constructor == String) {
        fragments = (body as String)
      } else if (body.constructor == Function) {
        fragments = body([matched], ctx)
      }
    } else if (match.constructor === RegExp && (matches = lastLine.match(match)) ) {
      matched = matches[0]
      if(body.constructor === String) {
        fragments = body
      } else if (body.constructor === Function) {
        fragments = (body as Function)(matches, ctx)
      }
    } else if (match.constructor === Array && (matched = match.find(s => lastLine.slice(-s.length)[0] == s))) {
      if (body.constructor === String) {
        fragments = body
      } else if ( body.constructor === Function ) {
        fragments = (body as Function)([matched], ctx)
      }
    }
    // return [matched, ret];
  }
  for(const snippet of snippetSet.global) {
    matchGo(snippet);
    if(matched && fragments) break;
  }
  if(snippetSet[wherePlace]) for(const snippet of snippetSet[wherePlace]) {
    matchGo(snippet);
    if(matched && fragments) break;
  }
  return [matched, fixIndent(fragments).split("##")];
}
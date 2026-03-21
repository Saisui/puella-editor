

<template>
  <div class="puella-editor">
    <pre ref="shower" class="editor-show hljs" spellcheck="false" v-html="codeRendered"/>
    <textarea ref="editor" class="editor-edit" v-model="code" @input="update"/>
  </div>
</template>

<script setup lang="ts">

import {onMounted, useTemplateRef, ref} from "vue";
import hljs from 'highlight.js';
import {tabGoOutput} from "../tab-go.ts";
import {puellaEditing} from "../puella-text-editing.ts";
import {PuellaKeydownSnippets} from "../snippets/keydown-snippets.ts";
const { language, } = defineProps<{ language?: string, }>();
const editor = useTemplateRef('editor');
const shower = useTemplateRef('shower');
const code = ref('');
const codeRendered = ref('')
function update(): void {
  codeRendered.value = language
    ? (hljs.highlight(code.value, { language }).value + `\n`)
    : (hljs.highlightAuto(code.value).value + `\n`)
}

onMounted(() => {
  const editing = puellaEditing(editor.value)

  // 同步文本滚动
  editor.value.addEventListener('scroll', () => {
    shower.value.scrollTop = editor.value.scrollTop;
    shower.value.scrollLeft = editor.value.scrollLeft;
  });

  // debug 打印输入匹配情况
  editor.value.addEventListener('input', event => {
    // console.log(tabGoOutput(editing.preText, language ?? 'javascript'))
    editing.nextPositions = editing.nextPositions.map(i => i + 1)
    console.log(event.data)
  });

  // 按下 tab 时，匹配文本，匹配成功则修改文本。
  editor.value.addEventListener('keydown', event => {
    if(event.key == 'Tab') {
      event.preventDefault();
      editing.nextPositions = []
      const [matched, inserted] = tabGoOutput(editing.preText, language ?? 'javascript')
      // console.log(inserted)
      editing.insertText(inserted.join(''), matched.length, - inserted.slice(1).join('').length);
      editing.nextPositions = []
      const nextOffsets = inserted.slice(1, -1).map(s => s.length)
      if(nextOffsets.length > 1) {
        for (const i in nextOffsets) {
          if (i == 0) {
            editing.nextPositions.push(editing.position + nextOffsets[i])
          } else {
            editing.nextPositions.push(editing.nextPositions[i - 1] + nextOffsets[i])
          }
        }
      }
      // console.log([nextOffsets, editing.nextPositions])
    }
  })
  editor.value.addEventListener('keydown', event => {
    if(!event.ctrlKey && PuellaKeydownSnippets.global.find(snip => event.key == snip.match)) {
      event.preventDefault();
      const matched = event.key;
      const inserted: string[] = PuellaKeydownSnippets.global.find(snip => event.key == snip.match).body.split('##')
      console.log([event.key, matched, ...inserted])
      editing.insertText(inserted.join(''), -1, -2);
    }
  })
  editor.value.addEventListener('keydown', event => {
    // console.log(event.key);
    // if(PuellaKeydownSnippets.global.find(snip => editing.lastLine.slice(- snip.match.length) == snip.match)) {
    if(event.key=='Enter') {
      event.preventDefault();
      if(editing.nextPositions.length) {
        // console.log(editing.nextPositions[0])
        editing.goNext()
      } else {
        editing.insertText('\n'+editing.lastLineIndent)
      }
    }
  })
  // editor.value.addEventListener('keydown', event => {
  //   console.log(event.ctrlKey, event.key)
  //   if(event.ctrlKey && event.key=='z') {
  //     event.preventDefault();
  //     console.log(editing.undo());
  //     console.log(editing.history);
  //   }
  // })
  editor.value.addEventListener('keydown', event => {
    console.log(event.ctrlKey, event.key)
    if(event.ctrlKey && event.key=='[') {
      event.preventDefault();
      editing.insertText(' '.repeat(editing.lastLineIndent.length - 2)+editing.lastLine.match(/^ *(.*)$/)[1], editing.lastLine.length, )
    }
    if(event.ctrlKey && event.key==']') {
      event.preventDefault();
      editing.insertText(' '.repeat(editing.lastLineIndent.length + 2)+editing.lastLine.match(/^ *(.*)$/)[1], editing.lastLine.length, )
    }
  })
})


</script>
<style scoped lang="scss">
@import url(https://cdn.jsdelivr.net/gh/highlightjs/cdn-release/build/styles/rose-pine.css);

.puella-editor {
  position: relative;
  //width: 800px;
  // max-width: 90vw;
  //width: calc(100vw - 20px);
  //height: calc(100vh - 20px);
  width: 100%;
  height: 100%;
  //background: v-bind(background);
  //background-size: cover;
  //padding: min(1vw, 1rem);
  /* 试试 grid，让父元素 的 padding 生效 */
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  box-sizing: border-box;
  caret-color: white;
  //color: #f8f8f2;         /* 默认文字色 */

  & > * {
    position: absolute;
    top: 0; left: 0;
    text-align: left;
    margin: 0;
    font: 14px 'fira code';
    white-space: pre-wrap;
    border: none;
    outline: none;
    /* font: 14px/1.5 'Courier New', monospace; */
    width: 100%; height: 100%;
    //box-sizing: border-box;
    /* grid 如上 */
    grid-column: 1;
    grid-row: 1;
  }
  & > img {
    //background: v-bind(background);
    //background-size: cover;
    pointer-events: none;
  }
  & > .editor-show {
      // background-color: #1e1e1e;   /* monokai 深色背景 */
      // background-image: url(v-bind(backgroundImage));
      background: transparent;
      //backdrop-filter: blur(10px) brightness(0.5);
      color: #f8f8f2;         /* 默认文字色 */
      overflow: auto;
      pointer-events: none;   /* 让鼠标穿透 */
  }
  & > .editor-edit {
      background: transparent;
      color: transparent;
      resize: none;
      /* 保留滚动条以保证可滚动 */
      overflow: auto;
    &::selection {
      background: rgba(255, 91, 184, 0.6);
      backdrop-filter: invert(1);
      text-shadow:
        1px 1px 2px red,
        0 0 1em blue,
        0 0 0.2em blue;
    }
  }
}
</style>
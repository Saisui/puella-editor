<template>
  <div class="editor-container">
    <div class="stack-grid">
      <pre class="base-style preview-layer" aria-hidden="true">{{ code + '\n' }}</pre>

      <textarea
        v-model="code"
        class="base-style input-layer"
        spellcheck="false"
        autofocus
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const code = ref('// 在这里输入代码...');
</script>

<style scoped>
.stack-grid {
  display: grid;
  position: relative;
  border: 1px solid #ccc;
}

/* 关键：让所有子元素重叠在同一个网格单元格 */
.stack-grid > * {
  grid-area: 1 / 1 / 2 / 2;
}

.base-style {
  /* 必须完全一致的属性 */
  margin: 0;
  padding: 10px;
  font-family: 'Fira Code', 'Courier New', monospace; /* 建议使用等宽字体 */
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
  tab-size: 4;
  border: none;
  box-sizing: border-box;
  overflow: hidden;
}

.input-layer {
  background: transparent;
  color: transparent; /* 隐藏输入框文字 */
  caret-color: #333;   /* 但显示光标 */
  resize: none;
  z-index: 1;
  outline: none;
}

.preview-layer {
  background: #f5f5f5;
  color: #333;
  z-index: 0;
}
</style>
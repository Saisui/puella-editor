<script setup lang="ts">

import PuellaEditor from "./components/PuellaEditor.vue";
import {ref} from "vue";
const keypress = ref('')
const use = ref('')
document.body.addEventListener("keydown", (event) => {
  if(event.key.length > 1) {
    use.value = '<'+event.key+'>'
    keypress.value = ''
    return;
  }
  keypress.value += (event.ctrlKey ? 'ctrl+' : '' )+ event.key
})
</script>

<template>
  <div class="editor"
       style="
          width: calc(100vw - 20px); height: calc(100vh - 20px);
          background: url(/puella-magic.webp) no-repeat center;
          background-size: cover;
  ">
    <PuellaEditor language="typescript"
                  style="backdrop-filter: blur(10px) brightness(0.5); padding: min(2vw, 10px);"
    />
  </div>
  <h1 style="position: absolute; left: 2vw; opacity: 0.5; top: 10vh; color: white; padding: 10px; pointer-events: none">{{keypress}}</h1>
  <h1 style="position: absolute; left: 2vw; opacity: 0.5; top: 15vh; color: white; padding: 10px; pointer-events: none">{{use}}</h1>
</template>

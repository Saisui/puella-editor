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
    <PuellaEditor language="typescript"
                  style="
                          width: calc(100vw - 45px); height: calc(100vh - 45px);
                          background: url(/puella-magic.webp) no-repeat center;
                          background-size: cover;
                          padding: min(2vw, 10px)
                  "
    />
  <h1 style="position: absolute; left: 2vw; opacity: 0.5; top: 10vh; color: white; padding: 10px; pointer-events: none">{{keypress}}</h1>
  <h1 style="position: absolute; left: 2vw; opacity: 0.5; top: 15vh; color: white; padding: 10px; pointer-events: none">{{use}}</h1>
</template>

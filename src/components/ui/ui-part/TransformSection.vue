<script setup>

import { ref } from 'vue'
const props = defineProps({ title: String, icon: String })
const open = ref(true)
function toggleOpen() { open.value = !open.value }
</script>


<template>

 <div class="transform-section">
    <h6 @click="toggleOpen">
      <span><i :class="icon"></i> {{ title }}</span>
      <i :class="open ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
    </h6>
    <div v-show="open" class="transform-control">
      <slot />
    </div>
  </div>

</template>


<style scoped>
.transform-section { 
  border-bottom:1px solid #dee2e6; 
  padding:10px 15px; 
}
.transform-section h6 { 
  display:flex; 
  justify-content:space-between; 
  align-items:center; 
  cursor:pointer; 
  margin-bottom:10px; 
}
.transform-control { 
  margin-bottom:10px;
}

</style>
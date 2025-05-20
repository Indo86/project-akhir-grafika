<script setup>

const emit = defineEmits(['apply','reset'])

</script>



<template>


  <div class="transform-section ">
    <div class="d-grid gap-2">
      <button class="btn btn-outline-secondary btn-sm" @click="$emit('reset')">
        <i class="bi bi-arrow-counterclockwise"></i> Reset
      </button>
    </div>
  </div>

</template>


<style scoped>
.d-grid { 
  margin-top:10px;
  padding: 10px;
}

</style>
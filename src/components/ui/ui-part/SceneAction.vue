<script setup>
import { ref } from 'vue'

// Destructure props agar local binding mengacu ke props yang benar
const { showAxis, autoRotate, autoRevolver } = defineProps({
  showAxis: Boolean,
  autoRotate: Boolean,
  autoRevolver: Boolean
})
const emit = defineEmits(['update:showAxis', 'update:autoRotate', 'update:autoRevolver'])

const open = ref(true)
</script>

<template>
  <div class="transform-section">
    <h6 @click="open = !open">
      <span><i class="bi bi-gear"></i> Scene Control</span>
      <i :class="open ? 'bi bi-chevron-up' : 'bi bi-chevron-down'" />
    </h6>

    <div v-show="open" class="transform-control">
      <div class="my-2">
        <label>
          <input
            type="checkbox"
            :checked="showAxis"
            @change="emit('update:showAxis', $event.target.checked)"
          />
          Tampilkan Sumbu
        </label>
      </div>
      <div class="my-2">
        <label>
          <input
            type="checkbox"
            :checked="autoRotate"
            @change="emit('update:autoRotate', $event.target.checked)"
          />
          Rotasi Otomatis
        </label>
      </div>
      <div class="my-2">
        <label>
          <input
            type="checkbox"
            :checked="autoRevolver"
            @change="emit('update:autoRevolver', $event.target.checked)"
          />
          Revolusi Otomatis
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.transform-section {
  border-bottom: 1px solid #dee2e6;
  padding: 10px 15px;
}
.transform-section h6 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: 10px;
}
.transform-control {
  margin-bottom: 10px;
}
</style>
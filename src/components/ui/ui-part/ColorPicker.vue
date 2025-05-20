<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  color: String,
  opacity: Number,
  wireframe: Boolean,
})

const emit = defineEmits([
  'update:color',
  'update:opacity',
  'update:wireframe',
])

// Collapse control
const open = ref(true)
function toggleOpen() {
  open.value = !open.value
}

// Local computed bindings
const localColor = computed({
  get: () => props.color,
  set: (val) => emit('update:color', val),
})

const localOpacity = computed({
  get: () => props.opacity,
  set: (val) => emit('update:opacity', val),
})

const localWireframe = computed({
  get: () => props.wireframe,
  set: (val) => emit('update:wireframe', val),
})

</script>


<template>
<div class="transform-section">
    <h6 @click="toggleOpen">
      <span><i class="bi bi-palette"></i> Material</span>
      <i :class="open ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
    </h6>
    <div v-show="open" class="transform-control">
      <!-- Color -->
      <div class="mb-2">
        <label class="form-label d-flex align-items-center">
          <div class="color-preview" :style="{ backgroundColor: localColor }"></div>
          Color
        </label>
        <input
          type="color"
          class="form-control form-control-sm"
          v-model="localColor"
        />
      </div>

      <!-- Opacity -->
      <div class="mb-2">
        <label class="form-label">Opacity</label>
        <div class="d-flex align-items-center">
          <input
            type="range"
            class="form-range me-2"
            min="0"
            max="1"
            step="0.01"
            v-model.number="localOpacity"
          />
          <span class="value-display">{{ Math.round(localOpacity * 100) }}%</span>
        </div>
      </div>

      <!-- Wireframe -->
      <div class="mb-2">
        <label class="form-label">Wireframe</label>
        <div class="form-check form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="localWireframe"
          />
        </div>
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
.color-preview {
  width: 25px;
  height: 25px;
  border: 1px solid #dee2e6;
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
}
.value-display {
  background-color: #e9ecef;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 0.8rem;
  margin-left: 5px;
}

</style>
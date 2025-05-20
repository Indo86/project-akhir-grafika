<script setup>
import { ref } from 'vue'
const props = defineProps({
  objects: Array,
  selectedIndex: Number
})
const emit = defineEmits([
  'update:selectedIndex',
  'add',
  'duplicate',
  'remove'
])

const open = ref(true)
const toggleOpen = () => (open.value = !open.value)
function select(idx)     { emit('update:selectedIndex', idx) }
function emitAdd(type)   { emit('add', type) }
</script>



<template>
  <div class="transform-section">
    <h6 @click="toggleOpen">
      <span><i class="bi bi-layers"></i> Objects</span>
      <i :class="open ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
    </h6>

    <div v-show="open" class="object-list">
      <div
        v-for="(obj, idx) in objects"
        :key="idx"
        class="object-item"
        :class="{ active: selectedIndex === idx }"
        @click="select(idx)"
      >
        <i :class="obj.icon + ' me-2'"></i>{{ obj.name }}
      </div>
    </div>

    <div class="d-flex flex-wrap gap-2 mt-2">
      <!-- Emit tipe shape ke parent -->
      <button class="btn btn-sm btn-outline-primary" @click="emitAdd('mobiusStrip')">Add Mobius Strip</button>
      <button class="btn btn-sm btn-outline-primary" @click="emitAdd('nonagon')">Add Nonagon</button>
      <button class="btn btn-sm btn-outline-primary" @click="emitAdd('kleinBottle')">Add Klein Bottle</button>
      <button class="btn btn-sm btn-outline-primary" @click="emitAdd('torusKnot')">Add Torus Knot</button>
    </div>

    <div class="d-flex justify-content-end gap-1 mt-2">
      <button class="btn btn-sm btn-outline-secondary" @click="$emit('duplicate')">
        <i class="bi bi-files"></i>
      </button>
      <button class="btn btn-sm btn-outline-danger" @click="$emit('remove')">
        <i class="bi bi-trash"></i>
      </button>
    </div>
  </div>
</template>


<style scoped>
.transform-section { border-bottom:1px solid #dee2e6; padding:10px 15px; }
.object-list { max-height:150px; overflow-y:auto; }
.object-item { display:flex; align-items:center; padding:5px 10px; cursor:pointer; }
.object-item.active { background:#daeeff; }
</style>

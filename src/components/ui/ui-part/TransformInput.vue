<script setup>
import { computed } from 'vue'
const props = defineProps({ axis:String, modelValue:Number, type:{type:String,default:'number'}, min:{default:0}, max:{default:10}, step:{default:0.1}, suffix:{type:String,default:''} })
const emit = defineEmits(['update:modelValue'])
const internalValue = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', parseFloat(val))
})
const displayValue = computed(() => `${props.modelValue}${props.suffix}`)
function update(val) { emit('update:modelValue', parseFloat(val)) }

</script>


<template>

  <div class="input-group input-group-sm mb-2">
    <span class="input-group-text text-uppercase">{{ axis }}</span>
    <input
      :type="type"
      class="form-control"
      :min="min"
      :max="max"
      :step="step"
      v-model.number="internalValue"
      @input="update($event.target.value)"
    />
    <span class="input-group-text">
      <span class="value-display">{{ displayValue }}</span>
    </span>
  </div>

</template>


<style scoped>
.value-display { 
  background-color:#e9ecef; 
  padding:2px 8px; 
  border-radius:3px; 
  font-size:0.8rem; 
  margin-left:5px; 

}


</style>
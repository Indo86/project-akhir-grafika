<script setup>
import { onMounted, ref } from 'vue'
import * as THREE from 'three'
import SceneManager from './SceneManager.js'
import { useScene } from '@/composables/useScene'

const container = ref(null)
const { manager, selected } = useScene()

onMounted(() => {
  // init manager & scene
  manager.value = new SceneManager(container.value)

  // default material
  const mat = new THREE.MeshStandardMaterial({ color:0x6699cc })

  // tambahkan 3 objek
  const m1 = manager.value.addObject('torusKnot', mat)


  // pilih yang pertama
  selected.value = m1

  manager.value.start()
})
</script>

<template>
  <div ref="container" class="three-canvas"></div>
</template>



<style scoped>
.three-canvas { width:100%; height:100%; display:block; }
</style>

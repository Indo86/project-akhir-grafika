<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { useScene } from '@/composables/useScene'
import ObjectSelector   from './ui-part/ObjectSelector.vue'
import TransformSection from './ui-part/TransformSection.vue'
import TransformInput   from './ui-part/TransformInput.vue'
import ColorPicker      from './ui-part/ColorPicker.vue'
import ActionButtons    from './ui-part/ActionButtons.vue'
import SceneAction from './ui-part/SceneAction.vue'
import { nextTick } from 'vue'
const { manager, selected } = useScene()

// panel collapse
const isCollapsed  = ref(false)
const togglePanel = () => isCollapsed.value = !isCollapsed.value

// build UI-ready object list
const objects = computed(() => {
  if (!manager.value) return []
  return manager.value.objects.map(mesh => ({
    mesh,
    name: mesh.name,
    icon: iconMap[mesh.name.split(' ')[0]] || 'bi bi-cube'
  }))
})

const showAxis = ref(false)
const autoRotate = ref(true)
const autoRevolver = ref(false)

watch([() => manager.value, showAxis], ([mgr, v]) => {
  if (mgr) mgr.toggleAxes(v)
}, { immediate: true })

watch([() => manager.value, autoRotate], ([mgr, v]) => {
  if (mgr) mgr.toggleRotation(v)
}, { immediate: true })

watch([() => manager.value, autoRevolver], ([mgr, v]) => {
  if (mgr && selected.value) mgr.toggleRevolution(selected.value, v)
}, { immediate: true })


// 2. daftar objek: setiap entry {mesh,name,icon}
const iconMap = {
  torusKnot:  'bi bi-infinity',
  nonagon:    'bi bi-hash',
  mobiusStrip:'bi bi-infinity',
  kleinBottle:'bi bi-flower3'
}
// selection index; start at 0 as soon as we have objects
const selectedIndex = ref(0)
watch(objects, list => {
  if (list.length && selectedIndex.value < 0) {
    selectObject(0)
  }
})

// the raw state backing the proxies
const transform = ref({
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale:    { x: 1, y: 1, z: 1 }
})
const material = ref({
  color:     '#6699cc',
  opacity:   1,
  wireframe: false
})
const uniformScale = ref(true)

// computed proxies for v-model
const posX = computed({
  get: () => transform.value.position.x,
  set: v  => transform.value.position.x = parseFloat(v) || 0
})
const posY = computed({
  get: () => transform.value.position.y,
  set: v  => transform.value.position.y = parseFloat(v) || 0
})
const posZ = computed({
  get: () => transform.value.position.z,
  set: v  => transform.value.position.z = parseFloat(v) || 0
})
function move(dx, dy, dz) {
    if (!selected.value) return
    const m = selected.value
    m.position.x += dx
    m.position.y += dy
    m.position.z += dz

    // sinkronkan UI inputs
    transform.value.position = {
      x: m.position.x,
      y: m.position.y,
      z: m.position.z
    }
  }
const rotX = computed({
  get: () => transform.value.rotation.x,
  set: v  => transform.value.rotation.x = parseFloat(v) || 0
})
const rotY = computed({
  get: () => transform.value.rotation.y,
  set: v  => transform.value.rotation.y = parseFloat(v) || 0
})
const rotZ = computed({
  get: () => transform.value.rotation.z,
  set: v  => transform.value.rotation.z = parseFloat(v) || 0
})

const sclX = computed({
  get: () => transform.value.scale.x,
  set: v  => {
    const n = parseFloat(v) || 1
    transform.value.scale.x = n
    if (uniformScale.value) {
      transform.value.scale.y = transform.value.scale.z = n
    }
  }
})
const sclY = computed({
  get: () => transform.value.scale.y,
  set: v  => transform.value.scale.y = parseFloat(v) || 1
})
const sclZ = computed({
  get: () => transform.value.scale.z,
  set: v  => transform.value.scale.z = parseFloat(v) || 1
})

// when user selects: copy mesh state → UI state
function selectObject(i) {
  selectedIndex.value = i
  const mesh = manager.value.objects[i]
  selected.value = mesh
  const p = mesh.position, r = mesh.rotation, s = mesh.scale, m = mesh.material
  transform.value.position = { x: p.x, y: p.y, z: p.z }
  transform.value.rotation = {
    x: THREE.MathUtils.radToDeg(r.x),
    y: THREE.MathUtils.radToDeg(r.y),
    z: THREE.MathUtils.radToDeg(r.z)
  }
  transform.value.scale = { x: s.x, y: s.y, z: s.z }
  material.value = {
    color:     `#${m.color.getHexString()}`,
    opacity:   m.opacity,
    wireframe: m.wireframe
  }
}

// 9. Kontrol keyboard
function onKeyDown(e) {
  if (!selected.value) return
  const step = 0.1
  const pos = transform.value.position

  switch (e.key) {
    // Arrow keys pindah di X/Z
    case 'ArrowUp':    pos.z -= step; break
    case 'ArrowDown':  pos.z += step; break
    case 'ArrowLeft':  pos.x -= step; break
    case 'ArrowRight': pos.x += step; break

    // PageUp/PageDown pindah di Y
    case 'PageUp':     pos.y += step; break
    case 'PageDown':   pos.y -= step; break

    // tambahan: WASD untuk X/Z juga bisa
    case 'w': pos.z -= step; break
    case 's': pos.z += step; break
    case 'a': pos.x -= step; break
    case 'd': pos.x += step; break
  }
}

// pasang dan lepas listener
onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
})


// add / dup / remove
function addObject(type) {
  if (!manager.value) return
  const mat = new THREE.MeshStandardMaterial({ color: 0x6699cc })
  manager.value.addObject(type, mat)
}
function duplicateObject() {
  if (manager.value && selected.value) manager.value.duplicateObject(selected.value)
}
function removeObject() {
  if (manager.value && selected.value) manager.value.removeObject(selected.value)
}

// whenever UI state changes, push to mesh
watch(transform, t => {
  if (!selected.value) return
  selected.value.position.set(t.position.x, t.position.y, t.position.z)
  selected.value.rotation.set(
    THREE.MathUtils.degToRad(t.rotation.x),
    THREE.MathUtils.degToRad(t.rotation.y),
    THREE.MathUtils.degToRad(t.rotation.z)
  )
  selected.value.scale.set(t.scale.x, t.scale.y, t.scale.z)
}, { deep: true })

watch(material, m => {
  if (!selected.value) return
  const mm = selected.value.material
  mm.color.set(m.color)
  mm.opacity   = m.opacity
  mm.wireframe = m.wireframe
}, { deep: true })

function applyAll() { /* already reactive */ }
function resetAll() {
  transform.value = {
    position: { x:0,y:0,z:0 },
    rotation: { x:0,y:0,z:0 },
    scale:    { x:1,y:1,z:1 }
  }
  uniformScale.value = true
  material.value = { color:'#6699cc', opacity:1, wireframe:false }
}
</script>





<template>
  <div class="transform-panel" :class="{ collapsed: isCollapsed }">
    <!-- toggle -->
    <button class="toggle-btn btn-sm" @click="togglePanel">
      <i :class="isCollapsed ? 'bi bi-chevron-left' : 'bi bi-chevron-right'"></i>
    </button>
    <div class="panel-header"><i class="bi bi-bounding-box"></i> Transform Panel</div>

    <!-- Object Selector -->
    <ObjectSelector
      :objects="objects"
      :selectedIndex="selectedIndex"
      @update:selectedIndex="selectObject"
      @add="addObject"
      @duplicate="duplicateObject"
      @remove="removeObject"
    />

    <!-- Position -->
    <TransformSection title="Position" icon="bi bi-arrows-move">
      <TransformInput axis="x" v-model="posX" />
      <TransformInput axis="y" v-model="posY" />
      <TransformInput axis="z" v-model="posZ" />
      <div class="d-flex flex-wrap gap-1 mt-2">
      <button class="btn btn-sm btn-outline-secondary" @click="move(-1,0,0)">–X</button>
      <button class="btn btn-sm btn-outline-secondary" @click="move( 1,0,0)">+X</button>
      <button class="btn btn-sm btn-outline-secondary" @click="move(0,-1,0)">–Y</button>
      <button class="btn btn-sm btn-outline-secondary" @click="move(0, 1,0)">+Y</button>
      <button class="btn btn-sm btn-outline-secondary" @click="move(0,0,-1)">–Z</button>
      <button class="btn btn-sm btn-outline-secondary" @click="move(0,0, 1)">+Z</button>
     </div>
    </TransformSection>

    <!-- Rotation -->
    <TransformSection title="Rotation" icon="bi bi-arrow-repeat">
      <TransformInput axis="x" type="range" :max="360" suffix="°" v-model="rotX" />
      <TransformInput axis="y" type="range" :max="360" suffix="°" v-model="rotY" />
      <TransformInput axis="z" type="range" :max="360" suffix="°" v-model="rotZ" />
    </TransformSection>

    <!-- Scale -->
    <TransformSection title="Scale" icon="bi bi-arrows-angle-expand">
      <div class="form-check mb-2">
        <input id="uniformScale" type="checkbox" class="form-check-input" v-model="uniformScale" />
        <label class="form-check-label" for="uniformScale">Uniform Scale</label>
      </div>
      <TransformInput axis="x" step="0.1" v-model="sclX" />
      <TransformInput axis="y" step="0.1" v-model="sclY" />
      <TransformInput axis="z" step="0.1" v-model="sclZ" />
    </TransformSection>

    <!-- Animation and Motion -->
    <SceneAction
    v-model:showAxis="showAxis"
    v-model:autoRotate="autoRotate"
    v-model:autoRevolver="autoRevolver"
  />
    <!-- Material -->
    <ColorPicker
      v-model:color="material.color"
      v-model:opacity="material.opacity"
      v-model:wireframe="material.wireframe"
    />

    <!-- Actions -->
    <ActionButtons @apply="applyAll" @reset="resetAll"/>
  </div>
</template>

<style scoped>

.transform-panel {
  position: fixed; top: 0; right: 0;
  width: 280px; height: 100vh;
  background-color: #f8f9fa;
  border-left: 1px solid #dee2e6;
  box-shadow: -2px 0 10px rgba(0,0,0,0.1);
  z-index: 1000; transition: transform 0.3s ease;
  overflow-y: auto;
}
.transform-panel.collapsed { transform: translateX(250px); }
.toggle-btn {
  position: absolute; left: -40px; top: 20px;
  background-color: #f8f9fa; border:1px solid #dee2e6;
  border-right: none; border-radius: 5px 0 0 5px;
  padding:8px; box-shadow: -2px 0 5px rgba(0,0,0,0.1);
}
.panel-header {
  background-color:#4a4a9e; color:white;
  padding:15px; font-weight:bold;
}

</style>
// menyediakan dan menginjeksikan sceneManager & selectedObject
import { ref, provide, inject } from 'vue'

export function provideScene() {
  const manager = ref(null)
  const selected = ref(null)
  provide('sceneManager', manager)
  provide('selectedObject', selected)
}

export function useScene() {
  const manager = inject('sceneManager')
  const selected = inject('selectedObject')
  return { manager, selected }
}

<template>
  <router-view/>
</template>

<script setup>
import { provideScene } from '@/composables/useScene'
provideScene()
</script>

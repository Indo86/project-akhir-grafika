
<script setup>
import ThreeCanvas from '@/components/three/ThreeCanvas.vue';
import TransformMain from '@/components/ui/TransformMain.vue';
</script>

<template>
  <div class="home-container">
    <ThreeCanvas />
    <TransformMain />
  </div>
</template>

<style>
body, html, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  background-color: #000;
}

.home-container {
  position: relative;
  width: 100%;
  height: 100vh;
}
</style>
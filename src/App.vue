<script setup>
import NavBar    from './components/NavBar.vue'
import AppFooter from './components/AppFooter.vue'
import { useReveal } from './composables/useReveal.js'
import { useRoute } from 'vue-router'
import { watch } from 'vue'

const route = useRoute()
const { reinitReveal } = useReveal()

// Re-run reveal observer whenever the route changes
watch(() => route.path, () => reinitReveal())
</script>

<template>
  <NavBar />
  <RouterView />
  <AppFooter />
</template>

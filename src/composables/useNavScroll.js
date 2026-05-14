import { ref, onMounted, onUnmounted } from 'vue'

export function useNavScroll() {
  const scrolled = ref(false)
  const navOpen  = ref(false)

  function onScroll() {
    scrolled.value = window.scrollY > 20
    if (window.scrollY > 60 && navOpen.value) {
      navOpen.value = false
    }
  }

  onMounted(()  => window.addEventListener('scroll', onScroll, { passive: true }))
  onUnmounted(() => window.removeEventListener('scroll', onScroll))

  return { scrolled, navOpen }
}

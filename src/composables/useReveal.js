import { onMounted } from 'vue'

function initReveal() {
  const els = document.querySelectorAll('.reveal')
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  )
  els.forEach((el) => observer.observe(el))
}

export function useReveal() {
  onMounted(() => setTimeout(initReveal, 80))

  // Expose so callers can re-trigger on route change
  function reinitReveal() {
    setTimeout(initReveal, 80)
  }

  return { reinitReveal }
}

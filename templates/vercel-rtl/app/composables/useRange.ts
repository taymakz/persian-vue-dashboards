import { onMounted, onUnmounted, ref } from 'vue'

function mapRange(num: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const newValue
    = ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
  const largest = Math.max(outMin, outMax)
  const smallest = Math.min(outMin, outMax)
  return Math.min(Math.max(newValue, smallest), largest)
}

export function useRange(inMin: number, inMax: number, outMin: number, outMax: number) {
  const range = ref(0)

  function handleScroll() {
    const scrollY = window.scrollY
    range.value = mapRange(scrollY, inMin, inMax, outMin, outMax)
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial calculation
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    range,
  }
}

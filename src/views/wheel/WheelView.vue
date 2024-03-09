<template>
  <v-app>
    <v-main>
      <v-container>
        <div class="wheel-container">
          <div class="wheel" ref="wheel">
            <div
              class="wheel-segment"
              v-for="(item, index) in visibleItems"
              :key="index"
              :style="segmentStyle(index)"
            >
              {{ item.name }}
            </div>
            <!-- Add a marker or pointer -->
            <div class="wheel-pointer"></div>
          </div>
          <v-btn @click="spinWheel">Spin</v-btn>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { computed, ref } from 'vue'
import { useWheelStore } from '@/stores/wheelStore'
import gsap from 'gsap'

export default {
  name: 'wheelView',
  setup() {
    const wheelStore = useWheelStore()
    const wheel = ref(null)

    // Compute visible items, considering the last segment for "Other Items"
    const visibleItems = computed(() => {
      const maxVisible = 7
      const items = wheelStore.items.slice(0, maxVisible)
      if (wheelStore.items.length > maxVisible) {
        items.push({ name: 'Other Items' })
      }
      return items
    })

    const segmentStyle = (index) => {
      const totalSegments = visibleItems.value.length
      const rotation = (360 / totalSegments) * index
      return {
        transform: `rotate(${rotation}deg)`
      }
    }

    const spinWheel = () => {
      // Assuming we have a total of 8 segments, including "Other Items"
      const totalSegments = visibleItems.value.length
      const spins = 3 // Complete spins
      const segmentDegree = 360 / totalSegments

      // Randomly choose a winning segment, this part should be replaced with logic based on chances
      const winningIndex = Math.floor(Math.random() * totalSegments)

      // Calculate the final degree, adjusting for the winning segment
      const finalDegree = 360 * spins + winningIndex * segmentDegree

      // Use GSAP to animate the spin
      gsap.to(wheel.value, {
        rotation: finalDegree,
        duration: 4,
        ease: 'power4.out',
        onComplete: () => {
          alert(`Landed on: ${visibleItems.value[winningIndex].name}`)
        }
      })
    }

    return {
      wheel,
      visibleItems,
      segmentStyle,
      spinWheel
    }
  }
}
</script>

<style scoped>
.wheel-container {
  position: relative;
  width: 300px;
  height: 300px;
  margin: auto;
}

.wheel {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
}

.wheel-segment {
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
  transform-origin: 50% 50%;
}

.wheel-pointer {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  /* Style your pointer here */
}
</style>

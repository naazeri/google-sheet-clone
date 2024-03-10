<template>
  <div class="wheel-container" @click="spinWheel">
    <div class="wheel" ref="wheel" :style="{ backgroundImage: 'url(' + wheelImage + ')' }"></div>
    <div class="pin"></div>
  </div>
</template>

<script>
import { ref } from 'vue'
import anime from 'animejs/lib/anime.es.js'
import wheelImage from '@/assets/wheel.png' // Import your wheel image

export default {
  setup() {
    const wheel = ref(null)

    // Import and use your wheel image as background
    const spinWheel = () => {
      const randomSpinDegrees = 3600 + Math.random() * 360 // Ensure at least 10 spins
      anime({
        targets: wheel.value,
        rotate: randomSpinDegrees,
        duration: 5000,
        easing: 'easeOutQuint',
        complete: function (anim) {
          const finalAngle = randomSpinDegrees % 360
          const winningSegment = Math.floor(finalAngle / (360 / 8)) // Assuming 8 segments
          alert(`Winner: Segment ${winningSegment + 1}`)
        }
      })
    }

    return {
      wheel,
      spinWheel,
      wheelImage
    }
  }
}
</script>

<style scoped>
.wheel-container {
  position: relative;
  width: 300px; /* Adjust based on your image size */
  height: 300px; /* Adjust based on your image size */
  margin: 20px auto;
  cursor: pointer;
}

.wheel {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
}

.pin {
  position: absolute;
  top: -10px; /* Adjust the positioning based on your needs */
  left: 50%;
  transform: translateX(-50%);
  width: 20px; /* Adjust the size based on your design */
  height: 20px; /* Adjust the size based on your design */
  background-color: #ff0000; /* Adjust the color based on your design */
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%); /* Creates a triangle shape */
}
</style>

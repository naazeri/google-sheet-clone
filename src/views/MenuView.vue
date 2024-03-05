<script setup></script>

<template>
  <div class="container">
    <RouterLink to="/sheets">Sheets</RouterLink>
    <RouterLink to="/wheel">Wheel of fortune</RouterLink>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  min-width: 100%;
  min-height: 100vh;
}
a {
  background-color: hsla(160, 100%, 37%, 0.26);
  border-radius: 8px;
  color: rgb(0, 189, 126);
  padding: 10px 14px;
  font-size: 18px;
  text-decoration: none;
  transition: 0.4s;
}

a:hover {
  background-color: hsla(160, 100%, 37%, 0.45);
  color: rgb(0, 170, 113);
}
</style>

<!-- frontend/src/App.vue -->
<template>
  <div id="app">
    <nav>
      <router-link to="/">Inicio</router-link> |
      <router-link to="/pacientes">Pacientes</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
}
nav {
  padding: 20px;
  background: #f5f5f5;
}
nav a {
  margin: 0 10px;
  text-decoration: none;
  color: #333;
}
nav a.router-link-active {
  color: #4A6FA5;
  font-weight: bold;
}
</style>
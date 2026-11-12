<!-- frontend/src/views/RegisterView.vue -->
<template>
  <div class="register-container">
    <h1>Registro</h1>
    <form @submit.prevent="register">
      <div class="form-group">
        <label>Nombre:</label>
        <input type="text" v-model="name" required>
      </div>
      <div class="form-group">
        <label>Email:</label>
        <input type="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label>Contraseña:</label>
        <input type="password" v-model="password" required>
      </div>
      <button type="submit">Registrarse</button>
    </form>
    <p><router-link to="/login">¿Ya tienes cuenta? Inicia sesión</router-link></p>
  </div>
</template>

<script>
export default {
  name: 'RegisterView',
  data() {
    return {
      name: '',
      email: '',
      password: ''
    }
  },
  methods: {
    register() {
      console.log('Register attempt:', this.name, this.email)
      // Aquí iría la lógica de registro
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>
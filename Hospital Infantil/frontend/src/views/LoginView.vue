<!-- frontend/src/views/LoginView.vue -->
<template>
  <div class="login-container">
    <h1>Iniciar Sesión</h1>
    <form @submit.prevent="login">
      <div class="form-group">
        <label>Email:</label>
        <input type="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label>Contraseña:</label>
        <input type="password" v-model="password" required>
      </div>
      <button type="submit">Entrar</button>
    </form>
    <p><router-link to="/register">¿No tienes cuenta? Regístrate</router-link></p>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login() {
      console.log('Login attempt:', this.email)
      // Aquí iría la lógica de autenticación
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
button {
  width: 100%;
  padding: 10px;
  background: #4A6FA5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
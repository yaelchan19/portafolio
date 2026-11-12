// frontend/src/api/index.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',  // Cambia según tu backend
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Interceptor para token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
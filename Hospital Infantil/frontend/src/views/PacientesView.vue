
<template>
  <div class="pacientes-container">
    <div class="header-section">
      <h1 class="main-title">Gestión de Pacientes</h1>
      <p class="subtitle">Sistema de seguimiento de pacientes pediátricos</p>
    </div>
    
    <!-- Estado de carga y errores -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando información de pacientes...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <div class="error-content">
        <h3>Error al cargar los datos</h3>
        <p>{{ error }}</p>
        <button class="retry-btn" @click="cargarPacientes">
          <span class="btn-icon">↻</span>
          Reintentar
        </button>
      </div>
    </div>
    
    <div v-else>
      <!-- Estadísticas mejoradas -->
      <div class="stats-grid">
        <div class="stat-card total">
          <div class="stat-icon">
            <span class="icon">👥</span>
          </div>
          <div class="stat-content">
            <div class="stat-label">Total Pacientes</div>
            <div class="stat-value">{{ pacientes.length }}</div>
          </div>
        </div>
        
        <div class="stat-card active">
          <div class="stat-icon">
            <span class="icon">❤️</span>
          </div>
          <div class="stat-content">
            <div class="stat-label">Pacientes Activos</div>
            <div class="stat-value">{{ pacientesActivos }}</div>
          </div>
        </div>
        
        <div class="stat-card alta">
          <div class="stat-icon">
            <span class="icon">✅</span>
          </div>
          <div class="stat-content">
            <div class="stat-label">Pacientes de Alta</div>
            <div class="stat-value">{{ pacientesAlta }}</div>
          </div>
        </div>
        
        <div class="stat-card baja">
          <div class="stat-icon">
            <span class="icon">📋</span>
          </div>
          <div class="stat-content">
            <div class="stat-label">Pacientes de Baja</div>
            <div class="stat-value">{{ pacientesBaja }}</div>
          </div>
        </div>
      </div>
      
      <!-- Panel de búsqueda mejorado -->
      <div class="search-panel">
        <div class="search-container">
          <span class="search-icon">🔍</span>
          <input 
            v-model="searchTerm" 
            placeholder="Buscar paciente por nombre, ID, ciudad, hospital o tutor..." 
            class="search-input"
            @input="filtrarPacientes"
          />
          <div class="search-info" v-if="searchTerm">
            {{ pacientesFiltrados.length }} resultado{{ pacientesFiltrados.length !== 1 ? 's' : '' }} encontrado{{ pacientesFiltrados.length !== 1 ? 's' : '' }}
          </div>
        </div>
      </div>
      
      <!-- Tabla mejorada -->
      <div class="table-wrapper">
        <div class="table-header">
          <h2 class="table-title">Registro de Pacientes</h2>
          <div class="table-actions">
            <div class="total-count">
              <span class="count-number">{{ pacientes.length }}</span> pacientes registrados
            </div>
            <button class="refresh-btn" @click="cargarPacientes" title="Actualizar datos">
              <span class="refresh-icon">🔄</span>
              Actualizar
            </button>
          </div>
        </div>
        
        <div class="table-scroll-container">
          <table class="patients-table">
            <thead>
              <tr>
                <th class="col-id">ID</th>
                <th class="col-name">Nombre Completo</th>
                <th class="col-age">Edad</th>
                <th class="col-gender">Sexo</th>
                <th class="col-birth">Fecha Nacimiento</th>
                <th class="col-city">Ciudad Origen</th>
                <th class="col-register">Fecha Inscripción</th>
                <th class="col-hospital">Hospital</th>
                <th class="col-tutor">Nombre Tutor</th>
                <th class="col-phone">Teléfono Tutor</th>
                <th class="col-status">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="paciente in pacientesFiltrados" :key="paciente.id" class="patient-row">
                <td class="cell-id">{{ paciente.id }}</td>
                <td class="cell-name">
                  <strong>{{ paciente.nombre_completo || 'Sin nombre' }}</strong>
                </td>
                <td class="cell-age">{{ obtenerEdad(paciente) }} años</td>
                <td class="cell-gender">
                  <span :class="['gender-badge', (paciente.sexo || '').toLowerCase()]">
                    {{ paciente.sexo || 'No especificado' }}
                  </span>
                </td>
                <td class="cell-birth">{{ formatFecha(paciente.fecha_nacimiento) }}</td>
                <td class="cell-city">
                  <span class="city-badge">{{ paciente.ciudad_origen || 'No especificada' }}</span>
                </td>
                <td class="cell-register">{{ formatFecha(paciente.fecha_inscripcion) }}</td>
                <td class="cell-hospital">
                  <span class="hospital-badge">{{ paciente.hospital || 'No asignado' }}</span>
                </td>
                <td class="cell-tutor">{{ paciente.nombre_tutor || 'No especificado' }}</td>
                <td class="cell-phone">
                  <span class="phone-number">{{ paciente.telefono_tutor || 'Sin teléfono' }}</span>
                </td>
                <td class="cell-status">
                  <span :class="['status-badge', getStatusClass(paciente.estado)]">
                    {{ getEstadoTexto(paciente.estado) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="pacientesFiltrados.length === 0 && searchTerm" class="empty-results">
            <div class="empty-icon">🔍</div>
            <h3>No se encontraron pacientes</h3>
            <p>No hay resultados para "{{ searchTerm }}"</p>
            <button class="clear-search" @click="searchTerm = ''">
              Limpiar búsqueda
            </button>
          </div>
          
          <div v-if="pacientes.length === 0 && !loading" class="empty-state">
            <div class="empty-icon">📄</div>
            <h3>No hay pacientes registrados</h3>
            <p>No se han cargado pacientes en el sistema.</p>
            <button class="refresh-btn" @click="cargarPacientes">
              <span class="refresh-icon">🔄</span>
              Intentar cargar de nuevo
            </button>
          </div>
        </div>
        
        <div class="table-footer">
          <div class="footer-info">
            Mostrando {{ pacientesFiltrados.length }} de {{ pacientes.length }} pacientes
            <span v-if="apiUrl" class="api-info">
              | Datos desde: {{ apiUrl }}
            </span>
          </div>
          <div class="last-update" v-if="ultimaActualizacion">
            Última actualización: {{ ultimaActualizacion }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PacientesView',
  data() {
    return {
      searchTerm: '',
      pacientes: [],
      pacientesNormalizados: [],
      loading: false,
      error: null,
      apiUrl: 'http://127.0.0.1:8000/api/pacientes',
      ultimaActualizacion: null
    }
  },
  computed: {
    pacientesActivos() {
      return this.pacientesNormalizados.filter(p => {
        const estado = (p.estado || '').toLowerCase().trim();
        return estado === 'activo' || estado.includes('activo');
      }).length;
    },
    pacientesAlta() {
      return this.pacientesNormalizados.filter(p => {
        const estado = (p.estado || '').toLowerCase().trim();
        return estado === 'alta' || 
               estado.includes('alta') || 
               estado === 'dedo_de_alta' ||
               estado.includes('de alta') ||
               estado.includes('dado de alta') ||
               estado === 'dado de alta' ||
               estado === 'de alta';
      }).length;
    },
    pacientesBaja() {
      return this.pacientesNormalizados.filter(p => {
        const estado = (p.estado || '').toLowerCase().trim();
        return estado === 'baja' || estado.includes('baja');
      }).length;
    },
    pacientesFiltrados() {
      if (!this.searchTerm) return this.pacientesNormalizados
      
      const term = this.searchTerm.toLowerCase()
      return this.pacientesNormalizados.filter(p => {
        const nombre = p.nombre_completo || ''
        const ciudad = p.ciudad_origen || ''
        const hospital = p.hospital || ''
        const tutor = p.nombre_tutor || ''
        const telefono = p.telefono_tutor || ''
        const estado = p.estado || ''
        const edad = p.edad.toString()
        
        return (
          nombre.toLowerCase().includes(term) ||
          p.id.toString().includes(term) ||
          ciudad.toLowerCase().includes(term) ||
          hospital.toLowerCase().includes(term) ||
          tutor.toLowerCase().includes(term) ||
          telefono.includes(term) ||
          estado.toLowerCase().includes(term) ||
          edad.includes(term)
        )
      })
    }
  },
  methods: {
    async cargarPacientes() {
      this.loading = true
      this.error = null
      
      try {
        console.log(`Cargando datos desde: ${this.apiUrl}`)
        
        const response = await axios.get(this.apiUrl, {
          timeout: 10000,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        
        console.log('Respuesta completa de la API:', response)
        
        if (response.data && Array.isArray(response.data)) {
          // Inspeccionar los datos recibidos
          if (response.data.length > 0) {
            console.log('Primer paciente recibido:', response.data[0])
            console.log('Campos disponibles:', Object.keys(response.data[0]))
            console.log('Valor de estado del primer paciente:', response.data[0]?.estado)
            console.log('Todos los estados únicos encontrados:', 
              [...new Set(response.data.map(p => p.estado))].filter(Boolean)
            )
            console.log('Valor de edad del primer paciente:', response.data[0]?.edad)
            console.log('Tipo de dato de edad:', typeof response.data[0]?.edad)
            console.log('Valor de fecha_nacimiento del primer paciente:', response.data[0]?.fecha_nacimiento)
          }
          
          this.pacientes = response.data
          // Normalizar los datos para asegurar consistencia
          this.pacientesNormalizados = this.normalizarDatos(response.data)
          this.ultimaActualizacion = new Date().toLocaleTimeString()
          console.log(`Se cargaron ${this.pacientes.length} pacientes`)
          console.log(`Datos normalizados:`, this.pacientesNormalizados.slice(0, 3))
          
          // Log para depurar estadísticas
          console.log('=== ESTADÍSTICAS ===');
          console.log('Total pacientes:', this.pacientes.length);
          console.log('Pacientes activos:', this.pacientesActivos);
          console.log('Pacientes de alta:', this.pacientesAlta);
          console.log('Pacientes de baja:', this.pacientesBaja);
          console.log('Estados encontrados:', [...new Set(this.pacientesNormalizados.map(p => p.estado))]);
          console.log('Detalle de pacientes de alta:', 
            this.pacientesNormalizados
              .filter(p => {
                const estado = (p.estado || '').toLowerCase().trim();
                return estado === 'alta' || 
                       estado.includes('alta') || 
                       estado === 'dedo_de_alta' ||
                       estado.includes('de alta') ||
                       estado.includes('dado de alta');
              })
              .map(p => ({ id: p.id, nombre: p.nombre_completo, estado: p.estado }))
          );
        } else {
          throw new Error('Formato de datos inválido')
        }
      } catch (err) {
        console.error('Error al cargar pacientes:', err)
        
        // Mensajes de error más descriptivos
        if (err.response) {
          // Error de respuesta del servidor
          if (err.response.status === 404) {
            this.error = `API no encontrada en ${this.apiUrl}. Verifica la URL.`
          } else if (err.response.status === 500) {
            this.error = 'Error interno del servidor. Intenta más tarde.'
          } else {
            this.error = `Error ${err.response.status}: ${err.response.statusText}`
          }
        } else if (err.request) {
          // Error de red (sin respuesta)
          this.error = 'No se pudo conectar con el servidor. Verifica:'
          this.error += '\n1. Que el servidor Laravel esté ejecutándose'
          this.error += '\n2. Que la URL sea correcta'
          this.error += '\n3. Que no haya problemas de CORS'
          console.error('Detalles del error:', err.message)
        } else {
          // Otros errores
          this.error = err.message || 'Error desconocido al cargar los datos'
        }
        
        // Mostrar datos de ejemplo como fallback
        const datosEjemplo = this.getDatosEjemplo()
        this.pacientes = datosEjemplo
        this.pacientesNormalizados = this.normalizarDatos(datosEjemplo)
        this.ultimaActualizacion = new Date().toLocaleTimeString() + ' (Datos de ejemplo)'
      } finally {
        this.loading = false
      }
    },
    
    // Normalizar datos para asegurar consistencia
    normalizarDatos(pacientes) {
      return pacientes.map(paciente => {
        // Calcular edad desde fecha de nacimiento si no existe
        let edadCalculada = this.calcularEdadDesdeFecha(paciente.fecha_nacimiento)
        
        // Determinar la edad a usar (priorizar edad directa si es válida)
        let edadFinal = edadCalculada
        if (paciente.edad !== undefined && paciente.edad !== null) {
          // Intentar extraer número si la edad viene como string "8 años"
          const edadDirecta = this.extraerNumeroEdad(paciente.edad)
          if (edadDirecta !== null) {
            edadFinal = edadDirecta
          }
        }
        
        // Normalizar estado (trim y lowercase para consistencia)
        let estadoNormalizado = paciente.estado || ''
        if (estadoNormalizado) {
          estadoNormalizado = estadoNormalizado.trim()
          
          // Mapear variaciones a valores consistentes
          const estadoLower = estadoNormalizado.toLowerCase()
          if (estadoLower === 'dedo_de_alta' || 
              estadoLower.includes('dado de alta') || 
              estadoLower === 'de alta') {
            estadoNormalizado = 'de alta'
          } else if (estadoLower === 'activo') {
            estadoNormalizado = 'activo'
          } else if (estadoLower === 'baja') {
            estadoNormalizado = 'baja'
          } else if (estadoLower === 'alta') {
            estadoNormalizado = 'de alta' // Tratar 'alta' como 'de alta'
          }
        }
        
        return {
          id: paciente.id || 0,
          nombre_completo: paciente.nombre_completo || '',
          edad: edadFinal,
          sexo: paciente.sexo || '',
          fecha_nacimiento: paciente.fecha_nacimiento || '',
          ciudad_origen: paciente.ciudad_origen || '',
          fecha_inscripcion: paciente.fecha_inscripcion || '',
          hospital: paciente.hospital || '',
          nombre_tutor: paciente.nombre_tutor || '',
          telefono_tutor: paciente.telefono_tutor || '',
          estado: estadoNormalizado
        }
      })
    },
    
    // Extraer número de edad de string como "8 años" o "5 años 6 meses"
    extraerNumeroEdad(edadInput) {
      if (edadInput === null || edadInput === undefined) return null
      
      // Si ya es número, devolverlo
      if (typeof edadInput === 'number') return edadInput
      
      // Si es string, extraer el primer número encontrado
      if (typeof edadInput === 'string') {
        const match = edadInput.match(/(\d+)/)
        if (match) {
          return parseInt(match[1], 10)
        }
      }
      
      return null
    },
    
    // Calcular edad desde fecha de nacimiento
    calcularEdadDesdeFecha(fechaNacimiento) {
      if (!fechaNacimiento) return 0
      
      try {
        const nacimiento = new Date(fechaNacimiento)
        const hoy = new Date()
        
        // Validar que la fecha sea válida
        if (isNaN(nacimiento.getTime())) {
          return 0
        }
        
        let edad = hoy.getFullYear() - nacimiento.getFullYear()
        const mes = hoy.getMonth() - nacimiento.getMonth()
        
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
          edad--
        }
        
        return edad >= 0 ? edad : 0
      } catch (err) {
        console.error('Error calculando edad desde fecha:', err, 'para fecha:', fechaNacimiento)
        return 0
      }
    },
    
    // Método para obtener la edad (para usar en template)
    obtenerEdad(paciente) {
      return paciente.edad !== undefined ? paciente.edad : 0
    },
    
    getDatosEjemplo() {
      // Datos de ejemplo como fallback con variaciones de estado
      return [
        {
          id: 1,
          nombre_completo: 'Juan Pérez López',
          edad: '8 años',
          sexo: 'Masculino',
          fecha_nacimiento: '2016-05-14',
          ciudad_origen: 'Ciudad de México',
          fecha_inscripcion: '2024-01-09',
          hospital: 'Hospital Infantil',
          nombre_tutor: 'Maria Pérez',
          telefono_tutor: '555-111-2233',
          estado: 'baja'
        },
        {
          id: 2,
          nombre_completo: 'Ana Garcia Martinez',
          edad: 6, // Ejemplo con número directo
          sexo: 'Femenino',
          fecha_nacimiento: '2018-03-21',
          ciudad_origen: 'Monterrey',
          fecha_inscripcion: '2024-01-11',
          hospital: 'Hospital ABC',
          nombre_tutor: 'Carlos García',
          telefono_tutor: '555-444-5566',
          estado: 'dedo_de_alta' // Ejemplo con estado de alta
        },
        {
          id: 3,
          nombre_completo: 'Pedro Sanchez Ruiz',
          // Sin campo edad, se calculará desde fecha_nacimiento
          sexo: 'Masculino',
          fecha_nacimiento: '2019-07-30',
          ciudad_origen: 'Guadalajara',
          fecha_inscripcion: '2024-01-12',
          hospital: 'Hospital General',
          nombre_tutor: 'Laura Ruiz',
          telefono_tutor: '555-777-8899',
          estado: 'activo'
        },
        {
          id: 4,
          nombre_completo: 'Lucía Hernández',
          edad: 10,
          sexo: 'Femenino',
          fecha_nacimiento: '2014-11-15',
          ciudad_origen: 'Puebla',
          fecha_inscripcion: '2024-01-10',
          hospital: 'Hospital Central',
          nombre_tutor: 'José Hernández',
          telefono_tutor: '555-999-0000',
          estado: 'de alta' // Otra variación
        },
        {
          id: 5,
          nombre_completo: 'Carlos Ramírez',
          edad: 7,
          sexo: 'Masculino',
          fecha_nacimiento: '2017-08-22',
          ciudad_origen: 'Querétaro',
          fecha_inscripcion: '2024-01-13',
          hospital: 'Hospital Regional',
          nombre_tutor: 'Ana Ramírez',
          telefono_tutor: '555-222-3333',
          estado: 'dado de alta' // Otra variación más
        }
      ]
    },
    
    formatFecha(fechaString) {
      if (!fechaString) return 'No especificada'
      
      try {
        const fecha = new Date(fechaString)
        return fecha.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      } catch (err) {
        // Intentar parsear formatos diferentes
        const partes = fechaString.split('/')
        if (partes.length === 3) {
          return fechaString // Ya está en formato dd/mm/yyyy
        }
        return fechaString // Devolver el string original
      }
    },
    
    getStatusClass(estado) {
      if (!estado) return 'status-default'
      
      const estadoLower = estado.toLowerCase().trim()
      if (estadoLower === 'activo' || estadoLower.includes('activo')) {
        return 'status-active'
      } else if (estadoLower === 'baja' || estadoLower.includes('baja')) {
        return 'status-baja'
      } else if (estadoLower === 'de alta' || 
                 estadoLower.includes('alta') || 
                 estadoLower === 'dedo_de_alta' ||
                 estadoLower.includes('dado de alta')) {
        return 'status-alta'
      } else {
        return 'status-default'
      }
    },
    
    getEstadoTexto(estado) {
      if (!estado) return 'Desconocido'
      
      const estadoLower = estado.toLowerCase().trim()
      if (estadoLower === 'activo' || estadoLower.includes('activo')) {
        return 'Activo'
      } else if (estadoLower === 'baja' || estadoLower.includes('baja')) {
        return 'Baja'
      } else if (estadoLower === 'de alta' || 
                 estadoLower.includes('alta') || 
                 estadoLower === 'dedo_de_alta' ||
                 estadoLower.includes('dado de alta')) {
        return 'De alta'
      } else {
        return estado.charAt(0).toUpperCase() + estado.slice(1)
      }
    },
    
    filtrarPacientes() {
      // Se ejecuta automáticamente por el computed
    }
  },
  
  mounted() {
    this.cargarPacientes()
  }
}
</script>

<style scoped>
.pacientes-container {
  padding: 24px 32px;
  max-width: 1800px;
  margin: 0 auto;
  background-color: #f8fafc;
  min-height: 100vh;
}

/* Header Section */
.header-section {
  margin-bottom: 32px;
}

.main-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 16px;
  color: #64748b;
  margin: 0;
  font-weight: 400;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: #64748b;
  font-size: 16px;
}

/* Error State */
.error-state {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-radius: 16px;
  padding: 32px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  max-width: 600px;
  margin: 40px auto;
  border: 1px solid #fca5a5;
}

.error-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.error-content h3 {
  color: #dc2626;
  margin: 0 0 8px 0;
  font-size: 18px;
}

.error-content p {
  color: #7f1d1d;
  margin: 0 0 16px 0;
  font-size: 14px;
  white-space: pre-line;
}

.retry-btn {
  background: #dc2626;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background: #b91c1c;
  transform: translateY(-1px);
}

.btn-icon {
  font-size: 16px;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.stat-card.total {
  border-left: 6px solid #4f46e5;
}

.stat-card.active {
  border-left: 6px solid #10b981;
}

.stat-card.alta {
  border-left: 6px solid #8b5cf6;
}

.stat-card.baja {
  border-left: 6px solid #ef4444;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-card.total .stat-icon {
  background-color: #eef2ff;
}

.stat-card.active .stat-icon {
  background-color: #d1fae5;
}

.stat-card.alta .stat-icon {
  background-color: #ede9fe;
}

.stat-card.baja .stat-icon {
  background-color: #fee2e2;
}

.icon {
  font-size: 28px;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

/* Search Panel */
.search-panel {
  margin-bottom: 32px;
}

.search-container {
  position: relative;
  max-width: 600px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 18px;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 16px 20px 16px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  background: white;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.search-info {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #64748b;
  background: white;
  padding: 2px 8px;
  border-radius: 6px;
}

/* Table Wrapper */
.table-wrapper {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.table-header {
  padding: 24px 32px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
}

.table-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.table-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.total-count {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #64748b;
}

.count-number {
  font-weight: 700;
  color: #4f46e5;
  font-size: 18px;
}

.refresh-btn {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  font-size: 14px;
}

.refresh-btn:hover {
  background: #4338ca;
  transform: translateY(-1px);
}

.refresh-icon {
  font-size: 14px;
}

/* Table */
.table-scroll-container {
  overflow-x: auto;
  max-height: 600px;
  overflow-y: auto;
}

.patients-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 1400px;
}

.patients-table thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #f8fafc;
}

.patients-table th {
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  color: #475569;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
  position: sticky;
  top: 0;
  background: #f8fafc;
}

.patients-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  color: #334155;
  vertical-align: middle;
}

.patient-row:hover {
  background-color: #f8fafc;
}

/* Column specific styles */
.col-id, .cell-id {
  width: 60px;
  text-align: center;
}

.col-name, .cell-name {
  min-width: 200px;
}

.col-age, .cell-age {
  width: 100px;
}

.col-gender, .cell-gender {
  width: 100px;
}

.col-birth, .cell-birth {
  width: 140px;
}

.col-city, .cell-city {
  width: 150px;
}

.col-register, .cell-register {
  width: 140px;
}

.col-hospital, .cell-hospital {
  width: 180px;
}

.col-tutor, .cell-tutor {
  min-width: 150px;
}

.col-phone, .cell-phone {
  width: 150px;
}

.col-status, .cell-status {
  width: 120px;
}

/* Badges */
.gender-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
}

.gender-badge.masculino {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.gender-badge.femenino {
  background-color: #fce7f3;
  color: #be185d;
}

.city-badge, .hospital-badge {
  padding: 4px 10px;
  background: #f1f5f9;
  border-radius: 6px;
  font-size: 12px;
  display: inline-block;
  border: 1px solid #e2e8f0;
}

.phone-number {
  font-family: 'SF Mono', Monaco, 'Courier New', monospace;
  font-size: 13px;
  color: #475569;
}

.status-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 100px;
  text-align: center;
}

.status-active {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
  border: 1px solid #10b981;
}

.status-baja {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #7f1d1d;
  border: 1px solid #ef4444;
}

.status-alta {
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  color: #5b21b6;
  border: 1px solid #8b5cf6;
}

.status-default {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #cbd5e1;
}

/* Empty States */
.empty-results, .empty-state {
  padding: 60px 20px;
  text-align: center;
  background: white;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 20px;
  opacity: 0.6;
}

.empty-results h3, .empty-state h3 {
  color: #1e293b;
  margin: 0 0 8px 0;
  font-size: 20px;
}

.empty-results p, .empty-state p {
  color: #64748b;
  margin: 0 0 20px 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.clear-search {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-search:hover {
  background: #4338ca;
}

/* Table Footer */
.table-footer {
  padding: 16px 32px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.footer-info {
  color: #64748b;
  font-size: 14px;
}

.api-info {
  color: #8b5cf6;
  font-weight: 500;
  margin-left: 10px;
}

.last-update {
  color: #64748b;
  font-size: 12px;
  background: #e2e8f0;
  padding: 4px 8px;
  border-radius: 4px;
}

/* Responsive */
@media (max-width: 1200px) {
  .pacientes-container {
    padding: 20px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .pacientes-container {
    padding: 16px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .main-title {
    font-size: 24px;
  }
  
  .stat-card {
    padding: 20px;
  }
  
  .search-input {
    padding: 14px 16px 14px 44px;
  }
  
  .table-header {
    padding: 20px;
  }
  
  .table-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .pacientes-container {
    padding: 12px;
  }
  
  .header-section {
    margin-bottom: 24px;
  }
  
  .main-title {
    font-size: 22px;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
  }
  
  .stat-value {
    font-size: 28px;
  }
}
</style>
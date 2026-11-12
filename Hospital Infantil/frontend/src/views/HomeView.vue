<!-- frontend/src/views/HomeView.vue -->
<template>
  <div class="home-container">
    <!-- Header principal -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="welcome-badge">Sistema Médico</div>
        <h1 class="main-title">
          <span class="title-gradient">Bienvenido</span>
          <br>
          <span class="title-sub">al Sistema de Gestión Hospitalaria</span>
        </h1>
        <p class="hero-description">
          Plataforma integral para la administración y seguimiento de pacientes pediátricos.
          Accede a las herramientas necesarias para una gestión eficiente.
        </p>
        
        <!-- Contador de estadísticas -->
        <div class="stats-preview">
          <div class="stat-item">
            <div class="stat-number"></div>
            <div class="stat-label"></div>
          </div>
          <div class="stat-item">
            <div class="stat-number"></div>
            <div class="stat-label"></div>
          </div>
          <div class="stat-item">
            <div class="stat-number"></div>
            <div class="stat-label"></div>
          </div>
        </div>
      </div>
      
      <div class="hero-illustration">
        <div class="illustration-container">
          <div class="icon-circle medical">
            <i class="fas fa-heartbeat"></i>
          </div>
          <div class="icon-circle patient">
            <i class="fas fa-user-injured"></i>
          </div>
          <div class="icon-circle document">
            <i class="fas fa-file-medical"></i>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Panel de acciones principales -->
    <div class="actions-panel">
      <h2 class="section-title">Acciones Principales</h2>
      <p class="section-subtitle">Selecciona un módulo para comenzar</p>
      
      <div class="actions-grid">
        <!-- Tarjeta principal de gestión de pacientes -->
        <router-link to="/pacientes" class="action-card primary">
          <div class="card-icon">
            <i class="fas fa-user-injured"></i>
          </div>
          <div class="card-content">
            <h3>Gestión de Pacientes</h3>
            <p>Accede al registro completo de pacientes, visualiza estadísticas y administra la información médica.</p>
            <div class="card-stats">
              <span class="stat-tag active"></span>
              <span class="stat-tag total"></span>
            </div>
          </div>
          <div class="card-arrow">
            <i class="fas fa-arrow-right"></i>
          </div>
        </router-link>
        
        <!-- Tarjetas futuras (deshabilitadas temporalmente) -->
        <div class="action-card disabled">
          <div class="card-icon">
            <i class="fas fa-calendar-check"></i>
          </div>
          <div class="card-content">
            <h3>Citas Médicas <span class="coming-soon">Próximamente</span></h3>
            <p>Programa y gestiona citas médicas para los pacientes registrados en el sistema.</p>
          </div>
        </div>
        
        <div class="action-card disabled">
          <div class="card-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="card-content">
            <h3>Reportes <span class="coming-soon">Próximamente</span></h3>
            <p>Genera reportes estadísticos y análisis de la información hospitalaria.</p>
          </div>
        </div>
        
        <div class="action-card disabled">
          <div class="card-icon">
            <i class="fas fa-hospital-user"></i>
          </div>
          <div class="card-content">
            <h3>Personal Médico <span class="coming-soon">Próximamente</span></h3>
            <p>Administra la información del equipo médico y asignación de pacientes.</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Información rápida -->
    <div class="quick-info">
      <h2 class="section-title">Información del Sistema</h2>
      
      <div class="info-cards">
        <div class="info-card">
          <div class="info-icon">
            <i class="fas fa-shield-alt"></i>
          </div>
          <h4>Sistema Seguro</h4>
          <p>Todos los datos médicos están protegidos y cifrados conforme a normativas de salud.</p>
        </div>
        
        <div class="info-card">
          <div class="info-icon">
            <i class="fas fa-sync-alt"></i>
          </div>
          <h4>Actualización en Tiempo Real</h4>
          <p>La información se actualiza automáticamente para mantener los datos siempre precisos.</p>
        </div>
        
        <div class="info-card">
          <div class="info-icon">
            <i class="fas fa-mobile-alt"></i>
          </div>
          <h4>Totalmente Responsivo</h4>
          <p>Accede al sistema desde cualquier dispositivo: computadora, tablet o smartphone.</p>
        </div>
        
        <div class="info-card">
          <div class="info-icon">
            <i class="fas fa-headset"></i>
          </div>
          <h4>Soporte 24/7</h4>
          <p>Contamos con equipo de soporte técnico disponible para asistencia en todo momento.</p>
        </div>
      </div>
    </div>
    
    <!-- Footer del home -->
    <div class="home-footer">
      <div class="footer-content">
        <div class="system-status">
          <div class="status-indicator active"></div>
          <span>Sistema operativo</span>
        </div>
        <p class="version">Versión 2.1.0 | Última actualización: Diciembre 2024</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  mounted() {
    // Puedes agregar lógica aquí si necesitas cargar datos al iniciar
  }
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 0;
}

/* Hero Section */
.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 5%;
  max-width: 1400px;
  margin: 0 auto;
  gap: 60px;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.welcome-badge {
  display: inline-block;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 24px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.main-title {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.2;
  color: #1e293b;
  margin: 0 0 16px 0;
  letter-spacing: -0.5px;
}

.title-gradient {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-sub {
  color: #475569;
  font-weight: 600;
  font-size: 40px;
}

.hero-description {
  font-size: 18px;
  line-height: 1.6;
  color: #64748b;
  margin-bottom: 40px;
  max-width: 500px;
}

.stats-preview {
  display: flex;
  gap: 30px;
  margin-top: 40px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 36px;
  font-weight: 800;
  color: #4f46e5;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Hero Illustration */
.hero-illustration {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.illustration-container {
  position: relative;
  width: 300px;
  height: 300px;
}

.icon-circle {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  animation: float 6s ease-in-out infinite;
}

.icon-circle.medical {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 0s;
}

.icon-circle.patient {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  bottom: 0;
  left: 0;
  animation-delay: 2s;
}

.icon-circle.document {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  bottom: 0;
  right: 0;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) translateX(var(--x, 0)); }
  50% { transform: translateY(-20px) translateX(var(--x, 0)); }
}

/* Actions Panel */
.actions-panel {
  padding: 80px 5%;
  background: white;
  max-width: 1400px;
  margin: 0 auto;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  text-align: center;
  margin-bottom: 12px;
}

.section-subtitle {
  font-size: 18px;
  color: #64748b;
  text-align: center;
  margin-bottom: 50px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.action-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  text-decoration: none;
  color: inherit;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.action-card.primary {
  border-color: #4f46e5;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.action-card:hover:not(.disabled) {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(79, 70, 229, 0.15);
  border-color: #4f46e5;
}

.action-card.primary:hover {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
}

.action-card.primary:hover .card-icon {
  background: white;
  color: #4f46e5;
}

.action-card.primary:hover .stat-tag {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.action-card.disabled {
  opacity: 0.7;
  cursor: not-allowed;
  position: relative;
}

.action-card.disabled::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 20px;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.action-card.primary .card-icon {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
}

.action-card.disabled .card-icon {
  background: #e2e8f0;
  color: #94a3b8;
}

.card-content {
  flex: 1;
}

.card-content h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.action-card.primary:hover .card-content h3 {
  color: white;
}

.coming-soon {
  font-size: 12px;
  background: #f1f5f9;
  color: #64748b;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 600;
}

.card-content p {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.action-card.primary:hover .card-content p {
  color: rgba(255, 255, 255, 0.9);
}

.card-stats {
  display: flex;
  gap: 10px;
}

.stat-tag {
  padding: 6px 16px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
}

.stat-tag.active {
  background: #d1fae5;
  color: #065f46;
}

.stat-tag.total {
  background: #e0e7ff;
  color: #3730a3;
}

.card-arrow {
  color: #94a3b8;
  font-size: 18px;
  transition: all 0.3s ease;
}

.action-card.primary:hover .card-arrow {
  color: white;
  transform: translateX(5px);
}

/* Quick Info */
.quick-info {
  padding: 80px 5%;
  max-width: 1400px;
  margin: 0 auto;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.info-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  border-color: #4f46e5;
}

.info-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 28px;
  color: #4f46e5;
}

.info-card:nth-child(2) .info-icon {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #10b981;
}

.info-card:nth-child(3) .info-icon {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #f59e0b;
}

.info-card:nth-child(4) .info-icon {
  background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
  color: #db2777;
}

.info-card h4 {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.info-card p {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

/* Home Footer */
.home-footer {
  padding: 30px 5%;
  background: #1e293b;
  color: white;
  max-width: 1400px;
  margin: 0 auto;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.system-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.system-status span {
  font-size: 14px;
  color: #cbd5e1;
}

.version {
  font-size: 14px;
  color: #94a3b8;
  margin: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    padding: 40px 5%;
  }
  
  .main-title {
    font-size: 40px;
  }
  
  .title-sub {
    font-size: 32px;
  }
  
  .hero-description {
    margin-left: auto;
    margin-right: auto;
  }
  
  .stats-preview {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .main-title {
    font-size: 32px;
  }
  
  .title-sub {
    font-size: 24px;
  }
  
  .hero-description {
    font-size: 16px;
  }
  
  .section-title {
    font-size: 28px;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .info-cards {
    grid-template-columns: 1fr;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .illustration-container {
    width: 250px;
    height: 250px;
  }
  
  .icon-circle {
    width: 80px;
    height: 80px;
    font-size: 32px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 30px 20px;
  }
  
  .main-title {
    font-size: 28px;
  }
  
  .title-sub {
    font-size: 20px;
  }
  
  .stats-preview {
    flex-direction: column;
    gap: 20px;
  }
  
  .actions-panel,
  .quick-info {
    padding: 40px 20px;
  }
  
  .action-card {
    padding: 20px;
  }
  
  .card-icon {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
}
</style>
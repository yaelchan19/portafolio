<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hospital Infantil - Gestión de Pacientes</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <style>
        body { background-color: #f8f9fa; }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white;
            padding: 25px 0;
            position: relative;
            overflow: hidden;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
                        linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%),
                        linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%);
            background-size: 20px 20px;
            opacity: 0.1;
        }
        .header-content {
            position: relative;
            z-index: 1;
        }
        .btn-dashboard {
            background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
            color: white;
            border: none;
            border-radius: 10px;
            padding: 10px 20px;
            font-weight: 600;
            font-size: 0.95rem;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(45, 206, 137, 0.3);
            position: relative;
            overflow: hidden;
        }
        .btn-dashboard::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.6s;
        }
        .btn-dashboard:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(45, 206, 137, 0.4);
            color: white;
        }
        .btn-dashboard:hover::before {
            left: 100%;
        }
        .btn-dashboard i {
            font-size: 1.1rem;
        }
        .card { border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .btn-primary { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            border: none;
            transition: all 0.3s ease;
        }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(102, 126, 234, 0.4);
        }
        .btn-success { 
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
            border: none;
            transition: all 0.3s ease;
        }
        .btn-success:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(40, 167, 69, 0.4);
        }
        .btn-danger { 
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); 
            border: none;
            transition: all 0.3s ease;
        }
        .btn-danger:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(220, 53, 69, 0.4);
        }
        .btn-info { 
            background: linear-gradient(135deg, #17a2b8 0%, #20c997 100%); 
            border: none;
            transition: all 0.3s ease;
        }
        .btn-info:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(23, 162, 184, 0.4);
        }
        .badge-age { background-color: #17a2b8; }
        .modal-header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
        }
        .table th { background-color: #f1f3ff; }
        .badge-pink { background-color: #e83e8c; color: white; }
        .badge-info { background-color: #17a2b8; color: white; }
        .badge-tutor { background-color: #20c997; color: white; }
        .badge-phone { background-color: #6f42c1; color: white; }
        .table-responsive { overflow-x: auto; }
        
        /* Nuevos estilos para estados */
        .badge-estado-activo { background-color: #28a745; color: white; }
        .badge-estado-dado_de_alta { background-color: #17a2b8; color: white; }
        .badge-estado-baja { background-color: #dc3545; color: white; }
        
        /* Filtros de estado */
        .filtro-estado-btn {
            padding: 8px 16px;
            font-size: 0.875rem;
            border-radius: 25px;
            transition: all 0.3s ease;
            border: 1px solid #dee2e6;
            background-color: white;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .filtro-estado-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .filtro-estado-btn.active {
            font-weight: 600;
            box-shadow: 0 3px 10px rgba(0,0,0,0.15);
        }
        
        /* Estilos mejorados para las acciones */
        .acciones-container {
            min-width: 160px;
        }
        
        .btn-accion {
            width: 36px;
            height: 36px;
            padding: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            margin: 3px;
            transition: all 0.3s ease;
            border: none;
        }
        
        .btn-accion:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .btn-accion-view {
            background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
            color: white;
        }
        
        .btn-accion-edit {
            background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
            color: #212529;
        }
        
        .btn-accion-pdf {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            color: white;
        }
        
        .btn-accion-delete {
            background: linear-gradient(135deg, #343a40 0%, #23272b 100%);
            color: white;
        }
        
        .btn-accion i {
            font-size: 1rem;
        }
        
        /* Estilos para los badges */
        .badge-estilizado {
            display: inline-block;
            padding: 0.4em 0.8em;
            font-size: 0.8em;
            font-weight: 600;
            line-height: 1.2;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            border-radius: 12px;
            margin: 3px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        /* Mejoras para la tabla */
        .table-hover tbody tr:hover {
            background-color: rgba(102, 126, 234, 0.08);
            transform: translateY(-1px);
            transition: all 0.2s ease;
        }
        
        .table td {
            vertical-align: middle;
            padding: 0.85rem;
        }
        
        /* Estilos para las celdas específicas */
        td .badge {
            font-size: 0.85em;
            padding: 0.45em 0.9em;
        }
        
        /* Mejoras para el modal de detalles */
        .detail-item {
            margin-bottom: 18px;
            padding-bottom: 12px;
            border-bottom: 1px solid #eee;
        }
        
        .detail-label {
            font-weight: 600;
            color: #667eea;
            font-size: 0.92rem;
            margin-bottom: 5px;
        }
        
        .detail-value {
            color: #495057;
            font-size: 1.05rem;
        }
        
        /* Estilos para los botones de PDF en la parte superior */
        .pdf-buttons-container {
            display: flex;
            gap: 12px;
            align-items: center;
        }
        
        .pdf-buttons-container .btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            border-radius: 10px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        /* Filtros de estado */
        .filtros-container {
            background-color: white;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 25px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            border: 1px solid rgba(102, 126, 234, 0.1);
        }
        
        .filtros-title {
            font-size: 0.95rem;
            color: #495057;
            margin-bottom: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .acciones-container {
                min-width: 140px;
            }
            
            .table-responsive {
                font-size: 0.9rem;
            }
            
            .btn-accion {
                width: 32px;
                height: 32px;
            }
            
            .btn-dashboard {
                padding: 8px 16px;
                font-size: 0.9rem;
            }
            
            .pdf-buttons-container {
                flex-direction: column;
                gap: 8px;
            }
        }
        
        /* Animaciones para los títulos */
        .header h1 {
            animation: fadeInDown 0.8s ease-out;
        }
        
        .header p.lead {
            animation: fadeInUp 0.8s ease-out 0.2s both;
        }
        
        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
</head>
<body>
    <div class="container-fluid p-0">
        <!-- Header -->
        <div class="header py-4 mb-4">
            <div class="container header-content">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h1 class="mb-2"><i class="fas fa-hospital me-2"></i> Hospital Infantil - Gestión de Pacientes</h1>
                        <p class="lead mb-0">Sistema de registro y seguimiento de pacientes</p>
                    </div>
                    <a href="{{ url('/') }}" class="btn btn-dashboard" title="Volver al Dashboard Principal">
                        <i class="fas fa-home me-2"></i> Dashboard
                    </a>
                </div>
            </div>
        </div>

        <div class="container">
            <!-- Botón para agregar paciente y exportar PDF -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2><i class="fas fa-user-injured me-2"></i> Lista de Pacientes</h2>
                <div class="d-flex gap-3">
                    <!-- Botón para PDF general -->
                    <div class="pdf-buttons-container">
                        <a href="{{ route('pacientes.pdf.general') }}" class="btn btn-danger">
                            <i class="fas fa-file-pdf me-2"></i> Exportar PDF
                        </a>
                    </div>
                    
                    <button class="btn btn-primary" onclick="abrirModalNuevo()">
                        <i class="fas fa-plus me-2"></i> Nuevo Paciente
                    </button>
                </div>
            </div>

            <!-- Filtros por estado -->
            <div class="filtros-container">
                <div class="filtros-title">
                    <i class="fas fa-filter"></i> Filtrar por Estado:
                </div>
                <div class="d-flex flex-wrap gap-2">
                    <button class="filtro-estado-btn" onclick="filtrarPorEstado('todos')" id="filtro-todos">
                        <i class="fas fa-list"></i> Todos
                    </button>
                    <button class="filtro-estado-btn" onclick="filtrarPorEstado('activo')" id="filtro-activo">
                        <i class="fas fa-check-circle"></i> Activos
                    </button>
                    <button class="filtro-estado-btn" onclick="filtrarPorEstado('dado_de_alta')" id="filtro-dado_de_alta">
                        <i class="fas fa-sign-out-alt"></i> Dados de Alta
                    </button>
                    <button class="filtro-estado-btn" onclick="filtrarPorEstado('baja')" id="filtro-baja">
                        <i class="fas fa-times-circle"></i> Bajas
                    </button>
                    <button class="filtro-estado-btn btn-info text-white" onclick="resetearFiltros()">
                        <i class="fas fa-redo"></i> Resetear
                    </button>
                </div>
            </div>

            <!-- Tabla de pacientes -->
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre Completo</th>
                                    <th>Edad</th>
                                    <th>Sexo</th>
                                    <th>Estado</th>
                                    <th>Fecha Nacimiento</th>
                                    <th>Ciudad Origen</th>
                                    <th>Fecha Inscripción</th>
                                    <th>Hospital</th>
                                    <th>Nombre del Tutor</th>
                                    <th>Teléfono del Tutor</th>
                                    <th class="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tabla-pacientes">
                                <!-- Los datos se cargarán aquí dinámicamente -->
                                <tr>
                                    <td colspan="12" class="text-center text-muted py-4">
                                        <div class="spinner-border text-primary" role="status">
                                            <span class="visually-hidden">Cargando...</span>
                                        </div>
                                        <p class="mt-2">Cargando pacientes...</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Paginación -->
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <div class="text-muted" id="contador-pacientes">
                            Cargando pacientes...
                        </div>
                        <div class="text-muted" id="contador-estado">
                            <!-- Mostrará el estado del filtro -->
                        </div>
                        <nav>
                            <ul class="pagination" id="paginacion">
                                <!-- La paginación se generará dinámicamente -->
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para crear/editar paciente -->
    <div class="modal fade" id="pacienteModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalTitle">Nuevo Paciente</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="pacienteForm">
                        @csrf
                        <input type="hidden" id="paciente_id" name="id" value="">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Nombre Completo *</label>
                                    <input type="text" class="form-control" id="nombre_completo" name="nombre_completo" required>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label class="form-label">Edad *</label>
                                    <input type="number" class="form-control" id="edad" name="edad" min="0" max="18" required>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label class="form-label">Sexo *</label>
                                    <select class="form-select" id="sexo" name="sexo" required>
                                        <option value="">Seleccionar</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Femenino">Femenino</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Fecha de Nacimiento *</label>
                                    <input type="date" class="form-control" id="fecha_nacimiento" name="fecha_nacimiento" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Fecha de Inscripción *</label>
                                    <input type="date" class="form-control" id="fecha_inscripcion" name="fecha_inscripcion" required>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Ciudad de Origen *</label>
                                    <input type="text" class="form-control" id="ciudad_origen" name="ciudad_origen" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Hospital *</label>
                                    <select class="form-select" id="hospital" name="hospital" required>
                                        <option value="">Seleccionar Hospital</option>
                                        @foreach($hospitales as $hospital)
                                            <option value="{{ $hospital->nombre_hospital }}">
                                                {{ $hospital->nombre_hospital }} 
                                                @if($hospital->ciudad)
                                                    ({{ $hospital->ciudad }})
                                                @endif
                                            </option>
                                        @endforeach
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Nombre del Tutor *</label>
                                    <input type="text" class="form-control" id="nombre_tutor" name="nombre_tutor" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Teléfono del Tutor *</label>
                                    <input type="tel" class="form-control" id="telefono_tutor" name="telefono_tutor" required>
                                </div>
                            </div>
                        </div>

                        <!-- Campo para Estado -->
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Estado *</label>
                                    <select class="form-select" id="estado" name="estado" required>
                                        <option value="activo">Activo</option>
                                        <option value="dado_de_alta">Dado de Alta</option>
                                        <option value="baja">Baja</option>
                                    </select>
                                    <small class="text-muted">El estado por defecto es "Activo"</small>
                                </div>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="submit" class="btn btn-primary" id="submitButton">
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal de detalles del paciente -->
    <div class="modal fade" id="detallesModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fas fa-user-circle me-2"></i>Detalles del Paciente</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-4 text-center mb-4">
                            <div class="mb-3">
                                <i class="fas fa-user-injured fa-5x" style="color: #667eea;"></i>
                            </div>
                            <h4 id="detalle-nombre"></h4>
                            <div class="mt-2">
                                <span class="badge bg-info badge-estilizado" id="detalle-id"></span>
                                <span class="badge badge-age badge-estilizado" id="detalle-edad"></span>
                                <span class="badge badge-estilizado" id="detalle-sexo-badge"></span>
                                <br>
                                <span class="badge badge-estilizado mt-1" id="detalle-estado-badge"></span>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="detail-item">
                                        <div class="detail-label"><i class="fas fa-calendar-alt me-1"></i> Fecha de Nacimiento</div>
                                        <div class="detail-value" id="detalle-fecha-nacimiento"></div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label"><i class="fas fa-calendar-check me-1"></i> Fecha de Inscripción</div>
                                        <div class="detail-value" id="detalle-fecha-inscripcion"></div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label"><i class="fas fa-map-marker-alt me-1"></i> Ciudad de Origen</div>
                                        <div class="detail-value" id="detalle-ciudad-origen"></div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="detail-item">
                                        <div class="detail-label"><i class="fas fa-hospital me-1"></i> Hospital</div>
                                        <div class="detail-value" id="detalle-hospital"></div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label"><i class="fas fa-user-friends me-1"></i> Nombre del Tutor</div>
                                        <div class="detail-value" id="detalle-nombre-tutor"></div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label"><i class="fas fa-phone me-1"></i> Teléfono del Tutor</div>
                                        <div class="detail-value" id="detalle-telefono-tutor"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="detail-item">
                                        <div class="detail-label"><i class="fas fa-info-circle me-1"></i> Información del Estado</div>
                                        <div class="detail-value">
                                            <div class="d-flex align-items-center">
                                                <span id="detalle-estado-texto"></span>
                                                <div class="ms-3" id="detalle-cambiar-estado">
                                                    <!-- Botón para cambiar estado (solo en detalles) -->
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" id="editarDesdeDetallesBtn">
                        <i class="fas fa-edit me-1"></i> Editar Paciente
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal de confirmación para eliminar -->
    <div class="modal fade" id="deleteModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title">Confirmar Eliminación</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    ¿Está seguro que desea eliminar al paciente <strong id="pacienteNombreEliminar"></strong>?
                    Esta acción no se puede deshacer.
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-danger" id="confirmarEliminarBtn">Eliminar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
        let pacienteAEliminar = null;
        let pacienteDetalleId = null;
        let filtroEstadoActual = 'todos';
        let todosPacientes = [];
        
        // Cargar pacientes al iniciar la página
        document.addEventListener('DOMContentLoaded', function() {
            cargarPacientes();
            activarFiltro('todos');
            
            // Configurar botón de editar desde detalles
            document.getElementById('editarDesdeDetallesBtn').addEventListener('click', function() {
                if (pacienteDetalleId) {
                    const detallesModal = bootstrap.Modal.getInstance(document.getElementById('detallesModal'));
                    detallesModal.hide();
                    
                    // Esperar un momento para que se cierre el modal antes de abrir el de edición
                    setTimeout(() => {
                        editarPaciente(pacienteDetalleId);
                    }, 300);
                }
            });
        });
        
        // Función para cargar pacientes
        function cargarPacientes() {
            fetch('/pacientes/datos')
                .then(response => response.json())
                .then(data => {
                    todosPacientes = data;
                    aplicarFiltro();
                })
                .catch(error => {
                    console.error('Error:', error);
                    document.getElementById('tabla-pacientes').innerHTML = `
                        <tr>
                            <td colspan="12" class="text-center text-danger py-4">
                                <i class="fas fa-exclamation-triangle me-2"></i>
                                Error al cargar los pacientes. Por favor, recarga la página.
                            </td>
                        </tr>
                    `;
                });
        }
        
        // Función para aplicar filtro por estado
        function aplicarFiltro() {
            let pacientesFiltrados = todosPacientes;
            
            if (filtroEstadoActual !== 'todos') {
                pacientesFiltrados = todosPacientes.filter(p => p.estado === filtroEstadoActual);
            }
            
            // Ordenar los datos por ID
            pacientesFiltrados.sort((a, b) => a.id - b.id);
            
            const tbody = document.getElementById('tabla-pacientes');
            const contador = document.getElementById('contador-pacientes');
            const contadorEstado = document.getElementById('contador-estado');
            
            if (pacientesFiltrados.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="12" class="text-center text-muted py-4">
                            <i class="fas fa-user-slash fa-2x mb-3"></i>
                            <p class="mb-0">No hay pacientes ${filtroEstadoActual !== 'todos' ? `con estado "${getEstadoTexto(filtroEstadoActual)}"` : 'registrados'}.</p>
                            <p class="mb-0"><small>¡Agrega el primero!</small></p>
                        </td>
                    </tr>
                `;
                contador.textContent = 'Mostrando 0 pacientes';
                contadorEstado.textContent = filtroEstadoActual !== 'todos' ? `Filtrado: ${getEstadoTexto(filtroEstadoActual)}` : '';
                return;
            }
            
            let html = '';
            pacientesFiltrados.forEach(paciente => {
                const fechaNac = new Date(paciente.fecha_nacimiento).toLocaleDateString('es-ES');
                const fechaIns = new Date(paciente.fecha_inscripcion).toLocaleDateString('es-ES');
                
                // Determinar clase CSS para el estado
                const estadoClase = `badge-estado-${paciente.estado}`;
                const estadoTexto = getEstadoTexto(paciente.estado);
                
                html += `
                    <tr>
                        <td>${paciente.id}</td>
                        <td>${paciente.nombre_completo}</td>
                        <td>
                            <span class="badge badge-age badge-estilizado">${paciente.edad} años</span>
                        </td>
                        <td>
                            <span class="badge ${paciente.sexo === 'Masculino' ? 'bg-info' : 'badge-pink'} badge-estilizado">
                                ${paciente.sexo}
                            </span>
                        </td>
                        <td>
                            <span class="badge ${estadoClase} badge-estilizado">
                                ${estadoTexto}
                            </span>
                        </td>
                        <td>${fechaNac}</td>
                        <td>${paciente.ciudad_origen}</td>
                        <td>${fechaIns}</td>
                        <td>${paciente.hospital}</td>
                        <td>
                            <span class="badge badge-tutor badge-estilizado">
                                <i class="fas fa-user-friends me-1"></i> ${paciente.nombre_tutor}
                            </span>
                        </td>
                        <td>
                            <a href="tel:${paciente.telefono_tutor}" class="text-decoration-none">
                                <span class="badge badge-phone badge-estilizado">
                                    <i class="fas fa-phone me-1"></i> ${paciente.telefono_tutor}
                                </span>
                            </a>
                        </td>
                        <td class="acciones-container">
                            <div class="d-flex justify-content-center">
                                <button class="btn btn-accion btn-accion-view" onclick="verDetalles(${paciente.id})" title="Ver detalles">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-accion btn-accion-edit" onclick="editarPaciente(${paciente.id})" title="Editar">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <a href="${generatePDFUrl('individual', paciente.id)}" class="btn btn-accion btn-accion-pdf" title="Descargar PDF">
                                    <i class="fas fa-file-pdf"></i>
                                </a>
                                <button class="btn btn-accion btn-accion-delete" onclick="confirmarEliminar(${paciente.id}, '${paciente.nombre_completo.replace(/'/g, "\\'")}')" title="Eliminar">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });
            
            tbody.innerHTML = html;
            contador.textContent = `Mostrando ${pacientesFiltrados.length} de ${todosPacientes.length} pacientes`;
            contadorEstado.textContent = filtroEstadoActual !== 'todos' ? `Filtrado: ${getEstadoTexto(filtroEstadoActual)}` : '';
        }
        
        // Función para obtener texto del estado
        function getEstadoTexto(estado) {
            const estados = {
                'activo': 'Activo',
                'dado_de_alta': 'Dado de Alta',
                'baja': 'Baja'
            };
            return estados[estado] || estado;
        }
        
        // Función para filtrar por estado
        function filtrarPorEstado(estado) {
            filtroEstadoActual = estado;
            aplicarFiltro();
            activarFiltro(estado);
        }
        
        // Función para activar el filtro visualmente
        function activarFiltro(estado) {
            // Remover clase active de todos los botones
            document.querySelectorAll('.filtro-estado-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.style.backgroundColor = '';
                btn.style.color = '';
                btn.style.border = '1px solid #dee2e6';
            });
            
            // Activar el botón seleccionado
            const btn = document.getElementById(`filtro-${estado}`);
            if (btn) {
                btn.classList.add('active');
                btn.style.backgroundColor = '#667eea';
                btn.style.color = 'white';
                btn.style.border = '1px solid #667eea';
            }
        }
        
        // Función para resetear filtros
        function resetearFiltros() {
            filtroEstadoActual = 'todos';
            aplicarFiltro();
            activarFiltro('todos');
        }
        
        // Función para generar URLs de PDF
        function generatePDFUrl(type, id = null) {
            const baseUrl = '/pacientes/pdf';
            switch(type) {
                case 'individual':
                    return `${baseUrl}/individual/${id}`;
                case 'vista-previa':
                    return `${baseUrl}/vista-previa/${id}`;
                case 'general':
                    return `${baseUrl}/general`;
                case 'vista-previa-general':
                    return `${baseUrl}/vista-previa-general`;
                default:
                    return '#';
            }
        }
        
        // Función para ver detalles del paciente
        function verDetalles(id) {
            fetch(`/pacientes/${id}`)
                .then(response => response.json())
                .then(paciente => {
                    pacienteDetalleId = paciente.id;
                    
                    // Formatear fechas
                    const fechaNac = new Date(paciente.fecha_nacimiento).toLocaleDateString('es-ES');
                    const fechaIns = new Date(paciente.fecha_inscripcion).toLocaleDateString('es-ES');
                    
                    // Llenar los datos en el modal de detalles
                    document.getElementById('detalle-nombre').textContent = paciente.nombre_completo;
                    document.getElementById('detalle-id').textContent = `ID: ${paciente.id}`;
                    document.getElementById('detalle-edad').textContent = `${paciente.edad} años`;
                    document.getElementById('detalle-fecha-nacimiento').textContent = fechaNac;
                    document.getElementById('detalle-fecha-inscripcion').textContent = fechaIns;
                    document.getElementById('detalle-ciudad-origen').textContent = paciente.ciudad_origen;
                    document.getElementById('detalle-hospital').textContent = paciente.hospital;
                    document.getElementById('detalle-nombre-tutor').textContent = paciente.nombre_tutor;
                    document.getElementById('detalle-telefono-tutor').textContent = paciente.telefono_tutor;
                    
                    // Configurar el badge de sexo
                    const sexoBadge = document.getElementById('detalle-sexo-badge');
                    sexoBadge.textContent = paciente.sexo;
                    if (paciente.sexo === 'Masculino') {
                        sexoBadge.className = 'badge bg-info badge-estilizado';
                    } else {
                        sexoBadge.className = 'badge badge-pink badge-estilizado';
                    }
                    
                    // Configurar el badge de estado
                    const estadoBadge = document.getElementById('detalle-estado-badge');
                    const estadoTexto = getEstadoTexto(paciente.estado);
                    estadoBadge.textContent = estadoTexto;
                    estadoBadge.className = `badge badge-estado-${paciente.estado} badge-estilizado`;
                    
                    // Configurar texto del estado
                    document.getElementById('detalle-estado-texto').textContent = `Estado actual: ${estadoTexto}`;
                    
                    // Mostrar modal de detalles
                    const modal = new bootstrap.Modal(document.getElementById('detallesModal'));
                    modal.show();
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error al cargar los detalles del paciente');
                });
        }
        
        // Función para abrir modal de nuevo paciente
        function abrirModalNuevo() {
            document.getElementById('modalTitle').textContent = 'Nuevo Paciente';
            document.getElementById('submitButton').textContent = 'Guardar';
            document.getElementById('pacienteForm').reset();
            document.getElementById('paciente_id').value = '';
            document.getElementById('estado').value = 'activo'; // Estado por defecto
            
            // Remover input de método si existe
            let methodInput = document.querySelector('input[name="_method"]');
            if (methodInput) {
                methodInput.remove();
            }
            
            const modal = new bootstrap.Modal(document.getElementById('pacienteModal'));
            modal.show();
        }
        
        // Función para editar paciente
        function editarPaciente(id) {
            fetch(`/pacientes/${id}`)
                .then(response => response.json())
                .then(paciente => {
                    // Formatear fechas para input type="date"
                    const fechaNac = paciente.fecha_nacimiento.split('T')[0];
                    const fechaIns = paciente.fecha_inscripcion.split('T')[0];
                    
                    // Rellenar formulario
                    document.getElementById('paciente_id').value = paciente.id;
                    document.getElementById('nombre_completo').value = paciente.nombre_completo;
                    document.getElementById('edad').value = paciente.edad;
                    document.getElementById('sexo').value = paciente.sexo;
                    document.getElementById('fecha_nacimiento').value = fechaNac;
                    document.getElementById('fecha_inscripcion').value = fechaIns;
                    document.getElementById('ciudad_origen').value = paciente.ciudad_origen;
                    document.getElementById('hospital').value = paciente.hospital;
                    document.getElementById('nombre_tutor').value = paciente.nombre_tutor;
                    document.getElementById('telefono_tutor').value = paciente.telefono_tutor;
                    document.getElementById('estado').value = paciente.estado;
                    
                    // Cambiar título y botón
                    document.getElementById('modalTitle').textContent = 'Editar Paciente';
                    document.getElementById('submitButton').textContent = 'Actualizar';
                    
                    // Agregar método PUT si no existe
                    if (!document.querySelector('input[name="_method"]')) {
                        const methodInput = document.createElement('input');
                        methodInput.type = 'hidden';
                        methodInput.name = '_method';
                        methodInput.value = 'PUT';
                        document.getElementById('pacienteForm').appendChild(methodInput);
                    }
                    
                    // Mostrar modal
                    const modal = new bootstrap.Modal(document.getElementById('pacienteModal'));
                    modal.show();
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error al cargar los datos del paciente');
                });
        }
        
        // Función para confirmar eliminación
        function confirmarEliminar(id, nombre) {
            pacienteAEliminar = id;
            document.getElementById('pacienteNombreEliminar').textContent = nombre;
            const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
            modal.show();
        }
        
        // Configurar evento de eliminación
        document.getElementById('confirmarEliminarBtn').addEventListener('click', function() {
            if (pacienteAEliminar) {
                eliminarPaciente(pacienteAEliminar);
            }
        });
        
        // Autocompletar edad basada en fecha de nacimiento en el modal
        document.getElementById('fecha_nacimiento').addEventListener('blur', function() {
            if (this.value) {
                const fechaNac = new Date(this.value);
                const hoy = new Date();
                let edad = hoy.getFullYear() - fechaNac.getFullYear();
                
                // Ajuste por mes y día
                const mes = hoy.getMonth() - fechaNac.getMonth();
                if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
                    edad--;
                }
                
                if (edad >= 0 && edad <= 18) {
                    const edadInput = document.getElementById('edad');
                    if (!edadInput.value || edadInput.value === '') {
                        edadInput.value = edad;
                    }
                }
            }
        });
        
        // Función para eliminar paciente
        function eliminarPaciente(id) {
            fetch(`/pacientes/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Cerrar modal y recargar lista
                    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
                    modal.hide();
                    cargarPacientes();
                    alert('Paciente eliminado exitosamente');
                } else {
                    alert('Error al eliminar el paciente');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al eliminar el paciente');
            });
        }
        
        // Manejar envío del formulario - SIN MENSAJE DE ALERTA
        document.getElementById('pacienteForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const id = document.getElementById('paciente_id').value;
            const url = id ? `/pacientes/${id}` : '/pacientes';
            const method = id ? 'PUT' : 'POST';
            
            // Convertir FormData a objeto
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Asegurar que el estado esté presente
            if (!data.estado) {
                data.estado = 'activo';
            }
            
            fetch(url, {
                method: method,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    // Cerrar modal y recargar lista
                    const modal = bootstrap.Modal.getInstance(document.getElementById('pacienteModal'));
                    modal.hide();
                    cargarPacientes();
                    // SE ELIMINÓ EL ALERT: alert(id ? 'Paciente actualizado exitosamente' : 'Paciente registrado exitosamente');
                } else {
                    alert(result.message || 'Error al guardar el paciente');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al guardar el paciente');
            });
        });
    </script>
</body>
</html>
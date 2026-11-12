<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- TOKEN CSRF PARA EVITAR ERROR 419 -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Hospital Infantil - Gestión de Hospitales</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body { background-color: #f8f9fa; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .card { border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; }
        .btn-success { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); border: none; }
        .btn-info { background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); border: none; }
        .badge-city { background-color: #20c997; color: white; }
        .modal-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .table th { background-color: #f1f3ff; }
        .hospital-card { transition: transform 0.3s; }
        .hospital-card:hover { transform: translateY(-5px); }
        .required:after { content: " *"; color: red; }
        .bg-pink { background-color: #e83e8c; }
        .stats-card { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border: none; }
        .hospital-info { background-color: #e9ecef; border-left: 4px solid #667eea; }
        .btn-view { background-color: #6c757d; color: white; }
        .btn-view:hover { background-color: #5a6268; }
        .detail-item { margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #667eea; }
        .detail-value { color: #555; }
        .btn-group .btn { padding: 0.25rem 0.5rem; font-size: 0.875rem; }
        
        /* Estilos para el botón de dashboard */
        .btn-dashboard {
            background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
            border: none;
            color: white;
        }
        .btn-dashboard:hover {
            background: linear-gradient(135deg, #138496 0%, #117a8b 100%);
            color: white;
        }
        
        /* Botón flotante para mobile */
        .floating-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
            color: white;
            border: none;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            transition: all 0.3s;
        }
        .floating-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            color: white;
        }
    </style>
</head>
<body>
    <div class="container-fluid p-0">
        <!-- Header -->
        <div class="header py-4 mb-4">
            <div class="container">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h1><i class="fas fa-hospital"></i> Hospital Infantil - Gestión de Hospitales</h1>
                        <p class="lead mb-0">Sistema de administración de hospitales asociados</p>
                    </div>
                    <a href="{{ url('/') }}" class="btn btn-dashboard" title="Volver al Dashboard Principal">
                        <i class="fas fa-home me-1"></i> Dashboard
                    </a>
                </div>
            </div>
        </div>

        <div class="container">
            <!-- Botones de acción -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2><i class="fas fa-hospital-alt"></i> Lista de Hospitales</h2>
                <div>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createHospitalModal">
                        <i class="fas fa-plus"></i> Nuevo Hospital
                    </button>
                    <a href="{{ route('pacientes.index') }}" class="btn btn-outline-secondary ms-2">
                        <i class="fas fa-user-injured"></i> Ver Pacientes
                    </a>
                </div>
            </div>

            <!-- Estadísticas -->
            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="card hospital-card">
                        <div class="card-body text-center">
                            <h3 class="text-primary">{{ $totalHospitales }}</h3>
                            <p class="text-muted mb-0">Hospitales Registrados</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card hospital-card">
                        <div class="card-body text-center">
                            <h3 class="text-success">{{ $pacientesPorHospital->sum('total_pacientes') }}</h3>
                            <p class="text-muted mb-0">Total de Pacientes</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card hospital-card">
                        <div class="card-body text-center">
                            <h3 class="text-info">{{ $ciudadesUnicas }}</h3>
                            <p class="text-muted mb-0">Ciudades Diferentes</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card hospital-card">
                        <div class="card-body text-center">
                            <h3 class="text-warning">{{ $hospitalMasPacientes->total_pacientes ?? 0 }}</h3>
                            <p class="text-muted mb-0">Máx. Pacientes por Hospital</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tabla de hospitales -->
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre del Hospital</th>
                                    <th>Ciudad</th>
                                    <th>Teléfono</th>
                                    <th>Fecha de Creación</th>
                                    <th>Pacientes Asignados</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($hospitales as $hospital)
                                <tr id="hospital-{{ $hospital->id }}">
                                    <td>{{ $hospital->id }}</td>
                                    <td>
                                        <strong>{{ $hospital->nombre_hospital }}</strong>
                                        @if($hospital->created_at->diffInDays(now()) < 7)
                                            <span class="badge bg-success ms-2">Nuevo</span>
                                        @endif
                                    </td>
                                    <td>
                                        <span class="badge badge-city rounded-pill">
                                            <i class="fas fa-map-marker-alt"></i> {{ $hospital->ciudad }}
                                        </span>
                                    </td>
                                    <td>
                                        @if($hospital->telefono)
                                            <a href="tel:{{ $hospital->telefono }}" class="text-decoration-none">
                                                <i class="fas fa-phone"></i> {{ $hospital->telefono }}
                                            </a>
                                        @else
                                            <span class="text-muted">No especificado</span>
                                        @endif
                                    </td>
                                    <td>
                                        {{ \Carbon\Carbon::parse($hospital->fecha_creacion)->format('d/m/Y') }}
                                    </td>
                                    <td>
                                        @php
                                            $totalPacientes = $pacientesPorHospital->firstWhere('hospital', $hospital->nombre_hospital)->total_pacientes ?? 0;
                                        @endphp
                                        @if($totalPacientes > 0)
                                            <span class="badge bg-primary">{{ $totalPacientes }} pacientes</span>
                                        @else
                                            <span class="badge bg-secondary">Sin pacientes</span>
                                        @endif
                                    </td>
                                    <td>
                                        <div class="btn-group" role="group">
                                            <button class="btn btn-sm btn-view" 
                                                    onclick="verDetallesHospital({{ $hospital->id }})" 
                                                    title="Ver detalles">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button type="button" class="btn btn-sm btn-warning ms-1" 
                                                    onclick="editarHospital({{ $hospital->id }})"
                                                    title="Editar">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button type="button" class="btn btn-sm btn-danger ms-1" 
                                                    onclick="eliminarHospital({{ $hospital->id }}, '{{ addslashes($hospital->nombre_hospital) }}')"
                                                    title="Eliminar">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                @empty
                                <tr>
                                    <td colspan="7" class="text-center text-muted py-4">
                                        <i class="fas fa-hospital fa-3x mb-3"></i><br>
                                        No hay hospitales registrados. ¡Agrega el primero!
                                    </td>
                                </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Paginación -->
                    @if($hospitales->hasPages())
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <div class="text-muted">
                            Mostrando {{ $hospitales->firstItem() }} a {{ $hospitales->lastItem() }} de {{ $hospitales->total() }} hospitales
                        </div>
                        <nav>
                            {{ $hospitales->links() }}
                        </nav>
                    </div>
                    @endif
                </div>
            </div>

            <!-- Información adicional -->
            <div class="row mt-4">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header bg-info text-white">
                            <h5 class="mb-0"><i class="fas fa-chart-pie"></i> Distribución por Ciudad</h5>
                        </div>
                        <div class="card-body">
                            <ul class="list-group list-group-flush">
                                @foreach($distribucionCiudades as $ciudad)
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    {{ $ciudad->ciudad ?: 'Sin ciudad especificada' }}
                                    <span class="badge bg-primary rounded-pill">{{ $ciudad->total }}</span>
                                </li>
                                @endforeach
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header bg-success text-white">
                            <h5 class="mb-0"><i class="fas fa-notes-medical"></i> Hospitales con más pacientes</h5>
                        </div>
                        <div class="card-body">
                            <ul class="list-group list-group-flush">
                                @foreach($pacientesPorHospital->take(5) as $hospital)
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    {{ $hospital->hospital }}
                                    <span class="badge bg-success rounded-pill">{{ $hospital->total_pacientes }} pacientes</span>
                                </li>
                                @endforeach
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Botón flotante para dashboard (solo visible en móviles) -->
        <a href="{{ url('/') }}" class="floating-btn d-md-none" title="Volver al Dashboard">
            <i class="fas fa-home"></i>
        </a>
    </div>

    <!-- MODALES -->

    <!-- Modal para crear nuevo hospital -->
    <div class="modal fade" id="createHospitalModal" tabindex="-1" aria-labelledby="createHospitalModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="createHospitalModalLabel">
                        <i class="fas fa-hospital me-2"></i>Nuevo Hospital
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="createHospitalForm" action="{{ route('hospitales.store') }}" method="POST">
                    @csrf
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="nombre_hospital" class="form-label required">Nombre del Hospital</label>
                            <input type="text" class="form-control" id="nombre_hospital" name="nombre_hospital" required>
                        </div>
                        <div class="mb-3">
                            <label for="ciudad" class="form-label required">Ciudad</label>
                            <input type="text" class="form-control" id="ciudad" name="ciudad" required>
                        </div>
                        <div class="mb-3">
                            <label for="telefono" class="form-label">Teléfono</label>
                            <input type="tel" class="form-control" id="telefono" name="telefono" placeholder="Ej: 555-123-4567">
                        </div>
                        <div class="mb-3">
                            <label for="fecha_creacion" class="form-label required">Fecha de Creación</label>
                            <input type="date" class="form-control" id="fecha_creacion" name="fecha_creacion" 
                                   value="{{ date('Y-m-d') }}" required>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save me-1"></i>Guardar Hospital
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal para editar hospital -->
    <div class="modal fade" id="editHospitalModal" tabindex="-1" aria-labelledby="editHospitalModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editHospitalModalLabel">
                        <i class="fas fa-edit me-2"></i>Editar Hospital
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="editHospitalForm" method="POST">
                    @csrf
                    @method('PUT')
                    <input type="hidden" id="edit_hospital_id" name="id">
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="edit_nombre_hospital" class="form-label required">Nombre del Hospital</label>
                            <input type="text" class="form-control" id="edit_nombre_hospital" name="nombre_hospital" required>
                        </div>
                        <div class="mb-3">
                            <label for="edit_ciudad" class="form-label required">Ciudad</label>
                            <input type="text" class="form-control" id="edit_ciudad" name="ciudad" required>
                        </div>
                        <div class="mb-3">
                            <label for="edit_telefono" class="form-label">Teléfono</label>
                            <input type="tel" class="form-control" id="edit_telefono" name="telefono" placeholder="Ej: 555-123-4567">
                        </div>
                        <div class="mb-3">
                            <label for="edit_fecha_creacion" class="form-label required">Fecha de Creación</label>
                            <input type="date" class="form-control" id="edit_fecha_creacion" name="fecha_creacion" required>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save me-1"></i>Actualizar Hospital
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal de detalles del hospital -->
    <div class="modal fade" id="detallesHospitalModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fas fa-hospital me-2"></i>Detalles del Hospital</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-4 text-center mb-4">
                            <div class="mb-3">
                                <i class="fas fa-hospital fa-5x" style="color: #667eea;"></i>
                            </div>
                            <h4 id="detalle-hospital-nombre"></h4>
                            <div class="mt-2">
                                <span class="badge bg-info" id="detalle-hospital-id"></span>
                                <span class="badge bg-success" id="detalle-hospital-pacientes-badge"></span>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="detail-item">
                                        <div class="detail-label"><i class="fas fa-map-marker-alt me-1"></i> Ciudad</div>
                                        <div class="detail-value" id="detalle-hospital-ciudad"></div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label"><i class="fas fa-phone me-1"></i> Teléfono</div>
                                        <div class="detail-value" id="detalle-hospital-telefono"></div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="detail-item">
                                        <div class="detail-label"><i class="fas fa-calendar-alt me-1"></i> Fecha de Creación</div>
                                        <div class="detail-value" id="detalle-hospital-fecha-creacion"></div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label"><i class="fas fa-user-injured me-1"></i> Pacientes Asignados</div>
                                        <div class="detail-value" id="detalle-hospital-pacientes"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-4">
                                <div class="detail-item">
                                    <div class="detail-label"><i class="fas fa-info-circle me-1"></i> Información del Sistema</div>
                                    <div class="detail-value">
                                        <small class="text-muted">
                                            Hospital registrado en el sistema de gestión hospitalaria. 
                                            Todos los datos están protegidos según las normativas de privacidad médica.
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" id="btn-editar-desde-detalles">
                        <i class="fas fa-edit me-1"></i> Editar Hospital
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
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>¿Está seguro que desea eliminar el hospital <strong id="hospitalNombreEliminar"></strong>?</p>
                    <p class="text-danger"><small>Esta acción no se puede deshacer.</small></p>
                </div>
                <div class="modal-footer">
                    <form id="deleteForm" method="POST">
                        @csrf
                        @method('DELETE')
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-danger">Eliminar</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
        // Variables globales
        let hospitalDetalleId = null;
        let hospitalAEliminar = null;

        // Configurar CSRF token globalmente
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        // Función para ver detalles del hospital
        function verDetallesHospital(id) {
            // Encontrar la fila específica usando el ID
            const fila = document.getElementById(`hospital-${id}`);
            
            if (!fila) {
                console.error('No se encontró el hospital con ID:', id);
                alert('No se pudo cargar la información del hospital');
                return;
            }
            
            // Obtener todas las celdas de la fila
            const celdas = fila.querySelectorAll('td');
            
            // Verificar que tenemos suficientes celdas
            if (celdas.length < 6) {
                console.error('Fila no tiene suficientes celdas:', celdas.length);
                alert('Error en la estructura de la tabla');
                return;
            }
            
            // Obtener datos directamente de las celdas
            const idHospital = celdas[0].textContent.trim();
            const nombre = celdas[1].querySelector('strong').textContent.trim();
            
            // Ciudad - extraer del badge
            const ciudadBadge = celdas[2].querySelector('.badge-city');
            const ciudad = ciudadBadge ? ciudadBadge.textContent.replace('📍 ', '').trim() : 'No especificada';
            
            // Teléfono
            const telefonoLink = celdas[3].querySelector('a');
            const telefono = telefonoLink ? telefonoLink.textContent.replace('📞 ', '').trim() : 'No especificado';
            
            // Fecha de creación
            const fechaCreacion = celdas[4].textContent.trim();
            
            // Pacientes asignados
            const pacientesBadge = celdas[5].querySelector('.badge');
            const pacientes = pacientesBadge ? pacientesBadge.textContent.trim() : '0 pacientes';
            
            // Guardar el ID para usar en el botón de editar
            hospitalDetalleId = id;
            
            // Llenar los datos en el modal de detalles
            document.getElementById('detalle-hospital-nombre').textContent = nombre;
            document.getElementById('detalle-hospital-id').textContent = `ID: ${idHospital}`;
            document.getElementById('detalle-hospital-ciudad').textContent = ciudad;
            document.getElementById('detalle-hospital-telefono').textContent = telefono;
            document.getElementById('detalle-hospital-fecha-creacion').textContent = fechaCreacion;
            document.getElementById('detalle-hospital-pacientes').textContent = pacientes;
            document.getElementById('detalle-hospital-pacientes-badge').textContent = pacientes;
            
            // Configurar el botón de editar desde detalles
            document.getElementById('btn-editar-desde-detalles').onclick = function() {
                const detallesModal = bootstrap.Modal.getInstance(document.getElementById('detallesHospitalModal'));
                detallesModal.hide();
                
                // Esperar un momento antes de abrir el modal de edición
                setTimeout(() => {
                    editarHospital(id);
                }, 300);
            };
            
            // Mostrar modal de detalles
            const modal = new bootstrap.Modal(document.getElementById('detallesHospitalModal'));
            modal.show();
            
            console.log('Detalles cargados:', { id, nombre, ciudad, telefono, fechaCreacion, pacientes });
        }

        // Función para editar hospital - CORREGIDA
        function editarHospital(id) {
            // Encontrar la fila específica
            const fila = document.getElementById(`hospital-${id}`);
            
            if (!fila) {
                alert('No se pudo encontrar el hospital para editar');
                return;
            }
            
            // Obtener todas las celdas de la fila
            const celdas = fila.querySelectorAll('td');
            
            // Obtener datos
            const nombre = celdas[1].querySelector('strong').textContent.trim();
            
            // Ciudad
            const ciudadBadge = celdas[2].querySelector('.badge-city');
            const ciudad = ciudadBadge ? ciudadBadge.textContent.replace('📍 ', '').trim() : '';
            
            // Teléfono
            const telefonoLink = celdas[3].querySelector('a');
            const telefono = telefonoLink ? telefonoLink.textContent.replace('📞 ', '').trim() : '';
            
            // Fecha de creación (convertir de dd/mm/yyyy a yyyy-mm-dd)
            const fechaTexto = celdas[4].textContent.trim();
            let fechaFormatoInput = '';
            
            if (fechaTexto) {
                const partes = fechaTexto.split('/');
                if (partes.length === 3) {
                    fechaFormatoInput = `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
                }
            }
            
            // Pacientes (para mostrar en el modal)
            const pacientesBadge = celdas[5].querySelector('.badge');
            const pacientes = pacientesBadge ? pacientesBadge.textContent.trim() : '0 pacientes';
            
            // Llenar el formulario de edición
            document.getElementById('edit_hospital_id').value = id;
            document.getElementById('edit_nombre_hospital').value = nombre;
            document.getElementById('edit_ciudad').value = ciudad;
            document.getElementById('edit_telefono').value = telefono;
            document.getElementById('edit_fecha_creacion').value = fechaFormatoInput;
            
            // ESTA ES LA CORRECCIÓN CLAVE: Usar la ruta correcta
            const routeUrl = "{{ route('hospitales.update', ':id') }}".replace(':id', id);
            document.getElementById('editHospitalForm').action = routeUrl;
            
            // También podemos mostrar la ruta en consola para depuración
            console.log('Ruta de actualización:', routeUrl);
            
            // Mostrar modal de edición
            const modal = new bootstrap.Modal(document.getElementById('editHospitalModal'));
            modal.show();
        }

        // Función para eliminar hospital
        function eliminarHospital(id, nombre) {
            hospitalAEliminar = id;
            document.getElementById('hospitalNombreEliminar').textContent = nombre;
            
            // Usar ruta con nombre para eliminar también
            const deleteUrl = "{{ route('hospitales.destroy', ':id') }}".replace(':id', id);
            document.getElementById('deleteForm').action = deleteUrl;
            
            const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
            modal.show();
        }

        // Configurar eventos cuando se carga la página
        document.addEventListener('DOMContentLoaded', function() {
            // Formatear automáticamente el teléfono en el modal de creación
            document.getElementById('telefono')?.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 3 && value.length <= 6) {
                    value = value.replace(/(\d{3})(\d{0,3})/, '$1-$2');
                } else if (value.length > 6) {
                    value = value.replace(/(\d{3})(\d{3})(\d{0,4})/, '$1-$2-$3');
                }
                e.target.value = value;
            });

            // Formatear automáticamente el teléfono en el modal de edición
            document.getElementById('edit_telefono')?.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 3 && value.length <= 6) {
                    value = value.replace(/(\d{3})(\d{0,3})/, '$1-$2');
                } else if (value.length > 6) {
                    value = value.replace(/(\d{3})(\d{3})(\d{0,4})/, '$1-$2-$3');
                }
                e.target.value = value;
            });

            // Limpiar formularios cuando se cierran los modales
            document.getElementById('createHospitalModal')?.addEventListener('hidden.bs.modal', function() {
                document.getElementById('createHospitalForm').reset();
            });

            // Validación de formularios
            document.getElementById('createHospitalForm')?.addEventListener('submit', function(e) {
                const nombre = document.getElementById('nombre_hospital').value.trim();
                const ciudad = document.getElementById('ciudad').value.trim();
                
                if (!nombre || !ciudad) {
                    e.preventDefault();
                    alert('Por favor complete todos los campos obligatorios.');
                    return;
                }
            });

            document.getElementById('editHospitalForm')?.addEventListener('submit', function(e) {
                const nombre = document.getElementById('edit_nombre_hospital').value.trim();
                const ciudad = document.getElementById('edit_ciudad').value.trim();
                
                if (!nombre || !ciudad) {
                    e.preventDefault();
                    alert('Por favor complete todos los campos obligatorios.');
                    return;
                }
            });

            // Mensaje de confirmación para eliminar
            document.getElementById('deleteForm')?.addEventListener('submit', function(e) {
                if (!confirm('¿Está completamente seguro de eliminar este hospital?')) {
                    e.preventDefault();
                }
            });

            // Manejar errores de formularios
            document.getElementById('editHospitalForm')?.addEventListener('submit', function(e) {
                // Esta función se ejecuta antes del envío
                console.log('Enviando formulario de edición...');
            });

            console.log('JavaScript cargado correctamente. Token CSRF configurado.');
        });

        // Función de utilidad para mostrar mensajes
        function showAlert(message, type = 'success') {
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
            alertDiv.style.top = '20px';
            alertDiv.style.right = '20px';
            alertDiv.style.zIndex = '1050';
            alertDiv.innerHTML = `
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;
            document.body.appendChild(alertDiv);
            
            // Auto-eliminar después de 5 segundos
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.remove();
                }
            }, 5000);
        }
    </script>
</body>
</html>
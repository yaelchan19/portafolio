<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Hospital - Hospital Infantil</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body { background-color: #f8f9fa; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .card { border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; }
        .btn-warning { background-color: #ffc107; border-color: #ffc107; }
        .btn-secondary { background-color: #6c757d; }
        .form-label { font-weight: 500; color: #495057; }
        .required:after { content: " *"; color: red; }
        .hospital-info { background-color: #e9ecef; border-left: 4px solid #667eea; }
        .stats-card { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); }
    </style>
</head>
<body>
    <div class="container-fluid p-0">
        <!-- Header -->
        <div class="header py-4 mb-4">
            <div class="container">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h1><i class="fas fa-hospital"></i> Hospital Infantil</h1>
                        <p class="lead mb-0">Editar Hospital</p>
                    </div>
                    <div>
                        <a href="{{ route('hospitales.index') }}" class="btn btn-light me-2">
                            <i class="fas fa-arrow-left"></i> Volver a la lista
                        </a>
                        <a href="{{ route('hospitales.create') }}" class="btn btn-outline-light">
                            <i class="fas fa-plus"></i> Nuevo Hospital
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-10">
                    <!-- Información del hospital -->
                    <div class="card mb-4 hospital-info">
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-md-8">
                                    <h4 class="mb-1">{{ $hospital->nombre_hospital }}</h4>
                                    <p class="mb-0 text-muted">
                                        <i class="fas fa-id-badge"></i> ID: {{ $hospital->id }} | 
                                        <i class="fas fa-map-marker-alt"></i> {{ $hospital->ciudad }} | 
                                        <i class="fas fa-calendar-alt"></i> Registrado: {{ \Carbon\Carbon::parse($hospital->created_at)->format('d/m/Y') }}
                                    </p>
                                </div>
                                <div class="col-md-4 text-end">
                                    <span class="badge bg-primary fs-6">
                                        <i class="fas fa-user-injured"></i> {{ $totalPacientes }} pacientes
                                    </span>
                                    <span class="badge bg-success fs-6 ms-2">
                                        <i class="fas fa-phone"></i> {{ $hospital->telefono ?: 'Sin teléfono' }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Estadísticas del hospital -->
                    <div class="row mb-4">
                        <div class="col-md-3">
                            <div class="card stats-card">
                                <div class="card-body text-center">
                                    <h5 class="text-primary">{{ $totalPacientes }}</h5>
                                    <p class="text-muted mb-0">Pacientes Totales</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card stats-card">
                                <div class="card-body text-center">
                                    <h5 class="text-success">{{ $pacientesMasculinos }}</h5>
                                    <p class="text-muted mb-0">Pacientes Masculinos</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card stats-card">
                                <div class="card-body text-center">
                                    <h5 class="text-info">{{ $pacientesFemeninos }}</h5>
                                    <p class="text-muted mb-0">Pacientes Femeninos</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card stats-card">
                                <div class="card-body text-center">
                                    <h5 class="text-warning">{{ $pacientesNuevosUltimoMes }}</h5>
                                    <p class="text-muted mb-0">Nuevos (último mes)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header bg-white">
                            <h3 class="mb-0"><i class="fas fa-edit"></i> Editar Información del Hospital</h3>
                        </div>
                        <div class="card-body">
                            <form id="hospitalForm" action="{{ route('hospitales.update', $hospital->id) }}" method="POST">
                                @csrf
                                @method('PUT')
                                
                                <!-- Mensajes de validación -->
                                @if ($errors->any())
                                    <div class="alert alert-danger">
                                        <ul class="mb-0">
                                            @foreach ($errors->all() as $error)
                                                <li>{{ $error }}</li>
                                            @endforeach
                                        </ul>
                                    </div>
                                @endif
                                
                                <!-- Mensaje de éxito -->
                                @if (session('success'))
                                    <div class="alert alert-success">
                                        {{ session('success') }}
                                    </div>
                                @endif

                                <h5 class="mb-3 text-primary"><i class="fas fa-info-circle"></i> Información General</h5>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="mb-3">
                                            <label class="form-label required">Nombre del Hospital</label>
                                            <input type="text" class="form-control @error('nombre_hospital') is-invalid @enderror" 
                                                   id="nombre_hospital" name="nombre_hospital" 
                                                   value="{{ old('nombre_hospital', $hospital->nombre_hospital) }}" required>
                                            @error('nombre_hospital')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                            <small class="form-text text-muted">El nombre debe ser único en el sistema.</small>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-8">
                                        <div class="mb-3">
                                            <label class="form-label required">Ciudad</label>
                                            <input type="text" class="form-control @error('ciudad') is-invalid @enderror" 
                                                   id="ciudad" name="ciudad" 
                                                   value="{{ old('ciudad', $hospital->ciudad) }}" required>
                                            @error('ciudad')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label class="form-label">Fecha de Creación</label>
                                            <input type="date" class="form-control @error('fecha_creacion') is-invalid @enderror" 
                                                   id="fecha_creacion" name="fecha_creacion" 
                                                   value="{{ old('fecha_creacion', $hospital->fecha_creacion) }}">
                                            @error('fecha_creacion')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>
                                    </div>
                                </div>

                                <h5 class="mb-3 text-primary mt-4"><i class="fas fa-phone-alt"></i> Información de Contacto</h5>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label">Teléfono Principal</label>
                                            <input type="tel" class="form-control @error('telefono') is-invalid @enderror" 
                                                   id="telefono" name="telefono" 
                                                   value="{{ old('telefono', $hospital->telefono) }}">
                                            @error('telefono')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label">Teléfono Secundario (Opcional)</label>
                                            <input type="tel" class="form-control" 
                                                   id="telefono_secundario" name="telefono_secundario" 
                                                   value="{{ old('telefono_secundario') }}">
                                        </div>
                                    </div>
                                </div>

                                <div class="row mt-4">
                                    <div class="col-md-12">
                                        <div class="alert alert-warning">
                                            <i class="fas fa-exclamation-triangle"></i> 
                                            <strong>¡Importante!</strong> Al cambiar el nombre del hospital, asegúrese de que los pacientes asociados puedan seguir siendo identificados correctamente.
                                        </div>
                                    </div>
                                </div>

                                <div class="d-flex justify-content-between mt-4">
                                    <div>
                                        <a href="{{ route('hospitales.index') }}" class="btn btn-secondary">
                                            <i class="fas fa-times"></i> Cancelar
                                        </a>
                                        <button type="button" class="btn btn-danger ms-2" onclick="confirmarEliminar()">
                                            <i class="fas fa-trash"></i> Eliminar Hospital
                                        </button>
                                    </div>
                                    <div>
                                        <button type="submit" class="btn btn-primary" id="submitBtn">
                                            <i class="fas fa-save"></i> Guardar Cambios
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    <!-- Información de pacientes asociados -->
                    @if($pacientes->count() > 0)
                    <div class="card mt-4">
                        <div class="card-header bg-info text-white">
                            <h5 class="mb-0"><i class="fas fa-user-injured"></i> Pacientes Asociados ({{ $totalPacientes }})</h5>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Edad</th>
                                            <th>Sexo</th>
                                            <th>Fecha Inscripción</th>
                                            <th>Tutor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach($pacientes as $paciente)
                                        <tr>
                                            <td>{{ $paciente->id }}</td>
                                            <td>{{ $paciente->nombre_completo }}</td>
                                            <td>{{ $paciente->edad }} años</td>
                                            <td>
                                                <span class="badge {{ $paciente->sexo === 'Masculino' ? 'bg-info' : 'bg-pink' }}">
                                                    {{ $paciente->sexo }}
                                                </span>
                                            </td>
                                            <td>{{ \Carbon\Carbon::parse($paciente->fecha_inscripcion)->format('d/m/Y') }}</td>
                                            <td>{{ $paciente->nombre_tutor }}</td>
                                        </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                            @if($totalPacientes > 5)
                            <div class="text-center mt-2">
                                <a href="{{ route('pacientes.index') }}?hospital={{ urlencode($hospital->nombre_hospital) }}" 
                                   class="btn btn-sm btn-outline-info">
                                    Ver todos los pacientes
                                </a>
                            </div>
                            @endif
                        </div>
                    </div>
                    @endif
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
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-triangle"></i> 
                        <strong>¡Advertencia Crítica!</strong> Esta acción eliminará permanentemente el hospital y <strong>TODOS sus {{ $totalPacientes }} pacientes</strong>.
                    </div>
                    <p>¿Está absolutamente seguro de que desea eliminar el hospital <strong>{{ $hospital->nombre_hospital }}</strong>?</p>
                    <p class="text-danger"><strong>Esta acción es irreversible y eliminará todos los datos asociados.</strong></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <form action="{{ route('hospitales.destroy', $hospital->id) }}" method="POST" style="display: inline;">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-danger">Eliminar Hospital y Pacientes</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Formatear automáticamente el teléfono
        document.getElementById('telefono').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 3 && value.length <= 6) {
                value = value.replace(/(\d{3})(\d{0,3})/, '$1-$2');
            } else if (value.length > 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{0,4})/, '$1-$2-$3');
            }
            e.target.value = value;
        });

        // Validar formulario
        document.getElementById('hospitalForm').addEventListener('submit', function(e) {
            const nombreHospital = document.getElementById('nombre_hospital').value.trim();
            const ciudad = document.getElementById('ciudad').value.trim();
            
            if (!nombreHospital || !ciudad) {
                e.preventDefault();
                alert('Por favor complete todos los campos obligatorios.');
                return;
            }
            
            if (!confirm('¿Está seguro de que desea guardar los cambios?')) {
                e.preventDefault();
                return;
            }
            
            // Deshabilitar botón para evitar doble envío
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        });

        // Función para confirmar eliminación
        function confirmarEliminar() {
            const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
            modal.show();
        }

        // Mostrar advertencia si se cambia el nombre del hospital
        const nombreOriginal = "{{ $hospital->nombre_hospital }}";
        document.getElementById('nombre_hospital').addEventListener('change', function() {
            if (this.value !== nombreOriginal) {
                if (!confirm('¿Está seguro de cambiar el nombre del hospital? Esto podría afectar la identificación de pacientes existentes.')) {
                    this.value = nombreOriginal;
                }
            }
        });
    </script>
</body>
</html>
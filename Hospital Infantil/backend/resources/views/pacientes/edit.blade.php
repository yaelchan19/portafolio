<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Paciente - Hospital Infantil</title>
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
        .patient-info { background-color: #e9ecef; border-left: 4px solid #667eea; }
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
                        <p class="lead mb-0">Editar Paciente</p>
                    </div>
                    <div>
                        <a href="{{ route('pacientes.index') }}" class="btn btn-light me-2">
                            <i class="fas fa-arrow-left"></i> Volver a la lista
                        </a>
                        <a href="{{ route('pacientes.create') }}" class="btn btn-outline-light">
                            <i class="fas fa-plus"></i> Nuevo Paciente
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-10">
                    <!-- Información del paciente -->
                    <div class="card mb-4 patient-info">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-8">
                                    <h4 class="mb-1">{{ $paciente->nombre_completo }}</h4>
                                    <p class="mb-0 text-muted">
                                        <i class="fas fa-id-badge"></i> ID: {{ $paciente->id }} | 
                                        <i class="fas fa-hospital"></i> Hospital: {{ $paciente->hospital }} | 
                                        <i class="fas fa-calendar-alt"></i> Registrado: {{ \Carbon\Carbon::parse($paciente->created_at)->format('d/m/Y') }}
                                    </p>
                                </div>
                                <div class="col-md-4 text-end">
                                    <span class="badge bg-info fs-6">
                                        <i class="fas fa-user"></i> {{ $paciente->edad }} años
                                    </span>
                                    <span class="badge {{ $paciente->sexo === 'Masculino' ? 'bg-primary' : 'bg-pink' }} fs-6 ms-2">
                                        {{ $paciente->sexo }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header bg-white">
                            <h3 class="mb-0"><i class="fas fa-edit"></i> Editar Información del Paciente</h3>
                        </div>
                        <div class="card-body">
                            <form id="pacienteForm" action="{{ route('pacientes.update', $paciente->id) }}" method="POST">
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

                                <h5 class="mb-3 text-primary"><i class="fas fa-user-circle"></i> Datos Personales</h5>
                                <div class="row">
                                    <div class="col-md-8">
                                        <div class="mb-3">
                                            <label class="form-label required">Nombre Completo</label>
                                            <input type="text" class="form-control @error('nombre_completo') is-invalid @enderror" 
                                                   id="nombre_completo" name="nombre_completo" 
                                                   value="{{ old('nombre_completo', $paciente->nombre_completo) }}" required>
                                            @error('nombre_completo')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="mb-3">
                                            <label class="form-label required">Edad</label>
                                            <input type="number" class="form-control @error('edad') is-invalid @enderror" 
                                                   id="edad" name="edad" min="0" max="18" 
                                                   value="{{ old('edad', $paciente->edad) }}" required>
                                            @error('edad')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="mb-3">
                                            <label class="form-label required">Sexo</label>
                                            <select class="form-select @error('sexo') is-invalid @enderror" 
                                                    id="sexo" name="sexo" required>
                                                <option value="">Seleccionar</option>
                                                <option value="Masculino" {{ (old('sexo', $paciente->sexo) == 'Masculino') ? 'selected' : '' }}>Masculino</option>
                                                <option value="Femenino" {{ (old('sexo', $paciente->sexo) == 'Femenino') ? 'selected' : '' }}>Femenino</option>
                                            </select>
                                            @error('sexo')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label required">Fecha de Nacimiento</label>
                                            <input type="date" class="form-control @error('fecha_nacimiento') is-invalid @enderror" 
                                                   id="fecha_nacimiento" name="fecha_nacimiento" 
                                                   value="{{ old('fecha_nacimiento', $paciente->fecha_nacimiento) }}" required>
                                            @error('fecha_nacimiento')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label required">Fecha de Inscripción</label>
                                            <input type="date" class="form-control @error('fecha_inscripcion') is-invalid @enderror" 
                                                   id="fecha_inscripcion" name="fecha_inscripcion" 
                                                   value="{{ old('fecha_inscripcion', $paciente->fecha_inscripcion) }}" required>
                                            @error('fecha_inscripcion')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>
                                    </div>
                                </div>

                                <h5 class="mb-3 text-primary mt-4"><i class="fas fa-map-marker-alt"></i> Ubicación y Hospital</h5>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label required">Ciudad de Origen</label>
                                            <input type="text" class="form-control @error('ciudad_origen') is-invalid @enderror" 
                                                   id="ciudad_origen" name="ciudad_origen" 
                                                   value="{{ old('ciudad_origen', $paciente->ciudad_origen) }}" required>
                                            @error('ciudad_origen')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label required">Hospital</label>
                                            <select class="form-select @error('hospital') is-invalid @enderror" 
                                                    id="hospital" name="hospital" required>
                                                <option value="">Seleccionar Hospital</option>
                                                @foreach($hospitales as $hospital)
                                                    <option value="{{ $hospital->nombre_hospital }}" 
                                                        {{ (old('hospital', $paciente->hospital) == $hospital->nombre_hospital) ? 'selected' : '' }}>
                                                        {{ $hospital->nombre_hospital }} 
                                                        @if($hospital->ciudad)
                                                            ({{ $hospital->ciudad }})
                                                        @endif
                                                    </option>
                                                @endforeach
                                            </select>
                                            @error('hospital')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>
                                    </div>
                                </div>

                                <h5 class="mb-3 text-primary mt-4"><i class="fas fa-users"></i> Información del Tutor</h5>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label required">Nombre del Tutor</label>
                                            <input type="text" class="form-control @error('nombre_tutor') is-invalid @enderror" 
                                                   id="nombre_tutor" name="nombre_tutor" 
                                                   value="{{ old('nombre_tutor', $paciente->nombre_tutor) }}" required>
                                            @error('nombre_tutor')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label required">Teléfono del Tutor</label>
                                            <input type="tel" class="form-control @error('telefono_tutor') is-invalid @enderror" 
                                                   id="telefono_tutor" name="telefono_tutor" 
                                                   value="{{ old('telefono_tutor', $paciente->telefono_tutor) }}" required>
                                            @error('telefono_tutor')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>
                                    </div>
                                </div>

                                <div class="row mt-4">
                                    <div class="col-md-12">
                                        <div class="alert alert-warning">
                                            <i class="fas fa-exclamation-triangle"></i> 
                                            Verifique cuidadosamente todos los datos antes de guardar los cambios.
                                        </div>
                                    </div>
                                </div>

                                <div class="d-flex justify-content-between mt-4">
                                    <div>
                                        <a href="{{ route('pacientes.index') }}" class="btn btn-secondary">
                                            <i class="fas fa-times"></i> Cancelar
                                        </a>
                                        <a href="{{ route('pacientes.show', $paciente->id) }}" class="btn btn-info ms-2">
                                            <i class="fas fa-eye"></i> Ver Detalles
                                        </a>
                                    </div>
                                    <div>
                                        <button type="submit" class="btn btn-primary">
                                            <i class="fas fa-save"></i> Guardar Cambios
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    <!-- Historial de cambios -->
                    <div class="card mt-4">
                        <div class="card-header bg-white">
                            <h5 class="mb-0"><i class="fas fa-history"></i> Información del Registro</h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <p><strong>Creado:</strong> {{ \Carbon\Carbon::parse($paciente->created_at)->format('d/m/Y H:i:s') }}</p>
                                    <p><strong>Última actualización:</strong> {{ \Carbon\Carbon::parse($paciente->updated_at)->format('d/m/Y H:i:s') }}</p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>Tutor actual:</strong> {{ $paciente->nombre_tutor }}</p>
                                    <p><strong>Teléfono actual:</strong> {{ $paciente->telefono_tutor }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Validación de fechas
        document.getElementById('fecha_nacimiento').addEventListener('change', function() {
            const fechaNac = new Date(this.value);
            const hoy = new Date();
            const edad = hoy.getFullYear() - fechaNac.getFullYear();
            
            if (edad < 0 || edad > 18) {
                alert('La edad calculada está fuera del rango permitido (0-18 años).');
                this.value = '{{ $paciente->fecha_nacimiento }}';
            }
        });
        
        // Autocompletar edad basada en fecha de nacimiento
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
        
        // Prevenir envío duplicado del formulario
        document.getElementById('pacienteForm').addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando cambios...';
        });
    </script>
</body>
</html>
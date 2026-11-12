<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registrar Nuevo Paciente - Hospital Infantil</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body { background-color: #f8f9fa; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .card { border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; }
        .btn-secondary { background-color: #6c757d; }
        .form-label { font-weight: 500; color: #495057; }
        .required:after { content: " *"; color: red; }
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
                        <p class="lead mb-0">Registro de Nuevo Paciente</p>
                    </div>
                    <a href="{{ route('pacientes.index') }}" class="btn btn-light">
                        <i class="fas fa-arrow-left"></i> Volver a la lista
                    </a>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-10">
                    <div class="card">
                        <div class="card-header bg-white">
                            <h3 class="mb-0"><i class="fas fa-user-plus"></i> Información del Paciente</h3>
                        </div>
                        <div class="card-body">
                            <form id="pacienteForm" action="{{ route('pacientes.store') }}" method="POST">
                                @csrf
                                
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
                                                   value="{{ old('nombre_completo') }}" 
                                                   placeholder="Ej: Juan Pérez López" required>
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
                                                   value="{{ old('edad') }}" required>
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
                                                <option value="Masculino" {{ old('sexo') == 'Masculino' ? 'selected' : '' }}>Masculino</option>
                                                <option value="Femenino" {{ old('sexo') == 'Femenino' ? 'selected' : '' }}>Femenino</option>
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
                                                   value="{{ old('fecha_nacimiento') }}" required>
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
                                                   value="{{ old('fecha_inscripcion', date('Y-m-d')) }}" required>
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
                                                   value="{{ old('ciudad_origen') }}" 
                                                   placeholder="Ej: Ciudad de México" required>
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
                                                        {{ old('hospital') == $hospital->nombre_hospital ? 'selected' : '' }}>
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
                                                   value="{{ old('nombre_tutor') }}" 
                                                   placeholder="Ej: María Pérez" required>
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
                                                   value="{{ old('telefono_tutor') }}" 
                                                   placeholder="Ej: 555-123-4567" required>
                                            @error('telefono_tutor')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>
                                    </div>
                                </div>

                                <div class="row mt-4">
                                    <div class="col-md-12">
                                        <div class="alert alert-info">
                                            <i class="fas fa-info-circle"></i> 
                                            Todos los campos marcados con * son obligatorios. 
                                            Asegúrese de que la información sea correcta antes de guardar.
                                        </div>
                                    </div>
                                </div>

                                <div class="d-flex justify-content-between mt-4">
                                    <a href="{{ route('pacientes.index') }}" class="btn btn-secondary">
                                        <i class="fas fa-times"></i> Cancelar
                                    </a>
                                    <button type="submit" class="btn btn-primary">
                                        <i class="fas fa-save"></i> Guardar Paciente
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    <!-- Información adicional -->
                    <div class="card mt-4">
                        <div class="card-body">
                            <h5><i class="fas fa-lightbulb"></i> Recomendaciones</h5>
                            <ul class="mb-0">
                                <li>Verifique que todos los datos sean correctos antes de guardar.</li>
                                <li>La edad debe estar entre 0 y 18 años.</li>
                                <li>El hospital seleccionado debe ser donde el paciente recibirá atención.</li>
                                <li>El teléfono del tutor debe estar actualizado para contactos de emergencia.</li>
                            </ul>
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
                this.value = '';
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
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        });
    </script>
</body>
</html>
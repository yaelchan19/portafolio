<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registrar Nuevo Hospital - Hospital Infantil</title>
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
        .step-indicator { 
            display: flex; 
            justify-content: space-between;
            margin-bottom: 2rem;
        }
        .step { 
            flex: 1; 
            text-align: center; 
            padding: 10px;
            border-bottom: 3px solid #dee2e6;
            color: #6c757d;
        }
        .step.active { 
            border-bottom-color: #667eea; 
            color: #667eea; 
            font-weight: bold;
        }
        .step-number {
            display: inline-block;
            width: 30px;
            height: 30px;
            line-height: 30px;
            border-radius: 50%;
            background-color: #dee2e6;
            color: white;
            margin-right: 5px;
        }
        .step.active .step-number {
            background-color: #667eea;
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
                        <h1><i class="fas fa-hospital"></i> Hospital Infantil</h1>
                        <p class="lead mb-0">Registro de Nuevo Hospital</p>
                    </div>
                    <a href="{{ route('hospitales.index') }}" class="btn btn-light">
                        <i class="fas fa-arrow-left"></i> Volver a la lista
                    </a>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-10">
                    <!-- Indicador de pasos -->
                    <div class="step-indicator">
                        <div class="step active">
                            <span class="step-number">1</span>
                            Información Básica
                        </div>
                        <div class="step">
                            <span class="step-number">2</span>
                            Contacto
                        </div>
                        <div class="step">
                            <span class="step-number">3</span>
                            Confirmación
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header bg-white">
                            <h3 class="mb-0"><i class="fas fa-hospital-alt"></i> Datos del Nuevo Hospital</h3>
                        </div>
                        <div class="card-body">
                            <form id="hospitalForm" action="{{ route('hospitales.store') }}" method="POST">
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

                                <h5 class="mb-3 text-primary"><i class="fas fa-info-circle"></i> Información General</h5>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="mb-3">
                                            <label class="form-label required">Nombre del Hospital</label>
                                            <input type="text" class="form-control @error('nombre_hospital') is-invalid @enderror" 
                                                   id="nombre_hospital" name="nombre_hospital" 
                                                   value="{{ old('nombre_hospital') }}" 
                                                   placeholder="Ej: Hospital Infantil de México" required>
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
                                                   value="{{ old('ciudad') }}" 
                                                   placeholder="Ej: Ciudad de México" required>
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
                                                   value="{{ old('fecha_creacion', date('Y-m-d')) }}">
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
                                                   value="{{ old('telefono') }}" 
                                                   placeholder="Ej: 555-123-4567">
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
                                                   value="{{ old('telefono_secundario') }}" 
                                                   placeholder="Ej: 555-987-6543">
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="mb-3">
                                            <label class="form-label">Observaciones (Opcional)</label>
                                            <textarea class="form-control" id="observaciones" name="observaciones" 
                                                      rows="3" placeholder="Agregue cualquier información adicional relevante...">{{ old('observaciones') }}</textarea>
                                        </div>
                                    </div>
                                </div>

                                <div class="row mt-4">
                                    <div class="col-md-12">
                                        <div class="alert alert-info">
                                            <i class="fas fa-info-circle"></i> 
                                            Los campos marcados con * son obligatorios. 
                                            Asegúrese de que la información sea correcta antes de guardar.
                                        </div>
                                    </div>
                                </div>

                                <div class="d-flex justify-content-between mt-4">
                                    <a href="{{ route('hospitales.index') }}" class="btn btn-secondary">
                                        <i class="fas fa-times"></i> Cancelar
                                    </a>
                                    <button type="submit" class="btn btn-primary" id="submitBtn">
                                        <i class="fas fa-save"></i> Registrar Hospital
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
                                <li>Verifique que el nombre del hospital no esté duplicado en el sistema.</li>
                                <li>Proporcione un teléfono válido para contactos de emergencia.</li>
                                <li>La fecha de creación puede ser la fecha de fundación del hospital o la fecha actual.</li>
                                <li>Los hospitales registrados podrán recibir pacientes inmediatamente después del registro.</li>
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

        // Formatear automáticamente el teléfono secundario
        document.getElementById('telefono_secundario').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 3 && value.length <= 6) {
                value = value.replace(/(\d{3})(\d{0,3})/, '$1-$2');
            } else if (value.length > 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{0,4})/, '$1-$2-$3');
            }
            e.target.value = value;
        });

        // Validar que el nombre del hospital no esté vacío
        document.getElementById('hospitalForm').addEventListener('submit', function(e) {
            const nombreHospital = document.getElementById('nombre_hospital').value.trim();
            const ciudad = document.getElementById('ciudad').value.trim();
            
            if (!nombreHospital || !ciudad) {
                e.preventDefault();
                alert('Por favor complete todos los campos obligatorios.');
                return;
            }
            
            // Mostrar mensaje de confirmación
            if (!confirm('¿Está seguro de que desea registrar este hospital?')) {
                e.preventDefault();
                return;
            }
            
            // Deshabilitar botón para evitar doble envío
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';
        });

        // Actualizar indicador de pasos al enfocar campos
        const steps = document.querySelectorAll('.step');
        const fields = document.querySelectorAll('#hospitalForm input, #hospitalForm textarea');
        
        fields.forEach((field, index) => {
            field.addEventListener('focus', function() {
                steps.forEach(step => step.classList.remove('active'));
                
                if (this.id === 'nombre_hospital' || this.id === 'ciudad') {
                    steps[0].classList.add('active');
                } else if (this.id === 'telefono' || this.id === 'telefono_secundario') {
                    steps[1].classList.add('active');
                } else {
                    steps[2].classList.add('active');
                }
            });
        });
    </script>
</body>
</html>
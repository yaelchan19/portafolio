<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Ficha del Paciente - {{ $paciente->nombre_completo }}</title>
    <style>
        body { 
            font-family: 'Arial', sans-serif; 
            font-size: 13px;
            margin: 0;
            padding: 20px;
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 3px solid #3498db;
            padding-bottom: 15px;
        }
        .header h1 { 
            color: #2c3e50; 
            margin: 0;
            font-size: 26px;
        }
        .header h2 { 
            color: #3498db; 
            margin: 5px 0;
            font-size: 18px;
        }
        .header h3 { 
            color: #7f8c8d; 
            margin: 5px 0 0 0;
            font-size: 14px;
        }
        .info-section { 
            margin-bottom: 25px; 
            padding: 15px;
            border: 1px solid #eee;
            border-radius: 5px;
            background-color: #fafafa;
        }
        .info-section h3 {
            color: #2c3e50;
            border-bottom: 1px solid #3498db;
            padding-bottom: 8px;
            margin-top: 0;
            font-size: 16px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }
        .info-item {
            margin-bottom: 10px;
        }
        .info-label { 
            font-weight: bold; 
            color: #34495e; 
            display: block;
            margin-bottom: 3px;
            font-size: 12px;
            text-transform: uppercase;
        }
        .info-value { 
            color: #2c3e50;
            font-size: 14px;
            padding: 5px;
            background-color: white;
            border-radius: 3px;
            border-left: 3px solid #3498db;
        }
        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .badge-id {
            background-color: #2c3e50;
            color: white;
        }
        .badge-edad {
            background-color: #17a2b8;
            color: white;
        }
        .badge-masculino {
            background-color: #3498db;
            color: white;
        }
        .badge-femenino {
            background-color: #e84393;
            color: white;
        }
        .badge-estado-activo {
            background-color: #28a745;
            color: white;
        }
        .badge-estado-dado_de_alta {
            background-color: #17a2b8;
            color: white;
        }
        .badge-estado-baja {
            background-color: #dc3545;
            color: white;
        }
        .estado-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .footer { 
            margin-top: 40px; 
            text-align: center; 
            font-size: 11px; 
            color: #7f8c8d;
            border-top: 1px solid #eee;
            padding-top: 15px;
        }
        .photo-placeholder {
            width: 120px;
            height: 150px;
            border: 1px dashed #ccc;
            background-color: #f8f9fa;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #999;
            font-size: 12px;
            float: right;
            margin-left: 20px;
        }
        .clearfix {
            clear: both;
        }
        .estado-section {
            margin-top: 5px;
            padding: 8px;
            border-radius: 5px;
            font-size: 12px;
        }
        .estado-activo {
            background-color: rgba(40, 167, 69, 0.1);
            border: 1px solid #28a745;
            color: #155724;
        }
        .estado-dado_de_alta {
            background-color: rgba(23, 162, 184, 0.1);
            border: 1px solid #17a2b8;
            color: #0c5460;
        }
        .estado-baja {
            background-color: rgba(220, 53, 69, 0.1);
            border: 1px solid #dc3545;
            color: #721c24;
        }
        .fecha-generacion {
            background-color: #f8f9fa;
            padding: 8px 12px;
            border-radius: 4px;
            border-left: 4px solid #6c757d;
            margin: 5px 0;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>HOSPITAL INFANTIL - GESTIÓN DE PACIENTES</h1>
        <h2>Ficha Clínica del Paciente</h2>
        <h3>Documento Oficial - Confidencial</h3>
    </div>

    <!-- Información principal -->
    <div class="info-section">
        <h3>Información de Identificación</h3>
        <div class="photo-placeholder">
            FOTO DEL<br>PACIENTE
        </div>
        
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">ID del Paciente</span>
                <div class="info-value">
                    <span class="badge badge-id">ID: {{ $paciente->id }}</span>
                </div>
            </div>
            <div class="info-item">
                <span class="info-label">Nombre Completo</span>
                <div class="info-value">{{ $paciente->nombre_completo }}</div>
            </div>
            <div class="info-item">
                <span class="info-label">Fecha de Nacimiento</span>
                <div class="info-value">{{ \Carbon\Carbon::parse($paciente->fecha_nacimiento)->format('d/m/Y') }}</div>
            </div>
            <div class="info-item">
                <span class="info-label">Edad Actual</span>
                <div class="info-value">
                    <span class="badge badge-edad">{{ $paciente->edad }} años</span>
                </div>
            </div>
            <div class="info-item">
                <span class="info-label">Sexo</span>
                <div class="info-value">
                    @if($paciente->sexo === 'Masculino')
                        <span class="badge badge-masculino">Masculino</span>
                    @else
                        <span class="badge badge-femenino">Femenino</span>
                    @endif
                </div>
            </div>
            <div class="info-item">
                <span class="info-label">Fecha de Inscripción</span>
                <div class="info-value">{{ \Carbon\Carbon::parse($paciente->fecha_inscripcion)->format('d/m/Y') }}</div>
            </div>
        </div>
        <div class="clearfix"></div>
    </div>

    <!-- Información geográfica y hospitalaria -->
    <div class="info-section">
        <h3>Información Hospitalaria</h3>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">Ciudad de Origen</span>
                <div class="info-value">{{ $paciente->ciudad_origen }}</div>
            </div>
            <div class="info-item">
                <span class="info-label">Hospital Asignado</span>
                <div class="info-value">{{ $paciente->hospital }}</div>
            </div>
            <div class="info-item">
                <span class="info-label">Tiempo en el Sistema</span>
                <div class="info-value">
                    @php
                        $fechaIns = \Carbon\Carbon::parse($paciente->fecha_inscripcion);
                        $diferencia = $fechaIns->diffInDays(now());
                    @endphp
                    {{ $diferencia }} días
                </div>
            </div>
            <div class="info-item">
                <span class="info-label">Estado del Paciente</span>
                <div class="info-value">
                    @php
                        // Determinar el texto y clase CSS según el estado
                        $estadoTexto = '';
                        $estadoClase = '';
                        $estadoColor = '';
                        
                        switch($paciente->estado) {
                            case 'activo':
                                $estadoTexto = 'Activo';
                                $estadoClase = 'badge-estado-activo';
                                $estadoColor = '#28a745';
                                break;
                            case 'dado_de_alta':
                                $estadoTexto = 'Dado de Alta';
                                $estadoClase = 'badge-estado-dado_de_alta';
                                $estadoColor = '#17a2b8';
                                break;
                            case 'baja':
                                $estadoTexto = 'Baja';
                                $estadoClase = 'badge-estado-baja';
                                $estadoColor = '#dc3545';
                                break;
                            default:
                                $estadoTexto = $paciente->estado;
                                $estadoClase = 'badge-estado-activo';
                                $estadoColor = '#6c757d';
                        }
                        
                        // Calcular fecha del cambio de estado si existe
                        $fechaEstado = $paciente->updated_at ?? $paciente->created_at;
                        $diasEstado = \Carbon\Carbon::parse($fechaEstado)->diffInDays(now());
                    @endphp
                    
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="badge {{ $estadoClase }} estado-badge">
                            {{ $estadoTexto }}
                        </span>
                        @if($estadoTexto === 'Dado de Alta')
                            <span style="font-size: 11px; color: #6c757d;">
                                (Hace {{ $diasEstado }} días)
                            </span>
                        @endif
                    </div>
                    
                    <!-- Información adicional del estado -->
                    <div class="estado-section estado-{{ $paciente->estado }}">
                        @if($paciente->estado === 'activo')
                            <strong><i class="fas fa-check-circle" style="color: #28a745;"></i> Paciente Activo:</strong> 
                            El paciente se encuentra actualmente en tratamiento o seguimiento médico.
                        @elseif($paciente->estado === 'dado_de_alta')
                            <strong><i class="fas fa-sign-out-alt" style="color: #17a2b8;"></i> Dado de Alta:</strong> 
                            El paciente fue dado de alta del sistema hospitalario el {{ \Carbon\Carbon::parse($fechaEstado)->format('d/m/Y') }}.
                        @elseif($paciente->estado === 'baja')
                            <strong><i class="fas fa-times-circle" style="color: #dc3545;"></i> Paciente de Baja:</strong> 
                            El paciente fue dado de baja del sistema por diversos motivos médicos o administrativos.
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Información del tutor -->
    <div class="info-section">
        <h3>Información del Tutor/Responsable</h3>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">Nombre del Tutor</span>
                <div class="info-value">{{ $paciente->nombre_tutor }}</div>
            </div>
            <div class="info-item">
                <span class="info-label">Teléfono del Tutor</span>
                <div class="info-value">{{ $paciente->telefono_tutor }}</div>
            </div>
            <div class="info-item">
                <span class="info-label">Parentesco</span>
                <div class="info-value">Tutor Legal</div>
            </div>
            <div class="info-item">
                <span class="info-label">Contacto de Emergencia</span>
                <div class="info-value">{{ $paciente->telefono_tutor }}</div>
            </div>
        </div>
    </div>

    <!-- Información adicional del estado -->
    <div class="info-section">
        <h3>Información del Estado Actual</h3>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">Estado Registrado</span>
                <div class="info-value">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span class="badge {{ $estadoClase }}" style="padding: 5px 12px; font-size: 12px;">
                            {{ $estadoTexto }}
                        </span>
                        <span style="color: {{ $estadoColor }}; font-weight: bold;">
                            @if($paciente->estado === 'activo')
                                 En Tratamiento
                            @elseif($paciente->estado === 'dado_de_alta')
                                 Alta Médica
                            @elseif($paciente->estado === 'baja')
                                 Baja del Sistema
                            @endif
                        </span>
                    </div>
                </div>
            </div>
            <div class="info-item">
                <span class="info-label">Última Actualización</span>
                <div class="info-value">
                    {{ \Carbon\Carbon::parse($paciente->updated_at)->format('d/m/Y H:i:s') }}
                </div>
            </div>
            <div class="info-item">
                <span class="info-label">Fecha de Registro</span>
                <div class="info-value">
                    {{ \Carbon\Carbon::parse($paciente->created_at)->format('d/m/Y') }}
                </div>
            </div>
            <div class="info-item">
                <span class="info-label">Duración del Estado</span>
                <div class="info-value">
                    @php
                        $fechaEstadoCambio = $paciente->updated_at ?? $paciente->created_at;
                        $diasEnEstado = \Carbon\Carbon::parse($fechaEstadoCambio)->diffInDays(now());
                    @endphp
                    {{ $diasEnEstado }} días
                </div>
            </div>
        </div>
        
        <!-- Descripción del estado -->
        <div style="margin-top: 15px; padding: 10px; background-color: #f8f9fa; border-radius: 5px; border-left: 4px solid {{ $estadoColor }};">
            <strong>Descripción del Estado:</strong>
            @if($paciente->estado === 'activo')
                <p style="margin: 5px 0 0 0; color: #555;">
                    El paciente se encuentra actualmente activo en el sistema hospitalario, recibiendo tratamiento médico 
                    o en seguimiento regular. Se mantiene contacto continuo con el tutor legal.
                </p>
            @elseif($paciente->estado === 'dado_de_alta')
                <p style="margin: 5px 0 0 0; color: #555;">
                    El paciente ha sido dado de alta médica después de completar su tratamiento satisfactoriamente. 
                    Se recomienda seguimiento ambulatorio según las indicaciones médicas.
                </p>
            @elseif($paciente->estado === 'baja')
                <p style="margin: 5px 0 0 0; color: #555;">
                    El paciente ha sido dado de baja del sistema. Esto puede deberse a diversas razones médicas o 
                    administrativas. Para más información, contactar con la administración del hospital.
                </p>
            @endif
        </div>
    </div>

    <!-- Espacio para observaciones -->
    <div class="info-section">
        <h3>Observaciones y Notas Médicas</h3>
        <div style="min-height: 100px; padding: 10px; background-color: white; border: 1px dashed #ccc; border-radius: 3px;">
            <p style="color: #999; font-style: italic; margin: 0;">
                Espacio reservado para observaciones médicas, tratamientos especiales, alergias conocidas, 
                medicamentos actuales, o cualquier información relevante para el cuidado del paciente.
            </p>
            <br><br><br><br>
            <div style="border-top: 1px solid #eee; padding-top: 10px; margin-top: 20px;">
                <p style="margin: 0;"><strong>Médico Tratante:</strong> ___________________________________</p>
                <p style="margin: 5px 0 0 0;"><strong>Firma:</strong> _________________________</p>
                <p style="margin: 5px 0 0 0;"><strong>Fecha:</strong> _________________________</p>
            </div>
        </div>
    </div>

    <div class="footer">
        <div class="fecha-generacion">
            <strong>Documento generado el:</strong> {{ now()->format('d/m/Y H:i:s') }}
        </div>
        <p>Hospital Infantil - Sistema de Gestión de Pacientes | Este documento es confidencial y solo para uso médico</p>
        <p>Paciente ID: {{ $paciente->id }} | Ficha: {{ str_pad($paciente->id, 6, '0', STR_PAD_LEFT) }}-{{ date('Ymd') }}</p>
        <p style="margin-top: 10px; color: {{ $estadoColor }}; font-weight: bold;">
            Estado actual: {{ $estadoTexto }} | 
            Última actualización: {{ \Carbon\Carbon::parse($paciente->updated_at)->format('d/m/Y') }}
        </p>
    </div>
</body>
</html>
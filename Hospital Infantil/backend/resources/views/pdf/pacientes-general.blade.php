<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Lista de Pacientes - Hospital Infantil</title>
    <style>
        body { 
            font-family: 'Arial', sans-serif; 
            font-size: 11px; 
            margin: 0;
            padding: 15px;
        }
        .header { 
            text-align: center; 
            margin-bottom: 15px; 
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        .header h1 { 
            color: #2c3e50; 
            margin: 0;
            font-size: 22px;
        }
        .header h3 { 
            color: #7f8c8d; 
            margin: 5px 0 0 0;
            font-size: 14px;
        }
        .header .filtro-info {
            color: #3498db;
            font-size: 13px;
            margin-top: 5px;
            font-weight: bold;
        }
        .summary { 
            margin: 15px 0; 
            padding: 12px; 
            background-color: #ecf0f1;
            border-radius: 5px;
            font-size: 11px;
        }
        .summary p {
            margin: 4px 0;
        }
        .table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 10px; 
            font-size: 10px;
        }
        .table th { 
            background-color: #3498db; 
            color: white; 
            padding: 6px; 
            text-align: left;
            font-weight: bold;
            border: 1px solid #2980b9;
            font-size: 10px;
        }
        .table td { 
            padding: 5px; 
            border: 1px solid #ddd;
            vertical-align: top;
            font-size: 10px;
        }
        .table tr:nth-child(even) { 
            background-color: #f9f9f9; 
        }
        .footer { 
            margin-top: 20px; 
            text-align: center; 
            font-size: 9px; 
            color: #7f8c8d;
            border-top: 1px solid #eee;
            padding-top: 8px;
        }
        .badge {
            display: inline-block;
            padding: 2px 5px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
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
        .text-center {
            text-align: center;
        }
        .estadisticas-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-top: 15px;
        }
        .estadistica-card {
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 8px;
            text-align: center;
        }
        .estadistica-valor {
            font-size: 16px;
            font-weight: bold;
            color: #2c3e50;
        }
        .estadistica-label {
            font-size: 9px;
            color: #7f8c8d;
            text-transform: uppercase;
        }
        .page-break {
            page-break-after: always;
        }
        .no-data {
            text-align: center;
            padding: 30px;
            color: #e74c3c;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>HOSPITAL INFANTIL - GESTIÓN DE PACIENTES</h1>
        <h3>Lista General de Pacientes Registrados</h3>
        
        @if(isset($filtro_estado) && $filtro_estado != 'todos')
        <div class="filtro-info">
            <i class="fas fa-filter"></i> Filtrado por estado: 
            @php
                $estados = [
                    'activo' => 'Activos',
                    'dado_de_alta' => 'Dados de Alta', 
                    'baja' => 'Bajas'
                ];
            @endphp
            {{ $estados[$filtro_estado] ?? $filtro_estado }}
        </div>
        @endif
    </div>

    <div class="summary">
        <p><strong>Total de Pacientes:</strong> {{ $pacientes->count() }}</p>
        <p><strong>Fecha de Generación:</strong> {{ now()->format('d/m/Y H:i:s') }}</p>
        @if(isset($filtro_estado) && $filtro_estado != 'todos')
        <p><strong>Filtro Aplicado:</strong> {{ $estados[$filtro_estado] ?? $filtro_estado }}</p>
        @endif
        <p><strong>Sistema:</strong> Sistema de Gestión Hospitalaria</p>
    </div>

    @if($pacientes->count() > 0)
    <!-- Estadísticas por estado -->
    <div class="estadisticas-grid">
        <div class="estadistica-card">
            <div class="estadistica-valor">{{ $pacientes->where('estado', 'activo')->count() }}</div>
            <div class="estadistica-label">Activos</div>
        </div>
        <div class="estadistica-card">
            <div class="estadistica-valor">{{ $pacientes->where('estado', 'dado_de_alta')->count() }}</div>
            <div class="estadistica-label">Dados de Alta</div>
        </div>
        <div class="estadistica-card">
            <div class="estadistica-valor">{{ $pacientes->where('estado', 'baja')->count() }}</div>
            <div class="estadistica-label">Bajas</div>
        </div>
        <div class="estadistica-card">
            <div class="estadistica-valor">{{ number_format($pacientes->avg('edad'), 1) }}</div>
            <div class="estadistica-label">Edad Promedio</div>
        </div>
    </div>
    @endif

    <table class="table">
        <thead>
            <tr>
                <th width="4%" class="text-center">ID</th>
                <th width="18%">Nombre Completo</th>
                <th width="7%" class="text-center">Edad</th>
                <th width="7%" class="text-center">Sexo</th>
                <th width="9%" class="text-center">Estado</th>
                <th width="9%">Fecha Nac.</th>
                <th width="10%">Ciudad</th>
                <th width="9%">Fecha Insc.</th>
                <th width="14%">Hospital</th>
                <th width="13%">Tutor</th>
            </tr>
        </thead>
        <tbody>
            @php
                // Asegurar que los pacientes estén ordenados por ID
                $pacientesOrdenados = $pacientes->sortBy('id');
            @endphp
            
            @forelse($pacientesOrdenados as $paciente)
            <tr>
                <td class="text-center">{{ $paciente->id }}</td>
                <td>{{ $paciente->nombre_completo }}</td>
                <td class="text-center">
                    <span class="badge" style="background-color: #17a2b8; color: white;">
                        {{ $paciente->edad }} años
                    </span>
                </td>
                <td class="text-center">
                    @if($paciente->sexo === 'Masculino')
                        <span class="badge badge-masculino">M</span>
                    @else
                        <span class="badge badge-femenino">F</span>
                    @endif
                </td>
                <td class="text-center">
                    @php
                        $estadoClase = '';
                        $estadoTexto = '';
                        switch($paciente->estado) {
                            case 'activo':
                                $estadoClase = 'badge-estado-activo';
                                $estadoTexto = 'Activo';
                                break;
                            case 'dado_de_alta':
                                $estadoClase = 'badge-estado-dado_de_alta';
                                $estadoTexto = 'Alta';
                                break;
                            case 'baja':
                                $estadoClase = 'badge-estado-baja';
                                $estadoTexto = 'Baja';
                                break;
                            default:
                                $estadoClase = 'badge-estado-activo';
                                $estadoTexto = $paciente->estado;
                        }
                    @endphp
                    <span class="badge {{ $estadoClase }}">{{ $estadoTexto }}</span>
                </td>
                <td>{{ \Carbon\Carbon::parse($paciente->fecha_nacimiento)->format('d/m/Y') }}</td>
                <td>{{ $paciente->ciudad_origen }}</td>
                <td>{{ \Carbon\Carbon::parse($paciente->fecha_inscripcion)->format('d/m/Y') }}</td>
                <td>{{ $paciente->hospital }}</td>
                <td>
                    <div style="font-size: 9px;">
                        <strong>{{ $paciente->nombre_tutor }}</strong><br>
                        <span style="color: #666;">Tel: {{ $paciente->telefono_tutor }}</span>
                    </div>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="10" class="no-data">
                    No hay pacientes registrados en el sistema.
                    @if(isset($filtro_estado) && $filtro_estado != 'todos')
                    <br>No se encontraron pacientes con el estado: {{ $estados[$filtro_estado] ?? $filtro_estado }}
                    @endif
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

    @if($pacientes->count() > 0)
    <div class="summary">
        <p><strong>Resumen Estadístico:</strong></p>
        @php
            $masculinos = $pacientes->where('sexo', 'Masculino')->count();
            $femeninos = $pacientes->where('sexo', 'Femenino')->count();
            $promedioEdad = $pacientes->avg('edad');
            
            // Estadísticas por estado
            $activos = $pacientes->where('estado', 'activo')->count();
            $dadosAlta = $pacientes->where('estado', 'dado_de_alta')->count();
            $bajas = $pacientes->where('estado', 'baja')->count();
        @endphp
        
        <p><strong>Por Sexo:</strong></p>
        <p>• Masculinos: {{ $masculinos }} ({{ $pacientes->count() > 0 ? number_format(($masculinos/$pacientes->count())*100, 1) : 0 }}%)</p>
        <p>• Femeninos: {{ $femeninos }} ({{ $pacientes->count() > 0 ? number_format(($femeninos/$pacientes->count())*100, 1) : 0 }}%)</p>
        
        <p><strong>Por Estado:</strong></p>
        <p>• Activos: {{ $activos }} ({{ $pacientes->count() > 0 ? number_format(($activos/$pacientes->count())*100, 1) : 0 }}%)</p>
        <p>• Dados de Alta: {{ $dadosAlta }} ({{ $pacientes->count() > 0 ? number_format(($dadosAlta/$pacientes->count())*100, 1) : 0 }}%)</p>
        <p>• Bajas: {{ $bajas }} ({{ $pacientes->count() > 0 ? number_format(($bajas/$pacientes->count())*100, 1) : 0 }}%)</p>
        
        <p><strong>Edades:</strong></p>
        <p>• Edad Promedio: {{ number_format($promedioEdad, 1) }} años</p>
        <p>• Más joven: {{ $pacientes->min('edad') }} años</p>
        <p>• Mayor: {{ $pacientes->max('edad') }} años</p>
    </div>
    @endif

    <div class="footer">
        <p>Documento generado automáticamente por el Sistema de Gestión Hospitalaria</p>
        @if(isset($filtro_estado) && $filtro_estado != 'todos')
        <p><strong>Filtro aplicado:</strong> {{ $estados[$filtro_estado] ?? $filtro_estado }}</p>
        @endif
        <p>Hospital Infantil © {{ date('Y') }} | Total de registros: {{ $pacientes->count() }}</p>
    </div>
</body>
</html>
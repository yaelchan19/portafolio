<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use App\Models\Hospital;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PacienteController extends Controller
{
    // Método principal para mostrar la vista
    public function index()
    {
        $pacientes = Paciente::with('hospitalRelacion')
            ->orderBy('id', 'asc')
            ->get();
        
        $hospitales = Hospital::all();
        
        return view('pacientes.index', compact('pacientes', 'hospitales'));
    }

    // Método para obtener datos de pacientes (AJAX) - para web
    public function getPacientes()
    {
        $pacientes = Paciente::with('hospitalRelacion')
            ->orderBy('id', 'asc')
            ->get();
        
        return response()->json($pacientes);
    }

    // Método para obtener hospitales (para web)
    public function getHospitales()
    {
        $hospitales = Hospital::all();
        return response()->json($hospitales);
    }

    // API: Devuelve todos los pacientes (simple, sin relaciones)
    public function apiIndex()
    {
        return response()->json(Paciente::all());
    }

    // Almacenar nuevo paciente
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre_completo' => 'required|string|max:150',
            'edad' => 'required|integer|min:0|max:18',
            'sexo' => 'required|in:Masculino,Femenino',
            'fecha_nacimiento' => 'required|date',
            'ciudad_origen' => 'required|string|max:100',
            'fecha_inscripcion' => 'required|date',
            'hospital' => 'required|string|exists:hospitales,nombre_hospital',
            'nombre_tutor' => 'required|string|max:150',
            'telefono_tutor' => 'required|string|max:20',
            'estado' => 'nullable|in:activo,dado_de_alta,baja',
        ], [
            'hospital.exists' => 'El nombre del hospital no existe en nuestro sistema',
            'hospital.required' => 'Debe seleccionar un hospital válido',
            'estado.in' => 'El estado debe ser: activo, dado_de_alta o baja',
        ]);

        // Establecer estado por defecto si no se envía
        if (!isset($validated['estado'])) {
            $validated['estado'] = 'activo';
        }

        $paciente = Paciente::create($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Paciente registrado exitosamente',
            'data' => $paciente
        ], 201);
    }

    // Mostrar paciente específico
    public function show($id)
    {
        $paciente = Paciente::findOrFail($id);
        return response()->json($paciente);
    }

    // Actualizar paciente
    public function update(Request $request, $id)
    {
        $paciente = Paciente::findOrFail($id);
        
        $validated = $request->validate([
            'nombre_completo' => 'required|string|max:150',
            'edad' => 'required|integer|min:0|max:18',
            'sexo' => 'required|in:Masculino,Femenino',
            'fecha_nacimiento' => 'required|date',
            'ciudad_origen' => 'required|string|max:100',
            'fecha_inscripcion' => 'required|date',
            'hospital' => 'required|string|exists:hospitales,nombre_hospital',
            'nombre_tutor' => 'required|string|max:150',
            'telefono_tutor' => 'required|string|max:20',
            'estado' => 'required|in:activo,dado_de_alta,baja',
        ], [
            'hospital.exists' => 'El nombre del hospital no existe en nuestro sistema',
            'estado.in' => 'El estado debe ser: activo, dado_de_alta o baja',
            'estado.required' => 'El estado del paciente es requerido',
        ]);

        $paciente->update($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Paciente actualizado exitosamente',
            'data' => $paciente
        ]);
    }

    // Eliminar paciente
    public function destroy($id)
    {
        $paciente = Paciente::findOrFail($id);
        $paciente->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Paciente eliminado exitosamente'
        ]);
    }

    // Método para cambiar solo el estado
    public function cambiarEstado(Request $request, $id)
    {
        $request->validate([
            'estado' => 'required|in:activo,dado_de_alta,baja'
        ]);

        $paciente = Paciente::findOrFail($id);
        $paciente->estado = $request->estado;
        $paciente->save();

        return response()->json([
            'success' => true,
            'message' => 'Estado actualizado exitosamente',
            'data' => $paciente
        ]);
    }

    // Generar PDF
    public function generatePDF($id)
    {
        $paciente = Paciente::findOrFail($id);
        
        $pdf = PDF::loadView('pdf.paciente', compact('paciente'))
            ->setPaper('a4', 'portrait')
            ->setOptions([
                'defaultFont' => 'sans-serif',
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true
            ]);
        
        return $pdf->download('paciente_' . $paciente->id . '.pdf');
    }

    // Método para obtener datos de pacientes (para la vista)
    public function datos()
    {
        $pacientes = Paciente::orderBy('id', 'asc')->get();
        return response()->json($pacientes);
    }

    /**
     * Obtener estadísticas de pacientes
     */
    public function getEstadisticas()
    {
        $estadisticas = [
            'total_pacientes' => Paciente::count(),
            'por_estado' => Paciente::select('estado', DB::raw('COUNT(*) as total'))
                ->groupBy('estado')
                ->get(),
            'por_sexo' => Paciente::select('sexo', DB::raw('COUNT(*) as total'))
                ->groupBy('sexo')
                ->get(),
            'por_hospital' => DB::table('pacientes')
                ->select('hospital', DB::raw('COUNT(*) as total'))
                ->groupBy('hospital')
                ->orderBy('total', 'desc')
                ->get(),
            'por_edad' => [
                '0-5' => Paciente::whereBetween('edad', [0, 5])->count(),
                '6-10' => Paciente::whereBetween('edad', [6, 10])->count(),
                '11-15' => Paciente::whereBetween('edad', [11, 15])->count(),
                '16-18' => Paciente::whereBetween('edad', [16, 18])->count(),
            ]
        ];
        
        return response()->json($estadisticas);
    }

    /**
     * Obtener pacientes activos
     */
    public function getPacientesActivos()
    {
        $pacientes = Paciente::with('hospitalRelacion')
            ->where('estado', 'activo')
            ->orderBy('id', 'asc')
            ->get();
        
        return response()->json($pacientes);
    }
}
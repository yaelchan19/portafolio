<?php

namespace App\Http\Controllers;

use App\Models\Hospital;
use App\Models\Paciente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HospitalController extends Controller
{
    // Listar todos los hospitales
    public function index()
    {
        $hospitales = Hospital::orderBy('id', 'asc')->paginate(10);
        
        // Estadísticas generales
        $totalHospitales = Hospital::count();
        $ciudadesUnicas = Hospital::distinct('ciudad')->count('ciudad');
        
        // Distribución por ciudad
        $distribucionCiudades = Hospital::select('ciudad', DB::raw('COUNT(*) as total'))
            ->groupBy('ciudad')
            ->orderBy('total', 'desc')
            ->get();
        
        // Pacientes por hospital
        $pacientesPorHospital = Paciente::select('hospital', DB::raw('COUNT(*) as total_pacientes'))
            ->groupBy('hospital')
            ->orderBy('total_pacientes', 'desc')
            ->get();
        
        // Hospital con más pacientes
        $hospitalMasPacientes = $pacientesPorHospital->first();
        
        return view('hospital.index', compact(
            'hospitales',
            'totalHospitales',
            'ciudadesUnicas',
            'distribucionCiudades',
            'pacientesPorHospital',
            'hospitalMasPacientes'
        ));
    }

    // Mostrar formulario para crear hospital
    public function create()
    {
        return view('hospital.create');
    }

    // Almacenar nuevo hospital
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre_hospital' => 'required|string|max:100|unique:hospitales,nombre_hospital',
            'ciudad' => 'required|string|max:100',
            'telefono' => 'nullable|string|max:20',
            'fecha_creacion' => 'nullable|date',
            'telefono_secundario' => 'nullable|string|max:20',
            'observaciones' => 'nullable|string',
        ], [
            'nombre_hospital.unique' => 'Ya existe un hospital con ese nombre.',
            'nombre_hospital.required' => 'El nombre del hospital es obligatorio.',
            'ciudad.required' => 'La ciudad es obligatoria.',
        ]);

        Hospital::create($validated);
        
        return redirect()->route('hospitales.index')
            ->with('success', 'Hospital registrado exitosamente');
    }

    // Mostrar formulario para editar hospital
    public function edit($id)
    {
        $hospital = Hospital::findOrFail($id);
        
        // Obtener estadísticas del hospital
        $totalPacientes = Paciente::where('hospital', $hospital->nombre_hospital)->count();
        $pacientesMasculinos = Paciente::where('hospital', $hospital->nombre_hospital)
            ->where('sexo', 'Masculino')
            ->count();
        $pacientesFemeninos = Paciente::where('hospital', $hospital->nombre_hospital)
            ->where('sexo', 'Femenino')
            ->count();
        $pacientesNuevosUltimoMes = Paciente::where('hospital', $hospital->nombre_hospital)
            ->where('created_at', '>=', now()->subMonth())
            ->count();
        
        // Pacientes asociados (limitado para vista previa)
        $pacientes = Paciente::where('hospital', $hospital->nombre_hospital)
            ->orderBy('id', 'asc')
            ->limit(5)
            ->get();
        
        return view('hospital.edit', compact(
            'hospital',
            'totalPacientes',
            'pacientesMasculinos',
            'pacientesFemeninos',
            'pacientesNuevosUltimoMes',
            'pacientes'
        ));
    }

    // Actualizar hospital existente (CORREGIDO para evitar error de integridad referencial)
    public function update(Request $request, $id)
    {
        $hospital = Hospital::findOrFail($id);
        
        $validated = $request->validate([
            'nombre_hospital' => 'required|string|max:100|unique:hospitales,nombre_hospital,' . $hospital->id,
            'ciudad' => 'required|string|max:100',
            'telefono' => 'nullable|string|max:20',
            'fecha_creacion' => 'nullable|date',
        ], [
            'nombre_hospital.unique' => 'Ya existe un hospital con ese nombre.',
            'nombre_hospital.required' => 'El nombre del hospital es obligatorio.',
            'ciudad.required' => 'La ciudad es obligatoria.',
        ]);

        // Usar transacción para garantizar consistencia
        DB::beginTransaction();
        
        try {
            // Guardar el nombre antiguo antes de actualizar
            $nombreAntiguo = $hospital->nombre_hospital;
            $nombreNuevo = $validated['nombre_hospital'];
            
            // Si cambia el nombre del hospital
            if ($nombreAntiguo !== $nombreNuevo) {
                // Primero actualizar el hospital
                $hospital->update($validated);
                
                // Luego actualizar los pacientes relacionados
                Paciente::where('hospital', $nombreAntiguo)
                    ->update(['hospital' => $nombreNuevo]);
            } else {
                // Si no cambia el nombre, solo actualizar el hospital
                $hospital->update($validated);
            }
            
            DB::commit();
            
            return redirect()->route('hospitales.index')
                ->with('success', 'Hospital actualizado exitosamente');
                
        } catch (\Exception $e) {
            DB::rollBack();
            
            // Log del error para debugging
            \Log::error('Error al actualizar hospital: ' . $e->getMessage());
            \Log::error('Nombre antiguo: ' . ($nombreAntiguo ?? 'N/A'));
            \Log::error('Nombre nuevo: ' . ($nombreNuevo ?? 'N/A'));
            
            return redirect()->back()
                ->withInput()
                ->with('error', 'Error al actualizar el hospital. Verifica que el nuevo nombre no viole restricciones de base de datos.');
        }
    }

    // Eliminar hospital
    public function destroy($id)
    {
        $hospital = Hospital::findOrFail($id);
        
        // Usar transacción para garantizar consistencia
        DB::beginTransaction();
        
        try {
            // Primero eliminar todos los pacientes asociados
            Paciente::where('hospital', $hospital->nombre_hospital)->delete();
            
            // Luego eliminar el hospital
            $hospital->delete();
            
            DB::commit();
            
            return redirect()->route('hospitales.index')
                ->with('success', 'Hospital y todos sus pacientes han sido eliminados exitosamente');
                
        } catch (\Exception $e) {
            DB::rollBack();
            
            \Log::error('Error al eliminar hospital: ' . $e->getMessage());
            
            return redirect()->back()
                ->with('error', 'Error al eliminar el hospital. Por favor, intenta nuevamente.');
        }
    }

    // Buscar hospitales (API para AJAX)
    public function search(Request $request)
    {
        $search = $request->input('search', '');
        $ciudad = $request->input('ciudad', '');
        
        $query = Hospital::query();
        
        if (!empty($search)) {
            $query->where('nombre_hospital', 'like', "%{$search}%")
                  ->orWhere('telefono', 'like', "%{$search}%");
        }
        
        if (!empty($ciudad)) {
            $query->where('ciudad', $ciudad);
        }
        
        $hospitales = $query->orderBy('id', 'asc')->get();
        
        return response()->json($hospitales);
    }

    // Obtener estadísticas (API)
    public function estadisticas()
    {
        $estadisticas = [
            'total_hospitales' => Hospital::count(),
            'hospitales_por_ciudad' => Hospital::select('ciudad', DB::raw('COUNT(*) as total'))
                ->groupBy('ciudad')
                ->orderBy('total', 'desc')
                ->get(),
            'pacientes_por_hospital' => Paciente::select('hospital', DB::raw('COUNT(*) as total'))
                ->groupBy('hospital')
                ->orderBy('total', 'desc')
                ->get(),
            'hospitales_sin_pacientes' => Hospital::whereNotIn('nombre_hospital', 
                Paciente::select('hospital')->distinct()
            )->count(),
        ];
        
        return response()->json($estadisticas);
    }

    // Método adicional para verificar integridad de datos
    public function verificarIntegridad()
    {
        // Encontrar pacientes con hospitales que no existen
        $pacientesInvalidos = Paciente::whereNotIn('hospital', 
            Hospital::select('nombre_hospital')
        )->get();
        
        // Encontrar hospitales sin pacientes
        $hospitalesSinPacientes = Hospital::whereNotIn('nombre_hospital',
            Paciente::select('hospital')->distinct()
        )->get();
        
        return response()->json([
            'pacientes_con_hospitales_invalidos' => $pacientesInvalidos,
            'total_pacientes_invalidos' => $pacientesInvalidos->count(),
            'hospitales_sin_pacientes' => $hospitalesSinPacientes,
            'total_hospitales_sin_pacientes' => $hospitalesSinPacientes->count(),
        ]);
    }
}
<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\HospitalController;

Route::get('/test', function () {
    return response()->json([
        'message' => 'API de Hospital Infantil funcionando',
        'status' => 'success'
    ]);
});

/*
|--------------------------------------------------------------------------
| API Pacientes
|--------------------------------------------------------------------------
*/
Route::prefix('pacientes')->group(function () {
    // Ruta principal para obtener todos los pacientes
    Route::get('/', [PacienteController::class, 'apiIndex']);
    
    // Rutas CRUD
    Route::post('/', [PacienteController::class, 'store']);
    Route::get('/{id}', [PacienteController::class, 'show']);
    Route::put('/{id}', [PacienteController::class, 'update']);
    Route::delete('/{id}', [PacienteController::class, 'destroy']);
    
    // Rutas adicionales
    Route::get('/hospitales/list', [PacienteController::class, 'getHospitales']);
    Route::get('/estadisticas/totales', [PacienteController::class, 'getEstadisticas']);
    Route::get('/listado/activos', [PacienteController::class, 'getPacientesActivos']);
    Route::patch('/{id}/cambiar-estado', [PacienteController::class, 'cambiarEstado']);
});

/*
|--------------------------------------------------------------------------
| API Hospitales
|--------------------------------------------------------------------------
*/
Route::apiResource('hospitales', HospitalController::class);
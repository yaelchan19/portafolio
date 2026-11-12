<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\HospitalController;
use App\Http\Controllers\PacientePDFController;

Route::get('/', function () {
    return view('welcome');
})->name('home');

// Rutas de autenticación
Route::get('/register', function () {
    return view('auth.register');
})->name('register')->middleware('guest');

Route::post('/register', function (Request $request) {
    // Lógica de registro
    // Puedes usar un controlador aquí
})->name('register.post');

Route::get('/login', function () {
    return view('auth.login');
})->name('login')->middleware('guest');

Route::post('/login', function (Request $request) {
    // Lógica de login
})->name('login.post');

Route::post('/logout', function () {
    Auth::logout();
    return redirect('/');
})->name('logout')->middleware('auth');

// Pacientes
Route::get('/pacientes', [PacienteController::class, 'index'])->name('pacientes.index');
Route::get('/pacientes/datos', [PacienteController::class, 'datos'])->name('pacientes.datos');
Route::post('/pacientes', [PacienteController::class, 'store'])->name('pacientes.store');
Route::get('/pacientes/{id}', [PacienteController::class, 'show'])->name('pacientes.show');
Route::put('/pacientes/{id}', [PacienteController::class, 'update'])->name('pacientes.update');
Route::delete('/pacientes/{id}', [PacienteController::class, 'destroy'])->name('pacientes.destroy');

// Rutas para pacientes (resource - redundante con las anteriores, pero se mantiene)
Route::resource('pacientes', PacienteController::class);

// Hospitales
Route::get('/hospitales', [HospitalController::class, 'index'])->name('hospitales.index');

// Rutas para hospitales (resource)
Route::resource('hospitales', HospitalController::class);
Route::put('/hospitales/{id}', [HospitalController::class, 'update'])->name('hospitales.update');


// Rutas para PDF
Route::prefix('pacientes/pdf')->group(function () {
    Route::get('/individual/{id}', [PacientePDFController::class, 'generarPDFIndividual'])
         ->name('pacientes.pdf.individual');
    
    Route::get('/general', [PacientePDFController::class, 'generarPDFGeneral'])
         ->name('pacientes.pdf.general');
    
    // Opcional: para vista previa
    Route::get('/vista-previa/{id}', [PacientePDFController::class, 'vistaPreviaIndividual'])
         ->name('pacientes.pdf.vista-previa.individual');
    
    Route::get('/vista-previa-general', [PacientePDFController::class, 'vistaPreviaGeneral'])
         ->name('pacientes.pdf.vista-previa.general');
});


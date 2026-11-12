<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use Barryvdh\DomPDF\Facade\Pdf;

class PacientePDFController extends Controller
{
    /**
     * Generar PDF de un paciente individual
     */
    public function generarPDFIndividual($id)
    {
        // SOLUCIÓN: Quitar el with('hospital') si no existe la relación
        $paciente = Paciente::findOrFail($id);
        // O si necesitas datos del hospital pero es un string:
        // $paciente = Paciente::findOrFail($id);
        // El campo hospital ya está en el modelo como atributo
        
        $pdf = PDF::loadView('pdf.paciente-individual', compact('paciente'));
        return $pdf->download('paciente-' . $paciente->id . '.pdf');
    }
    
    /**
     * Generar PDF general de todos los pacientes
     */
    public function generarPDFGeneral()
    {
        // SOLUCIÓN: Quitar el with(['hospital', 'user']) si no existen las relaciones
        $pacientes = Paciente::orderBy('created_at', 'desc')->get();
        // O si quieres ordenar por otro campo:
        // $pacientes = Paciente::orderBy('id', 'asc')->get();
        
        $pdf = PDF::loadView('pdf.pacientes-general', compact('pacientes'));
        return $pdf->download('pacientes-general.pdf');
    }
    
    /**
     * Vista previa PDF individual
     */
    public function vistaPreviaIndividual($id)
    {
        $paciente = Paciente::findOrFail($id);
        $pdf = PDF::loadView('pdf.paciente-individual', compact('paciente'));
        return $pdf->stream('paciente-' . $paciente->id . '-vista-previa.pdf');
    }
    
    /**
     * Vista previa PDF general
     */
    public function vistaPreviaGeneral()
    {
        $pacientes = Paciente::orderBy('created_at', 'desc')->get();
        $pdf = PDF::loadView('pdf.pacientes-general', compact('pacientes'));
        return $pdf->stream('pacientes-general-vista-previa.pdf');
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Hospital extends Model
{
    use HasFactory;

    protected $table = 'hospitales';
    protected $primaryKey = 'id';  // Cambiado a 'id' según tu estructura
    public $timestamps = true;

    protected $fillable = [
        'nombre_hospital',
        'ciudad',
        'telefono',
        'fecha_creacion'  // Añadido según tu BD
    ];

    protected $casts = [
        'fecha_creacion' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relación con pacientes
     * Nota: Ahora la relación es por nombre_hospital, no por id
     */
    public function pacientes()
    {
        return $this->hasMany(Paciente::class, 'hospital', 'nombre_hospital');
    }

    /**
     * Accesor para hospital completo (nombre + ciudad)
     */
    public function getHospitalCompletoAttribute()
    {
        return $this->nombre_hospital . ' - ' . $this->ciudad;
    }

    /**
     * Accesor para teléfono formateado
     */
    public function getTelefonoFormateadoAttribute()
    {
        return $this->telefono ? 'Tel: ' . $this->telefono : 'Sin teléfono';
    }

    /**
     * Scope para buscar hospitales por ciudad
     */
    public function scopePorCiudad($query, $ciudad)
    {
        return $query->where('ciudad', 'LIKE', '%' . $ciudad . '%');
    }

    /**
     * Scope para hospitales ordenados por nombre
     */
    public function scopeOrdenadosPorNombre($query)
    {
        return $query->orderBy('nombre_hospital', 'asc');
    }

    /**
     * Método para contar pacientes por hospital
     */
    public function contarPacientes()
    {
        return $this->pacientes()->count();
    }
}
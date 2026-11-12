<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Paciente extends Model
{
    use HasFactory;

    protected $table = 'pacientes';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'nombre_completo',
        'edad',
        'sexo',
        'fecha_nacimiento',
        'ciudad_origen',
        'fecha_inscripcion',
        'hospital',
        'nombre_tutor',
        'telefono_tutor',
        'estado', // Nuevo campo
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'fecha_nacimiento' => 'date',
        'fecha_inscripcion' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'edad' => 'integer',
    ];

    /**
     * Valores por defecto para los atributos
     */
    protected $attributes = [
        'estado' => 'activo',
    ];

    /**
     * Relación con el hospital
     */
    public function hospitalRelacion()
    {
        return $this->belongsTo(Hospital::class, 'hospital', 'nombre_hospital');
    }

    /**
     * Accesor para mostrar edad con formato
     */
    public function getEdadFormateadaAttribute()
    {
        return $this->edad . ' años';
    }

    /**
     * Accesor para mostrar estado con formato
     */
    public function getEstadoFormateadoAttribute()
    {
        $estados = [
            'activo' => 'Activo',
            'dado_de_alta' => 'Dado de Alta',
            'baja' => 'Baja'
        ];
        
        return $estados[$this->estado] ?? $this->estado;
    }

    /**
     * Accesor para mostrar clase CSS según estado
     */
    public function getEstadoClaseAttribute()
    {
        $clases = [
            'activo' => 'badge bg-success',
            'dado_de_alta' => 'badge bg-info',
            'baja' => 'badge bg-warning'
        ];
        
        return $clases[$this->estado] ?? 'badge bg-secondary';
    }

    /**
     * Scope para buscar pacientes por hospital
     */
    public function scopePorHospital($query, $hospital)
    {
        return $query->where('hospital', $hospital);
    }

    /**
     * Scope para pacientes por rango de edad
     */
    public function scopePorRangoEdad($query, $min, $max)
    {
        return $query->whereBetween('edad', [$min, $max]);
    }

    /**
     * Scope para pacientes por sexo
     */
    public function scopePorSexo($query, $sexo)
    {
        return $query->where('sexo', $sexo);
    }

    /**
     * Scope para pacientes por estado
     */
    public function scopePorEstado($query, $estado)
    {
        return $query->where('estado', $estado);
    }

    /**
     * Scope para pacientes activos
     */
    public function scopeActivos($query)
    {
        return $query->where('estado', 'activo');
    }

    /**
     * Scope para pacientes dados de alta
     */
    public function scopeDadosDeAlta($query)
    {
        return $query->where('estado', 'dado_de_alta');
    }

    /**
     * Scope para pacientes dados de baja
     */
    public function scopeBaja($query)
    {
        return $query->where('estado', 'baja');
    }
}
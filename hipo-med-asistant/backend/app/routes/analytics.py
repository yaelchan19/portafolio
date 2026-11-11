from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.models import Cita, Consultorio, EstadoCita
from datetime import date, timedelta
from typing import List, Optional

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/dashboard")
def obtener_estadisticas_dashboard(db: Session = Depends(get_db)):
    """
    Obtiene métricas clave para el dashboard de administración.
    """
    # 1. Citas por semana (últimas 4 semanas)
    hoy = date.today()
    inicio_4_semanas = hoy - timedelta(days=28)
    
    citas_semanales = db.query(
        func.date_trunc('week', Cita.fecha_programada).label('semana'),
        func.count(Cita.id).label('total')
    ).filter(Cita.fecha_programada >= inicio_4_semanas).group_by('semana').order_by('semana').all()

    # 2. Motivos de consulta más frecuentes
    motivos_frecuentes = db.query(
        Cita.motivo,
        func.count(Cita.id).label('total')
    ).group_by(Cita.motivo).order_by(func.count(Cita.id).desc()).limit(5).all()

    # 3. Consultorios con mayor demanda (Citas completadas)
    consultorios_demanda = db.query(
        Consultorio.nombre,
        func.count(Cita.id).label('total')
    ).join(Cita, Cita.consultorio_id == Consultorio.id).filter(
        Cita.estado == EstadoCita.COMPLETADA
    ).group_by(Consultorio.nombre).order_by(func.count(Cita.id).desc()).limit(5).all()

    return {
        "citas_semanales": [
            {"semana": str(c.semana.date()), "total": c.total} for c in citas_semanales
        ],
        "motivos_frecuentes": [
            {"motivo": m.motivo or "Sin motivo", "total": m.total} for m in motivos_frecuentes
        ],
        "consultorios_demanda": [
            {"nombre": c.nombre, "total": c.total} for c in consultorios_demanda
        ]
    }

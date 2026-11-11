from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import LogAuditoria, Usuario
from typing import List, Optional

router = APIRouter(prefix="/auditoria", tags=["Auditoría"])

@router.get("/")
def obtener_logs_auditoria(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, le=200),
    usuario_id: Optional[int] = Query(None),
    accion: Optional[str] = Query(None)
):
    """
    Obtiene los logs de auditoría para el administrador.
    """
    query = db.query(LogAuditoria).order_by(LogAuditoria.fecha.desc())
    
    if usuario_id:
        query = query.filter(LogAuditoria.usuario_id == usuario_id)
    if accion:
        query = query.filter(LogAuditoria.accion == accion)
        
    logs = query.offset(skip).limit(limit).all()
    
    resultado = []
    for l in logs:
        resultado.append({
            "id": l.id,
            "usuario": l.usuario.nombre if l.usuario else "Sistema",
            "accion": l.accion,
            "tabla": l.tabla,
            "registro_id": l.registro_id,
            "detalles": l.detalles,
            "fecha": l.fecha.isoformat()
        })
    return resultado

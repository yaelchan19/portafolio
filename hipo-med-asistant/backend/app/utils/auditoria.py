from sqlalchemy.orm import Session
from app.models.models import LogAuditoria
import json

def registrar_log(db: Session, usuario_id: int, accion: str, tabla: str = None, registro_id: int = None, detalles: dict = None):
    """
    Registra una acción en la tabla de auditoría.
    """
    try:
        nuevo_log = LogAuditoria(
            usuario_id=usuario_id,
            accion=accion,
            tabla=tabla,
            registro_id=registro_id,
            detalles=json.dumps(detalles) if detalles else None
        )
        db.add(nuevo_log)
        db.commit()
    except Exception as e:
        print(f"Error al registrar log de auditoría: {str(e)}")
        db.rollback()

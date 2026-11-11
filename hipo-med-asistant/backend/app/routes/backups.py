from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from typing import List, Dict
from app.utils.backup_manager import create_backup, restore_backup, list_backups, BACKUP_DIR
import os

router = APIRouter(prefix="/backups", tags=["Backups"])

@router.get("/download/{filename}")
def download_backup(filename: str):
    """Descargar un archivo de respaldo específico."""
    filepath = os.path.join(BACKUP_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Archivo de respaldo no encontrado")
    
    return FileResponse(
        path=filepath,
        filename=filename,
        media_type='application/sql'
    )

@router.get("/", response_model=List[Dict])
def get_backups():
    """Listar todos los archivos de respaldo disponibles."""
    try:
        return list_backups()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create")
def generate_backup():
    """Generar una nueva copia de seguridad de la base de datos."""
    success, result = create_backup()
    if success:
        return {"message": "Copia de seguridad creada correctamente", "filename": os.path.basename(result)}
    else:
        # Si pg_dump no está en el PATH o en la ruta predeterminada, lanzamos un error detallado
        raise HTTPException(status_code=500, detail=f"Error al crear backup: {result}. Asegúrese de tener pg_dump instalado y configurado en el sistema.")

@router.post("/restore/{filename}")
def restore_database(filename: str):
    """Restaurar la base de datos desde un archivo SQL."""
    filepath = os.path.join(BACKUP_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Archivo de respaldo no encontrado")
        
    success, output = restore_backup(filepath)
    if success:
        return {"message": "Base de datos restaurada correctamente"}
    else:
        raise HTTPException(status_code=500, detail=f"Error al restaurar: {output}")

@router.delete("/{filename}")
def delete_backup(filename: str):
    """Eliminar un archivo de respaldo específico."""
    filepath = os.path.join(BACKUP_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Archivo de respaldo no encontrado")
        
    try:
        os.remove(filepath)
        return {"message": "Copia de seguridad eliminada correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

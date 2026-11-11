from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import traceback

from app.database import engine, Base
from app.models import models
from app.routes import auth
from app.routes.cola import router as cola_router
from app.routes.sala import router as sala_router
from app.routes.consultorios import router as consultorios_router
from app.routes.citas import router as citas_router
from app.routes.expedientes import router as expedientes_router
from app.routes.backups import router as backups_router
from app.routes.medico import router as medico_router
from app.routes.analytics import router as analytics_router
from app.routes.auditoria import router as auditoria_router
from app.routes.usuarios import router as usuarios_router
from app.utils.backup_manager import create_backup

import logging
import asyncio
from datetime import datetime, timedelta

# Configurar logging para ver errores en la consola
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Hospital Pediátrico API")

# Función para el respaldo automático cada 15 días
async def scheduled_backup_task():
    while True:
        # Esperar 15 días (15 * 24 * 60 * 60 segundos)
        # Para pruebas o primera ejecución, se puede ajustar
        await asyncio.sleep(15 * 24 * 60 * 60)
        logger.info("Iniciando respaldo automático programado (cada 15 días)...")
        success, result = create_backup()
        if success:
            logger.info(f"Respaldo automático completado: {result}")
        else:
            logger.error(f"Error en respaldo automático: {result}")

@app.on_event("startup")
async def startup_event():
    # Iniciar la tarea programada en segundo plano
    asyncio.create_task(scheduled_backup_task())

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204)

# Manejador global de excepciones para ver errores 500 en la consola y evitar bloqueos CORS
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print("=== ERROR DETECTADO EN EL SERVIDOR ===")
    print(traceback.format_exc())
    
    # Generar un respaldo automático adicional cuando el sistema detecte un error crítico
    # Solo si el error parece estar relacionado con la base de datos (SQLAlchemy o Psycopg2)
    error_str = str(exc).lower()
    if "db" in error_str or "database" in error_str or "sqlalchemy" in error_str or "psycopg2" in error_str:
        logger.warning("Falla de base de datos detectada. Generando respaldo de emergencia...")
        success, result = create_backup()
        if success:
            logger.info(f"Respaldo de emergencia completado: {result}")
        else:
            logger.error(f"Falla al crear respaldo de emergencia: {result}")
    
    # Creamos la respuesta de error
    response = JSONResponse(
        status_code=500,
        content={"message": "Error interno del servidor", "detail": str(exc)},
    )
    
    # Añadimos manualmente cabeceras CORS para que el navegador pueda leer el error
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todos temporalmente para descartar CORS
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(cola_router)
app.include_router(sala_router)
app.include_router(consultorios_router)
app.include_router(citas_router)
app.include_router(expedientes_router)
app.include_router(backups_router)
app.include_router(medico_router)
app.include_router(analytics_router)
app.include_router(auditoria_router)
app.include_router(usuarios_router)

@app.get("/")
def root():
    return {
        "status": "API funcionando",
        "msg": "Backend Hospital Pediátrico funcionando"
    }
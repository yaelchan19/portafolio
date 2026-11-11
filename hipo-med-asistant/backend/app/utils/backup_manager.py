import os
import subprocess
from datetime import datetime
from app.database import DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME

BACKUP_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "backups"))

# Ruta por defecto de PostgreSQL en Windows (ajustada a tu versión 18)
PG_BIN_DIR = r"C:\Program Files\PostgreSQL\18\bin"

def get_backup_filename():
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return os.path.join(BACKUP_DIR, f"backup_{DB_NAME}_{timestamp}.sql")

def run_command(command, env=None):
    try:
        result = subprocess.run(
            command,
            env=env,
            check=True,
            capture_output=True,
            text=True,
            shell=True
        )
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        return False, e.stderr

def create_backup():
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)
        
    filename = get_backup_filename()
    
    # Configurar la contraseña para pg_dump sin intervención manual
    env = os.environ.copy()
    env["PGPASSWORD"] = DB_PASSWORD
    
    pg_dump_path = os.path.join(PG_BIN_DIR, "pg_dump.exe")
    if not os.path.exists(pg_dump_path):
        pg_dump_path = "pg_dump" # Intentar si está en el PATH
        
    command = f'"{pg_dump_path}" -h {DB_HOST} -p {DB_PORT} -U {DB_USER} -F p -f "{filename}" {DB_NAME}'
    
    success, output = run_command(command, env)
    if success:
        return True, filename
    
    error_msg = output if output else "Error desconocido al ejecutar pg_dump"
    return False, f"{error_msg}. Verifique que la ruta {pg_dump_path} sea correcta."

def restore_backup(filename):
    if not os.path.exists(filename):
        return False, "Archivo de respaldo no encontrado"
        
    env = os.environ.copy()
    env["PGPASSWORD"] = DB_PASSWORD
    
    psql_path = os.path.join(PG_BIN_DIR, "psql.exe")
    if not os.path.exists(psql_path):
        psql_path = "psql" # Intentar si está en el PATH
        
    # El comando psql para restaurar un archivo SQL plano
    # Primero intentamos desconectar otros usuarios para poder restaurar
    # (Esto es opcional pero recomendado si la DB está en uso)
    command = f'"{psql_path}" -h {DB_HOST} -p {DB_PORT} -U {DB_USER} -d {DB_NAME} -f "{filename}"'
    
    success, output = run_command(command, env)
    if success:
        return True, output
    
    error_msg = output if output else "Error desconocido al ejecutar psql"
    return False, f"{error_msg}. Verifique que la ruta {psql_path} sea correcta."

def list_backups():
    if not os.path.exists(BACKUP_DIR):
        return []
    
    files = [f for f in os.listdir(BACKUP_DIR) if f.endswith(".sql")]
    backups = []
    for f in files:
        path = os.path.join(BACKUP_DIR, f)
        stats = os.stat(path)
        backups.append({
            "filename": f,
            "size": stats.st_size,
            "created_at": datetime.fromtimestamp(stats.st_ctime).isoformat(),
            "path": path
        })
    # Ordenar por fecha de creación descendente
    backups.sort(key=lambda x: x["created_at"], reverse=True)
    return backups

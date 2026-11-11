from sqlalchemy import text
import sys
import os

# Añadir el directorio actual al path para importar app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine

def migrate():
    print("Migrando tabla 'usuarios' para soportar campos de médico...")
    
    with engine.connect().execution_options(isolation_level="AUTOCOMMIT") as conn:
        columns = [
            ("especialidad", "VARCHAR(200)"),
            ("cedula_profesional", "VARCHAR(100)"),
            ("universidad_egreso", "VARCHAR(200)"),
            ("horario_atencion", "VARCHAR(200)"),
            ("consultorio_pref", "VARCHAR(100)")
        ]
        
        for col_name, col_type in columns:
            try:
                # Verificar si la columna ya existe
                res = conn.execute(text(f"SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = '{col_name}'")).fetchone()
                
                if not res:
                    print(f"- Añadiendo columna '{col_name}'...")
                    conn.execute(text(f"ALTER TABLE usuarios ADD COLUMN {col_name} {col_type}"))
                else:
                    print(f"- La columna '{col_name}' ya existe.")
            except Exception as e:
                print(f"- Error al añadir columna '{col_name}': {str(e)}")

    print("\nMigración completada.")

if __name__ == "__main__":
    migrate()

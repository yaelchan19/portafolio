import sys
import os

# Añadir el directorio backend al path para poder importar la app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.utils.backup_manager import create_backup

def main():
    print("Iniciando respaldo automático...")
    success, result = create_backup()
    if success:
        print(f"Respaldo creado con éxito: {result}")
    else:
        print(f"Error al crear el respaldo: {result}")

if __name__ == "__main__":
    main()

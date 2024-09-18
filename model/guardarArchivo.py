import os

# Define la ruta de la nueva carpeta
carpeta_nueva = "C:\\nueva_carpeta"

# Crea la carpeta
try:
    os.makedirs(carpeta_nueva, exist_ok=True)  # exist_ok=True evita errores si la carpeta ya existe
    print(f'Carpeta creada exitosamente en: {carpeta_nueva}')
except Exception as e:
    print(f'Error al crear la carpeta: {e}')

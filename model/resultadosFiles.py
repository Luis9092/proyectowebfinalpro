import requests
import json
import firebase_admin
from firebase_admin import credentials, storage


class ResultadosFiles:
    def __init__(self) -> None:
        pass

    def constructorResultados(
        self, idresultado, idImagenResultado, nombreArchivo, pathArchivo, tipoArchivo
    ):
        self.idresultado = idresultado
        self.idImagenResultado = idImagenResultado
        self.nombreArchivo = nombreArchivo
        self.pathArchivo = pathArchivo
        self.tipoArchivo = tipoArchivo

    def enviarDataResultado(self):
        url = "http://127.0.0.1:8000/agregarResultado"
        response = {}
        parametros = {
            "idresultado": str(self.idresultado),
            "idImagenResultado": str(self.idImagenResultado),
            "nombreArchivo": str(self.nombreArchivo),
            "pathArchivo": str(self.pathArchivo),
            "tipoArchivo": str(self.tipoArchivo),
            "fechacreacion": "",
        }
        retorno = requests.post(url, data=json.dumps(parametros))

        if retorno.status_code == 200:
            response = {"estado": 1, "mensaje": "Usuario Creado Correctamente"}
        else:
            response = {"estado": 0, "mensaje": "Por Favor Verificar Los Datos"}
        return response

    def subir_imagen(self, ruta_imagen, nombre_imagen):

        cred = credentials.Certificate("static/proyectouno-8e1df-3906e74c298d.json")
        firebase_admin.initialize_app(
            cred, {"storageBucket": "proyectouno-8e1df.appspot.com"}
        )
        try:
            bucket = storage.bucket()
            blob = bucket.blob(nombre_imagen)

            # Sube la imagen al bucket
            blob.upload_from_filename(ruta_imagen)

            # Opcionalmente, puedes hacer la imagen pública
            blob.make_public()
            # importante para poder almacenarlo
            pathpublica = blob.public_url
            print(f"Imagen subida a: {blob.public_url}")
            return pathpublica
        except Exception as e:
            print(f"Ocurrió un error al subir la imagen: {e}")
            return 0

    def eliminarImagenResultadoServer(self, image_name):
        api_url = "http://127.0.0.1:8000/eliminarResultadoServer"
        url = f"{api_url}/{image_name}"

        try:
            # Realizar la solicitud DELETE
            response = requests.delete(url)

            # Comprobar el código de estado de la respuesta
            if response.status_code != 200:
                return 0
            return 1
        except Exception as e:
            print(f"Ocurrió un error: {e}")
            return 0

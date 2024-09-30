import requests
import json


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
        url = "https://repositorioprivado.onrender.com/agregarResultado"
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



    def eliminarImagenResultadoServer(self, image_name):
        api_url = "https://repositorioprivado.onrender.com/eliminarResultadoServer"
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

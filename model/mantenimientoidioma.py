import requests
import json


class MantenimientoIdioma:
    def __init__(self) -> None:
        pass

    def crearIdioma(self, txtidioma, txtprefijo):

        url = "http://127.0.0.1:8000/crearIdioma"
        params = {
            "id": "",
            "nombreIdioma": str(txtidioma),
            "abreviacion": str(txtprefijo),
            "fechacreacion": "",
        }
        response = requests.post(url=url, data=json.dumps(params))
        respuesta = {"mensaje": "Error al agregar el idioma!!", "estado": 0}

        if response.status_code == 200:
            respuesta = {"mensaje": "Idioma Agregado Correctamente!!", "estado": 1}

        return json.dumps(respuesta)

    def eliminar(self, id, txtidioma, txtprefijo):

        url = "http://127.0.0.1:8000/eliminarIdiomas"
        params = {
            "id": str(id),
            "nombreIdioma": str(txtidioma),
            "abreviacion": str(txtprefijo),
            "fechacreacion": "",
        }
        x = requests.delete(url, data=json.dumps(params))
        respuesta = {"mensaje": "Error al agregar el idioma!!", "estado": 0}

        if x.status_code == 200:
            respuesta = {"mensaje": "Idioma Eliminado correctamente!!", "estado": 1}

        return json.dumps(respuesta)

    def actualizarIdioma(self, id, txtidioma, txtprefijo, fecha):
        url = "http://127.0.0.1:8000/actualizarIdioma"
        params = {
            "id": str(id),
            "nombreIdioma": str(txtidioma),
            "abreviacion": str(txtprefijo),
            "fechacreacion": str(fecha),
        }
        x = requests.put(url, data=json.dumps(params))
        respuesta = {"mensaje": "Error al actualizar el idioma", "estado": 0}

        if x.status_code == 200:
            respuesta = {"mensaje": "Idioma Actualizado Correctamente!!", "estado": 1}

        return json.dumps(respuesta)

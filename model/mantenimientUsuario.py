import requests
import json


class MantenimientoUsuario:
    def __init__(self) -> None:
        pass

    def eliminarUsuario(self, id):
        api_url = f"https://repositorioprivado.onrender.com/eliminarUsuario/{id}"

        respuesta = {"mensaje": "Error al eliminar usuario.", "estado": 0}
        x = requests.delete(api_url)
        if x.status_code == 200:
            respuesta = {"mensaje": "Usuario Eliminado correctamente!!", "estado": 1}
        print(respuesta)
        return json.dumps(respuesta)
    
    def actualizarEstadoUser(self, id, estado):
        api_url = f"https://repositorioprivado.onrender.com/actualizarEstadoUser/{id}/{estado}"

        respuesta = {"mensaje": "Error al actualizar el estado del usuario.", "estado": 0}
        x = requests.put(api_url)
        if x.status_code == 200:
            respuesta = {"mensaje": "Estado Del Usuario Actualizado correctamente!!", "estado": 1}
        print(respuesta)
        return json.dumps(respuesta)
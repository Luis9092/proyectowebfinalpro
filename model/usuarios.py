import requests
from flask import session
import json


class Usuarios:
    def __init__(self) -> None:
        pass

    def autenticarusuario(self, correo, pasw):

        url = "http://127.0.0.1:8000/autenticarUsuario/<correo><pas>"
        parametros = {"correo": correo, "pas": pasw}
        retorno = requests.get(url, parametros)
        if retorno.status_code == 200:
            per = retorno.json()
            session["correo"] = per["correo"]
            session["id"] = per["id"]
            session["nombres"] = per["nombres"]
            session["imgperfil01"] = per["imagen"]
            return per["idRole"]
        else:

            return 0

    def crearCuenta(self, nombres, apellidos, correo, pasw, fechaNacimiento):
        url = "http://127.0.0.1:8000/crearUsuario"
        response = {}
        parametros = {
            "id": "",
            "nombres": str(nombres),
            "apellidos": str(apellidos),
            "correo": str(correo),
            "contrasenia": str(pasw),
            "imagen": "",
            "estado": 1,
            "theme": 1,
            "fechaCreacion": "",
            "fechaActualizacion": "",
            "idRole": 0,
            "fechaNacimiento": str(fechaNacimiento),
        }
        retorno = requests.post(url, data=json.dumps(parametros))

        if retorno.status_code == 201:
            response = {"estado": 1, "mensaje": "Usuario Creado Correctamente"}
        else:
            response = {"estado": 0, "mensaje": "Por Favor Verificar Los Datos"}
        return response

    def devolverMenuPorRole(self, roleid):
        url = "http://127.0.0.1:8000/devolverMenu/<roleid>"
        parametros = {"roleid": roleid}
        retorno = requests.get(url, parametros)
        cadena = ""
        if retorno.status_code == 200:
            data = retorno.json()

            for m in data:
                print(m["nombre"])
                cadena += (
                    ' <div class="menu-item" id="'
                    + m["id"]
                    + '">\
              <a class="item" href="'
                    + m["link"]
                    + '">'
                    + m["icon"]
                    + ""
                    + m["nombre"]
                    + "</a>\
              </div>\n"
                )
            session["menu"] = cadena
            return 1

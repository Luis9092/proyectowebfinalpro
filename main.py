from flask import Flask
from flask import render_template, url_for, request, session, redirect
from werkzeug.utils import secure_filename

import json
from model.usuarios import Usuarios
import requests
from datetime import datetime
import os
from model.resultadosFiles import ResultadosFiles
from model.mantenimientoidioma import MantenimientoIdioma
from model.mantenimientUsuario import MantenimientoUsuario

app = Flask(__name__)
app.secret_key = "luiscasas12345"

# ULTIMA MODIFICACION ANTES DE TERMINA EL DIA 10 DE OCTUBRE DE 2024
@app.route("/")
def root():
    return render_template("login.html")


@app.route("/crearCuenta")
def crearCuenta():
    return render_template("crearCuenta.html")


@app.route("/menu")
def menu():
    if "correo" not in session or not session["correo"]:
        return redirect(url_for("root"))
    return render_template("menu.html")


@app.route("/inicio")
def inicioApp():
    if "correo" not in session or not session["correo"]:
        return redirect(url_for("root"))
    return render_template("inicio.html")


@app.route("/elegirArchivo")
def subirArchivo():
    if "correo" not in session or not session["correo"]:
        return redirect(url_for("root"))
    return render_template("desdeArchivos.html")


@app.route("/tomarfoto")
def tomarFoto():
    if "correo" not in session or not session["correo"]:
        return redirect(url_for("root"))
    return render_template("tomarfoto.html")


@app.route("/miperfil")
def miperfil():
    if "correo" not in session or not session["correo"]:
        return redirect(url_for("root"))
    return render_template("usuariopage.html")


@app.route("/idiomas")
def idiomas():
    url = "https://repositorioprivado.onrender.com/verIdiomas"
    if "correo" not in session or not session["correo"]:
        return redirect(url_for("root"))
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return render_template("idiomas.html", data=data)

    return render_template("idiomas.html", data=[])


@app.route("/crearUsuario", methods=["POST"])
def crearUsuario():
    us = Usuarios()
    nombres = request.form["txtnombres"]
    apellidos = request.form["txtapellidos"]
    correo = request.form["txtCorreoUsuario"]
    pasw = request.form["txtPassword"]
    fechaNac = request.form["fechaformateada"]
    
    retorno = us.crearCuenta(nombres, apellidos, correo, pasw, fechaNac)

    return json.dumps(retorno)


@app.route("/iniciarsesion", methods=["POST"])
def iniciarSesion():
    correo = request.form["txtCorreoUsuario"]
    pasw = request.form["txtPassword"]
    respuesta = {"estado": 0, "mensaje": "Por Favor Verificar Los Datos"}
    respuestasi = {"estado": 1, "mensaje": "Credenciales autenticadas correctamente. "}
    us = Usuarios()
    retorno = us.autenticarusuario(correo=correo, pasw=pasw)
    if retorno != 0:
        dev = us.devolverMenuPorRole(retorno)
        if dev == 1:
            return json.dumps(respuestasi)

    return json.dumps(respuesta)


@app.route("/actualizarImagenPerfil", methods=["POST"])
def actualizarImagenPerfil():
    tiempo = datetime.now()
    horaActual = tiempo.strftime("%Y%H%M%S")
    iduser = request.form["idus90"]
    imagenActual = request.files["subirFotoPerfil"]
    imgantes = request.form["imgantes"]
    nombreFinal = ""
    if imagenActual.filename != "":
        nombreFinal = horaActual + "_" + imagenActual.filename
        imagenActual.save("static/imagenesusuariosPerfil/" + nombreFinal)
    url = "https://repositorioprivado.onrender.com/actualizarImagenUsuario"

    response = {}
    parametros = {"documento": str(iduser), "nuevo_valor": str(nombreFinal)}
    x = requests.put(url, data=json.dumps(parametros))
    if x.status_code == 200:
        response = {
            "estado": 1,
            "mensaje": "Imagen de perfil actualizada correctamente",
        }
        session["imgperfil01"] = nombreFinal
        if imgantes != "imagendefault.jpg":
            try:
                ruta_archivo = "static/imagenesusuariosPerfil/" + imgantes
                os.remove(ruta_archivo)
                print(f"El archivo {ruta_archivo} ha sido eliminado.")
            except FileNotFoundError:
                print(f"El archivo {ruta_archivo} no se encontró.")
            except PermissionError:
                print(f"No se tienen permisos para eliminar el archivo {ruta_archivo}.")
            except Exception as e:
                print(f"Ocurrió un error: {e}")
    else:
        response = {"estado": 0, "mensaje": "Por favor verificar los datos"}

    return json.dumps(response)


@app.route("/resultados")
def resultados():
    if "correo" not in session or not session["correo"]:
        return redirect(url_for("root"))
    url = "https://repositorioprivado.onrender.com/verResultadosGuardados/<id>"
    id = session.get("id")

    response = requests.get(url, params={"id": id})
    if response.status_code == 200:
        tablare = response.json()
        return render_template(
            "resultados.html",
            tablare=tablare,
        )

    return render_template("resultados.html", tablare=[])


@app.route("/eliminarResultadosUser", methods=["POST"])
def eliminarResultadosUser():
    idimagen = request.form.get("idimagen")
    nameimagen = request.form.get("nameimagen")
    api_url = f"https://repositorioprivado.onrender.com/eliminarArchivoUser/{idimagen}/{nameimagen}"
 

    alerta = {}
    try:
        # Realizar la solicitud DELETE
        response = requests.delete(api_url)
        # Comprobar el código de estado de la respuesta
        if response.status_code == 200:
            alerta = {"mensaje": "Archivo eliminado correctamente", "estado": 1}

    except Exception as e:
        print(f"Ocurrió un error: {e}")
        alerta = {"mensaje": "Error al eliminar el archivo", "estado": 0}

    return json.dumps(alerta)


@app.route("/subir_imagen", methods=["POST"])
def subir_imagen():
    respuesta = {"mensaje": "error", "estado": 0}
    idImagen = request.form["idImagen"]
    print(idImagen)
    
    if "imagen" not in request.files:
        return "No file part"
    file = request.files["imagen"]
    if file.filename == "":
        return "No selected file"
    nombre = file.filename
    re = ResultadosFiles()
    if file:
        # Generar un nombre único para el archivo
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{secure_filename(file.filename)}"
        file_path = os.path.join("static", filename)

        try:
            # Guardar el archivo
            file.save(file_path)
            url = "https://repositorioprivado.onrender.com/guardarImagenResultado"

            # Parámetros a enviar
            param1 = session.get("id")
            param2 = idImagen

            # Hacer la solicitud POST con el archivo
            with open(file_path, "rb") as f:
                files = {"file": f}
                response = requests.post(
                    url, files=files, data={"param1": param1, "param2": param2}
                )

                if response.status_code == 200:
                    print("Hecho con éxito.")
                    respuesta = {"mensaje": "Éxito en todo broo", "estado": 1}
                else:
                    print("Error en la solicitud:", response.status_code)
                    respuesta= {"mensaje": "Error en la solicitud", "estado": 0}
        except Exception as e:
            print("Ocurrió un error:", str(e))
            respuesta = {"mensaje": "Error al guardar el archivo", "estado": 0}
        finally:
            # Eliminar archivo si existe
            if os.path.isfile(file_path):
                os.remove(file_path)
                re.eliminarImagenResultadoServer(filename)
    else:
        respuesta = {"mensaje": "No se recibió ningún archivo", "estado": 0}

    return json.dumps(respuesta)


@app.route("/acercade")
def acercade():
    if "correo" not in session or not session["correo"]:
        return redirect(url_for("root"))
    return render_template("acercade.html")


@app.route("/crearidioma", methods=["POST"])
def crearIdioma():
    valor = request.form.get("valor")
    txtidioma = request.form.get("txtidioma")
    txtprefijo = request.form.get("txtprefijo")
    id = request.form.get("id")
    fecha = request.form.get("fecha")

    print(valor)
    ma = MantenimientoIdioma()
    if valor == "crear":
        respuesta = ma.crearIdioma(txtidioma=txtidioma, txtprefijo=txtprefijo)
        return respuesta
    if valor == "eliminar":
        respuesta = ma.eliminar(id=id, txtidioma="", txtprefijo="")
        return respuesta
    if valor == "actualizar":
        respuesta = ma.actualizarIdioma(
            txtidioma=txtidioma, txtprefijo=txtprefijo, id=id, fecha=fecha
        )
        return respuesta


@app.route("/adminpage")
def adminPage():
    if "correo" not in session or not session["correo"]:
        return redirect(url_for("root"))
    url = "https://repositorioprivado.onrender.com/viewUser"
    response = requests.get(url)

    url2 = "https://repositorioprivado.onrender.com/estadisticasUser"
    response2 = requests.get(url2)
    data2 = response2.json()

    if response.status_code == 200:
        data = response.json()
        return render_template("administrar.html", data=data, ver=data2)

    return render_template("administrar.html", data=[])


@app.route("/usuariosProcesos", methods=["POST"])
def usuarioAdministrar():
    valor = request.form.get("valor")
    id = request.form.get("id")
    estado = request.form.get("estado")
    ma = MantenimientoUsuario()
    
    respuesta = {"mensaje": "Error al ejecutar los procesos.", "estado": 0}

    if valor == "eliminar":
        respuesta = ma.eliminarUsuario(id=id)
        return respuesta

    if valor == "actualizar":
        respuesta = ma.actualizarEstadoUser(id=id, estado=estado)
        return respuesta

    return json.dumps(respuesta)


@app.route("/salir")
def salir():
    session.clear()
    return redirect(url_for("root"))


if __name__ == "__main__":
    app.run(debug=True)
    # app.run(host="0.0.0.0", port=5000, debug= True)


# EL PROBLAEMA ES EL ENVICO DE DATOS

from flask import Flask
from flask import render_template, url_for, request, session, redirect
import json
from model.usuarios import Usuarios
import requests

app = Flask(__name__)
app.secret_key = "luiscasas12345"


@app.route("/")
def root():
    return render_template("login.html")


@app.route("/crearCuenta")
def crearCuenta():
    return render_template("crearCuenta.html")


@app.route("/menu")
def menu():
    return render_template("menu.html")


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




@app.route("/inicio")
def inicioApp():
    if "correo" not in session or not session["correo"]:
        return redirect(url_for("root"))
    return render_template("inicio.html")


@app.route("/elegirArchivo")
def subirArchivo():
    return render_template("desdeArchivos.html")

@app.route("/tomarfoto")
def tomarFoto():
    return render_template("tomarfoto.html")


@app.route("/salir")
def salir():
    session.clear()
    return redirect(url_for("root"))




if __name__ == "__main__":
    app.run(debug=True)

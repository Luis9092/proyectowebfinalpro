
const fotoPerfiluser = document.querySelector("#fotoPerfiluser");
const btnAceptafoto = document.querySelector("#btnAceptafoto");
function validarArchivoPefil(archivo) {
    const tiposValidos = ['image/jpeg', 'image/png', 'image/jpg'];
    return tiposValidos.includes(archivo.type);
}

// PRIMER PASO VALIDAR LAS ENTRADAS DE ARCHIVOS
const inputarchivoFoto = document.querySelector('#subirFotoPerfil');
let estadoperfil = 0;
let NombresEliminarperfil = [];

if (inputarchivoFoto) {
    inputarchivoFoto.addEventListener('change', function () {
        const archivo = this.files[0];
        if (archivo) {
            if (validarArchivoPefil(archivo)) {
                const fileReader = new FileReader();
                name = archivo.name;

                fileReader.onload = function (event) {
                    fotoPerfiluser.src = event.target.result;
                    estadoperfil = 1;
                    btnAceptafoto.disabled = false;
                    alertModal("#00dfdf", "Imagen Agregada correctamente!!", "success",)
                };

                fileReader.readAsDataURL(archivo);
            } else {
                estadoperfil = 0;
                alertModal("#ff0055", "El archivo no es válido. Debe ser JPG, PNG o JPEG.", "error",)
            }
        }
    });
}

if (btnAceptafoto) {
    btnAceptafoto.addEventListener("click", () => {
        if (estadoperfil == 1) {
            EnviarformPerfil();
        }
    });
}




let formularioPerfil = $("#formularioPerfil");


function EnviarformPerfil() {
    formularioPerfil.submit(function (e) {
        e.preventDefault();

        $.ajax({
            type: formularioPerfil.attr("method"),
            url: formularioPerfil.attr("action"),
            data: new FormData(this),
            processData: false,
            contentType: false,
            success: function (response) {
                const respuesta = JSON.parse(response);
                console.log(respuesta.estado);

                if (respuesta.estado == 0) {
                    Swal.fire({
                        title: "Error",
                        text: respuesta.mensaje,
                        icon: "error",
                        confirmButtonColor: "#00CDB5",
                    }).then(function () {
                        // window.location.replace("/miperfil");
                    });
                } else {
                    Swal.fire({
                        title: "Excelente!!",
                        text: respuesta.mensaje,
                        icon: "success",
                        confirmButtonColor: "#00CDB5",
                    }).then(function () {
                        window.location.replace("/miperfil");
                    });
                }
            },
            error: function (error) {
                alert(error);
            },
        });
    });
}
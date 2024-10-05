let miresultado = document.querySelectorAll(".miresultado");

for (const item of miresultado) {
    item.addEventListener("click", (e) => {
        let target = e.target;
        let id = target.id;
        
        
        const imagen = document.getElementById(id);
        const modal = document.getElementById('miModal');
        const imagenExpandida = document.getElementById('imagenExpandida');
        const cerrarModal = document.getElementById('cerrarModal');

        imagen.onclick = function () {
            modal.style.display = "flex";
            imagenExpandida.src = this.src;
        };

        cerrarModal.onclick = function () {
            modal.style.display = "none";
        };

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
    });
}


let eliminarImagenre = document.querySelectorAll("#eliminarImagenre");

for (const element of eliminarImagenre) {

    element.addEventListener("click", (e) => {
        let id = element.value;

    

        enviaradataeliminar(id);
    });
}

function enviaradataeliminar(id) {

    const formEliminarArhivoUser = $("#" + id + "");
    const nombrearchivo = document.querySelector(`#nombreArchivo${id}`);
    const idimagen = document.querySelector(`#idImagen21${id}`);

 

    $.ajax({
        type: formEliminarArhivoUser.attr("method"),
        url: formEliminarArhivoUser.attr("action"),
        data: {
            idimagen: idimagen.value,
            nameimagen: nombrearchivo.value,
        },
        success: function (response) {
            const respuesta = JSON.parse(response);
       

            if (respuesta.estado == 0) {
                Swal.fire({
                    title: "Error",
                    text: respuesta.mensaje,
                    icon: "error",
                    confirmButtonColor: "#ff004c",
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
                    window.location.replace("/resultados");
                });
            }
        },
        error: function (error) {
            alert(error);
        },
    });

}


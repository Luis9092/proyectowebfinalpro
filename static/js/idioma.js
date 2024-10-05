
const txtidioma = document.querySelector("#txtidioma");
const txtprefijo = document.querySelector("#txtprefijo");
const btnCrearIdioma = document.querySelector("#btnCrearIdioma");
const txtidi = document.querySelector("#txtidi");
const fechac = document.querySelector("#fechac");


function validarTexto(input) {
    const regex = /^[a-zA-Z\s]+$/; // Permite solo letras y espacios
    return regex.test(input);
}

function validarInputs() {
    let txtidiom = txtidioma.value;
    let txtprefij = txtprefijo.value;
    let retorno = 0;
    if (validarTexto(txtidiom) && validarTexto(txtprefij)) {
        
        retorno = 1;
    } else {
        console.log("Porfavor llenar el formulario.");
        retorno = 0;
    }
    return retorno;
}

if (btnCrearIdioma) {
    btnCrearIdioma.addEventListener("click", (e) => {
        const retorno = validarInputs();
        let value = e.target.value;
      
        if (retorno == 1) {
            alertModal("#00dfdf", "Texto Validado correctamente", "success",);
            enviaradatacrearidioma(value);
        } else {
            alertModal("#ff0055", "Por favor llenar correctamente el formulario.", "error",)
        }
    });
}

const btnEliminar = document.querySelector("#btnEliminar");

if (btnEliminar) {
    btnEliminar.addEventListener("click", (e) => {
        const retorno = validarInputs();
        let value = e.target.value;
      
        if (retorno == 1) {
            alertModal("#00dfdf", "Texto Validado correctamente", "success",);
            enviaradatacrearidioma(value);
        } else {
            alertModal("#ff0055", "Por favor llenar correctamente el formulario.", "error",)
        }
    });
}

const btnActualizar = document.querySelector("#btnActualizar");

if (btnActualizar) {
    btnActualizar.addEventListener("click", (e) => {
        const retorno = validarInputs();
        let value = e.target.value;
       
        if (retorno == 1) {
            alertModal("#00dfdf", "Texto Validado correctamente", "success",);
            enviaradatacrearidioma(value);
        } else {
            alertModal("#ff0055", "Por favor llenar correctamente el formulario.", "error",)
        }
    });
}


function enviaradatacrearidioma(valores) {
    const formEliminarArhivoUser = $("#formcrearIdioma");
    $.ajax({
        type: formEliminarArhivoUser.attr("method"),
        url: formEliminarArhivoUser.attr("action"),
        data: {
            txtidioma: txtidioma.value,
            txtprefijo: txtprefijo.value,
            id: txtidi.value,
            valor: valores,
            fecha: fechac.value
        },
        success: function (response) {
            const respuesta = JSON.parse(response);
            

            if (respuesta.estado == 0) {
                Swal.fire({
                    title: "Error",
                    text: respuesta.mensaje,
                    icon: "error",
                    confirmButtonColor: "#00CDB5",
                }).then(function () {
                  
                });
            } else {
                Swal.fire({
                    title: "Excelente!!",
                    text: respuesta.mensaje,
                    icon: "success",
                    confirmButtonColor: "#00CDB5",
                }).then(function () {
                    window.location.replace("/idiomas");
                });
            }
        },
        error: function (error) {
            alert(error);
        },
    });
}



$("#tableidiomas").on("click", "tr td", function (evt) {
    let id,
        nombre,
        pref, fecha;

    target = $(event.target);
    id = target.parent("tr").find("td").eq(1).html();
    nombre = target.parent("tr").find("td").eq(2).html();
    pref = target.parent("tr").find("td").eq(3).html();
    fecha = target.parent("tr").find("td").eq(4).html();
    txtidioma.value = nombre;
    txtprefijo.value = pref;
    txtidi.value = id;
    fechac.value = fecha;

});


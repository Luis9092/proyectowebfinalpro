
const btnuser = document.querySelector("#btnuser");
const dialogUser = document.querySelector("#dialogUser");
const cancelaruser = document.querySelector("#cancelaruser");
let txtnombresus = document.querySelector("#txtnombresus");
const txtcorreous = document.querySelector("#txtcorreous");
const txtestado = document.querySelector("#txtestado");
const txtfechaus = document.querySelector("#txtfechaus");
const txtfechanus = document.querySelector("#txtfechanus");
const txtedad = document.querySelector("#txtedad");
const idus1 = document.querySelector("#idus1");

if (btnuser) {
    btnuser.addEventListener("click", (e) => {
        dialogUser.showModal();
    });
}

if (cancelaruser) {
    cancelaruser.addEventListener("click", () => {
        dialogUser.close();
    });
}


$("#tableusuarios").on("click", "tr td", function (evt) {
    let id,
        nombres,
        apellidos,
        correo,
        estado,
        fechacreacion,
        fechanacimiento
        , pathimage;

    target = $(event.target);
    id = target.parent("tr").find("td").eq(1).html();
    nombres = target.parent("tr").find("td").eq(2).html();
    apellidos = target.parent("tr").find("td").eq(3).html();
    correo = target.parent("tr").find("td").eq(4).html();
    estado = target.parent("tr").find("td").eq(6).html();
    fechacreacion = target.parent("tr").find("td").eq(7).html();
    fechanacimiento = target.parent("tr").find("td").eq(8).html();
    pathimage = target.parent("tr").find("td").eq(9).html();
    idus1.value = id;
    txtnombresus.value = nombres + " " + apellidos;
    txtcorreous.value = correo;
    txtestado.value = Number(estado);
    txtfechaus.value = fechacreacion;
    txtfechanus.value = fechanacimiento;
    const edadretorno = calcularEdad(fechanacimiento);
    txtedad.value = edadretorno;
    dialogUser.showModal();


});

function calcularEdad(fechaNacimiento) {
    const partesFecha = fechaNacimiento.split('/');
    const fechaFormateada = partesFecha[2] + '-' + partesFecha[1] + '-' + partesFecha[0];

    const fechaNac = new Date(fechaFormateada);
    const hoy = new Date();

    const diferenciaEnMS = hoy - fechaNac;
    const edadEnMilisegundos = new Date(diferenciaEnMS);
    const edad = edadEnMilisegundos.getUTCFullYear() - 1970;

    return edad;
}

const btnEliminarus = document.querySelector("#btnEliminarus");

if (btnEliminarus) {
    btnEliminarus.addEventListener("click", (e) => {
        let value = e.target.value;
        alert(value);
        enviardataus(value);
    });
}

const btnActualizarUser = document.querySelector("#btnActualizarUser");

if (btnActualizarUser) {
    btnActualizarUser.addEventListener("click", (e) => {
        let value = e.target.value;
        alert(value);
        enviardataus(value);
    });
}


function enviardataus(valores) {

    const formUseadm = $("#formUseadm");

    $.ajax({
        type: formUseadm.attr("method"),
        url: formUseadm.attr("action"),
        data: {
            id: idus1.value,
            estado: String(txtestado.value),
            valor: valores
        },
        success: function (response) {
            const respuesta = JSON.parse(response);
            dialogUser.close();

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
                    window.location.replace("/adminpage");
                });
            }
        },
        error: function (error) {
            alert(error);
        },
    });

}

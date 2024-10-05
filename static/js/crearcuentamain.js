//18122022
/* global Swal */
const txtCorreoUsuario = document.querySelector("#txtCorreoUsuario");
const txtPassword = document.querySelector("#txtPassword");
const eye_show = document.querySelector("#eye-show");
const eye_hide = document.querySelector("#eye-hide");
const fechaformateada = document.querySelector("#fechaformateada");
const fecha = document.querySelector("#fecha");
const txtnombres = document.querySelector("#txtnombres");
const txtapellidos = document.querySelector("#txtapellidos");

let Ifacebook = "",
  Itwitter = "",
  Iinstragram = "";
eye_show.onclick = () => {
  if (txtPassword.type === "password") {
    txtPassword.type = "text";
    eye_show.classList.replace("show", "hide");
    eye_hide.classList.replace("hide", "show");
  }
};

eye_hide.onclick = () => {
  if (txtPassword.type === "text") {
    txtPassword.type = "password";
    eye_show.classList.replace("hide", "show");
    eye_hide.classList.replace("show", "hide");
  }
};

let verificar_input = {
  txtCorreoUsuario: true,
  txtPassword: true,
};

document.querySelector("#accion").addEventListener("click", (e) => {
  e.preventDefault();
  EnviarDatos();
});

window.addEventListener("load", () => {
  let txtfrase = document.querySelector("#txt_frase");
  txtfrase.innerHTML =
    '"Porque yo sé los planes que tengo para ustedes, declara el Señor, planes de bienestar y no de calamidad, para darles un futuro y una esperanza." – Jeremías 29:11';
});

let timerInterval;
function EnviarDatos() {
  submitController();
}

function ValidacionLogin(icono, color, mensaje) {
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    iconColor: color,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: icono,
    title:
      "<h5 style='color:" + color + "; font-size:15px;' >" + mensaje + "</h5>",
  }).then(function () {
    // window.location.replace("Modulos?modulo=dashboard");
  });
}
txtCorreoUsuario.addEventListener("input", (e) => validatefieldWhite(e));
txtPassword.addEventListener("input", (e) => validatefieldWhite(e));
txtCorreoUsuario.addEventListener("change", (e) => validateEmailB(e));
fecha.addEventListener("change", (e) => formatearFecha(e));
txtnombres.addEventListener("input", (e) => validatefieldName(e));
txtapellidos.addEventListener("input", (e) => validatefieldName(e));



function formatearFecha(e) {
  const fechaInput = e.target.value;
   
  let formato = "dd/mm/yyyy"

  const fechaObj = new Date(fechaInput);

  // Definimos un objeto con los códigos de formato comunes
  const formatos = {
    'dd': (fechaObj.getDate()).toString().padStart(2, '0'),
    'mm': (fechaObj.getMonth() + 1).toString().padStart(2, '0'), // Meses en JavaScript empiezan desde 0
    'yyyy': fechaObj.getFullYear(),
  };

  // Reemplazamos los códigos de formato en la cadena de formato proporcionada
  let retorno = formato.replace(/dd|mm|yyyy/g, matched => formatos[matched]);
  fechaformateada.value = retorno;
}

const validatefieldWhite = (e) => {
  const fieldValue = e.target.value;
  const field_id = e.target.id;
  if (fieldValue.trim().length === 0) {
    verificar_input[field_id] = true;
  } else {
    verificar_input[field_id] = false;
  }
};

const validateEmailB = (e) => {
  const fieldValue = e.target.value;
  const field_id = e.target.id;
  const regex = new RegExp("^(.*)@(gmail|googlemail|(.*.)google).com");

  if (fieldValue.trim().length === 0) {
    verificar_input[field_id] = true;
    ValidacionLogin("warning", "#FF0000", "Por favor llenar el formulario*");
  } else if (!regex.test(fieldValue)) {
    verificar_input[field_id] = true;
    ValidacionLogin("warning", "#FF0000", "Tiene que ser una direccion de correo valida*");
  } else {
    verificar_input[field_id] = false;
  }
};


const validatefieldName = (e) => {
  const fieldValue = e.target.value;
  const field_id = e.target.id;
  const regex = new RegExp(
    "^([A-ZÀ-ÅÇ-ÖÙ-Ý][a-zà-åç-öù-ÿ]+(?:[-' ][A-ZÀ-ÅÇ-ÖÙ-Ý][a-zà-åç-öù-ÿ]+)*)$"
  );

  if (fieldValue.trim().length === 0) {
    verificar_input[field_id] = true;
    ValidacionLogin("warning", "#FF0000", "Debe de llenar el formulario*");

  } else if (!regex.test(fieldValue)) {
    verificar_input[field_id] = true;
    ValidacionLogin("warning", "#FF0000", "*Inicial Mayúscula, solo se permiten letras");


  } else {
    verificar_input[field_id] = false;

  }
};

submitController = () => {
  if (verificar_input.txtCorreoUsuario || verificar_input.txtPassword) {
    ValidacionLogin("warning", "#FF0000", "Por favor llenar los campos correctamente*");
  } else {
    Swal.fire({
      title: '<h5 style="color:#00CDB5; " >Creando Cuenta...</h5>',
      html: "Enviando datos en <b></b>.",
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const b = Swal.getHtmlContainer().querySelector("b");
        timerInterval = setInterval(() => {
          b.textContent = Swal.getTimerLeft();
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        EnviarData();
      }
    });
  }
};


let frmModPass = $("#frm_crearUser");

function EnviarData() {
  $.ajax({
    type: frmModPass.attr("method"),
    url: "/crearUsuario",
    data: frmModPass.serialize(),
    success: function (response) {
      const respuesta = JSON.parse(response);

      if (respuesta.estado == 0) {
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          iconColor: "#ff0e1d",
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "warning",
          title:
            "<h5 style='color:#ff0044; font-size:15px;'>Formulario Llenado incorrectamente.</h5>",
        });
      } else {
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          iconColor: "#08bb40",
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "success",
          title:
            "<h5 style='font-size:15px;' >Usuario Creado Correctamente</h5>",
        }).then(function () {
          window.location.replace("/");
          // alert("Ha entrado");
        });
      }
    },
    error: function (error) {
      alert(error);
    },
  });
}

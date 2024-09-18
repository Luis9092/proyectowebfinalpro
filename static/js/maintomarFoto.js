

// Acceder a la cámara
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const imagenCapturada = document.getElementById('imagenCapturada');
const botonCapturar = document.getElementById('capturar');
const botonEncenderApagar = document.getElementById('encenderApagar');
const IniciarTraduccionfoto = document.querySelector("#IniciarTraduccionfoto");
IniciarTraduccionfoto.disabled = true;

let stream = null;
let camaraEncendida = false;
let estadoCamara = false;
// Función para encender y apagar la cámara
if (botonEncenderApagar) {
    botonEncenderApagar.addEventListener('click', async () => {
        if (camaraEncendida) {
            // Apagar la cámara

            stream.getTracks().forEach(track => track.stop());
            video.srcObject = null;
            botonEncenderApagar.textContent = 'Encender Cámara';
            video.style.display = "none";
            estadoCamara = false;

        } else {
            // Encender la cámara
            video.style.display = "block";
            estadoCamara = true;
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
                botonEncenderApagar.textContent = 'Apagar Cámara';
            } catch (error) {
                console.error('Error al acceder a la cámara:', error);
            }
        }
        camaraEncendida = !camaraEncendida;
    });
}

async function apagarEncender() {
    camaraEncendida = true;
    if (camaraEncendida) {
        // Apagar la cámara

        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        botonEncenderApagar.textContent = 'Encender Cámara';
        video.style.display = "none";
    } else {
        // Encender la cámara
        video.style.display = "block";

        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            botonEncenderApagar.textContent = 'Apagar Cámara';
        } catch (error) {
            console.error('Error al acceder a la cámara:', error);
        }
    }
    camaraEncendida = !camaraEncendida;
}

// Función para capturar la imagen
// if (botonCapturar) {
let iniciadorfoto = false
botonCapturar.addEventListener('click', () => {
    if (estadoCamara == true) {
        estadosCamara();
        subirImagenServer();
    }
});




function estadosCamara() {
    video.style.display = "none";
    apagarEncender();
    IniciarTraduccionfoto.disabled = false;
    estadoCamara = false;
}
async function subirImagenServer() {
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    imagenCapturada.src = canvas.toDataURL('image/png');
    const dataURL = canvas.toDataURL('image/png');
    let agregado = hora();
    // Convertir el Data URL a un Blob
    const response = await fetch(dataURL);
    const blob = await response.blob();
    let NuevoNombre = agregado.toString() + "fototomada.png";
    // Renombrar el archivo
    const newFileName = NuevoNombre;

    const renamedFile = new File([blob], newFileName, { type: 'image/png' });
    let retorno = 0;

    // Aquí puedes hacer algo con el archivo renombrado, como subirlo
    const formData = new FormData();
    formData.append('file', renamedFile);

    // Ejemplo de uso de Axios para subir la imagen (opcional)
    try {
        const response = await axios.post('http://127.0.0.1:8000/subirImagenServer', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        alertModal("#00dfdf", "Imagen Subida al Servidor.", "success",);
        retorno = 1;


    } catch (error) {
        alertModal("#ff0055", "Error al cargarlo al servidor :(", "error",)
        retorno = 0
    }
    return retorno;
}






let namefoto = "";
const imgEscaneadafoto = document.querySelector("#imgEscaneadafoto");
const imgTraducidafoto = document.querySelector("#imgTraducidafoto");
const textofoto = document.querySelector("#textofoto");
const traduccionfoto = document.querySelector("#traduccionfoto");
const txtfilefoto = document.querySelector("#txtfilefoto");
const tamaniofoto = document.querySelector("#tamaniofoto");
const formatofoto = document.querySelector("#formatofoto");
const txtid12foto = document.querySelector("#txtid12foto");


let NombresEliminarfoto = [];

//BOTON PRINCIPAL PARA PODER INICIAR CON EL SCAN
// if (IniciarTraduccionfoto) {
//     IniciarTraduccionfoto.addEventListener("click", (e) => {

//         if (iniciadorfoto == true) {
//             let agregado = hora();
//             let nombre = namefoto.replace(/\s+/g, '');
//             let nuevoNombre = agregado.toString() + nombre;
//             initTodofoto(nuevoNombre);
//             NombresEliminarfoto.push(nuevoNombre);
//         }

//     });
// }



async function initTodofoto(nuevoNombre) {

    // alert(nuevoNombre);

    const retorno1 = await subirImagenServer(nuevoNombre);
    // //retorno 1 exitp
    // if (retorno1 == 1) {
    //     const retorno2 = await IniciarScanfoto(nuevoNombre, tamanio.value, formato.value, txtid12.value);
    //     // alert("proceso uno exito");
    //     if (retorno2 == 1) {
    //         // alert("proceso dos exito");
    //         let idioma = txtidiomas.value;
    //         const retorno3 = await traducirImagefoto(nuevoNombre, idioma);
    //         if (retorno3 == 1) {

    //             const retornoFin = await TraerDatafoto();
    //             if (retornoFin == 1) {
    //                 imgEscaneadafoto.src = "http://127.0.0.1:8000/fileEscaneado/" + nuevoNombre;
    //                 imgTraducidafoto.src = "http://127.0.0.1:8000/fileTraducido/" + nuevoNombre;
    //             }
    //         }
    //     }
    // }


}



// async function IniciarScanfoto(nuevoNombre, tamanio, formato, id) {
//     retorno = 0;

//     try {
//         const response = await axios.post("http://127.0.0.1:8000/IniciarScanImage", {
//             id: "",
//             idUser: String(id),
//             nombre: String(nuevoNombre),
//             tamanio: String(tamanio),
//             formato: String(formato),
//             fechaCreacion: "",
//         });
//         alertModal("#00dfdf", "Escanendo imagen...", "success",)

//         retorno = 1;
//     } catch (e) {
//         console.log(e);
//         alertModal("#ff0055", "Imagen sin texto :(", "error",)

//         retorno = 0;
//     }
//     return retorno;
// }


// async function traducirImagefoto(name, idioma) {
//     retorno = 0;
//     try {
//         const response = await axios.post("http://127.0.0.1:8000/traducirTextoImage", {
//             id: 0,
//             name_file: String(name),
//             idiomaTraducir: String(idioma)
//         });
//         // Aquí puedes manejar la respuesta si es necesario
//         alertModal("#00dfdf", "Texto traducido correctamente!!", "success",)

//         retorno = 1;
//     } catch (error) {
//         alertModal("#ff0055", "Error al traducir el texto.", "error",)
//         console.error("Error al traducir la imagen:", error);
//         retorno = 0;
//     }

//     return retorno;
// }

// async function traeridImagen(name) {
//     retorno = 0;
//     try {
//         params = { nameimg: String(name) }
//         const response = await axios.get("http://127.0.0.1:8000/obtneridImage/<nameimg>", {
//             params
//         });
//         console.log("textoTraducidondata ", response.data.id);

//         retorno = response.data.id;
//     } catch (e) {
//         console.log(e);
//         retorno = 0;
//     }
//     return retorno;
// }







// function extraerInfoImagen(file) {
//     return new Promise((resolve, reject) => {
//         // Verificar si el archivo es una imagen
//         if (!file.type.startsWith('image/')) {
//             reject(new Error('El archivo seleccionado no es una imagen.'));
//             return;
//         }

//         const img = new Image();
//         img.onload = function () {
//             // Extraer el tamaño
//             const tamanio = {
//                 ancho: this.width,
//                 alto: this.height
//             };

//             // Extraer el formato
//             const formato = file.type.split('/')[1];

//             resolve({
//                 tamanio: tamanio,
//                 formato: formato
//             });
//         };

//         img.onerror = function () {
//             reject(new Error('No se pudo cargar la imagen.'));
//         };

//         // Crear una URL para el archivo
//         img.src = URL.createObjectURL(file);
//     });
// }

// if (txtfile) {
//     txtfile.addEventListener("change", function (event) {
//         const file = event.target.files[0];
//         extraerInfoImagen(file)
//             .then(info => {
//                 tamanio.value = `${info.tamanio.ancho}x${info.tamanio.alto} píxeles`;
//                 formato.value = info.formato;

//                 console.log(`Tamaño: ${info.tamanio.ancho}x${info.tamanio.alto} píxeles`);
//                 console.log(`Formato: ${info.formato}`);
//             })
//             .catch(error => {
//                 console.error('Error:', error.message);
//             });
//     });
// }



// async function TraerDatafoto() {
//     retorno = 0;
//     try {
//         const response = await axios.get("http://127.0.0.1:8000/ObtenerDataImagen", {
//         });
//         console.log("textoTraducidondata ", response.data.traduccionpalabras);

//         verresultado(response.data.textoextraido, response.data.textotraducido, response.data.palabras, response.data.traduccionpalabras, response.data.nopalabras);
//         retorno = 1;
//     } catch (e) {
//         console.log(e);
//         retorno = 0;
//     }
//     return retorno;
// }


// function verresultado(textoextraido, textotraducido, palabras, traduccionpalabras, nopalabras) {
//     datos = []
//     texto.innerHTML = textoextraido;
//     traduccion.innerHTML = textotraducido;
//     let contador = 0;
//     const array1 = palabras.split(',');
//     const array2 = traduccionpalabras.split(',');
//     document.querySelector("#noPalabras").innerHTML = `${nopalabras} Palabras`;

//     array1.forEach((elemento, index) => {
//         const traduccion = array2[index];

//         if (elemento && traduccion) {
//             datos.push({
//                 no: datos.length + 1,
//                 palabra: elemento.trim(),
//                 traduccion: traduccion.trim(),
//             });
//         }
//     });
//     PintarEntabla(datos);
//     console.log(datos);
// }
// function PintarEntabla(datos) {
//     document.querySelector("#pintar").innerHTML = "";

//     let cadena = "";
//     datos.forEach(item => {
//         cadena += `
//         <tr>
//           <td>${item.no}</td>
//           <td>${item.palabra}</td>
//           <td>${item.traduccion}</td>
//         </tr>
//         `;
//     });
//     document.querySelector("#pintar").innerHTML = cadena;
// }


// async function eliminarRecurso(url) {
//     try {
//         const response = await axios.delete(url);
//         console.log('Recurso eliminado:', response.data);
//     } catch (error) {
//         console.error('Error al eliminar el recurso:', error);
//     }
// }

// // Llama a la función con la URL de la API que deseas eliminar
// // ADICIONALES PARA PODER DARLE VISTA

// function alertModal(color, mensaje, icon) {

//     const Toast = Swal.mixin({
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer: 3000,
//         iconColor: color,

//         timerProgressBar: true,
//         didOpen: (toast) => {
//             toast.onmouseenter = Swal.stopTimer;
//             toast.onmouseleave = Swal.resumeTimer;
//         }
//     });
//     Toast.fire({
//         icon: icon,
//         title: mensaje
//     });
// }



// //Salir del windows
// window.addEventListener('beforeunload', function (event) {
//     if (NombresEliminarfoto.length != 0) {
//         NombresEliminarfoto.forEach(element => {
//             let url = "http://127.0.0.1:8000/eliminaImage/" + element;
//             eliminarRecurso(url);
//         });
//     }

// });


// Acceder a la cámara
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const imagenCapturada = document.getElementById('imagenCapturada');
const botonCapturar = document.getElementById('capturar');
const botonEncenderApagar = document.getElementById('encenderApagar');
const IniciarTraduccionfoto = document.querySelector("#IniciarTraduccionfoto");
let subidoAlservido = false;
let namefoto = "";

const tamaniofoto = document.querySelector("#tamaniofoto");
const formatofoto = document.querySelector("#formatofoto");
const txtid12foto = document.querySelector("#txtid12foto");


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
    subidoAlservido = false;
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
let iniciadorfoto = false
if (botonCapturar) {

    botonCapturar.addEventListener('click', async () => {
        if (estadoCamara == true) {
            video.style.display = "none";

            const ctx = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const width = canvas.width; // Ancho en píxeles
            const height = canvas.height;
            tamaniofoto.value = `${width}x${height} píxeles`;
            formatofoto.value = "png";

            imagenCapturada.src = canvas.toDataURL('image/png');
            const dataURL = canvas.toDataURL('image/png');
            let agregado = hora();
            // Convertir el Data URL a un Blob
            const response = await fetch(dataURL);
            const blob = await response.blob();
            let NuevoNombre = agregado.toString() + "fototomada.png";
            // Renombrar el archivo
            const newFileName = NuevoNombre;
            namefoto = NuevoNombre;
            const renamedFile = new File([blob], newFileName, { type: 'image/png' });

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
                alertModalfoto("#00dfdf", "Imagen Subida al Servidor.", "success",)
                subidoAlservido = true;
                NombresEliminarfoto.push(NuevoNombre);

            } catch (error) {
                alertModalfoto("#ff0055", "Error al cargarlo al servidor :(", "error",)
                subidoAlservido = false;
            }
            apagarEncender();
            IniciarTraduccionfoto.disabled = false;
            estadoCamara = false;
        }
    });
}



const txtidiomasfoto = document.querySelector("#txtidiomasfoto")

const imgEscaneadafoto = document.querySelector("#imgEscaneadafoto");
const imgTraducidafoto = document.querySelector("#imgTraducidafoto");
const textofoto = document.querySelector("#textofoto");
const traduccionfoto = document.querySelector("#traduccionfoto");
const txtfilefoto = document.querySelector("#txtfilefoto");




let NombresEliminarfoto = [];

//BOTON PRINCIPAL PARA PODER INICIAR CON EL SCAN
if (IniciarTraduccionfoto) {
    IniciarTraduccionfoto.addEventListener("click", (e) => {

        if (subidoAlservido == true) {
            initTodofoto(namefoto);
        }

    });
}



async function initTodofoto(nuevoNombre) {

    alert(nuevoNombre);

    // //retorno 1 exitp
    if (subidoAlservido == true) {
        const retorno2 = await IniciarScanfoto(nuevoNombre, tamaniofoto.value, formatofoto.value, txtid12foto.value);
        // alert("proceso uno exito");
        if (retorno2 == 1) {
            // alert("proceso dos exito");
            let idioma = txtidiomasfoto.value;
            const retorno3 = await traducirImagefoto(nuevoNombre, idioma);
            if (retorno3 == 1) {

                const retornoFin = await TraerDatafoto();
                if (retornoFin == 1) {
                    imgEscaneadafoto.src = "http://127.0.0.1:8000/fileEscaneado/" + nuevoNombre;
                    imgTraducidafoto.src = "http://127.0.0.1:8000/fileTraducido/" + nuevoNombre;
                }
            }
        }
    }
}


async function IniciarScanfoto(nuevoNombre, tamanio, formato, id) {
    retorno = 0;

    try {
        const response = await axios.post("http://127.0.0.1:8000/IniciarScanImage", {
            id: "",
            idUser: String(id),
            nombre: String(nuevoNombre),
            tamanio: String(tamanio),
            formato: String(formato),
            fechaCreacion: "",
        });
        alertModalfoto("#00dfdf", "Escanendo imagen...", "success",)

        retorno = 1;
    } catch (e) {
        console.log(e);
        alertModalfoto("#ff0055", "Imagen sin texto :(", "error",)

        retorno = 0;
    }
    return retorno;
}


async function traducirImagefoto(name, idioma) {
    retorno = 0;
    try {
        const response = await axios.post("http://127.0.0.1:8000/traducirTextoImage", {
            id: 0,
            name_file: String(name),
            idiomaTraducir: String(idioma)
        });
        // Aquí puedes manejar la respuesta si es necesario
        alertModalfoto("#00dfdf", "Texto traducido correctamente!!", "success",)

        retorno = 1;
    } catch (error) {
        alertModalfoto("#ff0055", "Error al traducir el texto.", "error",)
        console.error("Error al traducir la imagen:", error);
        retorno = 0;
    }

    return retorno;
}

async function traeridImagenfoto(name) {
    retorno = 0;
    try {
        params = { nameimg: String(name) }
        const response = await axios.get("http://127.0.0.1:8000/obtneridImage/<nameimg>", {
            params
        });
        console.log("textoTraducidondata ", response.data.id);

        retorno = response.data.id;
    } catch (e) {
        console.log(e);
        retorno = 0;
    }
    return retorno;
}


async function TraerDatafoto() {
    retorno = 0;
    try {
        const response = await axios.get("http://127.0.0.1:8000/ObtenerDataImagen", {
        });
        console.log("textoTraducidondata ", response.data.traduccionpalabras);

        verresultadofoto(response.data.textoextraido, response.data.textotraducido, response.data.palabras, response.data.traduccionpalabras, response.data.nopalabras);
        retorno = 1;
    } catch (e) {
        console.log(e);
        retorno = 0;
    }
    return retorno;
}


function verresultadofoto(textoextraido, textotraducido, palabras, traduccionpalabras, nopalabras) {
    datos = []
    texto.innerHTML = textoextraido;
    traduccion.innerHTML = textotraducido;
    let contador = 0;
    const array1 = palabras.split(',');
    const array2 = traduccionpalabras.split(',');
    document.querySelector("#noPalabrasfoto").innerHTML = `${nopalabras} Palabras`;

    array1.forEach((elemento, index) => {
        const traduccion = array2[index];

        if (elemento && traduccion) {
            datos.push({
                no: datos.length + 1,
                palabra: elemento.trim(),
                traduccion: traduccion.trim(),
            });
        }
    });
    PintarEntablafoto(datos);
    console.log(datos);
}
function PintarEntablafoto(datos) {
    document.querySelector("#pintarfoto").innerHTML = "";

    let cadena = "";
    datos.forEach(item => {
        cadena += `
        <tr>
          <td>${item.no}</td>
          <td>${item.palabra}</td>
          <td>${item.traduccion}</td>
        </tr>
        `;
    });
    document.querySelector("#pintarfoto").innerHTML = cadena;
}


async function eliminarRecursofoto(url) {
    try {
        const response = await axios.delete(url);
        console.log('Recurso eliminado:', response.data);
    } catch (error) {
        console.error('Error al eliminar el recurso:', error);
    }
}

// Llama a la función con la URL de la API que deseas eliminar
// ADICIONALES PARA PODER DARLE VISTA

function alertModalfoto(color, mensaje, icon) {

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        iconColor: color,

        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: icon,
        title: mensaje
    });
}



//Salir del windows
window.addEventListener('beforeunload', function (event) {
    if (NombresEliminarfoto.length != 0) {
        NombresEliminarfoto.forEach(element => {
            let url = "http://127.0.0.1:8000/eliminaImage/" + element;
            eliminarRecursofoto(url);
        });
    }

});
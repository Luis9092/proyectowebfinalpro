const txtidiomas = document.querySelector("#txtidiomas")
const img1 = document.querySelector("#img1");
let name = "";

const imgEscaneada = document.querySelector("#imgEscaneada");
const imgTraducida = document.querySelector("#imgTraducida");
const texto = document.querySelector("#texto");
const traduccion = document.querySelector("#traduccion");
const txtfile = document.querySelector("#txtfile");
const tamanio = document.querySelector("#tamanio");
const formato = document.querySelector("#formato");
const txtid12 = document.querySelector("#txtid12");


function validarArchivoImagen(archivo) {
    const tiposValidos = ['image/jpeg', 'image/png', 'image/jpg'];
    return tiposValidos.includes(archivo.type);
}

// PRIMER PASO VALIDAR LAS ENTRADAS DE ARCHIVOS
const inputArchivo = document.querySelector('input[type="file"]');

let iniciador = false;
let NombresEliminar = [];
if(inputArchivo){
inputArchivo.addEventListener('change', function () {
    const archivo = this.files[0];
    if (archivo) {
        if (validarArchivoImagen(archivo)) {
            const fileReader = new FileReader();
            name = archivo.name;

            fileReader.onload = function (event) {
                img1.src = event.target.result;
                alertModal("#00dfdf", "Imagen Agregada correctamente!!", "success",)
            };

            fileReader.readAsDataURL(archivo);
            iniciador = true
        } else {
            alertModal("#ff0055", "El archivo no es válido. Debe ser JPG, PNG o JPEG.", "error",)
            iniciador = false;
        }
    }
});
}

const IniciarTraduccion = document.querySelector("#IniciarTraduccion");

//BOTON PRINCIPAL PARA PODER INICIAR CON EL SCAN
if (IniciarTraduccion) {
    IniciarTraduccion.addEventListener("click", (e) => {

        if (iniciador == true) {
            let agregado = hora();
            let nombre = name.replace(/\s+/g, '');
            let nuevoNombre = agregado.toString() + nombre;
            initTodo(nuevoNombre);
            NombresEliminar.push(nuevoNombre);
        }

    });
}



async function initTodo(nuevoNombre) {

    // alert(nuevoNombre);

    const retorno1 = await uploadImage(nuevoNombre);
    //retorno 1 exitp
    if (retorno1 == 1) {
        const retorno2 = await IniciarScan(nuevoNombre, tamanio.value, formato.value, txtid12.value);
        // alert("proceso uno exito");
        if (retorno2 == 1) {
            // alert("proceso dos exito");
            let idioma = txtidiomas.value;
            const retorno3 = await traducirImage(nuevoNombre, idioma);
            if (retorno3 == 1) {

                const retornoFin = await TraerData();
                if (retornoFin == 1) {
                    imgEscaneada.src = "http://127.0.0.1:8000/fileEscaneado/" + nuevoNombre;
                    imgTraducida.src = "http://127.0.0.1:8000/fileTraducido/" + nuevoNombre;
                }
            }
        }
    }


}



async function uploadImage(nuevoNombre) {
    const fileInput = document.getElementById('txtfile');
    retorno = 0;
    // Verifica si hay un archivo seleccionado
    if (fileInput.files.length > 0) {
        const originalFile = fileInput.files[0];
        const newFileName = nuevoNombre; // Cambia el nombre aquí

        // Crea un nuevo objeto File con el nuevo nombre
        const newFile = new File([originalFile], newFileName, { type: originalFile.type });

        const formData = new FormData();
        formData.append('file', newFile); // Agrega la nueva imagen al FormData

        try {
            const response = await axios.post('http://127.0.0.1:8000/subirImagenServer', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alertModal("#00dfdf", "Imagen Subida al Servidor.", "success",)

            retorno = 1;
        } catch (error) {
            alertModal("#ff0055", "Error al cargarlo al servidor :(", "error",)
            retorno = 0;
        }
    } else {
        retorno = 0;
        // message.textContent = 'Por favor, selecciona un archivo de imagen.';
    }
    return retorno;
}

async function IniciarScan(nuevoNombre, tamanio, formato, id) {
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
        alertModal("#00dfdf", "Escanendo imagen...", "success",)

        retorno = 1;
    } catch (e) {
        console.log(e);
        alertModal("#ff0055", "Imagen sin texto :(", "error",)

        retorno = 0;
    }
    return retorno;
}


async function traducirImage(name, idioma) {
    retorno = 0;
    try {
        const response = await axios.post("http://127.0.0.1:8000/traducirTextoImage", {
            id: 0,
            name_file: String(name),
            idiomaTraducir: String(idioma)
        });
        // Aquí puedes manejar la respuesta si es necesario
        alertModal("#00dfdf", "Texto traducido correctamente!!", "success",)

        retorno = 1;
    } catch (error) {
        alertModal("#ff0055", "Error al traducir el texto.", "error",)
        console.error("Error al traducir la imagen:", error);
        retorno = 0;
    }

    return retorno;
}

async function traeridImagen(name) {
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







function extraerInfoImagen(file) {
    return new Promise((resolve, reject) => {
        // Verificar si el archivo es una imagen
        if (!file.type.startsWith('image/')) {
            reject(new Error('El archivo seleccionado no es una imagen.'));
            return;
        }

        const img = new Image();
        img.onload = function () {
            // Extraer el tamaño
            const tamanio = {
                ancho: this.width,
                alto: this.height
            };

            // Extraer el formato
            const formato = file.type.split('/')[1];

            resolve({
                tamanio: tamanio,
                formato: formato
            });
        };

        img.onerror = function () {
            reject(new Error('No se pudo cargar la imagen.'));
        };

        // Crear una URL para el archivo
        img.src = URL.createObjectURL(file);
    });
}

if (txtfile) {
    txtfile.addEventListener("change", function (event) {
        const file = event.target.files[0];
        extraerInfoImagen(file)
            .then(info => {
                tamanio.value = `${info.tamanio.ancho}x${info.tamanio.alto} píxeles`;
                formato.value = info.formato;

                console.log(`Tamaño: ${info.tamanio.ancho}x${info.tamanio.alto} píxeles`);
                console.log(`Formato: ${info.formato}`);
            })
            .catch(error => {
                console.error('Error:', error.message);
            });
    });
}



async function TraerData() {
    retorno = 0;
    try {
        const response = await axios.get("http://127.0.0.1:8000/ObtenerDataImagen", {
        });
        console.log("textoTraducidondata ", response.data.traduccionpalabras);

        verresultado(response.data.textoextraido, response.data.textotraducido, response.data.palabras, response.data.traduccionpalabras, response.data.nopalabras);
        retorno = 1;
    } catch (e) {
        console.log(e);
        retorno = 0;
    }
    return retorno;
}


function verresultado(textoextraido, textotraducido, palabras, traduccionpalabras, nopalabras) {
    datos = []
    texto.innerHTML = textoextraido;
    traduccion.innerHTML = textotraducido;
    let contador = 0;
    const array1 = palabras.split(',');
    const array2 = traduccionpalabras.split(',');
    document.querySelector("#noPalabras").innerHTML = `${nopalabras} Palabras`;

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
    PintarEntabla(datos);
    console.log(datos);
}
function PintarEntabla(datos) {
    document.querySelector("#pintar").innerHTML = "";

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
    document.querySelector("#pintar").innerHTML = cadena;
}


async function eliminarRecurso(url) {
    try {
        const response = await axios.delete(url);
        console.log('Recurso eliminado:', response.data);
    } catch (error) {
        console.error('Error al eliminar el recurso:', error);
    }
}

// Llama a la función con la URL de la API que deseas eliminar
// ADICIONALES PARA PODER DARLE VISTA

function alertModal(color, mensaje, icon) {

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
    if (NombresEliminar.length != 0) {
        NombresEliminar.forEach(element => {
            let url = "http://127.0.0.1:8000/eliminaImage/" + element;
            eliminarRecurso(url);
        });
    }

});
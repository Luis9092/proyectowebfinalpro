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
const inputArchivo = document.querySelector('#txtfile');

let iniciador = false;
let NombresEliminar = [];
if (inputArchivo) {
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
let nombreArreglado = ""
let descargarValores = 0;

//BOTON PRINCIPAL PARA PODER INICIAR CON EL SCAN

if (IniciarTraduccion) {
    IniciarTraduccion.addEventListener("click", (e) => {
        if (iniciador == true) {
            let agregado = hora();
            let nombre = name.replace(/\s+/g, '');
            let nuevoNombre = agregado.toString() + nombre;
            nombreArreglado = nuevoNombre;
            initTodo(nuevoNombre);
            NombresEliminar.push(nuevoNombre);
        }
    });
}


async function initTodo(nuevoNombre) {

    const retorno1 = await uploadImage(nuevoNombre);
    if (retorno1 == 1) {
        const retorno2 = await IniciarScan(nuevoNombre, tamanio.value, formato.value, txtid12.value);
        console.log(retorno2);
        if (retorno2 == 1) {
            alertModal("#00dfdf", "Texto Traducido correctamente.", "success",)

        } else {
            alertModal("#ff0055", "Error al traducir texto:(", "error",)
        }
    }
}

async function obtenerImagenescaneada(nuevoNombre) {
    try {
        const response = await fetch('https://repositorioprivado.onrender.com/fileEscaneado/' + nuevoNombre);

        if (!response.ok) {
            throw new Error('Error al obtener la imagen: ' + response.statusText);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const img = imgEscaneada;
        img.src = url;
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}
async function obtenerImagenesTraducida(nuevoNombre) {
    try {
        const response = await fetch('https://repositorioprivado.onrender.com/fileTraducido/' + nuevoNombre);

        if (!response.ok) {
            throw new Error('Error al obtener la imagen: ' + response.statusText);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const img = imgTraducida;
        img.src = url;
    } catch (error) {
        console.error('Error en la solicitud:', error);
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
            // const response = await axios.post('http://127.0.0.1:8000/subirImagenServer', formData, {
            const response = await axios.post('https://repositorioprivado.onrender.com/subirImagenServer', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alertModal("#00dfdf", "Imagen Subida al Servidor.", "success",)

            retorno = 1;
        } catch (error) {
            alertModal("#ff0055", "Error al cargarlo al servidor :(", "error",)
            console.log(error);
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
    alertModal("#00dfdf", "Escanendo imagen...", "success",);

    try {
        const response = await axios.post("https://repositorioprivado.onrender.com/IniciarScanImage", {
            // const response = await axios.post("http://127.0.0.1:8000/IniciarScanImage", {
            id: "",
            idUser: String(id),
            nombre: String(nuevoNombre),
            tamanio: String(tamanio),
            formato: String(formato),
            fechaCreacion: "",
            idiomatraducir: String(txtidiomas.value),
        });

        console.log(response);

        verresultado(response.data.textoextraido, response.data.textotraducido, response.data.palabras, response.data.traduccionpalabras, response.data.nopalabras);
        idImagen = response.data.idimagen;
        idiomaOrigen = response.data.idiomaorigen;
        idiomaTraduccion = response.data.idiomatraduccion;

        // imgEscaneada.src = "http://127.0.0.1:8000/fileEscaneado/" + nuevoNombre;
        // imgTraducida.src = "http://127.0.0.1:8000/fileTraducido/" + nuevoNombre;
        imgEscaneada.src = "https://repositorioprivado.onrender.com/fileEscaneado/" + nuevoNombre;
        imgTraducida.src = "https://repositorioprivado.onrender.com/fileTraducido/" + nuevoNombre;
        // obtenerImagenescaneada(nuevoNombre);
        // obtenerImagenesTraducida(nuevoNombre);
        descargarValores = 1;
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
        const response = await axios.post("https://repositorioprivado.onrender.com/traducirTextoImage", {
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
        const response = await axios.get("https://repositorioprivado.onrender.com/obtneridImage/<nameimg>", {
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

let idImagen = "";
let idiomaOrigen = ""
let idiomaTraduccion = "";


async function TraerData() {
    retorno = 0;
    try {
        const response = await axios.get("https://repositorioprivado.onrender.com/ObtenerDataImagen", {
        });
        console.log("textoTraducidondata ", response.data.traduccionpalabras);

        verresultado(response.data.textoextraido, response.data.textotraducido, response.data.palabras, response.data.traduccionpalabras, response.data.nopalabras);
        idImagen = response.data.idimagen;
        idiomaOrigen = response.data.idiomaorigen;
        idiomaTraduccion = response.data.idiomatraduccion;

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
    document.querySelector("#pintar").innerHTML = "";
    PintarEntabla(datos);
}

function PintarEntabla(datos) {

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

// Lljama a la función con la URL de la API que deseas eliminar
// ADICIONALES PARA PODER DARLE VISTA

function alertModal(color, mensaje, icon) {

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 4000,
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

            let url = "https://repositorioprivado.onrender.com/eliminaImage/" + element;
            // let url = "http://127.0.0.1:8000/eliminaImage/" + element;
            eliminarRecurso(url);
        });
    }
});
const descargarImagenAr = document.querySelector("#descargarImagenAr");

if (descargarImagenAr) {
    descargarImagenAr.addEventListener("click", () => {
        if (descargarValores == 1) {
            // const url = `http://127.0.0.1:8000/IniciarScanImage/${nombreArreglado}`;
            const url = `https://repositorioprivado.onrender.com/descargarImagenEscaneado/${nombreArreglado}`;
            const retorno = descargarImagenMarcada(url, nombreArreglado);
            if (retorno == 1) {
                alertModal("#00dfdf", "Imagen Descargada Correctamente!!", "success",);
            }
        }
    });
}

const descargarImagenTraducida1 = document.querySelector("#descargarImagenTraducida1");
if (descargarImagenTraducida1) {
    descargarImagenTraducida1.addEventListener("click", () => {
        if (descargarValores == 1) {
            // const url = `http://127.0.0.1:8000/IniciarScanImage/${nombreArreglado}`;
            const url = `https://repositorioprivado.onrender.com/descargarImagenTraducido/${nombreArreglado}`;
            const retorno = descargarImagenMarcada(url, nombreArreglado);
            if (retorno == 1) {
                alertModal("#00dfdf", "Imagen Descargada Correctamente!!", "success",);
            }
        }
    });
}

async function descargarImagenMarcada(casa123, nameFile) {

    try {
        const url2 = casa123;
        const response = await fetch(url2);

        // Verificamos si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error('Error al descargar la imagen');
        }

        // Obtenemos el blob de la imagen
        const blob = await response.blob();

        // Creamos un enlace para descargar la imagen
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nameFile;
        link.click();

        // Liberamos el objeto URL
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error:', error);
        // Aquí puedes mostrar un mensaje de error al usuario
    }
}

const guardarImagen = document.querySelector("#guardarImagen");
if (guardarImagen) {
    guardarImagen.addEventListener("click", () => {
        if (descargarValores == 1) {
            const imagen = document.querySelector("#imgEscaneada");
            convertirImagenABlob(imagen);
        }
    });
}
const guardarImagenTraducida = document.querySelector("#guardarImagenTraducida");

if (guardarImagenTraducida) {
    guardarImagenTraducida.addEventListener("click", () => {
        if (descargarValores == 1) {
            const imgTraducida = document.querySelector("#imgTraducida");
            convertirImagenABlob(imgTraducida);
        }
    });

}

function convertirImagenABlob(imgElement) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = imgElement.naturalWidth; // Usa naturalWidth para el tamaño original
    canvas.height = imgElement.naturalHeight;
    ctx.drawImage(imgElement, 0, 0);

    canvas.toBlob(function (blob) {
        enviarImagenAFlask(blob);
    }, "image/png"); // Puedes cambiar el tipo de MIME según sea necesario
}

function enviarImagenAFlask(blob) {
    const formData = new FormData();
    formData.append("imagen", blob, nombreArreglado);
    formData.append("idImagen", idImagen)

    fetch("/subir_imagen", {
        method: "POST",
        body: formData,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);

            console.log(data.estado);
            if (data.estado == 1) {
                alertModal("#00dfdf", "Imagen Guardada correctamente al servidor", "success",)
            } else {
                alertModal("#ff0055", "Al parece hubo un fallo al subir la imagen", "error",)
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

const pdfdescargar = document.querySelector("#pdfdescargar");

if (pdfdescargar) {
    pdfdescargar.addEventListener("click", () => {
        const text = texto.textContent;
        const tra = traduccion.textContent;
        const id = txtid12.value;
        const email = document.querySelector("#emailuser").value;
        const idimagen = idImagen;
        const nombre = hora();
        const origenIdioma = idiomaOrigen;
        const traduccionIdioma = idiomaTraduccion;
        const tipoArchivo = "pdf";
        let nameFinal = nombre.toString() + "resultadosTraduccion.pdf";
        crearArchivodoc(id, email, text, tra, idimagen, nameFinal, origenIdioma, traduccionIdioma, tipoArchivo);
    });
}

const descargartxt1 = document.querySelector("#descargartxt1");

if (descargartxt1) {
    descargartxt1.addEventListener("click", () => {
        const text = texto.textContent;
        const tra = traduccion.textContent;
        const id = txtid12.value;
        const email = document.querySelector("#emailuser").value;
        const idimagen = idImagen;
        const nombre = hora();
        const origenIdioma = idiomaOrigen;
        const traduccionIdioma = idiomaTraduccion;
        const tipoArchivo = "txt";
        let nameFinal = nombre.toString() + "resultadosTraduccion.txt";
        crearArchivodoc(id, email, text, tra, idimagen, nameFinal, origenIdioma, traduccionIdioma, tipoArchivo);
    });
}

async function crearArchivodoc(id, email, text, tra, idimagen, nameFinal, origen, traduccion, tipoArchivo) {
    const retorno = await EnviarTextoparaPdf(id, email, text, tra, idimagen, nameFinal, origen, traduccion, tipoArchivo);
    if (retorno == 1) {
        const retorno2 = await descargarArchivo1(nameFinal);
        if (retorno2 == 1) {
            alertModal("#00dfdf", "Descargando archivo", "success");
            const link = "https://repositorioprivado.onrender.com/eliminararchivos/" + nameFinal;
            eliminarRecurso(link);
        } else {
            alertModal("#ff0055", "Error al descargar el archivo.", "error",)
        }
    }
}


async function EnviarTextoparaPdf(id, correo, text, tra, idimagen, nombre, origen, traduccion, tipoArchivo) {
    retorno = 0;
    try {
        const response = await axios.post("https://repositorioprivado.onrender.com/creararchivo", {
            idresultado: String(id),
            idImagenResultado: String(idimagen),
            texto: String(text),
            traduccion: String(tra),
            correo: String(correo),
            nombre: String(nombre),
            idiomaOrigen: String(origen),
            idiomaTraduccion: String(traduccion),
            tipoArchivo: String(tipoArchivo)
        });
        // 
        retorno = 1;
    } catch (error) {
        console.error("Error al traducir la imagen:", error);
        retorno = 0;
    }

    return retorno;
}

async function descargarArchivo1(nameFile) {
    try {
        // Construimos la URL completa del endpoint
        const url2 = `https://repositorioprivado.onrender.com/descargararchivo/${nameFile}`;
        // Realizamos la petición fetch
        const response = await fetch(url2);

        // Verificamos si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error('Error al descargar la imagen');
        }

        // Obtenemos el blob de la imagen
        const blob = await response.blob();

        // Creamos un enlace para descargar la imagen
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nameFile;
        link.click();

        // Liberamos el objeto URL
        window.URL.revokeObjectURL(url);
        return 1;
    } catch (error) {
        console.error('Error:', error);
        return 0;
    }
}

function obtenerHoraActual() {
    let fecha = new Date();
    let horas = fecha.getHours();
    return horas;
}

function SaludoUsuario(nombre) {
    let hora = obtenerHoraActual();
    let cadena = "";

    if (hora < 12) {
        cadena = "Buenos Dias!! " + nombre;
    }
    if (hora > 12 && hora <= 18) {
        cadena = "Buenas Tardes!! " + nombre;
    }

    if (hora > 18 && hora < 24) {
        cadena = "Buenas Noches!! " + nombre;
    }

    document.querySelector("#txtSaludo").textContent = cadena;
}
window.onload = function () {
    const txtnombress = document.querySelector("#txtnombress").value;
    SaludoUsuario(txtnombress);
}

// EL ERROE ESTA EN FLUTTER
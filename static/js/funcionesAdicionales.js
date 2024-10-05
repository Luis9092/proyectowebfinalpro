

function hora() {
    const ahora = new Date();
    const dia = ahora.getDate();
    const mes = ahora.getMonth() + 1; // Los meses comienzan desde 0
    const anio = ahora.getFullYear();
    const horas = ahora.getHours();
    const minutos = ahora.getMinutes();
    const segundos = ahora.getSeconds();
    const milis = ahora.getMilliseconds();
    let formato = dia + mes + anio + horas + minutos + segundos + milis;
    return formato;
}


$('.botonF1').hover(function () {
    $('.btn').addClass('animacionVer');
})
$('.contenedorFlotante').mouseleave(function () {
    $('.btn').removeClass('animacionVer');
})

const modal = document.getElementById('myModal');
const openModal = document.getElementById('botonFlotanten');
const closeModal = document.getElementById('closeModal');
const closeButton = document.getElementById('closeButton');

openModal.onclick = function () {
    modal.style.display = 'flex';
}

closeModal.onclick = function () {
    modal.style.display = 'none';
}

closeButton.onclick = function () {
    modal.style.display = 'none';
}

window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}
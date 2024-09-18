

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
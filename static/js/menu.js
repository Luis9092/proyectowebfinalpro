const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const themeLabel = document.querySelector('.theme-label');
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const mainContent = document.querySelector('.main-content');



menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    // menuToggle.classList.toggle("abierto");
});



// Cerrar el menú al hacer clic fuera de él en dispositivos móviles
document.addEventListener('click', (e) => {
    const isMobile = window.innerWidth < 768;
    const sidebar = document.querySelector('#sidebar'); // Asegúrate de que tu selector sea correcto
    const menuToggle = document.querySelector('#menuToggle'); // Asegúrate de que tu selector sea correcto
    const togleicon = document.querySelector("#togleicon");
    if (isMobile && !sidebar.contains(e.target) && e.target !== menuToggle && e.target !== togleicon) {
        sidebar.classList.remove('open');
    }
});


// Ajustar el diseño al cambiar el tamaño de la ventana
// window.addEventListener('resize', () => {
//     if (window.innerWidth >= 768) {
//         sidebar.classList.remove('open');
//     }
// });

const modeToggle = body.querySelector("#switch-mode");

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark") {
    body.classList.toggle("dark");
}
// let getStatus = localStorage.getItem("status");
// if (getStatus && getStatus === "close") {
//     sidebar.classList.toggle("close");
// }

modeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    if (body.classList.contains("dark")) {
        localStorage.setItem("mode", "dark");
    } else {
        localStorage.setItem("mode", "light");
    }
});


var swiper = new Swiper(".swiper_inicio", {
    spaceBetween: 30,
    loop: true,
    effect: "fade",
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    autoplay: {
        delay: 4500,
        disableOnInteraction: false,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});
function whenReady(fn: () => void) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", fn);
    } else {
        fn();
    }
}

whenReady(() => {

    let mainNav = document.getElementById('navbar-menu');

    let navBarToggle = document.getElementById('navbar-toggle');


    navBarToggle.addEventListener('click', () => mainNav.classList.toggle('active'));
});

let buttons = document.querySelectorAll(`#js-triggers a`);
let menuButton = buttons[0];
let modalButton = buttons[1];

let nav = document.querySelector(`nav`);
let modalPanel = document.querySelector(`.modal-panel`);

menuButton.addEventListener(`click`, () => {
    let open = nav.style.maxHeight === `200px`;
    if (open === true) {
        nav.style.maxHeight = `0px`;
    } else {
        nav.style.maxHeight = `200px`;
    }
});

modalButton.addEventListener(`click`, () => {
    modalPanel.style.opacity = `1`;
    modalPanel.style.visibility = `visible`;
});

/* Click background to close modal */
modalPanel.addEventListener(`click`, (event) => {
    let background = event.target === modalPanel;

    if (background === true) {
        modalPanel.style.opacity = `0`;
        modalPanel.style.visibility = `hidden`;
    }
});

/* Press ESC to close modal */
document.addEventListener(`keydown`, (event) => {
    let esc = event.key === `Escape`;
    if (esc === true) {
        modalPanel.style.opacity = `0`;
        modalPanel.style.visibility = `hidden`;
    }
});

let sideTray = document.createElement(`div`);
sideTray.className = `side-tray`;
sideTray.innerHTML = nav.innerHTML; // Put menus from nav in side tray
document.body.appendChild(sideTray);

window.addEventListener(`resize`, () => {
    if (window.innerWidth < 736) {
        nav.style.display = `none`;
        sideTray.className = `side-tray`;
    } else {
        nav.style.display = `block`;
        nav.style.maxHeight = `0px`;
        sideTray.className = `side-tray`;
    }
});

menuButton.addEventListener(`click`, () => {
    if (window.innerWidth < 736) {
        let open = sideTray.className === `side-tray show`;
        if (open === true) {
            sideTray.className = `side-tray`;
        } else {
            sideTray.className = `side-tray show`;
        }
    }
});
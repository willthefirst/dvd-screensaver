const canvas = document.getElementById("dvd");
const ctx = canvas.getContext("2d");

const logo = new Image();
logo.src = "dvd-logo.svg";

ctx.fillStyle = "#000";
ctx.fillRect(0, 0, 1200, 900);

logo.onload = function () {
    ctx.drawImage(logo, 0, 0, 250, 150);
};

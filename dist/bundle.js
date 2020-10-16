(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var canvas = document.getElementById("dvd");
var ctx = canvas.getContext("2d");
var logo = new Image();
// Globals
var width = 900;
var height = 600;
var logoX = 1;
var logoY = 1;
var logoWidth = 250;
var logoHeight = 150;
var logoVector = {
    changeX: 3,
    changeY: 3
};
var init = function () {
    // Initialize logo
    logo.src = "images/dvd-logo.svg";
    window.requestAnimationFrame(draw);
};
var draw = function () {
    // Clear the canvas
    ctx.clearRect(0, 0, width, height);
    // Draw black background
    ctx.fillStyle = "#000";
    ctx.strokeStyle = "rgba(0, 153, 255, 0.4)";
    ctx.fillRect(0, 0, width, height);
    ctx.save();
    // Update the logo position
    updateLogo();
    // Draw the logo
    ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
    window.requestAnimationFrame(draw);
};
var updateLogo = function () {
    // Bounce off edges
    var atTopOrBot = logoY <= 0 || logoY + logoHeight >= height;
    var atLeftOrRight = logoX <= 0 || logoX + logoWidth >= width;
    // Update logo's direction if necessary
    if (atTopOrBot) {
        logoVector.changeY *= -1;
        changeColor();
    }
    if (atLeftOrRight) {
        logoVector.changeX *= -1;
        changeColor();
    }
    // Move logo along its vector
    logoX += logoVector.changeX;
    logoY += logoVector.changeY;
};
var changeColor = function () { };
init();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQU0sTUFBTSxHQUF1QixRQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2xFLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFcEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUV2QixVQUFVO0FBQ1YsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ2hCLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQztBQUNqQixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZCxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZCxJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUM7QUFDcEIsSUFBSSxVQUFVLEdBQUcsR0FBRyxDQUFDO0FBQ3JCLElBQUksVUFBVSxHQUFHO0lBQ2hCLE9BQU8sRUFBRSxDQUFDO0lBQ1YsT0FBTyxFQUFFLENBQUM7Q0FDVixDQUFDO0FBRUYsSUFBTSxJQUFJLEdBQUc7SUFDWixrQkFBa0I7SUFDbEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxxQkFBcUIsQ0FBQztJQUNqQyxNQUFNLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEMsQ0FBQyxDQUFDO0FBRUYsSUFBTSxJQUFJLEdBQUc7SUFDWixtQkFBbUI7SUFDbkIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUVuQyx3QkFBd0I7SUFDeEIsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7SUFDdkIsR0FBRyxDQUFDLFdBQVcsR0FBRyx3QkFBd0IsQ0FBQztJQUMzQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2xDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUVYLDJCQUEyQjtJQUMzQixVQUFVLEVBQUUsQ0FBQztJQUViLGdCQUFnQjtJQUNoQixHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUN6RCxNQUFNLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEMsQ0FBQyxDQUFDO0FBRUYsSUFBTSxVQUFVLEdBQUc7SUFDbEIsbUJBQW1CO0lBQ25CLElBQU0sVUFBVSxHQUFHLEtBQUssSUFBSSxDQUFDLElBQUksS0FBSyxHQUFHLFVBQVUsSUFBSSxNQUFNLENBQUM7SUFDOUQsSUFBTSxhQUFhLEdBQUcsS0FBSyxJQUFJLENBQUMsSUFBSSxLQUFLLEdBQUcsU0FBUyxJQUFJLEtBQUssQ0FBQztJQUUvRCx1Q0FBdUM7SUFDdkMsSUFBSSxVQUFVLEVBQUU7UUFDZixVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLFdBQVcsRUFBRSxDQUFDO0tBQ2Q7SUFFRCxJQUFJLGFBQWEsRUFBRTtRQUNsQixVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLFdBQVcsRUFBRSxDQUFDO0tBQ2Q7SUFFRCw2QkFBNkI7SUFDN0IsS0FBSyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUM7SUFDNUIsS0FBSyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUM7QUFDN0IsQ0FBQyxDQUFDO0FBRUYsSUFBTSxXQUFXLEdBQUcsY0FBTyxDQUFDLENBQUM7QUFFN0IsSUFBSSxFQUFFLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBjYW52YXMgPSA8SFRNTENhbnZhc0VsZW1lbnQ+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZHZkXCIpO1xuY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblxubGV0IGxvZ28gPSBuZXcgSW1hZ2UoKTtcblxuLy8gR2xvYmFsc1xubGV0IHdpZHRoID0gOTAwO1xubGV0IGhlaWdodCA9IDYwMDtcbmxldCBsb2dvWCA9IDE7XG5sZXQgbG9nb1kgPSAxO1xubGV0IGxvZ29XaWR0aCA9IDI1MDtcbmxldCBsb2dvSGVpZ2h0ID0gMTUwO1xubGV0IGxvZ29WZWN0b3IgPSB7XG5cdGNoYW5nZVg6IDMsXG5cdGNoYW5nZVk6IDNcbn07XG5cbmNvbnN0IGluaXQgPSAoKSA9PiB7XG5cdC8vIEluaXRpYWxpemUgbG9nb1xuXHRsb2dvLnNyYyA9IFwiaW1hZ2VzL2R2ZC1sb2dvLnN2Z1wiO1xuXHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xufTtcblxuY29uc3QgZHJhdyA9ICgpID0+IHtcblx0Ly8gQ2xlYXIgdGhlIGNhbnZhc1xuXHRjdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuXG5cdC8vIERyYXcgYmxhY2sgYmFja2dyb3VuZFxuXHRjdHguZmlsbFN0eWxlID0gXCIjMDAwXCI7XG5cdGN0eC5zdHJva2VTdHlsZSA9IFwicmdiYSgwLCAxNTMsIDI1NSwgMC40KVwiO1xuXHRjdHguZmlsbFJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cdGN0eC5zYXZlKCk7XG5cblx0Ly8gVXBkYXRlIHRoZSBsb2dvIHBvc2l0aW9uXG5cdHVwZGF0ZUxvZ28oKTtcblxuXHQvLyBEcmF3IHRoZSBsb2dvXG5cdGN0eC5kcmF3SW1hZ2UobG9nbywgbG9nb1gsIGxvZ29ZLCBsb2dvV2lkdGgsIGxvZ29IZWlnaHQpO1xuXHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xufTtcblxuY29uc3QgdXBkYXRlTG9nbyA9ICgpID0+IHtcblx0Ly8gQm91bmNlIG9mZiBlZGdlc1xuXHRjb25zdCBhdFRvcE9yQm90ID0gbG9nb1kgPD0gMCB8fCBsb2dvWSArIGxvZ29IZWlnaHQgPj0gaGVpZ2h0O1xuXHRjb25zdCBhdExlZnRPclJpZ2h0ID0gbG9nb1ggPD0gMCB8fCBsb2dvWCArIGxvZ29XaWR0aCA+PSB3aWR0aDtcblxuXHQvLyBVcGRhdGUgbG9nbydzIGRpcmVjdGlvbiBpZiBuZWNlc3Nhcnlcblx0aWYgKGF0VG9wT3JCb3QpIHtcblx0XHRsb2dvVmVjdG9yLmNoYW5nZVkgKj0gLTE7XG5cdFx0Y2hhbmdlQ29sb3IoKTtcblx0fVxuXG5cdGlmIChhdExlZnRPclJpZ2h0KSB7XG5cdFx0bG9nb1ZlY3Rvci5jaGFuZ2VYICo9IC0xO1xuXHRcdGNoYW5nZUNvbG9yKCk7XG5cdH1cblxuXHQvLyBNb3ZlIGxvZ28gYWxvbmcgaXRzIHZlY3RvclxuXHRsb2dvWCArPSBsb2dvVmVjdG9yLmNoYW5nZVg7XG5cdGxvZ29ZICs9IGxvZ29WZWN0b3IuY2hhbmdlWTtcbn07XG5cbmNvbnN0IGNoYW5nZUNvbG9yID0gKCkgPT4ge307XG5cbmluaXQoKTtcbiJdfQ==

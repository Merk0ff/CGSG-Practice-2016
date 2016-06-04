/**
 * Created by pd6 on 04.06.2016.
 */

var MousX = 0, MousY = 0, IsDrag = 0;
var MouseXLast = 0, MouseYLast = 0;

function mouse_move() {
    var ev = window.event;
    if (IsDrag) {
        var DeltaX, DeltaY;
        DeltaX = ev.clientX - MouseXLast;
        DeltaY = ev.clientY - MouseYLast;
        MousX += DeltaX;
        MousY += DeltaY;
    }

    MouseXLast = ev.clientX;
    MouseYLast = ev.clientY;
}

function mouse_position() {
    IsDrag = 1;
}

function mouse_drop() {
    IsDrag = 0;
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

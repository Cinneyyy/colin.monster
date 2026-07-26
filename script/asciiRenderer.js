const asciiSeq = " .'-_~*#@";

function getBrightness(r, g, b) {
    return 0.299*r + 0.587*g + 0.114*b;
}

function getAsciiChar(r, g, b) {
    return asciiSeq[Math.round((asciiSeq.length-1) * getBrightness(r, g, b))];
}

function getAsciiRender(w, h) {

}

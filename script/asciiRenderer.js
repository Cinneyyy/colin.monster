{
    const asciiSeq = " .'-_~*#@";
    const params = {
        srcImg: "img/ascii_art/an_iq_too_high.png"
    }

    const canvas = new HTMLCanvasElement();
    const context = canvas.getContext("2d");
    const image = new Image();
    image.src = params.srcImg;
    image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);

        // TODO: get pixel data
    }

    function getBrightness(r, g, b) {
        return 0.299*r + 0.587*g + 0.114*b;
    }

    function getAsciiChar(r, g, b) {
        return asciiSeq[Math.round((asciiSeq.length-1) * getBrightness(r, g, b))];
    }

    function getAsciiRender() {
    }
}

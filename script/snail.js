let makeSnailEepy = false;

{
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.zIndex = "10";
    canvas.style.pointerEvents = "none";

    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    let mouseX = window.innerWidth/2;
    let mouseY = window.innerHeight/2;
    let canvasX = mouseX;
    let canvasY = mouseY;

    const size = 100;
    const displaySize = 35;
    const speed = 0.01;

    canvas.width = size;
    canvas.height = size;

    const displaySizeCss = `${displaySize}px`;
    canvas.style.width = displaySizeCss;
    canvas.style.height = displaySizeCss;

    const image = new Image();
    image.src = "/img/snail/snail.svg";

    let calledDraw = false;
    onmousemove = e => {
        [mouseX, mouseY] = [e.clientX, e.clientY];

        if(!calledDraw) {
            calledDraw = true;
            draw();
        }
    }

    function draw() {
        if(makeSnailEepy) {
            canvas.remove();
            onmousemove = null;
            return;
        }

        const dx = mouseX - canvasX - displaySize/2;
        const dy = mouseY - canvasY;

        canvasX += dx * speed;
        canvasY += dy * speed;

        canvas.style.left = `${canvasX}px`;
        canvas.style.top = `${canvasY}px`;

        ctx.clearRect(0, 0, size, size);
        if(dx > 0) {
            ctx.save();
            ctx.translate(size, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(image, 0, 0, size, size);
            ctx.restore();
        }
        else {
            ctx.drawImage(image, 0, 0, size, size);
        }

        window.requestAnimationFrame(draw);
    }
}

{
    class CanvasImage {
        static minLifetime = 50;

        constructor(canvas, ctx, initTick, img, pos, size, vel, sineDev, sineFreq) {
            this.canvas = canvas;
            this.ctx = ctx;
            this.initTick = initTick;
            this.img = img;
            this.pos = pos;
            this.size = size;
            this.vel = vel;
            this.sineDev = sineDev;
            this.sineFreq = sineFreq;
            this.sinePhase = Math.random() * Math.PI * 2;
            this.sineAxis = {
                x: -vel.y,
                y: vel.x
            };
            this.sineOffset = {
                x: 0,
                y: 0
            };
        }

        remove(ticks) {
            if((ticks - this.initTick) < CanvasImage.minLifetime) {
                return false;
            }

            return this.pos.x > this.canvas.width
                || this.pos.y > this.canvas.height
                || this.pos.x + this.size < 0
                || this.pos.y + this.size < 0;
        }

        tick(ticks) {
            this.pos.x += this.vel.x;
            this.pos.y += this.vel.y;

            const sin = Math.sin((ticks - this.initTick) * this.sineFreq + this.sinePhase) * this.sineDev;
            this.sineOffset = {
                x: this.sineAxis.x * sin,
                y: this.sineAxis.y * sin
            }
        }

        draw() {
            this.ctx.drawImage(this.img, this.pos.x + this.sineOffset.x, this.pos.y + this.sineOffset.y, this.size, this.size);
        }
    }

    class Canvas {
        constructor(id, isFg, params) {
            for(let i = 0; i < params.length; i++) {
                params[i].img = new Image();
                params[i].img.src = params[i].imgSrc;
            }

            this.params = params;

            this.canvas = document.getElementById(id); 
            this.ctx = this.canvas.getContext("2d");
            this.ticks = 0;
            this.isFg = isFg;

            this.images = [];

            window.addEventListener("resize", () => this.resize());
            this.resize();
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        draw(skipDraw) {
            for(let i = 0; i < this.params.length; i++) {
                const param = this.params[i];

                if(Math.random() < param.chance) {
                    const dist = rand(param.dist);
                    const size = rand(param.size) / dist;

                    const paramPos = structuredClone(param.pos);
                    for(let j = 0; j < paramPos.x.length; j++) {
                        if(paramPos.x[j] == 0) {
                            paramPos.x[j] = -size;
                        }
                        else if(paramPos.x[j] == 1) {
                            paramPos.x[j] = this.canvas.width;
                        }
                    }
                    for(let j = 0; j < paramPos.y.length; j++) {
                        if(paramPos.y[j] == 0) {
                            paramPos.y[j] = -size;
                        }
                        else if(paramPos.y[j] == 1) {
                            paramPos.y[j] = this.canvas.height;
                        }
                    }

                    const pos = {
                        x: rand(paramPos.x),
                        y: rand(paramPos.y)
                    }

                    const vel = {
                        x: rand(param.vel.x) / dist,
                        y: rand(param.vel.y) / dist
                    };

                    const sineDev = rand(param.sineDev) / dist;
                    const sineFreq = rand(param.sineFreq) * Math.sqrt(vel.x*vel.x + vel.y*vel.y);

                    this.images.push(new CanvasImage(this.canvas, this.ctx, this.ticks, param.img, pos, size, vel, sineDev, sineFreq));
                }
            }

            for(let i = 0; i < this.images.length; i++) {
                this.images[i].tick(this.ticks);

                if(this.images[i].remove()) {
                    this.images.splice(i, 1);
                    i--;
                }
            }

            this.ticks++;
            if(skipDraw) {
                return;
            }

            if(this.isFg) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
            else {
                this.ctx.fillStyle = "#113c82";
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }

            for(const img of this.images) {
                img.draw();
            }

            if(!this.isFg) {
                this.ctx.fillStyle = "#113c82a0";
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }

            window.requestAnimationFrame(() => this.draw(false));
        }
    }

    function lerp(t, min, max) {
        if(min == max) {
            return min;
        }

        return (max - min) * t + min;
    }

    function rand(minMax) {
        if(minMax.length == 1) {
            return minMax[0];
        }

        return lerp(Math.random(), minMax[0], minMax[1]);
    }

    // const param = {
    //     chance: 0,
    //     dist: [0, 0],
    //     size: [0, 0],
    //     pos: {
    //         x: [0, 0],
    //         y: [0, 0]
    //     },
    //     vel: {
    //         x: [0, 0],
    //         y: [0, 0]
    //     },
    //     sineDev: [0, 0],
    //     sineFreq: [0, 0],
    //     imgSrc: ""
    // }

    const funnySine = Math.random() < 0.05;

    const bgCanvas = new Canvas("bg-canvas", false, [
        // Bubbles 
        {
            chance: 0.03,
            dist: [5, 18],
            size: [325, 375],
            pos: {
                x: [0, 1],
                y: [1]
            },
            vel: {
                x: [0],
                y: [-12, -17]
            },
            sineDev: funnySine ? [300] : [100, 150],
            sineFreq: funnySine ? [0.07] : [0.008, 0.015],
            imgSrc: "/img/fish/bubble.png"
        },
        // Fish LtR
        {
            chance: 0.01,
            dist: [5, 13],
            size: [330, 400],
            pos: {
                x: [0],
                y: [0, 1]
            },
            vel: {
                x: [15, 30],
                y: [0]
            },
            sineDev: funnySine ? [200] : [20, 40],
            sineFreq: funnySine ? [0.05] : [0.008, 0.015],
            imgSrc: "/img/fish/fish_right.png"
        },
        // Fish RtL
        {
            chance: 0.01,
            dist: [5, 13],
            size: [330, 400],
            pos: {
                x: [1],
                y: [0, 1]
            },
            vel: {
                x: [-30, -15],
                y: [0]
            },
            sineDev: funnySine ? [200] : [20, 40],
            sineFreq: funnySine ? [0.05] : [0.008, 0.015],
            imgSrc: "/img/fish/fish_left.png"
        }
    ]);

    const fgCanvas = new Canvas("fg-canvas", true, [
        // Bubbles 
        {
            chance: 0.008,
            dist: [1.5, 4.5],
            size: [150, 200],
            pos: {
                x: [0, 1],
                y: [1]
            },
            vel: {
                x: [0],
                y: [-12, -17]
            },
            sineDev: funnySine ? [150] : [10, 25],
            sineFreq: funnySine ? [0.01] : [0.004, 0.008],
            imgSrc: "/img/fish/bubble.png"
        },
        // Fish LtR
        {
            chance: 0.005,
            dist: [1.5, 4.5],
            size: [170, 220],
            pos: {
                x: [0],
                y: [0, 1]
            },
            vel: {
                x: [15, 30],
                y: [0]
            },
            sineDev: funnySine ? [150] : [5, 13],
            sineFreq: funnySine ? [0.01] : [0.0025, 0.0065],
            imgSrc: "/img/fish/fish_right.png"
        },
        // Fish RtL
        {
            chance: 0.005,
            dist: [1.5, 4.5],
            size: [170, 220],
            pos: {
                x: [1],
                y: [0, 1]
            },
            vel: {
                x: [-30, -15],
                y: [0]
            },
            sineDev: funnySine ? [150] : [5, 13],
            sineFreq: funnySine ? [0.01] : [0.0025, 0.0065],
            imgSrc: "/img/fish/fish_left.png"
        }
    ]);

    const preSimulation = 0;//512;
    for(let i = 0; i < preSimulation; i++) {
        bgCanvas.draw(true);
        fgCanvas.draw(true);
    }

    bgCanvas.draw(false);
    fgCanvas.draw(false);
}

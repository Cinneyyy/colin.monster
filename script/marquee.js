{
    function image(src) {
        return `<img src='${src}' style='width: 40px; height: 40px; margin-top: 5px; margin-right: 10px; image-rendering: pixelated;'>`;
    }

    const strings = [
        "‼️ SITE UNDER CONSTRUCTION ‼️",
        ":3",
        "<a href='/'>www.colin.monster</a>",
        image("img/pfp.png").repeat(3),
        "Crazy? I was crazy once. They put me in a room. A rubber room. A rubber room with rats. And rats make me crazy. ".repeat(12), // 12, underrated number btw
        "🎷🐈 🎷🦍 🎷🦓 🎷🐛 🎷🐇 🎷🐓 🎷🦜 🎷🐠 🎷🪱 🎷🐌",
        "🏳️‍🌈🏳️‍⚧️",
        ["rainbow", "bisexual", "transgender", "non_binary"].map(p => image(`img/pride/${p}.png`)).join(""),
        "Rock and Stone!",
        "No mind to think.",
        "Despite everything, it's still you.",
        "I'm the original&emsp;&emsp;&emsp;<span style='color: yellow;'>Starwalker.</span>",
        "<img src='/img/asset/button_ut-88x31.gif' style='width: 88px; height: 31px; margin-top: 9.5px; image-rendering: pixelated;'>"
    ];

    const seconds = 10;
    const element = document.getElementById("marquee-content");

    let lastIndex = -1;

    function startMarquee(stringIndex) {
        for(const anim of element.getAnimations()) {
            anim.cancel();
        }

        if(stringIndex == null) {
            do {
                stringIndex = Math.floor(Math.random() * strings.length);
            }
            while(stringIndex == lastIndex && strings.length > 1);
        }

        lastIndex = stringIndex;
        element.innerHTML = strings[stringIndex];

        element.animate(
            [
                {
                    transform: "translateX(-100%)"
                },
                {
                    transform: "translateX(0%)"
                }
            ],
            {
                duration: (seconds-1) * 1000,
                iterations: 1,
                easing: "linear"
            }
        )
    }

    startMarquee(0);
    setInterval(() => startMarquee(null), seconds * 1000);
}

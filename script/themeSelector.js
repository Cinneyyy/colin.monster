const root = document.documentElement.style;

// Color scheme
{
    const colorSchemes = [
        {
            name: "purple",
            bgImage: "purple.webp",
            bgDarkCol: "#200050",
            bgLightCol: "#420069",
            borderCol: "#a010d2",
            textCol: "#eebbff"
        },
        {
            name: "gold",
            bgImage: "gold.webp",
            bgDarkCol: "#493900",
            bgLightCol: "#8c6f09",
            borderCol: "#fcc90f",
            textCol: "#ffdda0"
        },
        {
            name: "blue",
            bgImage: "blue.webp",
            bgDarkCol: "#022486",
            bgLightCol: "#1a5090",
            borderCol: "#41a2f0",
            textCol: "#80cff0"
        },
        {
            name: "red",
            bgImage: "red.svg",
            bgDarkCol: "#1a0005",
            bgLightCol: "#350413",
            borderCol: "#ff40af",
            textCol: "#ff6b9f"
        },
        {
            name: "grey",
            bgImage: "grey.webp",
            bgDarkCol: "#101010",
            bgLightCol: "#353535",
            borderCol: "#bbbbbb",
            textCol: "#bbbbbb"
        },
        {
            name: "green",
            bgImage: "green.webp",
            bgDarkCol: "#031701",
            bgLightCol: "#092d01",
            borderCol: "#93eb70",
            textCol: "#a2cc90"
        }
    ];

    const scheme = colorSchemes[Math.floor((Math.random() * colorSchemes.length))];

    root.setProperty("--scheme-border-color", scheme.borderCol);
    root.setProperty("--scheme-text-color", scheme.textCol);
    root.setProperty("--scheme-bg-dark-color", scheme.bgDarkCol);
    root.setProperty("--scheme-bg-light-color", scheme.bgLightCol);
    root.setProperty("--scheme-bg-image", `url("img/background/${scheme.bgImage}")`);
}

// List style
{
    const listStyles = [
        ["disc", 1.25],
        ["square", 1.25],
        ["armenian", 2.25],
        ["decimal", 2.1],
        ["georgian", 1.75],
        ["hebrew", 1.5],
        ["lower-alpha", 1.25],
        ["upper-alpha", 1.25],
        ["lower-greek", 1.25],
        ["lower-roman", 3],
        ["upper-roman", 3],
        ["hiragana", 1.5],
        ["katakana", 1.5],
        ["cjk-ideographic", 1.5]
    ];

    const listStyle = listStyles[Math.floor(Math.random() * listStyles.length)];
    root.setProperty("--list-style", listStyle[0]);
    root.setProperty("--list-marker-width", `${listStyle[1]}em`);
}

// Waow font
{
    const waowFonts = [
        "kingstone",
        "papyrus",
        "poland-canned-into-kaito",
        "sabily",
        "dazzle-ships"
    ];

    root.setProperty("--waow-font", waowFonts[Math.floor(Math.random() * waowFonts.length)]);
}

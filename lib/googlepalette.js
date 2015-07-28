define([], function () {
    /*
     * 
     * 
     */
    // return array of colors, length is inputed number (base_colors repeats)
    // Extracted from rgbcolor.js in the Retina communities directory.
    // rgbcolor.js is a (small) library rgb-color.js
    // It appears that this was just added to that library. 
    function GooglePalette(num)
    {
        var base_colors = [
            "#3366cc",
            "#dc3912",
            "#ff9900",
            "#109618",
            "#990099",
            "#0099c6",
            "#dd4477",
            "#66aa00",
            "#b82e2e",
            "#316395",
            "#994499",
            "#22aa99",
            "#aaaa11",
            "#6633cc",
            "#e67300",
            "#8b0707",
            "#651067",
            "#329262",
            "#5574a6",
            "#3b3eac",
            "#b77322",
            "#16d620",
            "#b91383",
            "#f4359e",
            "#9c5935",
            "#a9c413",
            "#2a778d",
            "#668d1c",
            "#bea413",
            "#0c5922",
            "#743411"
        ];

        if ((!num) || (num === 0)) {
            return base_colors;
        }

        var num_colors = [];
        for (var i = 0; i < num; i++) {
            var c_index = i % base_colors.length;
            num_colors.push(base_colors[c_index]);
        }
        return num_colors;
    };
    return GooglePalette;
});
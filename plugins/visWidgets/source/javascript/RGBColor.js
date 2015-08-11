/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define(['jquery'],
    function ($) {
        'use strict';
        // A constructor.
        var RGBColor = function (r, g, b) {
            this.r = r;
            this.g = g;
            this.b = b;
        };
        // Make a nice, pure, prototype
        var base = Object.create(null, {
            asString: {
                value: function () {
                    return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
                }
            },
            asStringWithAlpha: {
                value: function (alpha) {
                    return "rgba(" + this.r + "," + this.g + "," + this.b + ',' + alpha + ")";
                }
            },
            invert: {
                value: function () {
                    return new RGBColor(255 - this.r, 255 - this.g, 255 - this.b);
                }
            },            
            darkenBy: {
                value: function (amount) {
                    var darker = new RGBColor(this.r, this.g, this.b);

                    darker.r -= amount;
                    darker.g -= amount;
                    darker.b -= amount;

                    if (darker.r < 0) {
                        darker.r = 0;
                    }

                    if (darker.g < 0) {
                        darker.g = 0;
                    }

                    if (darker.b < 0) {
                        darker.b = 0;
                    }

                    return darker;
                }
            },
            lightenBy: {
                value: function (amount) {
                    var lighter = new RGBColor(this.r, this.g, this.b);

                    lighter.r += amount;
                    lighter.g += amount;
                    lighter.b += amount;

                    if (lighter.r > 255) {
                        lighter.r = 255;
                    }

                    if (lighter.g > 255) {
                        lighter.g = 255;
                    }

                    if (lighter.b > 255) {
                        lighter.b = 255;
                    }

                    return lighter;
                }
            },
            subtract: {
                value: function (c) {
                    return new RGBColor(this.r - c.r, this.g - c.g, this.b - c.b);
                }
            },
            rgbFromString: {
                value: function (string) {
                    var $div = $.jqElem('div').css('background-color', string);
                    var rgb = $div.css('background-color');
                    var m = rgb.match(/rgb\((\d+), (\d+), (\d+)\)/);
                    if (m) {
                        return {
                            r: +m[1],
                            g: +m[2],
                            b: +m[3]
                        };
                    }
                }
            }
        });
        // They get married!
        // (I know, funky, but it beats setting the prototype properties directly...)
        RGBColor.prototype = base;
        return RGBColor;
    });
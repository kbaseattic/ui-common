/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define(['kb_vis_rectangle', ],
    function (Rectangle) {

        'use strict';

        function Point(x,y) {
            this.x = x;
            this.y = y;
        }

        Point.prototype.asString = function () {
            return "{" + this.x + ", " + this.y + "}";
        }

        Point.prototype.offset = function(dx, dy) {
            return new Point(this.x + dx, this.y + dy);
        }

        Point.prototype.rectWithPoint = function(point) {

            var ux = this.x < point.x
                ? this.x
                : point.x;
            var uy = this.y < point.y
                ? this.y
                : point.y;

            var width = Math.abs(this.x - point.x);
            var height = Math.abs(this.y - point.y);

            return new Rectangle(
                new Point(ux, uy),
                new Size (width, height)
            );
        }

        return Point;
    }
);

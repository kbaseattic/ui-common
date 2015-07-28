/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define([], function () {
    'use strict';

    // Date formatting
    function niceElapsedTime(dateObj, nowDateObj) {
        var date, now;
        if (typeof dateObj === 'string') {
            date = new Date(dateObj);
        } else if (typeof dateObj === 'number') {
            date = new Date(dateObj);
        } else {
            date = dateObj;
        }
        if (nowDateObj === undefined) {
            now = new Date();
        } else if (typeof nowDateObj === 'string') {
            now = new Date(nowDateObj);
        } else {
            now = nowDateObj;
        }

        var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        var elapsed = Math.round((now.getTime() - date.getTime()) / 1000);
        var elapsedAbs = Math.abs(elapsed);

        // Within the last 7 days...
        if (elapsedAbs < 60 * 60 * 24 * 7) {
            if (elapsedAbs === 0) {
                return 'now';
            }
            var measure, measureAbs, unit;
            if (elapsedAbs < 60) {
                measure = elapsed;
                measureAbs = elapsedAbs;
                unit = 'second';
            } else if (elapsedAbs < 60 * 60) {
                measure = Math.round(elapsed / 60);
                measureAbs = Math.round(elapsedAbs / 60);
                unit = 'minute';
            } else if (elapsedAbs < 60 * 60 * 24) {
                measure = Math.round(elapsed / 3600);
                measureAbs = Math.round(elapsedAbs / 3600);
                unit = 'hour';
            } else if (elapsedAbs < 60 * 60 * 24 * 7) {
                measure = Math.round(elapsed / (3600 * 24));
                measureAbs = Math.round(elapsedAbs / (3600 * 24));
                unit = 'day';
            }

            if (measureAbs > 1) {
                unit += 's';
            }

            var prefix = null, suffix = null;
            if (measure < 0) {
                prefix = 'in';
            } else if (measure > 0) {
                suffix = 'ago';
            }

            return (prefix ? prefix + ' ' : '') + measureAbs + ' ' + unit + (suffix ? ' ' + suffix : '');
        }
        // otherwise show the actual date, with or without the year.
        if (now.getFullYear() === date.getFullYear()) {
            return shortMonths[date.getMonth()] + " " + date.getDate();
        }
        return shortMonths[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
    }

    /**
     * Displays a friendly timestamp, with full date and time details
     * down to the minute, in local time.
     * 
     * @function niceTimestamp
     * 
     * @params {string|number|Date} - A date in either a Date object
     * or a form that can be converted by the Date constructor.
     * 
     * @returns {string} a friendly formatted timestamp.
     * 
     * @static
     */
    function niceTime(dateObj) {
        var date, time;
        if (typeof dateObj === 'string') {
            date = new Date(dateObj);
        } else if (typeof dateObj === 'number') {
            date = new Date(dateObj);
        } else {
            date = dateObj;
        }

        var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var minutes = date.getMinutes();
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (date.getHours() >= 12) {
            if (date.getHours() !== 12) {
                time = (date.getHours() - 12) + ":" + minutes + "pm";
            } else {
                time = "12:" + minutes + "pm";
            }
        } else {
            time = date.getHours() + ":" + minutes + "am";
        }
        return shortMonths[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " at " + time;
    }

    /**
     * Given a number, formats it in a manner appropriate for 
     * representing a file size. It uses recognizable units, 
     * bytes, K, M, G, T and attempts to show at meaningful scale.
     * 
     * @function fileSizeFormat
     * 
     * @params {num} - the size of the file
     * 
     * @returns {string} a formatted string representing the size of the
     * file in recognizable units.
     * 
     * @static
     * 
     * @todo complete, test
     * @todo there is a complete version somewhere else 
     */
    function fileSize(number) {
        var num;
        if (typeof num === 'string') {
            num = parseInt(number, 10);
        } else {
            num = number;
        }

        var pieces = [], group;
        while (num > 0) {
            group = num % 1000;
            pieces.unshift(String(group));
                num = Math.floor(num / 1000);
            if (num > 0) {
                pieces.unshift(',');
            }
        }
        return pieces.join('') + ' bytes';
    }

    return {
        niceElapsedTime: niceElapsedTime,
        niceTime: niceTime,
        fileSize: fileSize
    };

});
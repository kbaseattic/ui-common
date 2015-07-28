/*
 * Pop-it menu- Dynamic Drive (www.dynamicdrive.com). This notice MUST
 * stay intact for legal use Visit http://www.dynamicdrive.com/ for full
 * source code.
 */
/*global
 define, console
 */
/*jslint
 browser: true,
 white: true
 */
define([], function () {
    'use strict';
    /*
    document.write('<style type="text/css"><!-- \
	#popdiv { \
	  position: absolute; \
	  background-color: #fcfcfc; \
	  border: 1px solid #CCC; \
	  z-index: 100; \
	  visibility: hidden; \
	  font-size: 12px;\
	} \
	table {\
	  font-size: 12px;\
	} \
- - ></style>');
*/


    var listenEvent = function (o, e, f) {
        if (o.addEventListener) {
            o.addEventListener(e, f, false);
        } else {
            o.attachEvent('on' + e, f);
        }
    };

    var popmenu = function () {
        var ie = document.all && !window.opera;
        var timeout, pmo = null, timeBeg;
        var w3c_contains = function (a, b) { // Determines if 1 element in contained in another- by Brainjar.com	
            while (b.parentNode) {
                b = b.parentNode;
                if (b === a) {
                    return true;
                }
            }
            return false;
        };
        this.createMenu = function (clickHandler) {
            //pmo = $('<div id="popdiv" style="position: absolute; background-color: #fcfcfc; border: 1px solid #ccc; z-index: 100; visibility: hidden; font-size: 12px;"></div>');
            //pmo.on('mouseover', popmenu.clear);
            //pmo.on('mouseout', popmenu.autoHide);
            pmo = document.createElement("div");
            pmo.setAttribute("id", "popdiv");
            pmo.style.position = 'absolute';
            pmo.style.backgroundColor = '#fcfcfc';
            pmo.style.border = '1px solid #ccc';
            pmo.style.zIndex = '100';
            pmo.style.visibility = 'hidden';
            pmo.style.fontSize = '12px';
            pmo.onmouseover = popmenu.clear;
            listenEvent(pmo, 'mouseout', popmenu.autoHide);
            listenEvent(pmo, 'click', clickHandler);
            document.body.appendChild(pmo);
            // $(document.body).append(pmo);
        };
        this.clear = function () {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
        this.hide = function () {
            if (pmo) {
                pmo.style.visibility = "hidden";
            }
        };
        this.delayedHide = function () {
            timeout = setTimeout(function () {
                popmenu.hide();
            }, 500);
        };
        this.clickHide = function (e) {
            if (timeBeg && (new Date().getTime()) - timeBeg > 500 && pmo
                && (e.pageX < pmo.offsetLeft || e.pageX > pmo.offsetLeft + pmo.offsetWidth
                    || e.pageY < pmo.offsetTop || e.pageY > pmo.offsetTop + pmo.offsetHeight)) {
                popmenu.hide(e);
            }
        };
        this.autoHide = function (e) {
            if (ie && !pmo.contains(e.toElement)) {
                popmenu.hide();
            } else if (e.currentTarget !== e.relatedTarget && !w3c_contains(e.currentTarget, e.relatedTarget)) {
                popmenu.hide();
            }
        };
        this.show = function (e, which, optWidth, clickHandler) {
            var ieo = (document.compatMode && document.compatMode.indexOf("CSS") !== -1) ?
                document.documentElement : document.body;
            this.clear();
            if (pmo === null) {
                this.createMenu(clickHandler);
            }
            pmo.innerHTML = which;
            pmo.style.width = (optWidth === undefined) ? optWidth : "150px";
            var eventX = ie ? event.clientX : e.clientX;
            var eventY = ie ? event.clientY : e.clientY;
            // Find out how close the mouse is to the corner of the window
            var rightedge = ie ? ieo.clientWidth - eventX : window.innerWidth - eventX;
            var bottomedge = ie ? ieo.clientHeight - eventY : window.innerHeight - eventY;
            // if the horizontal distance isn't enough to accomodate the width of the context menu
            if (rightedge < pmo.offsetWidth) { // then move the horizontal position of the menu to the left by it's width
                pmo.style.left = (ie ? ieo.scrollLeft : window.pageXOffset) + eventX - pmo.offsetWidth + "px";
            } else { // then position the horizontal position of the menu where the mouse was clicked
                pmo.style.left = (ie ? ieo.scrollLeft : window.pageXOffset) + eventX + "px";
            }
            //same concept with the vertical position
            if (bottomedge < pmo.offsetHeight) {
                pmo.style.top = (ie ? ieo.scrollTop : window.pageYOffset) + eventY - pmo.offsetHeight + "px";
            } else {
                pmo.style.top = (ie ? ieo.scrollTop : window.pageYOffset) + eventY + "px";
            }
            pmo.style.visibility = "visible";
            timeBeg = new Date().getTime();
        };
    };

    // Install the window-wide 'click' event in order to hide the popmenu if it is showing.
    listenEvent(window, 'click', popmenu.clickHide);

    return new popmenu();
});
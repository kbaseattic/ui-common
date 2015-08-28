/*global
 define, console
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'kb.html'
], function (html) {
    'use strict';
    function factory(config) {
        var widgets = [];

        function addFactoryWidget(name, widget) {
            var id = html.genId();
            widgets.push({
                name: name,
                widget: widget.create(),
                id: id
            });
            return id;
        }

        /*function addFactoryWidget(name, widget, params) {
         // Create a container node. We need to be able to render
         // default content in case the widget can't render for 
         // some reason.
         // Note that we are just creating a procedure for attaching
         // the widget -- the dom may not be ready yet.
         var id = html.genId(),
         W;
         try {
         W = widget.create(params);
         } catch (e) {
         W = ErrorWidget.create({
         exception: e,
         from: 'addFactoryWidget'
         });
         }
         // Wrap each widget in a widget connector, if need be. 
         // We do this so we can use different types of widgets.
         // The raw widget can be attached here if it complies
         // with the widget spec.
         widgets[name] = {
         widget: W,
         id: id,
         attach: W.attach,
         detach: W.detach,
         start: W.start,
         stop: W.stop
         };
         
         return id;
         }
         */
        function getWidgets() {
            return widgets;
        }
        return {
            addFactoryWidget: addFactoryWidget,
            getWidgets: getWidgets
        };
    }

    return {
        make: function (config) {
            return factory(config);
        }
    };
});
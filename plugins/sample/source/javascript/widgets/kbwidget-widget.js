/*global
 define, console
 */
/*jslint
 browser: true,
 white: true
 */
/* DOC: sample kbase widget
 * This is a sample, bare-bones kbase widget.
 * It represents a "hello world" in the form of a kbase widget.
 * Note that it does not contain any code relevant to the new widget interface.
 * This is because we are not attempting to change to the kbase widget api
 * (yet) to adhere to this interface.
 * Rather, the widget manager (typically a Panel) will reference the widget 
 * through a proxy object known as a widget adapter. This adapter implements the
 * widget interface, and knows how to invoke a kbwidget.
 */

/* DOC: dependencies
 * A kbwidget is implemented as a form of jquery plugin. As such, the core widget
 * has a dependency on jquery.
 * 
 * Additionally, a KBase widget will need to reference a "parent widget". The parent
 * widget is provided as a string in to the KBWidget constructor function, and the
 * module that defines this widget must be provided as a dependency as well.
 * However,  the base widget module does not return an object, rather it 
 * modifies the global jquery object (which in this case is the jquery module)
 * to add itself. 
 * Thus note that we do not have an argument in the module function to matche
 * the base widget module. (We could include it, but it would give us an 
 * unused variable warning in the ide or jslint)
 * 
 * TODO: see kbwidget documentation for a listing of all base widgets and what
 * TODO: they provide to the sub-widget.
 */
define([
    'jquery',
    
    'kb.jquery.authenticatedwidget'
],
    function ($) {
        /* DOC: strict mode
         * As required by the kbase coding standards, we use strict mode in all
         * AMD modules.
         */
        'use strict';
        $.KBWidget({
            /* DOC: widget name
             * 
             */
            name: 'SampleWidget',
            
            /* DOC: base widget name
             * This name is used by the kbase widget to create a jquery object
             * of the same name. After the widget is created it will be available
             * as a jquery plugin with this same name.
             */
            parent: 'kbaseAuthenticatedWidget',
            
            /* DOC: version
             * 
             */
            version: '0.0.1',
            
            /* DOC options
             * 
             */
            options: {
                param1: 'default param1 value'
            },
            
            /* DOC: init function 
             * The init function is the only method that needs to be implemented
             * in the widget api. The parent widget will have handled the 
             * interface with the jquery plugin api to populate properties and
             * provide methods that will be available on the "this" context 
             * object.
             * Note that options passed 
             */
            init: function (options) {
                
                /* DOC: call parent
                 * The kbase widget object provides a object inheritance system,
                 * which allows this (sub) widget to interact in the object
                 * hierarachy. One requirement of this is that this widget 
                 * invoke the _super method, which will invoke the parent
                 * widget. 
                 * This is particularly important in the handling of options,
                 * where are incorporated into this object via a specialized
                 * attribute system with getters and setters.
                 */
                this._super(options);
                
                /* DOC: delegete render to a method
                 * In order to reduce the complexity of the init function 
                 * content rendering is delegated to a helper method.
                 */
                this.render();
                
                /* DOC: return "this" to enable chaining
                 * 
                 */
                return this;
            },
            
            /* DOC: render function
             */
            render: function () {

                /* DOC: "magic" object properties
                 * Since this widget is created in the context of a super-widget, 
                 * it inherits properties from that context. A very important one
                 * is the $elem property, which is the jquery-wrapped node provded
                 * to this widget for its usage.
                 */
                this.$elem.html('Hello, I am a simple KBase Jquery Widget. Param 1 is ' + this.options.param1);
            }
        });
    });
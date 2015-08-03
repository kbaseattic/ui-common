/*
 * HEADER
 * 
 */
/*
 * DOC: js lint config
 * 
 */
/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
/*
 * DOC: Sample Factory Pattern Widget
 * 
 * Follows a factory pattern for generation of widgets.
 * The module returns factory-maker - a function which returns a factory for making 
 * widgets.
 * The factory has a single method - makeWidget.
 * The widget it produces has the following methods:
 * init
 * attach
 * start
 * run
 * stop
 * detach
 * destroy
 */

/* DOC: dependencies
 * This sample widget has only a single explicit dependency - the q promises library.
 * At this stage of the widget lifecycle each method must be implemented as a
 * promise. This allows the widget to incorporate asynchronous processes into 
 * any method.
 * 
 * We use the well-established "Q" promises library. Since promises is really
 * an interface, it would be possible to use another promises library, or 
 * even to roll your own.
 * 
 * We also use our own lightweight DOM wrapper, kb.dom. This allows us to prevent
 * access to the global DOM objects.
 * 
 * Of course, one may wish to use jquery to do the same thing.
 * 
 * TODO: I think we need one more dependency -- a kbase dom helper, so that
 * TODO: widget authors don't need to deal with "document", "window" or other
 * TODO: global dom objects. This is also more consistent with the spirit of AMD - 
 * TODO: ban all globals. It also gives us a hook on to a more secure widget env,
 * TODO: as well as widget testing (via mocks for the DOM).
 * 
 */
define([   
    'q', 'kb.dom'
],
    function (q, DOM) {
        /* DOC: strict mode please 
         * To facility robust and clean code, we use strict mode. It should be 
         * placed at the top of the module function.
         */
        'use strict';

        /* DOC: widget creation with factory pattern
         * In this example widget we are using the factory pattern to create 
         * new widget instances. There are several ways to create new objects
         * in javascript. This pattern provides a clean and secure object, and
         * a clear api in the form of the final returned simple object.
         * 
         * The constructor may take arguments, to assist in the creation of a 
         * specialized widget. In this simple widget we do not utilize this
         * feature. However, the sample jquery and pure object widgets do, 
         * in the form of the widget adapter.
         * 
         */
        var widget = function (config) {
            var mount, container;
            
            /* DOC: widget initialization
             * With the first step of the widget lifecycle being creation,
             * the second is initialization. This step may be redundant with
             * creation, in which case it can just be a dummy 
             * TODO: widget managers should be able to deal with missing optional methods
             * 
             * The initialization step may be used for the construction of objects
             * that will be required latter in the widget lifecycle. For instance,
             * service clients, configuration, data, dependencies. 
             * 
             * One "feature" of this lifecycle interface is that, a lifecycle
             * event may serve different purposes in different use cases.
             */
            function init(config) {
                return q.Promise(function (resolve) {
                    resolve();
                });
            }
            
            /* DOC: attachment to DOM
             * The attach method is called after a DOM node is available for the
             * widget to operate on. A DOM node is provided for the widget to use.
             * The widget should only use this node for simple operations. In the
             * case presented here, the only operations performed on the node are
             * appendChild and removeChild, for adding and removing the widget's 
             * own top level element. 
             * 
             * TODO: we may want to even restrict this access to an API,
             * TODO: perhaps provided by the calling environment.
             * 
             * In many cases the attach method looks just like it does here. 
             * Other use cases may attach event listeners here as well.
             */
            function attach(node) {
                return q.Promise(function (resolve) {
                    /* DOC: save parent node reference
                     * We save a reference to the parent node, since later stages
                     * of the widget lifecycle require us to clean up after
                     * ourselves.
                     */
                    mount = node;
                    
                    /* DOC: create own dom node
                     * Although not necessary, it is a good practice to create a
                     * top level node within the widget. Subsequently we only use
                     * this top level element. This allows cleaner and easier
                     * operation on DOM. For instance, we can add events to this
                     * node and later when we remove it they will be automatically
                     * cleaned up by the DOM -- we don't have to track them ourselves.
                     */
                    container = DOM.createElement('div');
                    DOM.append(mount, container);
                    
                    resolve();
                });
            }
            
            /* DOC: starting the widget
             * After a widget has been successfully attached to the DOM, it may 
             * be started. It also represents the point at which the widget 
             * receives parameters which control its behavior. 
             * This even represents the point at which a widget might
             * listen for events, fire of async requests for data, receive
             * observer objects. 
             * 
             * For instance, if a widget is showing a data item, this may be where
             * it receives parameters which describe the data item, it fetches 
             * the item, renders it, and displays it.
             * 
             * Note that this method is slightly different from the following one,
             * run, in that it is called the first time a widget is started. 
             * 
             * For instance, if a widget is part of an MVVM environment, and is
             * driven by observered objects, then this would be where those 
             * are established.
             * 
             */
            function start(params) {
                return q.Promise(function (resolve) {
                    
                    /* DOC: rendering
                     * Here we have a simple rendering implementation!
                     */
                    DOM.setHTML(container, 'Hi, I am a very simple minded widget.');
                    resolve();
                });
            }

            /* DOC: running a widget again
             * This optional method is used to re-run a widget with parameters.
             * It is a subset of the start method, in that it accepts parameters 
             * and may cause a mutation in widget state or the user interface.
             * 
             * The use case for re-running a widget is when it is completely controlled
             * by a widget manager, and all data flows through the start and run 
             * methods. For example, a parent widget may listen for data modification
             * events, and re-run the widget with those data modification events.
             * This could be implemented by destroying and recreating a widget. 
             * However, in some cases, with many widgets, this may case significant
             * performance degradation. This 
             */
            function run(params) {
                return q.Promise(function (resolve) {
                    DOM.setHTML(container, 'Hi, it is now ' + (new Date()));
                    resolve();
                });
            }
            
            /* DOC: stopping a widget
             * The counterpoint to starting a widget is stopping it! This provides
             * an opportunity to stop any runtime services that may have been 
             * started, remove event listeners, clear pending requests.
             * 
             * Note that this does not give a widget the privilege of denying 
             * a stop request. For instance, if a widget provides an editor, and 
             * is has pending editor changes, it may wish to force the user to 
             * confirm this action first. That is beyond the scope of the 
             * basic widget lifecycle interface. 
             * TODO: perhaps this is an extension of the interface?
             * TODO: if so, that might argue for an interface to be implemented
             * TODO: in a more extensible pattern (e.g. objects)
             * 
             */
            function stop() {
                return q.Promise(function (resolve) {
                    resolve();
                });
            }
            
            /* DOC: detaching a widget
             * When a widget is on its way out of the DOM, perhaps as part of a
             * process in which an entire user interface is being torn down, this
             * represents an opportunity for the widget to remove any DOM-specific
             * changes it may have made. In most cases this is probably exactly
             * what is implemented here, removing the container that was originally 
             * attached. 
             */
            function detach() {
                return q.Promise(function (resolve) {
                    DOM.remove(mount, container);
                    resolve();
                });
            }
            
            /* DOC: destroying a widget
             * The ultimate fate of a widget is reached when it is no longer being used,
             * and the laste references to it are about to be removed. After this point,
             * the widget will no longer be reachable and will eventually be 
             * garbage-collected. Javascript itself provides no hooks to allow an 
             * object to know it is about to garbage-collected, or destroyed.
             * The widget lifecycle interface provides this hook. This method is
             * called by whatever is managing this widget after the detach event
             * and before the last reference is removed.
             * 
             * This represents a final opportunity to remove any object references 
             * which may have been created during the lifetime of this object.
             * In practice, the stop and detach events capture most of this.
             */
            function destroy() {
                return q.Promise(function (resolve) {
                    resolve();
                });
            }
            
            return {
                init: init,
                attach: attach,
                start: start,
                run: run,
                stop: stop,
                detach: detach,
                destroy: destroy
            };
        };
        
        return {
            make: function (config) {
                return widget(config);
            }
        };
    }
);
/**
 * Any Javsascript type.
 * 
 * @typedef {(object|string|number|boolean|undefined|function)} Any
 */


/**
* 
* The traditional KBase session layout, reflecting the fields set
* in the browser cookie.
* 
* 
* @typedef {Object} KBaseSessionObject
* @property {string} token - The Globus auth token
* @property {string} un - username as extracted from the Globus auth token
* @property {string} user_id - same as un
* @property {string} name - The user "full name" (globus) or
* "user name" (kbase). Deprecated - user name should be taken from
* the user profile. (See xxx)
* @property {string} kbase_sessionid - Issued by the auth server,
* used to uniquely identify this session amongst all other extant
* sessions. ???
* @todo Where is kbase_sessionid used??? Not in ui-common ...
* 
*/

/**
 * An ordered list of properties that specify a path into an object. Each
 * path item represents a property name of the current object. The first 
 * item represents a property of the immediate object, the second a property
 * of the value of the first property, if that contained an object, and so
 * forth. The canonical representation is an array of strings, but a string
 * with property components separated by dots is a natural and easier form
 * for people.
 * 
 * @typedef {(string|Array.<string,number>)} PropertyPath
 */

/**
 * A widget matched with a route.
 * 
 * @interface Panel
 * 
 */

/**
 * Set the panel up in the runtime environment. At present, this means to 
 * add the routes.
 *
 * @function
 * @name Panel#setup 
 * 
 */

/**
 * Remove the panel from the runtime environment.
 * 
 * @function
 * @name Panel#teardown
 */


/**
 * A widget.
 * 
 * @interface Widget
 */

/**
 * Initialize the function with a given configuration.
 * 
 * @function
 * @name Widget#init
 * @returns {Promise} promise
 * 
 */

/** 
 * The attach method is called when the calling context has a concrete DOM node
 * to provide the widget.
 * 
 * @function
 * @name Widget#attach
 * @returns {Promise} promise
 * 
 */

/** 
 * Start the widget with run-time parameters.
 * 
 * @function
 * @name Widget#start
 * @returns {Promise} promise
 * 
 */

/** 
 * Run the widget with run-time parameters.
 * 
 * @function
 * @name Widget#run
 * @returns {Promise} promise
 * 
 */

/** 
 * Stop the widget with run-time parameters.
 * 
 * @function
 * @name Widget#stop
 * @returns {Promise} promise
 * 
 */

/** 
 * Detach the widget with run-time parameters.
 * 
 * @function
 * @name Widget#detach
 * @returns {Promise} promise
 * 
 */


/** 
 * Destroy the widget with run-time parameters.
 * 
 * @function
 * @name Widget#destroy
 * @returns {Promise} promise
 * 
 */


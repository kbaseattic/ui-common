
/* 
 * Narrative Model  
 *
 *   This is responisble for the state of the narrative model
 *   Two way binding is used to update the view
*/

app.service('narrative', function($http) {
    var self = this;

    // models for methods; two for faster retrieval and updating of templates
    this.methods = [];
    this.method_dict = {};

    // model for cells displayed
    this.cells = [];

    // current selected app (frozen narrative)
    this.current_app;

	// model for ws objects in 'data' view
	this.selected_ws;
	this.ws_objects = [];  

	// model for tasks; appears in 'running tasks'
	this.tasks = [];

    // add cell to narrative model
    this.addCell = function(name) {
		console.log('add narrative cell:', name, cell_obj);
        var cell_obj = self.method_dict[name];
        self.cells.push(cell_obj);
    }

    // remove cell from narrative model; pretty awesome, eh?
    this.removeCell = function(index) {
        console.log('remove narrative cell', this.cells[index]);
		this.cells.splice(index, 1);
    }

    this.setApp = function(name) {
		console.log('setting app to:', name, cell_obj);
        self.current_app = cell_obj;
    }


    // run a cell on a page; independent of "narrative" concept
    /*this.runCell = function(index, cell) {
    	console.log('running cell:', index, 'with params', cell )

    	self.newTask({name: cell.title, params: cell.params})
    }*/

    // a task is of the form {name: cell.title, fields: scope.fields}
    this.newTask = function(task) {
    	self.tasks.push(task);
    }



    // Load data for apps, app builder, and data 
    $http.get('data/services.json').success(function(data) {
        // reorganize data since it doesn't make any sense.  
        // why is there no order to the groups of menthods?
        var methods = [];
        var method_dict = {}
        for (var key in data) {
            var group_name = key
            var method = {name: group_name, methods: []}

            var nar_meths = data[group_name].methods;

            for (var i in nar_meths) {
                var meth = nar_meths[i];
                var id = meth.title;  // use title as id for now

                var obj = {title: meth.title,
                           description: meth.description,
                           input: meth.properties.widgets.input,
                           output: meth.properties.widgets.output,
                           params: sanitize(meth.properties.parameters, 'param'),
                           returns: sanitize(meth.returns, 'output')};

                var small = {title: meth.title,
                           description: meth.description}

                method.methods.push(small);
                method_dict[id] = obj;
            }

            methods.push(method);
        }

        // update models, two-way-binding ftw.
        self.methods = methods;
        self.method_dict = method_dict;
    });


    // change param0, param1, etc... to a list.  not sure why.
    function sanitize(properties, key_prefix) {
        var props = [];

        for (var i=0; i<Object.keys(properties).length; i++) {
            var key = key_prefix+String(i);

            props.push(properties[key]);
        }
        return props;
    }

    // let's make this happen: 
    // http://ngmodules.org/modules/angularjs-json-rpc
    if (!self.ws_objects) {
        var p = kb.ws.list_objects({workspaces: [USER_ID+':home']});
        $.when(p).done(function(data){

            $scope.$apply(function() {
                self.ws_objects = data;
            })
        })
    }


});


 


(function($, undefined) {
    $.KBWidget({
        name: 'kbaseTree',
        parent: 'kbaseWidget',
        version: '0.0.1',
        options: {
            treeID: null,
            workspaceID: null,
            kbCache: null,
            treeServiceURL: "http://140.221.85.58:8284/",
        },

        init: function(options) {
            this._super(options);

            if (!this.options.treeID) {
                this.renderError("No tree to render!");
            }
            else if (!this.options.workspaceID) {
                this.renderError("No workspace given!");
            }
            else if (!this.options.kbCache) {
                this.renderError("No KBase Cache present!");
            }

            else {
                this.treeClient = new Tree(this.options.treeServiceURL);
                this.$canvas = $('<div>')
                               .append($('<canvas id="knhx-canvas">'));
                this.$elem.append(this.$canvas);

                knhx_init('knhx-canvas', null);
                this.render();
            }

            return this;
        },

        render: function() {
            var prom = this.options.kbCache.req('ws', 'get_objects', 
                [this.buildObjectIdentity(this.options.workspaceID, this.options.treeID)]);

            $.when(prom).done($.proxy(function(objArr) {
                var tree = objArr[0].data;
                var idMap = {};
                $.each(tree.id_map, function(key, value) {
                    idMap[key] = value[0] + '-' + value[1];
                });

                // this.treeClient.replace_node_names(tree.species_tree, idMap, 
                //     function(relabeledTree) {
                //         console.log(relabeledTree);
                //         kn_actions.plot(relabeledTree);
                //     },
                //     function(error) {
                //         console.debug("error");
                //     }
                // );
                kn_actions.plot(tree.species_tree);
            }, this));
            $.when(prom).fail($.proxy(function(error) { this.renderError(error); }, this));

        },

        renderError: function(error) {
            errString = "Sorry, an unknown error occurred";
            if (typeof error === "string")
                errString = error;
            else if (error.error && error.error.message)
                errString = error.error.message;

            
            var $errorDiv = $("<div>")
                            .addClass("alert alert-danger")
                            .append("<b>Error:</b>")
                            .append("<br>" + errString);
            this.$elem.empty();
            this.$elem.append($errorDiv);
        },

        getData: function() {
            return {
                type: 'Tree',
                id: this.options.treeID,
                workspace: this.options.workspaceID,
                title: 'Genome Tree'
            };
        },

        buildObjectIdentity: function(workspaceID, objectID) {
            var obj = {};
            if (/^\d+$/.exec(workspaceID))
                obj['wsid'] = workspaceID;
            else
                obj['workspace'] = workspaceID;

            // same for the id
            if (/^\d+$/.exec(objectID))
                obj['objid'] = objectID;
            else
                obj['name'] = objectID;
            return obj;
        },


    });
})( jQuery );
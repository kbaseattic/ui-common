(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseWSButtons",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        
        options: {
            wsNameOrId: null,
            objNameOrId: null,
            objVer: null,
            kbCache:{},
            width:900
        },

        pref: null,
        objName:"",
        wsName:"",
        
        init: function(options) {
            this._super(options);
            var self = this;
            this.pref = this.uuid();
        	var container = self.$elem;
        	container.append('' + 
        			'<table>' +
        			'<tr><td>Source object:</td><td id="td_src_'+this.pref+'"/></tr>' +
        			'<tr><td>Target workspace:</td><td id="td_ws_'+this.pref+'"/></tr>' +
        			'<tr><td>Target object name:</td><td><input type="text" id="input_target_'+this.pref+'"/></td></tr>' +
        			'<tr><td/><td><button id="btn_copy_'+this.pref+'">Copy</button></td></tr>' +
        			'</table>');
        	$('#btn_copy_'+this.pref).click(function (e) {
            	var ws_name = $("#select_ws"+self.pref).val();
            	var target_obj_name = $("#input_target_"+self.pref).val();
            	console.log("Copy " + self.options.wsNameOrId + "/" + self.options.objNameOrId + " -> " + 
            			ws_name + "/" + target_obj_name);
        	});
        	
            // get the refs
            var objectIdentity = self.getObjectIdentity(options.wsNameOrId, options.objNameOrId, options.objVer);
            
            var request1 = kb.ws.list_workspace_info({prem: 'w'});
            var request2 = kb.ws.get_object_info_new({objects: [objectIdentity]});            
            
            //kbws.list_referencing_objects([objectIdentity], function(data) {
            $.when(request1, request2).done(function(ws_list_data,obj_data) {
        		var objInfo = obj_data[0];
				$('#td_src_'+self.pref).html(objInfo[6]+"/"+objInfo[1]);
				console.log(ws_list_data);
				var td_ws = $('#td_ws_'+self.pref);
            	if (ws_list_data.length == 0) {
    				td_ws.html("No workspaces you can have write access");
            	} else {
            		var drop_down_html = '<select id="select_ws_'+self.pref+'">';
            		for (var i in ws_list_data) {
            			var ws_name = ws_list_data[i][1];
            			drop_down_html += '<option value="'+ws_name+'">'+ws_name+'</option>';
            		}
            		drop_down_html += '</select>';
            		td_ws.html(drop_down_html);
            	}
            }).fail(function(err){
                    self.$elem.empty();
                    self.$elem.append("<br><b>There are no other data objects (you can access) that reference this object.</b>");
            });
            
            return this;
        },
        
        getData: function() {
            return {title:"Workspace object management",id:this.objName, workspace:this.wsName};
        },
        
        uuid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, 
                function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
        },
        
        /* Construct an ObjectIdentity that can be used to query the WS*/
        getObjectIdentity: function(wsNameOrId, objNameOrId, objVer) {
            if (objVer) { return {ref:wsNameOrId+"/"+objNameOrId+"/"+objVer}; }
            return {ref:wsNameOrId+"/"+objNameOrId } ;
        }

    });
})( jQuery )
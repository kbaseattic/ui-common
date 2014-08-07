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
            width:200
        },

        pref: null,
        objName:"",
        wsName:"",
        
        init: function(options) {
            this._super(options);
            var self = this;
            this.pref = this.uuid();
        	var container = self.$elem;
        	/*container.append('' + 
        			'<table>' +
        			'<tr><td>Source object:</td><td id="td_src_'+this.pref+'"/></tr>' +
        			'<tr><td>Target workspace:</td><td id="td_ws_'+this.pref+'"/></tr>' +
        			'<tr><td>Target object name:</td><td><input type="text" id="input_target_'+this.pref+'" style="width: 150px;"/></td></tr>' +
        			'<tr><td/><td><button id="btn_copy_'+this.pref+'">Copy</button></td></tr>' +
        			'</table>');*/
        	container.append($('<div />').css("overflow","auto").append('' +
        			'<p><span style="white-space: nowrap; display: inline-block; width: 130px;"><b>Source Data:</b></span><span id="td_src_'+this.pref+'"/></p>'+
        			'<p><span style="white-space: nowrap; display: inline-block; width: 130px;"><b>Target Workspace:</b></span><span id="td_ws_'+this.pref+'"/></p>'+
        			'<p><span style="white-space: nowrap; display: inline-block; width: 130px;"><b>Target Data Name:</b></span><input type="text" id="input_target_'+this.pref+'" style="width: 150px;"/></p>'+
        			'<button id="btn_copy_'+this.pref+'" class="btn btn-primary">Copy</button>'));
        	
            var objectIdentity = self.getObjectIdentity(options.wsNameOrId, options.objNameOrId, options.objVer);

        	$('#btn_copy_'+this.pref).click(function (e) {
            	var ws_name = $("#select_ws_"+self.pref).val();
            	var target_obj_name = $("#input_target_"+self.pref).val();
            	if (target_obj_name.length == 0) {
            		alert("Error: target object name is empty");
            		return;
            	}
            	kb.ws.copy_object({from: objectIdentity, to: {ref: ws_name + "/" + target_obj_name}}, function(data) {
            		alert("Object was successfuly copied");
            	},
            	function(err) {
            		alert("Error: " + err.error.message);
            	});
        	});

            var request1 = kb.ws.list_workspace_info({perm: 'w'});
            var request2 = kb.ws.get_object_info_new({objects: [objectIdentity]});
            
            //kbws.list_referencing_objects([objectIdentity], function(data) {
            $.when(request1, request2).done(function(ws_list_data,obj_data) {
        		var objInfo = obj_data[0];
				$('#td_src_'+self.pref).html('<br>'+objInfo[7]+"/<wbr>"+objInfo[1]);
				$("#input_target_"+self.pref).val(objInfo[1]);
				//console.log(ws_list_data);
				var td_ws = $('#td_ws_'+self.pref);
            	if (ws_list_data.length == 0) {
    				td_ws.html("You do not have write access to any workspaces.");
            	} else {
            		var drop_down_html = '<select id="select_ws_'+self.pref+'" style="width: 150px;">';
            		for (var i in ws_list_data) {
            			var ws_name = ws_list_data[i][1];
            			drop_down_html += '<option value="'+ws_name+'">'+ws_name+'</option>';
            		}
            		drop_down_html += '</select>';
            		td_ws.html(drop_down_html);
            	}
            }).fail(function(err){
                    self.$elem.empty();
                    self.$elem.append("Error: " + err.error.message);
            });
            
            return this;
        },
        
        getData: function() {
            return {title:"Copy To My Workspace",id:this.objName, workspace:this.wsName};
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
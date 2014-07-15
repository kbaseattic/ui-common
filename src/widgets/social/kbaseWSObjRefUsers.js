(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseWSObjRefUsers",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        
        //wsUrl: "http://dev04.berkeley.kbase.us:7058",
        wsUrl:"https://kbase.us/services/ws",
        
        options: {
            wsNameOrId: null,
            objNameOrId: null,
            objVer: null,
            kbCache:{},
            width:300
        },

        
        objName:"",
        wsName:"",
        userList:{},
        
        
        init: function(options) {
            this._super(options);
            var self = this;

            if (options.wsUrl) {
                self.wsUrl = options.wsUrl;
            }
            var kbws;
            
            if (self.options.kbCache.ws_url) {
                self.wsUrl = self.options.kbCache.ws_url;
            }
            if (self.options.kbCache.token) {
                kbws = new Workspace(self.wsUrl, {token: self.options.kbCache.token});
            } else {
                kbws = new Workspace(self.wsUrl);
            }
            
            self.objName = options.objNameOrId;
            self.wsName = options.wsNameOrId;
            
            self.$elem.append('<div id="loading-mssg"><p class="muted loader-table"><center><img src="assets/img/ajax-loader.gif"><br><br>finding all data that references this object...</center></p></div>');
            self.$elem.append('<div id="mainview">')
            //self.$elem.append(JSON.stringify(options)+"<br>");
            
            // get the refs
            var objectIdentity = self.getObjectIdentity(options.wsNameOrId, options.objNameOrId, options.objVer);
            kbws.list_referencing_objects([objectIdentity], function(data) {
                    if (data[0].length == 0) {
                        self.$elem.append("<br><b>There are no other users that have referenced this object.</b>");
                    } else {
                        for(var i = 0; i < data[0].length; i++) {
                            //var savedate = new Date(objInfo[3]); // todo: add last save date
			    if (data[0][i][5] in self.userList) {
				self.userList[data[0][i][5]]['refCount']++;
			    } else {
				self.userList[data[0][i][5]] = {refCount:1};
			    }
                        }
                        
			
			// todo : use globus to populate user names
			
			var tblData = [];
			for (var ud in self.userList) {
			    tblData.push({name:"Name G Placeholder",user_id:ud,mentions:self.userList[ud]['refCount']});
			}
			
                        self.$elem.find('#loading-mssg').remove();
                        
                        var $maindiv = self.$elem.find('#mainview');
                        $maindiv.append('<table cellpadding="0" cellspacing="0" border="0" id="ref-table" \
                            class="table table-bordered table-striped" style="width: 100%; margin-left: 0px; margin-right: 0px;"/>');

            		var tblSettings = {
            				"sPaginationType": "full_numbers",
            				"iDisplayLength": 10,
                                        "sDom": 't<lip>',
            				"aoColumns": [
            				              {sTitle: "Name", mData: "name", sWidth:"30%"},
            				              {sTitle: "User Id", mData: "user_id"},
            				              {sTitle: "Mentions", mData: "mentions"}
            				              ],
            				              "aaData": tblData
            		};
            		var refTable = self.$elem.find('#ref-table').dataTable(tblSettings);
                    }
                }, function(err) {
                    self.$elem.find('#loading-mssg').remove();
                    self.$elem.append("<br><b>There are no other users that have referenced this object.</b>");
                    console.error("Error in finding referencing objects! (note: v0.1.6 throws this error if no referencing objects were found)");
                    console.error(err);
                    //self.$elem.append("<br><div><i>Error was:</i></div><div>"+err['error']['message']+"</div><br>");
                });
            
            return this;
        },
        
        getData: function() {
            return {title:"People using this data object.",id:this.objName, workspace:this.wsName};
        },
        
        
        /* Construct an ObjectIdentity that can be used to query the WS*/
        getObjectIdentity: function(wsNameOrId, objNameOrId, objVer) {
            if (objVer) { return {ref:wsNameOrId+"/"+objNameOrId+"/"+objVer}; }
            return {ref:wsNameOrId+"/"+objNameOrId } ;
        },
        
        monthLookup : ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep","Oct", "Nov", "Dec"]

    });
})( jQuery )
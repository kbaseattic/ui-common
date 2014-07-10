(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseWSReferenceList",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        
        //wsUrl: "http://dev04.berkeley.kbase.us:7058",
        wsUrl:"https://kbase.us/services/ws",
        
        options: {
            wsNameOrId: null,
            objNameOrId: null,
            objVer: null,
            authToken: null,
            userId: null,
            wsUrl:null
        },

        init: function(options) {
            this._super(options);
            var self = this;

            if (options.wsUrl) {
                self.wsUrl = options.wsUrl;
            }
            var tok = ""; // put token here for testing
            var kbws;
            if (tok) {
                kbws = new Workspace(self.wsUrl, {token: tok});
            } else {
                kbws = new Workspace(self.wsUrl);
            }

            //self.$elem.append(JSON.stringify(options)+"<br>");
            
            var objectIdentity = self.getObjectIdentity(options.wsNameOrId, options.objNameOrId, options.objVer);
            
            kbws.list_referencing_objects([objectIdentity], function(data) {
                    if (data[0].length == 0) {
                        self.$elem.append("<br>No objects reference this object.<br>");
                    } else {
                        for(var i = 0; i < data[0].length; i++) {
                            var objInfo = data[0][i]
                            //0:obj_id objid, 1:obj_name name, 2:type_string type,3:timestamp save_date, 4:int version, 5:username saved_by,
                            //6:ws_id wsid, 7:ws_name workspace, 8:string chsum, 9:int size, 10:usermeta meta>
                            //object_info;
                            var savedate = new Date(objInfo[3]);
                            self.$elem.append("<b>"+objInfo[1]+"</b> <i>"+objInfo[2]+"</i> ("+objInfo[6]+"/"+objInfo[0]+"/"+objInfo[4]+", saved by "
                                              +objInfo[5]+" on "+self.monthLookup[savedate.getMonth()]+" "+savedate.getDay()+", "+savedate.getFullYear()+")<br>")
                        }
                    }
                }, function(err) {
                    self.$elem.append(JSON.stringify(err));
                });
            
            return this;
        },
        
        getData: function() {
            return {};
        },
        
        
        /* Construct an ObjectIdentity that can be used to query the WS*/
        getObjectIdentity: function(wsNameOrId, objNameOrId, objVer) {
            if (objVer) { return {ref:wsNameOrId+"/"+objNameOrId+"/"+objVer}; }
            return {ref:wsNameOrId+"/"+objNameOrId } ;
        },
        
        monthLookup : ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep","Oct", "Nov", "Dec"]

    });
})( jQuery )
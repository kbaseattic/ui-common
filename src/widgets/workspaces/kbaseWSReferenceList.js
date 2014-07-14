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
            kbCache:{},
            width:900
        },

        
        objName:"",
        wsName:"",
        
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
                        self.$elem.append("<br><b>There are no other data objects (you can access) that reference this object.</b>");
                    } else {
                        var refList = {};
                        for(var i = 0; i < data[0].length; i++) {
                            var objInfo = data[0][i];
                            //0:obj_id objid, 1:obj_name name, 2:type_string type,3:timestamp save_date, 4:int version, 5:username saved_by,
                            //6:ws_id wsid, 7:ws_name workspace, 8:string chsum, 9:int size, 10:usermeta meta>
                            //object_info;
                            if (!(objInfo[6]+"/"+objInfo[1] in refList)) {
                                refList[objInfo[6]+"/"+objInfo[1]] = objInfo;
                                
                            } else {
                                if (refList[objInfo[6]+"/"+objInfo[1]][4] < objInfo[4]) {
                                    refList[objInfo[6]+"/"+objInfo[1]] = objInfo;
                                    
                            }
                        }
                        
                        // load the data into a data object
                        var refTableData = [];
                        for(var ref in refList) {
                            var objInfo = refList[ref];
                            var savedate = new Date(objInfo[3]);
                                    refTableData.push({
                                            na:objInfo[1]+ " ("+objInfo[6]+"/"+objInfo[0]+"/"+objInfo[4]+")",
                                            ty:objInfo[2],
                                            de:"saved by "+objInfo[5]+" on "+self.monthLookup[savedate.getMonth()]+" "+savedate.getDate()+", "+savedate.getFullYear()
                                        })
                                }
                            //self.$elem.append("<b>"+objInfo[1]+"</b> <i>"+objInfo[2]+"</i> ("+objInfo[6]+"/"+objInfo[0]+"/"+objInfo[4]+", saved by "
                            //            +objInfo[5]+" on "+self.monthLookup[savedate.getMonth()]+" "+savedate.getDate()+", "+savedate.getFullYear()+")<br>")
                        }
                        
                        self.$elem.find('#loading-mssg').remove();
                        
                        var $maindiv = self.$elem.find('#mainview');
                        $maindiv.append('<table cellpadding="0" cellspacing="0" border="0" id="ref-table" \
                            class="table table-bordered table-striped" style="width: 100%; margin-left: 0px; margin-right: 0px;"/>');

            		var tblSettings = {
            				"sPaginationType": "full_numbers",
            				"iDisplayLength": 10,
                                        "sDom": 't<flip>',
            				"aoColumns": [
            				              {sTitle: "Object Name (reference)", mData: "na", sWidth:"30%"},
            				              {sTitle: "Type", mData: "ty"},
            				              {sTitle: "Details", mData: "de"}
            				              ],
            				              "aaData": refTableData
            				              
            				              /*"fnDrawCallback": function() {}
                                                      	$('.'+pref+'contig-click').unbind('click');
                                                                $('.'+pref+'contig-click').click(function() {
                                                                var contigId = [$(this).data('contigname')];
                                                                showContig(contigId);
                                                        });            
                                                        }*/
            		};
            		var refTable = self.$elem.find('#ref-table').dataTable(tblSettings);
                    }
                }, function(err) {
                    self.$elem.find('#loading-mssg').remove();
                    self.$elem.append("<br><b>There are no other data objects (you can access) that reference this object.</b>");
                    console.error("Error in finding referencing objects! (note: v0.1.6 throws this error if no referencing objects were found)");
                    console.error(err);
                    //self.$elem.append("<br><div><i>Error was:</i></div><div>"+err['error']['message']+"</div><br>");
                });
            
            return this;
        },
        
        getData: function() {
            return {title:"Data objects that reference:",id:this.objName, workspace:this.wsName};
        },
        
        
        /* Construct an ObjectIdentity that can be used to query the WS*/
        getObjectIdentity: function(wsNameOrId, objNameOrId, objVer) {
            if (objVer) { return {ref:wsNameOrId+"/"+objNameOrId+"/"+objVer}; }
            return {ref:wsNameOrId+"/"+objNameOrId } ;
        },
        
        monthLookup : ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep","Oct", "Nov", "Dec"]

    });
})( jQuery )
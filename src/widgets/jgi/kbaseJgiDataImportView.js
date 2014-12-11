(function( $, undefined ) { 
    $.KBWidget({ 
        name: "KBaseJgiDataImportView",
        parent: "kbaseAuthenticatedWidget",
	
        options: {
            ws: null,
            obj: null,
            loadingImage: "assets/img/ajax-loader.gif",
            //ws_url: "https://kbase.us/services/ws"
	    ws_url:"https://dev04.berkeley.kbase.us/services/ws"
        },

	ws: null, // the ws client
	
	$mainPanel: null,
	$errorPanel: null,

        init: function(options) {
            this._super(options);
	    
	    this.$errorPanel = $('<div>').addClass('alert alert-danger').hide();
	    this.$elem.append(this.$errorPanel);

            this.$mainPanel = $("<div>");
	    this.$elem.append(this.$mainPanel);
	    
	    // check if we are already logged in
	    if (!this._attributes.auth.token) {
		this.notLoggedIn();
	    } else {
		this.ws = new Workspace(this.options.ws_url, this._attributes.auth);
		this.getDataAndRender();
	    }
	    
            return this;
        },
	
	loggedInCallback: function(event, auth) {
            this.ws = new Workspace(this.options.ws_url, auth);
            this.getDataAndRender();
            return this;
        },
        loggedOutCallback: function(event, auth) {
            this.ws = null;
            this.notLoggedIn();
            return this;
        },
        
        refresh: function() {
            this.getDataAndRender();
        },
	
	objData: null,
	
	getDataAndRender: function() {
	    var self = this;
	    self.ws.get_object_info(
		[{ref:self.options.ws+"/"+self.options.obj}],1,
		function(objInfoList) {
		    if (objInfoList[0]) {
			self.objData = {info:objInfoList[0]};
			console.log(self.objData);
			self.render();
		    } else {
			self.showError({error:{message:'Could not fetch the data information for some reason.'}});
		    }
		},
		function(error) {
		    self.showError(error);
		}
	    );
	},
	
	
        render: function() {
            var self = this;
	    if (self.objData) {
		// do things
		self.$mainPanel.empty();
		
		// first we detect the type
		var typeName = self.objData.info[2].split('-')[0];
		if (typeName === 'KBaseFile.SingleEndLibrary') {
		    self.renderLibraryFile('Single End Read Library');
		} else if (typeName === 'KBaseFile.PairedEndLibrary') {
		    self.renderLibraryFile('Paired End Read Library');
		} else {
		    self.renderUnknownType(self.objData.info[2]);
		}
            }
        },

	
	renderLibraryFile: function(typeNameNice) {
	    var self = this;
	    
	    var $basicInfo =
		$('<div>').addClass('col-md-6')
		    .append($('<div>').append('<h3>'+self.objData.info[1]+'</h3>'))
		    .append($('<div>').css({'color':'#555'}) //todo: make this a real style somewhere
			 .append('<a href="#/spec/type/'+self.objData.info[2]+'" target="_blank">'+typeNameNice+'</a>'))
		    .append($('<div>').css({'color':'#555'})
			 .append('Imported on '+self.getTimeStr(self.objData.info[3])))
		    .append($('<div>').css({'color':'#555'})
			 .append('Perm Ref: '+self.objData.info[6]+"/"+self.objData.info[0]+"/"+self.objData.info[4] ))
	    
	    var $buttonDiv =
		$('<div>').css({'margin':'10px','margin-top':'20px'})
		    .append($('<a href="">').addClass('btn btn-info').css({'margin':'5px'}).append('Launch New Analysis'))
		    .append($('<a href="">').addClass('btn btn-info').css({'margin':'5px'}).append('Launch Assembly App'))
		    //.append($('<a href="">').addClass('btn btn-info').css({'margin':'5px'}).append('Copy into Existing Analysis'));
		
	    $basicInfo.append($buttonDiv);
	    	   
	    var $metaInfo = $('<div>').addClass('col-md-6').css({'margin-top':'20px'});
	    
	    var $metaTbl = $('<table>').addClass("table table-striped table-bordered").css({'width':'100%'});
	    for(var key in self.objData.info[10]) {
		if (self.objData.info[10].hasOwnProperty(key)) {
		    $metaTbl.append(
			$('<tr>')
			    .append($('<th>').append(key))
			    .append($('<td>').append(self.objData.info[10][key])));
		}
	    }
	    $metaInfo.append($metaTbl)
	
	    
	    var $content =
		$('<div>').append(
		    $('<div>').addClass('row')
			.append($basicInfo)
			.append($metaInfo));
		
	    self.$mainPanel.append($content);
	},
	
	/* copied from render library file because i expect these viewers to diverge somewhat */
	renderUnknownType: function(typeNameNice) {
	    var self = this;
	    var $basicInfo =
		$('<div>').addClass('col-md-6')
		    .append($('<div>').append('<h3>'+self.objData.info[1]+'</h3>'))
		    .append($('<div>').css({'color':'#555'}) //todo: make this a real style somewhere
			 .append('<a href="#/spec/type/'+self.objData.info[2]+'" target="_blank">'+typeNameNice+'</a>'))
		    .append($('<div>').css({'color':'#555'})
			 .append('Updated on '+self.getTimeStr(self.objData.info[3])))
		    .append($('<div>').css({'color':'#555'})
			 .append('Perm Ref: '+self.objData.info[6]+"/"+self.objData.info[0]+"/"+self.objData.info[4] ))
	    
	    var $buttonDiv =
		$('<div>').css({'margin':'10px','margin-top':'20px'})
		    .append($('<a href="#/narrativemanager/new">').addClass('btn btn-info').css({'margin':'5px'}).append('Launch New Analysis'));
	    $basicInfo.append($buttonDiv);
	    var $metaInfo = $('<div>').addClass('col-md-6').css({'margin-top':'20px'});
	    
	    var $metaTbl = $('<table>').addClass("table table-striped table-bordered").css({'width':'100%'});
	    for(var key in self.objData.info[10]) {
		if (self.objData.info[10].hasOwnProperty(key)) {
		    $metaTbl.append(
			$('<tr>')
			    .append($('<th>').append(key))
			    .append($('<td>').append(self.objData.info[10][key])));
		}
	    }
	    $metaInfo.append($metaTbl)
	    
	    var $content =
		$('<div>').append(
		    $('<div>').addClass('row')
			.append($basicInfo)
			.append($metaInfo));
		
	    self.$mainPanel.append($content);
	},
	
        
	notLoggedIn: function() {
	    this.$mainPanel.empty();
	    this.$mainPanel.append("You must be logged in to view this data.");
	},
	
	showError: function(error) {
	    this.$errorPanel.empty();
	    this.$errorPanel.append('<strong>Error when retrieving imported JGI data.</strong><br><br>');
	    this.$errorPanel.append(error.error.message);
	    this.$errorPanel.append('<br>');
	    this.$errorPanel.show();
	},
	
	// edited from: http://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
        getTimeStr: function (objInfoTimeStamp) {
            var date = new Date(objInfoTimeStamp);
            var seconds = Math.floor((new Date() - date) / 1000);
            // f-ing safari, need to add extra ':' delimiter to parse the timestamp
            if (isNaN(seconds)) {
                var tokens = objInfoTimeStamp.split('+');  // this is just the date without the GMT offset
                var newTimestamp = tokens[0] + '+'+tokens[0].substr(0,2) + ":" + tokens[1].substr(2,2);
                date = new Date(newTimestamp);
                seconds = Math.floor((new Date() - date) / 1000);
                if (isNaN(seconds)) {
                    // just in case that didn't work either, then parse without the timezone offset, but
                    // then just show the day and forget the fancy stuff...
                    date = new Date(tokens[0]);
                    return this.monthLookup[date.getMonth()]+" "+date.getDate()+", "+date.getFullYear();
                }
            }
	    // forget about time since, just show the date.
            return this.monthLookup[date.getMonth()]+" "+date.getDate()+", "+date.getFullYear();
        },
        
        monthLookup : ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep","Oct", "Nov", "Dec"],
        

    });
})( jQuery );
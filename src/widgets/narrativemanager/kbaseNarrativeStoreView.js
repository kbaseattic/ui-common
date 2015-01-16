(function( $, undefined ) { 
    $.KBWidget({ 
        name: "KBaseNarrativeStoreView",
        parent: "kbaseAuthenticatedWidget",

        options: {
            type: null, // either app or method
            id: null,
            loadingImage: "assets/img/ajax-loader.gif",
	    narrativeStoreUrl:"https://kbase.us/services/narrative_method_store"
        },

        $mainPanel: null,
        $errorPanel: null,
        
        narstore: null,

        init: function(options) {
            this._super(options);

            
            this.$errorPanel = $('<div>').addClass('alert alert-danger').hide();
            this.$elem.append(this.$errorPanel);

            this.$mainPanel = $("<div>");
            this.$elem.append(this.$mainPanel);
            
            this.$narMethodStoreInfo = $("<div>").css({margin:'10px', padding:'10px'});
            this.$elem.append(this.$narMethodStoreInfo);
            
            this.narstore = new NarrativeMethodStore(this.options.narrativeStoreUrl+"/rpc");
            this.getNarMethodStoreInfo();
        
            if (options.type==='app') {
                this.fetchAppInfoAndRender();
            } else if (options.type==='method') {
                this.fetchMethodInfoAndRender();
            } else {
                this.showError({error:{message:'Must specify either "app" or "method" in url, as in narrativestore/app/app_id.'}});
            }
        
            return this;
        },

        getNarMethodStoreInfo: function() {
            var self = this;
            this.narstore.status(
                    function(status) {
                        var url = status.git_spec_url+"/tree/"+status.git_spec_branch;
                        if (self.options.type==='app') {
                            url+="/apps/"+self.options.id;
                        }
                        if (self.options.type==='method') {
                            url+="/methods/"+self.options.id;
                        }
                        
                        
                        self.$narMethodStoreInfo.append(
                            $('<table>').css({border:'1px solid #bbb', margin:'10px', padding:'10px'})
                                .append($('<tr>')
                                            .append($('<th>').append('Method Store URL  '))
                                            .append($('<td>').append(self.options.narrativeStoreUrl)))
                                .append($('<tr>')
                                            .append($('<th>').append('Method Spec Repo  '))
                                            .append($('<td>').append(status.git_spec_url)))
                                .append($('<tr>')
                                            .append($('<th>').append('Method Spec Branch  '))
                                            .append($('<td>').append(status.git_spec_branch)))
                                .append($('<tr>')
                                            .append($('<th>').append('Yaml/Spec Location '))
                                            .append($('<td>').append('<a href="'+url+'" target="_blank">'+url+"</a>")))
                                .append($('<tr>')
                                            .append($('<th>').append('Method Spec Commit  '))
                                            .append($('<td>').append(status.git_spec_commit.replace(/(?:\r\n|\r|\n)/g, '<br>'))))
                                );
                    },
                    function(err) {
                        this.showError(err);
                    });
        },
        
        
        appFullInfo: null,
        appSpec: null,
        appMethodSpecs: null,
        fetchAppInfoAndRender: function() {
	    var self = this;
	    self.narstore.get_app_full_info({ids:[self.options.id]},
		    function(data) {
			self.appFullInfo = data[0];
                        self.narstore.get_app_spec({ids:[self.options.id]},
                            function(spec) {
                                self.appSpec = spec[0];
                                var methodIds = [];
                                for(var s=0; s<self.appSpec.steps.length; s++) {
                                    methodIds.push(self.appSpec.steps[s].method_id);
                                }
                                self.narstore.get_method_brief_info({ids:methodIds},
                                    function(methods) {
                                        self.appMethodSpecs = {};
                                        for(var m=0; m<methods.length; m++) {
                                            self.appMethodSpecs[methods[m].id] = methods[m];
                                        }
                                        self.renderApp();
                                    },
                                    function(err) {
                                        self.showError(err);
                                        console.error(err);
                                    });
                            },
                            function(err) {
                                self.showError(err);
                                console.error(err);
                            });
		    },
		    function(err) {
			self.showError(err);
			console.error(err);
		    });
	},
        
        
        methodFullInfo: null,
        methodSpec: null,
        fetchMethodInfoAndRender: function() {
	    var self = this;
	    self.narstore.get_method_full_info({ids:[self.options.id]},
		    function(data) {
			self.methodFullInfo = data[0];
                        self.narstore.get_method_spec({ids:[self.options.id]},
                            function(spec) {
                                self.methodSpec = spec[0];
                                self.renderMethod();
                            },
                            function(err) {
                                self.showError(err);
                                console.error(err);
                            });
		    },
		    function(err) {
                        // try loading it as an app, temp hack since app page is new ...
			console.error(err);
                        if (err.error.message.indexOf('No such file or directory')>=0) {
                            // if it could not be found, then check if it is an app
                            self.fetchAppInfoAndRender();
                        } else {
                            self.showError(err);
                        }
		    });
	},
        
        renderApp: function() {
	    var self = this;
	    var m = self.appFullInfo;
	    var spec = self.appSpec;
            var methodSpecs = self.appMethodSpecs;
	    console.log(m);
	    console.log(spec);
            console.log(methodSpecs);
	    
	    var $header = $('<div>').addClass("row").css("width","95%");
	    var $basicInfo = $('<div>').addClass("col-md-8");
	    
	    $basicInfo.append('<div><h2>App - '+m['name']+'</h2>');
	    if (m['subtitle']) {
		$basicInfo.append('<div><h4>'+m['subtitle']+'</h4></div>');
	    }
	    if (m['ver']) {
		$basicInfo.append('<div><strong>Version: </strong>&nbsp&nbsp'+m['ver']+"</div>");
	    }
	    
	    if (m['contact']) {
		$basicInfo.append('<div><strong>Help or Questions? Contact: </strong>&nbsp&nbsp'+m['contact']+"</div>");
	    }
	    
            
            if (m['authors']) {
		var $authors = $('<div>');
		for(var k=0; k<m['authors'].length; k++) {
		    if (k==0) {
			$authors.append('<strong>Authors: </strong>&nbsp&nbsp<a href="#/people/'+m['authors'][k]+'" target="_blank">'+m['authors'][k]+"</a>");
		    } else {
			$authors.append(', <a href="#/people/'+m['authors'][k]+'" target="_blank'>+m['authors'][k]+"</a>");
		    }
		}
		$basicInfo.append($authors);
	    }
            
            
	    var $topButtons = $('<div>').addClass("col-md-4").css("text-align","right")
				    .append(
				      '<div class="btn-group">' +
					//'<button id="launchmethod" class="btn btn-default">Launch in New Narrative</button>' +
				      '</div>'  
				    );
	    
	    $topButtons.find("#launchmethod").click(function(e) {
		    e.preventDefault(); //to prevent standard click event
		    alert("This should create a new narrative populated with this Method.");
		});
	    
	    $header.append($basicInfo);
	    $header.append($topButtons);
	    
	    self.$mainPanel.append($header);
	    
	    
	    var $descriptionPanels = $('<div>').addClass("row").css("width","95%");
	    var $description = $('<div>').addClass("col-md-12");
	    if (m['description']) {
		$description.append('<div><hr>'+m['description']+"</div>");
	    }
	    $descriptionPanels.append($description);
	    self.$mainPanel.append($descriptionPanels);
            
            
            var $headerPanels = $('<div>').addClass("row").css("width","95%");
	    var $header = $('<div>').addClass("col-md-12");
	    if (m['header']) {
		$header.append("<hr><h4>In-App Instructions</h4>");
		$header.append('<div>'+m['header']+"</div>");
	    }
	    $headerPanels.append($header);
	    self.$mainPanel.append($headerPanels);
            
            
            var $stepsContainer = $('<div>').css("width","95%");
	    if (spec.steps) {
		$stepsContainer.append("<hr><h4>App Steps</h4>");
                for(var k=0; k<spec.steps.length; k++) {
                    var method_spec = methodSpecs[spec.steps[k].method_id];
                    var $step = $('<div>').addClass("col-md-12");
                    $step.append('<strong>Step '+(k+1)+' - <a href="#/narrativestore/method/'+method_spec.id+'">'+method_spec.name + '</a></strong><br>');
                    $step.append($('<div>').css({margin:'5px', 'margin-bottom':'10px'}).append(method_spec.subtitle));
                    $stepsContainer.append($('<div>').addClass('row').append($step));
                }
	    }
	    self.$mainPanel.append($stepsContainer);
            
            
            
	    if (m['screenshots']) {
		var imgHtml = '';
		for(var s=0; s<m['screenshots'].length; s++) {
		    imgHtml += '<td style="padding:10px;"><div style="border: 1px solid #ccc;">'+
			'<img src="'+self.options.narrativeStoreUrl + m['screenshots'][s]['url']  +'" width="100%">' +
			'</div></td>';
		}
		var $ssPanel = $("<div>").append(
		    '<br><br><div style="width:95%;overflow:auto;">'+
			'<table style="border:0px;"><tr>'+
			imgHtml +
			'</tr></table>'+
		    '</div>'
		);
	       
		self.$mainPanel.append($ssPanel);
	    }
            
            
            if (m['publications']) {
		var $publications = $('<div>').addClass("col-md-12");
		for(var k=0; k<m['publications'].length; k++) {
		    if (k==0) {
			$publications.append('<strong>Related Publications: </strong><br><br>');
		    }
                    $publications.append('&nbsp;&nbsp;&nbsp;&nbsp;'+m['publications'][k].display_text + ' <a href="'+m['publications'][k].link+'" target="_blank">'+m['publications'][k].link+'</a><br><br>');
                    
		}
		self.$mainPanel.append($('<div>').addClass("row").css({"width":"95%","margin-top":"15px"}).append($publications));
	    }
            
            
	    if (m['technical_description']) {
		var $techDetailsDiv = $('<div>')
					.append("<hr><h4>Technical Details</h4>")
					.append(m['technical_description']+"<br>");
		self.$mainPanel.append($techDetailsDiv);
	    }
            
            
            var $entireInfo = $('<div>')
					.append("<hr><h4>Full App Info</h4>")
					.append($("<pre>").append(JSON.stringify(m, null, '\t')));
	    self.$mainPanel.append($entireInfo);
            
            var $entireSpec = $('<div>')
					.append("<hr><h4>Full App Specification</h4>")
					.append($("<pre>").append(JSON.stringify(spec, null, '\t')));
	    self.$mainPanel.append($entireSpec);
	},
        
        
        renderMethod: function() {
	    var self = this;
	    var m = self.methodFullInfo;
	    var spec = self.methodSpec;
	    console.log(m);
	    console.log(spec);
	    
	    var $header = $('<div>').addClass("row").css("width","95%");
	    var $basicInfo = $('<div>').addClass("col-md-8");
	    
	    $basicInfo.append('<div><h2>Method - '+m['name']+'</h2>');
	    if (m['subtitle']) {
		$basicInfo.append('<div><h4>'+m['subtitle']+'</h4></div>');
	    }
	    if (m['ver']) {
		$basicInfo.append('<div><strong>Version: </strong>&nbsp&nbsp'+m['ver']+"</div>");
	    }
	    
	    if (m['contact']) {
		$basicInfo.append('<div><strong>Help or Questions? Contact: </strong>&nbsp&nbsp'+m['contact']+"</div>");
	    }
	    
            
            if (m['authors']) {
		var $authors = $('<div>');
		for(var k=0; k<m['authors'].length; k++) {
		    if (k==0) {
			$authors.append('<strong>Authors: </strong>&nbsp&nbsp<a href="#/people/'+m['authors'][k]+'" target="_blank">'+m['authors'][k]+"</a>");
		    } else {
			$authors.append(', <a href="#/people/'+m['authors'][k]+'" target="_blank'>+m['authors'][k]+"</a>");
		    }
		}
		$basicInfo.append($authors);
	    }
            
            if (m['kb_contributers']) {
		var $authors = $('<div>');
		for(var k=0; k<m['kb_contributers'].length; k++) {
		    if (k==0) {
			$authors.append('<strong>KBase Contributers: </strong>&nbsp&nbsp<a href="#/people/'+m['kb_contributers'][k]+'" target="_blank">'+m['kb_contributers'][k]+"</a>");
		    } else {
			$authors.append(', <a href="#/people/'+m['kb_contributers'][k]+'" target="_blank'>+m['kb_contributers'][k]+"</a>");
		    }
		}
		$basicInfo.append($authors);
	    }
            
            
            
            
	    var $topButtons = $('<div>').addClass("col-md-4").css("text-align","right")
				    .append(
				      '<div class="btn-group">' +
					//'<button id="launchmethod" class="btn btn-default">Launch in New Narrative</button>' +
				      '</div>'  
				    );
	    
	    $topButtons.find("#launchmethod").click(function(e) {
		    e.preventDefault(); //to prevent standard click event
		    alert("This should create a new narrative populated with this Method.");
		});
	    
	    $header.append($basicInfo);
	    $header.append($topButtons);
	    
	    self.$mainPanel.append($header);
	    
	    
	    var $descriptionPanels = $('<div>').addClass("row").css("width","95%");
	    var $description = $('<div>').addClass("col-md-12");
	    if (m['description']) {
		$description.append('<div><hr>'+m['description']+"</div>");
	    }
	    $descriptionPanels.append($description);
	    self.$mainPanel.append($descriptionPanels);
            
	    if (m['screenshots']) {
		var imgHtml = '';
		for(var s=0; s<m['screenshots'].length; s++) {
		    imgHtml += '<td style="padding:10px;"><div style="border: 1px solid #ccc;">'+
			'<img src="'+self.options.narrativeStoreUrl + m['screenshots'][s]['url']  +'" width="100%">' +
			'</div></td>';
		}
		var $ssPanel = $("<div>").append(
		    '<br><br><div style="width:95%;overflow:auto;">'+
			'<table style="border:0px;"><tr>'+
			imgHtml +
			'</tr></table>'+
		    '</div>'
		);
	       
		self.$mainPanel.append($ssPanel);
	    }
            
            
            if (m['publications']) {
		var $publications = $('<div>').addClass("col-md-12");
		for(var k=0; k<m['publications'].length; k++) {
		    if (k==0) {
			$publications.append('<strong>Related Publications: </strong><br><br>');
		    }
                    $publications.append('&nbsp;&nbsp;&nbsp;&nbsp;'+m['publications'][k].display_text + ' <a href="'+m['publications'][k].link+'" target="_blank">'+m['publications'][k].link+'</a><br><br>');
                    
		}
		self.$mainPanel.append($('<div>').addClass("row").css({"width":"95%","margin-top":"15px"}).append($publications));
	    }
            
            if (spec['parameters']) {
		var $parameters = $('<div>')
					.append("<hr><h4>Parameters</h4>");
                for(var k=0; k<spec.parameters.length; k++) {
                    var moreInfo = "<b>Required?</b> "; if (spec.parameters[k].optional) { moreInfo += 'no'; } else { moreInfo += 'yes'; }
                    moreInfo += ", <b>Advanced?</b> "; if (spec.parameters[k].advanced) { moreInfo += 'yes'; } else { moreInfo += 'no'; }
                    if (spec.parameters[k].text_options) {
                        if (spec.parameters[k].text_options.valid_ws_types) {
                            if (spec.parameters[k].text_options.valid_ws_types.length>0) {
                                if (spec.parameters[k].text_options.is_output_name) {
                                    moreInfo += ", Is an Output Data Name ";
                                } else {
                                    moreInfo += ", Is an Input Data Object ";
                                }
                                moreInfo += JSON.stringify(spec.parameters[k].text_options.valid_ws_types);
                            }
                        }
                    }
                    $parameters.append('<b>['+(k+1)+']: '+spec.parameters[k].ui_name+'</b> - '+spec.parameters[k].short_hint+"<br>");
                    $parameters.append(moreInfo+"<br>");
                    $parameters.append(' <u>Full Description</u>: '+spec.parameters[k].description+'<br><br>');
		}
		self.$mainPanel.append($parameters);
	    }
            
	    if (m['technical_description']) {
		var $techDetailsDiv = $('<div>')
					.append("<hr><h4>Technical Details</h4>")
					.append(m['technical_description']+"<br>");
		self.$mainPanel.append($techDetailsDiv);
	    }
            
            
            var $entireInfo = $('<div>')
					.append("<hr><h4>Full Method Info</h4>")
					.append($("<pre>").append(JSON.stringify(m, null, '\t')));
	    self.$mainPanel.append($entireInfo);
            
            var $entireSpec = $('<div>')
					.append("<hr><h4>Full Method Specification</h4>")
					.append($("<pre>").append(JSON.stringify(spec, null, '\t')));
	    self.$mainPanel.append($entireSpec);
	},
        
        
        loggedInCallback: function(event, auth) {
            return this;
        },
        loggedOutCallback: function(event, auth) {
            return this;
        },

        refresh: function() {
        },

        showError: function(error) {
            this.$errorPanel.empty();
            this.$errorPanel.append('<strong>Error when fetching App/Method information.</strong><br><br>');
            this.$errorPanel.append(error.error.message);
            this.$errorPanel.append('<br>');
            this.$errorPanel.show();
        }
    });
})( jQuery );




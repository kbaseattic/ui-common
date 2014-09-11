(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseUserResourceUsage",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        
        userNameFetchUrl:"https://kbase.us/services/genome_comparison/users?usernames=",
	
	
        options: {
            userInfo:null,
	    wsUserInfoUrl:"https://dev04.berkeley.kbase.us:7058",
	    wsUserInfoRef:"",
            kbCache:{},
        },
    
	wsUserInfoClient:null,
	loggedIn:false,
	loggedInUserId:null,
	userInfoData:null,
	isMe:false,
	
	$alertPanel:null,
	$mainPanel:null,
	
        init: function(options) {
            this._super(options);
            var self = this;
	    
            if (options.wsUserInfoUrl) {
		if (options.kbCache.token) {
		    self.wsUserInfoClient = new Workspace(options.wsUserInfoUrl, {token: self.options.kbCache.token});
		    self.loggedIn = true;
		    self.loggedInUserId = $('<div></div>').kbaseLogin().get_kbase_cookie('user_id');;
		}
            }
	    if (options.userInfo) {
		self.userInfoData = options.userInfo['data'];
		if (self.userInfoData['basic_personal_info']['user_name']===self.loggedInUserId) {
		    self.isMe = true;
		}
	    }
	    // setup the alert panel
            self.$alertPanel = $("<div></div>");
	    self.$elem.append(self.$alertPanel);
            self.$mainPanel = $('<div></div>').css("height","300px");
	    self.$elem.append(self.$mainPanel);
	    
	    self.render();
	    return this;
	},
    
    
	render: function() {
	    var self = this;
	    
	    var d = self.userInfoData['resource_usage']['disk_usage'];
	    var df = self.userInfoData['resource_usage']['disk_quota'];
	    var du = self.userInfoData['resource_usage']['disk_units'];
	    var percent = (d/df)*100;
	    
	    var ddata = [   {"label":"used", "value":percent}, 
			    {"label":"free", "value":(100-percent)}]; 
	    console.log(ddata);
	    var $dskPie = $('<div>').addClass("col-md-6").css("text-align","right");
	    var $dskTxt = $('<div>').addClass("col-md-6").append(
			'<strong>Disk Usage</strong><br>' +
			'&nbsp&nbsp'+ percent.toFixed(1) + ' percent used<br>' +
			'&nbsp&nbspused ' +d+ ' of ' +df+ du+'<br>' 
		    );
	    var $dskView = $('<div>').addClass("row").append($dskPie).append($dskTxt);
	    self.renderPie(ddata,$dskPie);
	    self.$mainPanel.append($dskView);
	    self.$mainPanel.append('<br>');
	    
	    var c = self.userInfoData['resource_usage']['cpu_usage'];
	    var cf = self.userInfoData['resource_usage']['cpu_quota'];
	    var cu = self.userInfoData['resource_usage']['cpu_units'];
	    percent = (c/cf)*100;
	    var cdata = [   {"label":"used", "value":percent}, 
			    {"label":"free", "value":(100-percent)}]; 
	    
	    var $cpuPie = $('<div>').addClass("col-md-6").css("text-align","right");
	    var $cpuTxt = $('<div>').addClass("col-md-6").append(
			'<strong>Compute Usage</strong><br>' +
			'&nbsp&nbsp'+ percent.toFixed(1) + ' percent used<br>' +
			'&nbsp&nbspused ' +c+ ' of ' +cf+ cu+'<br>' );
	    var $cpuView = $('<div>').addClass("row").append($cpuPie).append($cpuTxt);
	    self.renderPie(cdata,$cpuPie);
	    self.$mainPanel.append($cpuView);
	
	    
	},
	
	renderPie:function(data,$div) {
	    
	    var w = 140,                        //width
	    h = 120,                            //height
	    r = 60,                            //radius
	    color = d3.scale.category20c();     //builtin range of colors
	    
	    var vis = d3.select($div[0])
		.append("svg:svg")              //create the SVG element inside the <body>
		.data([data])                   //associate our data with the document
		    .attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
		    .attr("height", h)
		.append("svg:g")                //make a group to hold our pie chart
		    .attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius
 
	    var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
		.outerRadius(r);
 
	    var pie = d3.layout.pie()           //this will create arc data for us given a list of values
		.value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array
 
	    var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
		.data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
		.enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
		    .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                .attr("class", "slice");    //allow us to style things in the slices (like text)
 
	    arcs.append("svg:path")
                .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
                .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function
 
	    arcs.append("svg:text")                                     //add a label to each slice
                .attr("transform", function(d) {                    //set the label's origin to the center of the arc
		    //we have to make sure to set these before calling arc.centroid
		    d.innerRadius = 0;
		    d.outerRadius = r;
		    return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
		})
            .attr("text-anchor", "middle")                          //center the text on it's origin
            .text(function(d, i) { return data[i].label; });        //get the label from our original data array
        
	}
    

    });
})( jQuery )
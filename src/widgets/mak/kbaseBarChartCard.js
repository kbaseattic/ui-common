(function( $, undefined ) { 
    $.KBWidget({ 
        name: "KBaseBarChartCard", 
        parent: "kbaseWidget", 
        version: "1.0.0",

        options: {
            loadingImage: "assets/img/ajax-loader.gif",
            title: "MAK Result Overview Bar Chart",
            isInCard: false,
            width: 400,
            height: 800
        },

		init: function(options) {
            this._super(options);
            if (this.options.terms === null) {
                //throw an error
                return;
            }

            this.$messagePane = $("<div/>")
                                .addClass("kbwidget-message-pane")
                                .addClass("kbwidget-hide-message");
            this.$elem.append(this.$messagePane);

//            this.workspaceClient = new workspaceService(this.workspaceURL);
            return this.render();
        },

        render: function(options) {
			
			self = this;
			
			self.tooltip = d3.select("body")
                             .append("div")
                             .classed("kbcb-tooltip", true);
							 
			var terms = self.options.terms
			var chartWidth = self.options.width
			
			
			// var $sideChart = $("<div>").css({"width":chartWidth,"top":50,"position":"relative"})
			var flat = []			
			var termData = []						
			var termColors = {"TIGRFam":"#CC0000","GO":"#7A00CC","COG":"#666666","SEED":"#CC5200","KEGG":"#007A00"}
			var count = 0
			
			for (term in terms) {				
				temp = term.indexOf(":")
				termType = term.substring(0,temp)
				var termColor = termColors[termType];
				termData.push({"term":term,"tiles":terms[term],"color":termColor})
				flat.push(terms[term].length)
				count++
			}
			
			var x = d3.scale.linear().domain([0,d3.max(flat)]).range([0,chartWidth])			
			var selectionHandler = []
			var $mainDiv = $("<div id='mainDiv' style='overflow:auto;height:450px;resize:vertical'>")
			var $barChartDiv = $("<div id='barchart'>")
			$mainDiv.append($barChartDiv)
			var $barChart = d3.select($barChartDiv.get(0))
				.selectAll("div")
				.data(termData)
					.enter()
				.append("div")
					.style({
						"font": "10px sans-serif",						
						"text-align": "left",
						"padding": "3px",
						"margin": "1px",
						"color": "white"
					})
					.attr("class", function(d) {return d.color})
					.style("background", function(d) {return d.color})
					.style("width",function(d) {return x(d.tiles.length) + "px"})
					.attr("id",function(d) {
						temp = d.term.indexOf(":")
						term = d.term.substring(temp+1)
						return term.replace(/\s+/g, '').replace(/,/g,'')
					})
					.text(function (d) {return d.term})
					.on("mouseover",							
						function(d) {                            
							for (tile in d.tiles) {
								tileSelector = d.tiles[tile].replace(/\./g,'').replace(/\|/,'')	
								d3.select("#MAK_tile_"+tileSelector).style("background", "#F08A04")
							}
							d3.select(this).style("background", "#F08A04"); 
				
							// self.tooltip = self.tooltip.text("term: "+d.term+", hits: "+d.tiles.length);
							self.tooltip = self.tooltip.text(d.term+", hits: "+d.tiles.length);
							return self.tooltip.style("visibility", "visible");
						}
					)						 
                       .on("mouseout", 
							function(d) {
								for (tile in d.tiles) {
									tileSelector = d.tiles[tile].replace(/\./g,'').replace(/\|/,'')								
									d3.select("#MAK_tile_"+tileSelector).style("background", "steelblue")
									if ($("#MAK_tile_"+tileSelector).hasClass('pickedFromBar')) d3.select("#MAK_tile_"+tileSelector).style("background", "#F08A04")
									if ($("#MAK_tile_"+tileSelector).hasClass('currentHeatmap')) d3.select("#MAK_tile_"+tileSelector).style("background", "#99FFCC")
								}
								d3.select(this).style("background", d.color);								
								if ($(this).hasClass("pickedFromBar")) d3.select(this).style("background", "#F08A04");
								if ($(this).hasClass("pickedFromTile")) d3.select(this).style("background", "#00CCFF");
								if ($(this).hasClass("currentTerms")) d3.select(this).style("background", "#99FFCC");
								return self.tooltip.style("visibility", "hidden"); 
							}
                       )
                       .on("mousemove", 
                           function() { 
                               return self.tooltip.style("top", (d3.event.pageY+15) + "px").style("left", (d3.event.pageX-10)+"px");
                           }
                       )
					.on("click",
						function(d) {
							if ($(this).hasClass('pickedFromBar')) {								
								for (tile in d.tiles) {
									tileSelector = d.tiles[tile].replace(/\./g,'').replace(/\|/,'')
									temp = selectionHandler.indexOf(tileSelector)
									selectionHandler.splice(temp,1)
									if (selectionHandler.indexOf(tileSelector)==-1) {
										$("#MAK_tile_"+tileSelector).removeClass('pickedFromBar')
									}
								}
								$(this).removeClass('pickedFromBar')
							}
							else {																
								for (tile in d.tiles) {
									tileSelector = d.tiles[tile].replace(/\./g,'').replace(/\|/,'')
									selectionHandler.push(tileSelector)
									if (!$("#MAK_tile_"+tileSelector).hasClass('pickedFromBar')) $("#MAK_tile_"+tileSelector).addClass('pickedFromBar')									
								}
								$(this).addClass('pickedFromBar')
							}
						}
					)
				
			$instructions = $("<p><b><i>Click on a term bar, selections will be <span style='color:#F08A04'>orange</span>.</i></b></p><p><b><i>Selecting a bicluster (left) that contain terms in this chart will highlight the corresponding term(s) <span style='color:#00CCFF'>light blue</span>.</i></b></p>")
			self.$elem.append($instructions)	
			self.$elem.append($mainDiv)
			
			//console.log("here")
			return this;
		},
		
        getData: function() {
            return {
                type: "MAKResult BarChart",
                id: this.options.id,
                workspace: this.options.workspace,
                title: "MAK Result Overview Bar Chart"
            };
        },

        showMessage: function(message) {
            var span = $("<span/>").append(message);

            this.$messagePane.append(span);
            this.$messagePane.removeClass("kbwidget-hide-message");
        },

        hideMessage: function() {
            this.$messagePane.addClass("kbwidget-hide-message");
            this.$messagePane.empty();
        },

        rpcError: function(error) {
            console.log("An error occurred: " + error);
        }
	
    });
})( jQuery );
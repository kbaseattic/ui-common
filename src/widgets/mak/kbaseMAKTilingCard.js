(function( $, undefined ) { 
    $.KBWidget({ 
        name: "KBaseMAKTilingCard", 
        parent: "kbaseWidget", 
        version: "1.0.0",

        options: {
            id: null,
            ws: null,
            loadingImage: "assets/img/ajax-loader.gif",
            title: "MAK Result Overview Tiles",
            isInCard: false,
            width: 750,
            height: 800
        },

//        workspaceURL: "https://kbase.us/services/workspace",
        newWorkspaceServiceUrl: "https://kbase.us/services/ws", 
		
		//"http://dev04.berkeley.kbase.us:7058", //"https://kbase.us/services/ws", //http://140.221.84.209:7058/",

        init: function(options) {
            this._super(options);
            if (this.options.id === null) {
                //throw an error
                return;
            }

            this.$messagePane = $("<div/>")
                                .addClass("kbwidget-message-pane")
                                .addClass("kbwidget-hide-message");
            this.$elem.append(this.$messagePane);

//            this.workspaceClient = new workspaceService(this.workspaceURL);
              this.workspaceClient = new Workspace(this.newWorkspaceServiceUrl, { 'token' : this.options.auth, 'user_id' : this.options.userId});

            return this.render();
        },

        render: function(options) {

            
            var self = this;
			var loader = $("<span style='display:none'><img src='"+self.options.loadingImage+"'/></span>").css({"width":"100%","margin":"0 auto"})

			self.tooltip = d3.select("body")
                             .append("div")
                             .classed("kbcb-tooltip", true);
					
			//"MAKbiclusters"
			//"SOMR1_expr_refine_top_0.25_1.0_c_reconstructed.txt_MAKResult"
			//this.options.ws
			//this.options.id
			console.log(this.options.ws)
			console.log(this.options.id)
			self.$elem.append(loader)
			loader.show()
						
            this.workspaceClient.get_objects([{workspace: this.options.ws, name: this.options.id}], 
				
				function(data){
					
					
					Packer = function(w, h) {
					  this.init(w, h);
					};

					Packer.prototype = {

					  init: function(w, h) {
						this.root = { x: 50, y: 50, w: w, h: h };
					  },

					  fit: function(blocks) {
						var n, node, block;
						for (n = 0; n < blocks.length; n++) {
						  block = blocks[n];
						  if (node = this.findNode(this.root, block.w, block.h))
							block.fit = this.splitNode(node, block.w, block.h);
						}
					  },

					  findNode: function(root, w, h) {
						if (root.used)
						  return this.findNode(root.right, w, h) || this.findNode(root.down, w, h);
						else if ((w <= root.w) && (h <= root.h))
						  return root;
						else
						  return null;
					  },

					  splitNode: function(node, w, h) {
						node.used = true;
						node.down  = { x: node.x,     y: node.y + h, w: node.w,     h: node.h - h };
						node.right = { x: node.x + w, y: node.y,     w: node.w - w, h: h          };
						return node;
					  }

					}
							 
					var bicluster_info = data[0].data.sets[0]
					var biclusters = data[0].data.sets[0].biclusters
					var blocks = [];
					var terms = {};	  
					var binWidth   = self.options.width; // This represents the boundary of the div; can be used to set the boundary of the card.
					var binHeight  = self.options.height;
					var $bin = $("<div>").css({"float":"left","width":binWidth})									
					
					for (i=0;i<biclusters.length;i++) {
						w = Math.floor(biclusters[i].condition_ids.length)>=20?Math.floor(biclusters[i].condition_ids.length):20
						h = Math.floor(biclusters[i].gene_ids.length/2)>=20?Math.floor(biclusters[i].gene_ids.length/2):20						
						var enrichedTerms = []
						
						for (var term in biclusters[i].enriched_terms) {
							
							if (biclusters[i].enriched_terms[term] != "") {
								enrichedTerms.push(biclusters[i].enriched_terms[term])
								var termEntry = term+": "+biclusters[i].enriched_terms[term]
								if (termEntry in terms) terms[termEntry].push(biclusters[i].bicluster_id)
								else terms[termEntry] = [biclusters[i].bicluster_id]
							}
						}
						blocks.push( { w: w, h: h, index: i, id: biclusters[i].bicluster_id, terms: enrichedTerms, score: biclusters[i].full_crit } )
					}
					
					// console.log(blocks)
					
					colors = ["#CCCCCC","#CCA3A3","#CC7A7A","#CC5252","#CC2929","#CC0000"]
					
					var colorScale = function(d) {
						if (d >= 1) return colors[5]						
						if (d < 1 && d > 0.8) return colors[4]
						if (d <= 0.6 && d > 0.4) return colors[3]
						if (d <= 0.4 && d > 0.2) return colors[2]
						if (d <= 0.2 && d > 0) return colors[1]
						if (d <= 0) return colors[0]
					};
					// Instantiate Packer
					
					var count = 0
					
					while (count < blocks.length) {
						var packer = new Packer(binWidth-50, binHeight);
							  
						// Sort inputs by area for best results.
						blocks = blocks.sort(function(a,b) { return (a.h*a.w < b.h*b.w); }); 
						packer.fit(blocks);
					
						// Draw the blocks
							
						count = 0
						
						_.each(blocks, function(o,i){
							var block = blocks[i];
							if (block.fit) {
								count++
							}
						});
						binHeight+=500
						console.log(count)
					}
					loader.hide()
					_.each(blocks, function(o,i){
						var block = blocks[i];
						if (block.fit) {
							count++
							var borderWidth = 2;
							var h = block.h - (borderWidth*4);
							var w = block.w - (borderWidth*4);
							var cssClass = ['fadeInLeftBig','fadeInRightBig'][_.random(0,1)];
							var tileID = block.id.replace(/\./g,'').replace(/\|/,'')
							
							var $item = $('<div >', { "id": 'MAK_tile_'+tileID, class: 'item animated' })
													.css({ height: h, width: w, top: block.fit.y, left: block.fit.x, borderWidth: borderWidth,
													// "background": colorScale(block.score),
													"background": "steelblue",
													"position": "absolute",
													"border": "solid #1919A3",
													"-moz-border-radius": "1px",
													"-webkit-border-radius": "1px",
													"border-radius": "1px"})
													.addClass(cssClass)    
													.on("mouseover", 
														function() { 
															if (!$(this).hasClass('picked')) {
																d3.select(this).style("background", "#00FFCC"); 
																for (term in block.terms) {
																	barChartSelector = block.terms[term].replace(/\s+/g, '').replace(/,/g,'')
																	d3.select("#"+barChartSelector).style("background", "#00FFCC")
																}
															}
															self.tooltip = self.tooltip.text("bicluster: "+biclusters[block.index].bicluster_id+", rows: "+biclusters[block.index].gene_ids.length+", columns: "+biclusters[block.index].condition_ids.length+", number: "+i);
															return self.tooltip.style("visibility", "visible"); 
														}
													)
													.on("mouseout", 
														function() { 
															if (!$(this).hasClass('picked')) {
																d3.select(this).style("background", "steelblue");
																for (term in block.terms) {
																	barChartSelector = block.terms[term].replace(/\s+/g, '').replace(/,/g,'')																
																	origColor = d3.select("#"+barChartSelector).attr("class")
																	d3.select("#"+barChartSelector).style("background", origColor)
																}
															}
															return self.tooltip.style("visibility", "hidden"); 
														}
													)
													.on("mousemove", 
														function(e) { 
															return self.tooltip.style("top", (e.pageY+15) + "px").style("left", (e.pageX-10)+"px");
														}
													)
													.on("click", 
														function(event) {																														
															self.trigger("showMAKBicluster", { bicluster: [biclusters[block.index],bicluster_info], ws: self.options.ws, event: event });															
													});
														
									  
							setTimeout(function(){ $bin.append($item) }, 5*i);
						}
					});
						
					self.$elem.append($bin)
					
					self.trigger("showBarChart", {terms: terms, ws: self.options.ws, id: self.options.id})
					self.trigger("showMAKBicluster", { bicluster: [biclusters[0],bicluster_info], ws: self.options.ws})
					
                },

			    function(data) {
                                $('.loader-table').remove();
                                self.$elem.append('<p>[Error] ' + data.error.message + '</p>');
                                return;
                }
		    );
						
            this.hideMessage();
            return this;
			
			
        },


        getData: function() {
            return {
                type: "MAKResult Tiles",
                id: this.options.id,
                ws: this.options.ws,
                title: "MAK Result Overview Tiles"
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

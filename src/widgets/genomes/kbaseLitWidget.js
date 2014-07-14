(function( $, undefined ) { 
    $.KBWidget({ 
        name: "KBaseLitWidget", 
        parent: "kbaseWidget", 
        version: "1.0.0",

        options: {
            genomeID: null,
            loadingImage: "../../widgets/images/ajax-loader.gif",
            isInCard: false,
        },

		init: function(options) {
			this._super(options);

			if (this.options.row === null) {
				//throw an error
				return;
			}				
            return this.render();
		},
		
		addInfoRow: function(a, b) {
            return "<tr><td>" + a + "</td><td>" + b + "</td></tr>";
        },
		
		render: function(options) {
			
			self = this
			
			function xmlToJson(xml) {
	
				// Create the return object
				var obj = {};

				if (xml.nodeType == 1) { // element
					// do attributes
					if (xml.attributes.length > 0) {
					obj["@attributes"] = {};
						for (var j = 0; j < xml.attributes.length; j++) {
							var attribute = xml.attributes.item(j);
							obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
						}
					}
				} else if (xml.nodeType == 3) { // text
					obj = xml.nodeValue;
				}

				// do children
				if (xml.hasChildNodes()) {
					for(var i = 0; i < xml.childNodes.length; i++) {
						var item = xml.childNodes.item(i);
						var nodeName = item.nodeName;
						if (typeof(obj[nodeName]) == "undefined") {
							obj[nodeName] = xmlToJson(item);
						} else {
							if (typeof(obj[nodeName].push) == "undefined") {
								var old = obj[nodeName];
								obj[nodeName] = [];
								obj[nodeName].push(old);
							}
							obj[nodeName].push(xmlToJson(item));
						}
					}
				}
				return obj;
			};
			
			var lit = self.options.literature
			
			self.$infoPanel = $("<div>");
           
			self.$infoTable = $("<table>")
                              .addClass("table table-striped table-bordered");
			
			$.get(lit,
				function(data) {
					var htmlJson = xmlToJson(data)
					var query = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id='+htmlJson.eSearchResult[1].IdList.Id['#text']
					console.log(query)
					$.get(query,
						function(data) {
							var htmlJson = xmlToJson(data)
							console.log(htmlJson)
							var litInfo = htmlJson.eSummaryResult[1].DocSum.Item
							for (i=0;i<litInfo.length;i++) {
								if (litInfo[i]["@attributes"].Type == "List") {
									if ($.isArray(litInfo[i].Item)) {
										newRow = "<tr><td>"+litInfo[i]["@attributes"].Name+"</td><td>"
										for (j=0;j<litInfo[i].Item.length;j++) {
											newRow+=litInfo[i].Item[j]["#text"]+", "
										}
										newRow+="</td></tr>"
										self.$infoTable.append(newRow)
									}
									else {self.$infoTable.append(self.addInfoRow(litInfo[i].Item["@attributes"].Name,litInfo[i].Item["#text"]))}
								}
								else {self.$infoTable.append(self.addInfoRow(litInfo[i]["@attributes"].Name,litInfo[i]["#text"]))}
							}
						})
				})
			
			self.$infoPanel.append(self.$infoTable)
			self.$elem.append(self.$infoPanel);			
				
			return this;
		},
		
	    getData: function() {
            return {
                type: "LitWidget",
                id: this.options.genomeID,
                workspace: this.options.workspaceID,
                title: "Literature Widget"
            };
        },
	});
})(jQuery);
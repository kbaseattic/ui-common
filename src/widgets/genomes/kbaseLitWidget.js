(function( $, undefined ) { 
    $.KBWidget({ 
        name: "KBaseLitWidget", 
        parent: "kbaseWidget", 
        version: "1.0.0",

        options: {
            genomeID: null,
            workspaceID: null,
			kbCache: null,
            loadingImage: "../../widgets/images/ajax-loader.gif",
            isInCard: false,
			width: 600,
			height: 700,
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

		xmlToJson: function(xml) {
				self = this;
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
							obj[nodeName] = self.xmlToJson(item);
						} else {
							if (typeof(obj[nodeName].push) == "undefined") {
								var old = obj[nodeName];
								obj[nodeName] = [];
								obj[nodeName].push(old);
							}
							obj[nodeName].push(self.xmlToJson(item));
						}
					}
				}
				return obj;
		},
		
		render: function(options) {
			
			self = this;
			
			var lit = self.options.literature
			
			var resultsDiv = $("<div>").append('<table cellpadding="0" cellspacing="0" border="0" id="literature-table" \
                            class="table table-bordered table-striped" style="width: 100%; margin-left: 0px; margin-right: 0px;"/>')
			var searchBarDiv = $("<div>").append("<input type='text' id='lit-query-box'>")
			var searchBarButton = $("<input type='button' id='lit-search-button' value='Update Search'>")
									.on("click",function() {
										lit = $('#lit-query-box').val()
										tableInput = []
										litDataTable.fnDestroy()
										populateSearch(lit)
									})
		
			var tableInput = []
			var litDataTable;
		
			self.$elem.append(searchBarDiv.append(searchBarButton)).append(resultsDiv)
			
			$('#lit-query-box').val(lit)
			$('#lit-query-box').css({"width":"300px"})
			populateSearch(lit)
			
			function parseLitSearchDataTable(query) {
				var tableInputRow = {}
					
				$.get(query,
					function(data) {
						var htmlJson = self.xmlToJson(data)
						
						var litInfo = htmlJson.eSummaryResult[1].DocSum.Item
						// if (data[0].length == 0) {
								// self.$elem.append("<br><b>There are no other data objects (you can access) that reference this object.</b>");
						// } else {
						for (i=0;i<litInfo.length;i++) {
							if ("#text" in litInfo[i]) {
								if (litInfo[i]["@attributes"].Name == "Source") tableInputRow["jo"] = litInfo[i]["#text"]
								if (litInfo[i]["@attributes"].Name == "AuthorList") {
									if ($.isArray(litInfo[i].Item)) {
										var authors = ""
										for (j=0;j<litInfo[i].Item.length;j++) {
											authors+=litInfo[i].Item[j]["#text"]
											if (j!=litInfo[i].Item.length-1) authors+=", "
										}
										tableInputRow["au"] = authors													
									}
									else {tableInputRow["au"] = litInfo[i].Item["#text"]}
								}
								if (litInfo[i]["@attributes"].Name == "Title") {
									var pubmedLink = "http://www.ncbi.nlm.nih.gov/pubmed/"+htmlJson.eSummaryResult[1].DocSum.Id["#text"]
									tableInputRow["ti"] = "<a href=" + pubmedLink + " target=_blank>" + litInfo[i]["#text"] + "</a>"
								}
							}
						}				
						
					}
				)
				return tableInputRow
			}
			
			function populateSearch(lit) {
				$.get('http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term='+lit.replace(/\s+/g, "+"),
					function(data) {
						
						var htmlJson = self.xmlToJson(data)
						if ($.isArray(htmlJson.eSearchResult[1].IdList.Id)) {						
							
							for (x=0;x<htmlJson.eSearchResult[1].IdList.Id.length;x++) {
								var query = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id='+htmlJson.eSearchResult[1].IdList.Id[x]['#text']														 
								tableInput.push(parseLitSearchDataTable(query))
							}
						}
						else {									
							console.log(htmlJson)
							var query = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id='+htmlJson.eSearchResult[1].IdList.Id['#text']
							tableInput.push(parseLitSearchDataTable(query))																		
						}				
						var sDom = 't<flip>'
						if (tableInput.length<=10) { sDom = 'tfi'; }
						
						setTimeout(function(){						
							litDataTable = self.$elem.find('#literature-table').dataTable(
								{
									"sPaginationType": "full_numbers",
									"iDisplayLength": 10,
									"sDom": sDom,
									"aoColumns": [
										{sTitle: "Journal", mData: "jo"},
										{sTitle: "Authors", mData: "au"},
										{sTitle: "Title", mData: "ti"}
									],
									"aaData": tableInput
								}
							)
						},1000);
					}
				)
			}
				
			return this;
		},		
		
	    getData: function() {
            return {
                type: "LitWidget",
                id: this.options.genomeID,
                workspace: this.options.workspaceID,
                title: "Literature"
            };
        },
	});
})(jQuery);
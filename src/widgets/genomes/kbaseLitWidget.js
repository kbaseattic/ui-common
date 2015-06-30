define('KBaseLitWidget',
    [
        'jquery',
	'kbwidget'
    ],
    function ($) {
 
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
							obj["@attributes"][attribute.nodeName] = attribute.value;
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
			var loader = $("<div style='display:none'><img src='"+self.options.loadingImage+"'/></div>").css({"width":"100%","margin":"0 auto"})
			//var loader = $("<div style='display:none'>LOADING...</div>").css({"width":"100%","margin":"0 auto"})

			var resultsDiv = $("<div>").append('<table cellpadding="0" cellspacing="0" border="0" id="literature-table" \
                            class="table table-bordered table-striped" style="width: 100%; margin-left: 0px; margin-right: 0px;"/>')
			var searchBarDiv = $("<div>").append("<input type='text' id='lit-query-box'>")
			var searchBarButton = $("<input type='button' id='lit-search-button' value='Update Search'>")
									.on("click",function() {
										lit = self.$elem.find('#lit-query-box').val()
										tableInput = []
										litDataTable.fnDestroy()
										populateSearch(lit)
									})
		
			var tableInput = []
			var litDataTable;
		
			self.$elem.append(searchBarDiv.append(searchBarButton)).append(loader).append(resultsDiv)
			
			self.$elem.find('#lit-query-box').val(lit)
			self.$elem.find('#lit-query-box').css({"width":"300px"})
			populateSearch(lit)
			
			function populateSearch(lit) {
				loader.show()
				$.ajax({
					async: true,
					url: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmax=500&sort=pub+date&term='+lit.replace(/\s+/g, "+"),
					type: 'GET',
					success: 
					function(data) {
						
						var htmlJson = self.xmlToJson(data)
						var query = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id='
						var abstr = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&id='
						if (htmlJson.eSearchResult[1].Count["#text"] == "0") {
							var tableSettings = {
								// "sPaginationType": "full_numbers",
								"iDisplayLength": 4,
								"sDom": 't<flip>',
								"aoColumns": [
									{sTitle: "Journal", mData: "source"},
									{sTitle: "Authors", mData: "author"},
									{sTitle: "Title", mData: "title"},
									{sTitle: "Date", mData: "date"}
								],
								"aaData": []
							}	
							loader.hide()
							litDataTable = self.$elem.find('#literature-table').dataTable(tableSettings)
							return;
						}
						if ($.isArray(htmlJson.eSearchResult[1].IdList.Id)) {						
							
							for (x=0;x<htmlJson.eSearchResult[1].IdList.Id.length;x++) {
								query += htmlJson.eSearchResult[1].IdList.Id[x]['#text']
								if (x != htmlJson.eSearchResult[1].IdList.Id.length-1) query += ','
								// tableInput.push(parseLitSearchDataTable(query))
							}
						}
						else {
						    // I think this means no results? So here I just show an empty table--mike				
							
							// this line below was throwing an error:
							
							query += htmlJson.eSearchResult[1].IdList.Id['#text']
						}				
						var tableInput = []
						$.when($.ajax({
							async: true,
							url: query,
							type: 'GET'
						}))
						.then(
							function(data) {
								htmlJson = self.xmlToJson(data)
								console.log(htmlJson)
								var summaries = htmlJson.eSummaryResult[1].DocSum // Add pub date field into table as well.
								
								if ($.isArray(summaries)) {
									summaryList = []
									for (summary in summaries) {
										summaryList.push(summaries[summary])
									}
								}
								else {
									summaryList = [summaries]
								}
								
								for (summary_idx in summaryList) {
									summary = summaryList[summary_idx].Item
									var tableInputRow = {}									
									var isArticle = false
									for (item_idx in summary) {
										infoRow = summary[item_idx]
										if (infoRow["@attributes"].Name == "PubTypeList") {
											var publications = []
											if ("#text" in infoRow) {
												if ($.isArray(infoRow.Item)) {
													for (pub_idx in infoRow.Item) {
														if (infoRow.Item[pub_idx]["#text"]=="Journal Article") isArticle = true
													}											
												}
												else {
													if (infoRow.Item["#text"]=="Journal Article") isArticle = true
												}												
											}
										}
										if (infoRow["@attributes"].Name == "PubDate") tableInputRow["date"] = infoRow["#text"]
										if (infoRow["@attributes"].Name == "Source") tableInputRow["source"] = infoRow["#text"]
										if (infoRow["@attributes"].Name == "Title") {
											// console.log(infoRow)
											tableInputRow["title"] = "<a href=" + "https://www.ncbi.nlm.nih.gov/pubmed/"+summaryList[summary_idx].Id["#text"] + " target=_blank>" + infoRow["#text"] + "</a>"												
										}
										
										var articleIDs = []
										
										for (summary_idx in summaryList) {
											summary = summaryList[summary_idx].Item
											var tableInputRow = {}				
											var isJournal = false;
											for (item_idx in summary) {
												infoRow = summary[item_idx]
												if (infoRow["@attributes"].Name == "PubDate") tableInputRow["date"] = infoRow["#text"].substring(0,4)
												if (infoRow["@attributes"].Name == "Source") tableInputRow["source"] = infoRow["#text"]
												if (infoRow["@attributes"].Name == "Title") {
													tableInputRow["title"] = "<a href=" + "https://www.ncbi.nlm.nih.gov/pubmed/"+summaryList[summary_idx].Id["#text"] + " target=_blank>" + infoRow["#text"] + "</a>"
													tableInputRow["abstract"] = summaryList[summary_idx].Id["#text"]
													articleIDs.push(summaryList[summary_idx].Id["#text"])
												}
											}
											else {
												authors = "No authors found for this article."
											}
											tableInputRow["author"] = authors
										}
									}
									if (isArticle) tableInput.push(tableInputRow)
								}
								
								var sDom = 't<flip>'
								if (tableInput.length<=10) { sDom = 'tfi'; }					
								var tableSettings = {
									// "sPaginationType": "full_numbers",
									"iDisplayLength": 4,
									"sDom": sDom,
									"aoColumns": [
										{sTitle: "Journal", mData: "source"},
										{sTitle: "Authors", mData: "author"},
										{sTitle: "Title", mData: "title"},
										{sTitle: "Date", mData: "date"}
									],
									"aaData": tableInput
								}	
								loader.hide()
								litDataTable = self.$elem.find('#literature-table').dataTable(tableSettings)
							},
							function() {
								loader.hide()
								self.$elem.append("<br><b>Failed to retrieve literature search results. Try again later.</b>");
							}
						)						
					}
				})
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
});

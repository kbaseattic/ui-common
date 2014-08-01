(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseGenomeGeneTable",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        genome_id: null,
        ws_name: null,
        kbCache: null,
        width: 1150,
        options: {
            genome_id: null,
            ws_name: null,
            kbCache: null,
            loadingImage: "assets/img/ajax-loader.gif"
        },
        wsUrl: "https://kbase.us/services/ws/",

        init: function(options) {
            this._super(options);

            this.ws_name = this.options.ws_name;
            this.genome_id = this.options.genome_id;
            this.kbCache = this.options.kbCache;
            this.render();
            return this;
        },
        
        render: function() {
            var self = this;
        	var pref = this.uuid();
	    
            var container = this.$elem;

        	container.append("<div><img src=\""+self.options.loadingImage+"\">&nbsp;&nbsp;loading genes data...</div>");

        	var genomeRef = "" + this.options.ws_name + "/" + this.options.genome_id;
        	
            var objId = {ref: genomeRef};
            if (this.options.kbCache)
                prom = this.options.kbCache.req('ws', 'get_objects', [objId]);
            else
                prom = kb.ws.get_objects([objId]);

            var self = this;
            
            $.when(prom).done($.proxy(function(data) {
            		container.empty();
            		var gnm = data[0].data;
            		////////////////////////////// Genes Tab //////////////////////////////
            		container.append($('<div />').css("overflow","auto").append('<table cellpadding="0" cellspacing="0" border="0" id="'+pref+'genes-table" \
            		class="table table-bordered table-striped" style="width: 100%; margin-left: 0px; margin-right: 0px;"/>'));
            		var genesData = [];
            		var geneMap = {};
            		var contigMap = {};

            		if (gnm.contig_ids && gnm.contig_lengths && gnm.contig_ids.length == gnm.contig_lengths.length) {
            			for (var pos in gnm.contig_ids) {
            				var contigId = gnm.contig_ids[pos];
            				var contigLen = gnm.contig_lengths[pos];
            				contigMap[contigId] = {name: contigId, length: contigLen, genes: []};
            			}
            		}
            		
            		function geneEvents() {
            			$('.'+pref+'gene-click').unbind('click');
            			$('.'+pref+'gene-click').click(function() {
            				var geneId = [$(this).data('geneid')];
            				window.open("#/genes/" + genomeRef + "/" + geneId, "_blank");
            			});            
            		}

            		for (var genePos in gnm.features) {
            			var gene = gnm.features[genePos];
            			var geneId = gene.id;
            			var contigName = null;
            			var geneStart = null;
            			var geneDir = null;
            			var geneLen = null;
            			if (gene.location && gene.location.length > 0) {
            				contigName = gene.location[0][0];
            				geneStart = gene.location[0][1];
            				geneDir = gene.location[0][2];
            				geneLen = gene.location[0][3];
            			}
            			var geneType = gene.type;
            			var geneFunc = gene['function'];
            			if (!geneFunc)
            				geneFunc = '-';
            			genesData[genesData.length] = {id: '<a class="'+pref+'gene-click" data-geneid="'+geneId+'">'+geneId+'</a>', 
            					contig: contigName, start: geneStart, dir: geneDir, len: geneLen, type: geneType, func: geneFunc};
            			geneMap[geneId] = gene;
            			var contig = contigMap[contigName];
            			if (contigName != null && !contig) {
            				contig = {name: contigName, length: 0, genes: []};
            				contigMap[contigName] = contig;
            			}
            			if (contig) {
            				var geneStop = Number(geneStart);
            				if (geneDir == '+')
            					geneStop += Number(geneLen);
            				if (contig.length < geneStop) {
            					contig.length = geneStop;
            				}
            				contig.genes.push(gene);
            			}
            		}
            		var genesSettings = {
            				"sPaginationType": "full_numbers",
            				"iDisplayLength": 10,
            				"aaSorting" : [[0,'asc']],  //[1,'asc'],[2,'asc']],
            				"aoColumns": [
			                              {sTitle: "Gene ID", mData: "id"}, 
            				              {sTitle: "Contig", mData: "contig"},
            				              {sTitle: "Start", mData: "start", sWidth:"7%"},
            				              {sTitle: "Strand", mData: "dir", sWidth:"7%"},
            				              {sTitle: "Length", mData: "len", sWidth:"7%"},
            				              {sTitle: "Type", mData: "type", sWidth:"10%"},
            				              {sTitle: "Function", mData: "func", sWidth:"45%"}
            				              ],
            				              "aaData": [],
            				              "oLanguage": {
            				            	  "sSearch": "Search gene:",
            				            	  "sEmptyTable": "No genes found."
            				              },
            				              "fnDrawCallback": geneEvents
            		};
            		var genesTable = $('#'+pref+'genes-table').dataTable(genesSettings);
            		genesTable.fnAddData(genesData);
            }, this));
            $.when(prom).fail($.proxy(function(data) {
            		container.empty();
            		container.append('<p>[Error] ' + data.error.message + '</p>');
            }, this));
            return this;
        },
        
        getData: function() {
        	return {
        		type: "KBaseGenomeGeneTable",
        		id: this.options.ws_name + "." + this.options.genome_id,
        		workspace: this.options.ws_name,
        		title: "Gene list"
        	};
        },

        uuid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, 
                function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
        }
    });
})( jQuery );

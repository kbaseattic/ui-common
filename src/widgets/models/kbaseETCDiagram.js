(function( $, undefined ) {

$.KBWidget({
    name: "kbaseETCDiagram",    
    version: "1.0.0",
    options: {
    },

    getData: function() {
        return {
            id: this.options.id,
            type: "Model",
            workspace: this.options.ws,
            title: this.options.title
        };
    },

    init: function(options) {
        this._super(options);
        var self = this;

        var ele = this.$elem,
            ws = options.ws,
            name = options.name;

        // canvas
        var height = 800,
            width = 900;

        // boxes
        var w = 100,
            h = 30;

        var start_x = 100,
            start_y = 100;

        var padding = 10;

        ele.append('<div id="canvas">');
        var svg = d3.select("#canvas").append("svg")
                    .attr("width", width)
                    .attr("height", height)


        var p = kb.ws.get_objects([{workspace: 'nconrad:core', name: 'ETC_data'},
                                   {workspace: ws, name: name }
                                  ]);
        $.when(p).done(function(d) {
            ele.rmLoading();

            var etc = d[0].data,
                model = d[1].data;

            console.log('etc', etc);
            draw(etc, model);
        })

        function draw(etc, model) {

                //.append("g")
                    //.call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoom))
                //.append("g");

            var model_rxns = rxnDict(model);
            var rows = etc.pathways;

            console.log('etc_pathways', rows)          

            var electron_acceptors = [];
            for (var j=0; j<rows.length; j++) {
                if (rows[j].type == "electron_acceptor") {
                    electron_acceptors.push(rows[j]);
                    continue;
                }

                var name = rows[j].name 

                var g = svg.append('g');
                g.append("text")
                 .attr("x", start_x + w*j)
                 .attr("y", start_y - h/3 )
                 .text(name)
                 .attr("font-size", '12px');

                // FIXME: rename steps -> entities on backend
                var col_entities = rows[j].steps;
                var unique_entities
                for (var i in col_entities) {
                    var entity = col_entities[i];

                    var found_rxns = [];  //may need to know which rxn was found
                    for (var k in entity.reactions) {
                        var rxn_id = entity.reactions[i];

                        if (rxn_id in model_rxns) {

                            found_rxns.push(model_rxns[rxn_id]);
                        }
                    }

                    var x = start_x + w*j;
                    var y = start_y + h*i;
                    var color = (found_rxns.length > 0 ? gene_color : 'white')
                    drawBox(entity, x, y, color);
                }
            }

            console.log('electron_acceptors', electron_acceptors, (rows.length+1));
            for (var i in electron_acceptors) {
                var col_entities = electron_acceptors[i].steps;
                console.log('cols', col_entities)

                for (var j in col_entities) { 
                    var entity = col_entities[j];


                    var found_rxns = [];  //may need to know which rxn was found
                    for (var k in entity.reactions) {
                        var rxn_id = entity.reactions[i];

                        if (rxn_id in model_rxns) {

                            found_rxns.push(model_rxns[rxn_id]);
                        }
                    }                    

                    var x = start_x + w*(3);
                    var y = start_y + h*i;
                    var color = (found_rxns.length > 0 ? gene_color : 'white')                    
                    drawBox(entity, x, y, color);
                }
            }
            
        } // end draw 


        function drawBox(entity, x, y, color) {
            var rxns = entity.reactions;

            var g = svg.append('g');
            var rect = g.append('rect')
                        .attr('class', 'rxn')
                        .data( [{ x: x, y: y }])
                        .attr('x', x)
                        .attr('y', y)
                        .attr('width', w)
                        .attr('height', h)
                        .style('stroke', '#666')
                        .style('fill', (color ? color : 'white') );


            g.append("text")
             .attr("x", x+ 4)
             .attr("y", y + h/2)
             .text(entity.substrates.name) 
             .attr("font-size", '10px');

            var content = '<b>'+entity.substrates.name+' Substrates</b><br>'+
                           entity.substrates.compound_refs.join(', ')+'<br><br>'+
                        '<b>'+entity.products.name+' Products</b><br>'+
                            entity.products.compound_refs.join(', ');


            $(g.node()).popover({content: content,
                                 title: '<b>'+rxns.join(', ')+'</b>',
                                 trigger: 'hover',
                                 html: true,
                                 placement: 'bottom',
                                 container: 'body'});
        }


        return this;
    }  //end init


})
}( jQuery ) );

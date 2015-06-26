define('kbaseETCDiagram',
    [
        'jquery',
	'kbwidget'
    ],
    function ($) {


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

        var start_x = 25,
            start_y = 75;

        var font_size = '12px';

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

            var model_rxns = rxnDict(model),
                rows = etc.pathways;

            // first get unique substrates (by name), and filter out electron electron_acceptors
            var electron_acceptors = [];
            var unique_columns = [];
            for (var j=0; j<rows.length; j++) {
                if (rows[j].type == "electron_acceptor") {
                    electron_acceptors.push(rows[j]);
                    continue;
                }

                var name = rows[j].name

                //var g = svg.append('g');
                if (name.indexOf('/') === -1) {
                  svg.append("text")
                     .attr("y", start_y - h/3)
                     .attr("x", start_x + w*j)
                     .text(name)
                     .attr('font-size', font_size)
                } else {
                  svg.append("text")
                     .attr("y", start_y - h/1.2)
                     .attr("x", start_x + w*j)
                     .text(name.split('/')[0]+' & ')
                     .attr('font-size', font_size);
                  svg.append("text")
                     .attr("y", start_y - h/3)
                     .attr("x", start_x + w*j)
                     .text(name.split('/')[1])
                     .attr('font-size', font_size);
                }

                // FIXME: rename steps -> entities on backend
                var col_entities = rows[j].steps;
                var unique_entities = {};
                for (var i in col_entities) {
                    var entity = col_entities[i];

                    if (entity.substrates.name in unique_entities )
                        unique_entities[entity.substrates.name].push(entity);
                    else
                        unique_entities[entity.substrates.name] = [entity]
                }
                unique_columns.push(unique_entities)
            }



            // next, plot first x columns
            for (var i=0; i < unique_columns.length; i++) {
                var entities = unique_columns[i];

                var z = 0;
                for (var entity in entities) {
                    var name = entity

                    var info = entities[name];
                    var found_rxns = [];
                    for (var j=0; j<info.length; j++) {
                        var obj = info[j]

                        var found_rxns = [];  //may need to know which rxn was found
                        for (var k=0; k<obj.reactions.length; k++) {
                            var rxn_id = obj.reactions[k];

                            if (rxn_id in model_rxns)
                                found_rxns.push(model_rxns[rxn_id]);
                        }
                    }

                    var x = start_x + w*i;
                    var y = start_y + h*z;
                    var color = (found_rxns.length > 0 ? gene_color : 'white')

                    drawBox(name, x, y, color, info);
                    z++;
                }
            }


            svg.append("text")
                 .attr("y", start_y - h/3)
                 .attr("x", start_x + w*(3))
                 .text('Electron Acceptors')
                 .attr('font-size', font_size);

            for (var i in electron_acceptors) {
                var col_entities = electron_acceptors[i].steps;

                for (var j in col_entities) {
                    var entity = col_entities[j];



                    var found_rxns = [];  //may need to know which rxn was found
                    for (var k in entity.reactions) {
                        var rxn_id = entity.reactions[k];

                        if (rxn_id in model_rxns) found_rxns.push(model_rxns[rxn_id]);
                    }

                    var x = start_x + w*(3);
                    var y = start_y + h*i;
                    var color = (found_rxns.length > 0 ? gene_color : 'white')

                    console.log(entity)
                    var reactions = entity.reactions;
                    var substrates = entity.substrates;
                    var products = entity.products;

                    var content = reactions[0]+' - '+
                              substrates.name+ ' - '+
                              products.name+'<br>'

                    drawBox(electron_acceptors[i].name, x, y, color, [entity]);
                }
            }
        } // end draw



        function drawBox(name, x, y, color, info) {
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
             .text(name)
             .attr("font-size", '10px');

             var content = $('<div>');
             for (var i=0; i<info.length; i++) {
                var reactions = info[i].reactions;
                var substrates = info[i].substrates;

                var products = info[i].products;

                content.append('('+i+') '+reactions[0]+' - '+
                                          substrates.name+ ' - '+
                                          products.name+'<br>')
             }

            //var content = JSON.stringify(info);


            $(g.node()).popover({content: content,
                                 trigger: 'hover',
                                 html: true,
                                 placement: 'bottom',
                                 container: 'body'});
        }


        function drawEA(entity, x, y, color) {
            //var rxns = entity.reactions;

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
             .text(entity.name)
             .attr("font-size", '10px');

            //var content = '<b>'+entity.substrates.name+' Substrates</b><br>'+
            //               entity.substrates.compound_refs.join(', ')+'<br><br>'+
            //            '<b>'+entity.products.name+' Products</b><br>'+
            //                entity.products.compound_refs.join(', ');


            $(g.node()).popover({content: '',
                                 title: entity.name,
                                 //title: '<b>'+rxns.join(', ')+'</b>',
                                 trigger: 'hover',
                                 html: true,
                                 placement: 'bottom',
                                 container: 'body'});
        }

        return this;
    }  //end init


})
});

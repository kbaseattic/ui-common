/*

*/

define('kbaseForcedNetwork',
    [
        'jquery',
        'd3',
        'kbaseVisWidget',
        'RGBColor',
        'geometry_rectangle',
        'geometry_point',
        'geometry_size',
    ], function( $ ) {

    $.KBWidget({

	    name: "kbaseForcedNetwork",
	  parent: "kbaseVisWidget",

        version: "1.0.0",
        options: {
            overColor : 'blue',
            nodeColor : 'gray',
            lineColor : 'gray',
            lineWeight : 3,
            nodeStrokeColor : 'black',
            nodeStrokeWeight : 1,
            nodeRadius : 10,
            highlightColor : 'yellow',
            highlightNodeStrokeWeight : 3,
            linkDistance : 100,
            charge : -100,
        },

        _accessors : [
            'forceLayout',
            'restart',
        ],

        defaultXDomain : function() {

            if (this.dataset() == undefined) {
                return [0,0];
            }

            var min = 2.0 * d3.min(this.dataset().nodes.map( function(d) {return d.x}));
            if (min > 0) {
                min = 0;
            }

            return [
                min,
                2.0 * d3.max(this.dataset().nodes.map( function(d) {return d.x}))
            ];
        },

        defaultYDomain : function() {

            if (this.dataset() == undefined) {
                return [0,0];
            }

            var min = 2.0 * d3.min(this.dataset().nodes.map( function(d) {return d.y}));
            if (min > 0) {
                min = 0;
            }

            return [
                min,
                2.0 * d3.max(this.dataset().nodes.map( function(d) {return d.y}))
            ];
        },

        appendUI : function ($elem) {
            this._super($elem);

            var mousedown = undefined;
            var chart = this.data('D3svg').select('.chart');
            var chartBounds = this.chartBounds();
            var selectionBox = undefined;

            var $force = this;
            var selectedNodes = [];

            chart
                .on('mousedown', function() {

                    if (d3.select(d3.event.target).attr('class') != 'background') {
                        return;
                    }
                    var coords = d3.mouse(this);
                    mousedown = new Point(coords[0] + chartBounds.origin.x,coords[1] + chartBounds.origin.y);

                    selectionBox = chart.append('rect')
                        .attr('class', 'selectionBox')
                        .attr('x', mousedown.x)
                        .attr('y', mousedown.y)
                        .attr('width', 0)
                        .attr('height', 0)
                        .attr('stroke', '#222')
                        .attr('stroke-width', '3')
                        .attr('fill', new RGBColor(0,0,0).asStringWithAlpha(0.1))
                })
                .on('mousemove', function() {
                    if (mousedown != undefined) {
                        var coords = d3.mouse(this);
                        var mouseCoords = new Point(coords[0] + chartBounds.origin.x,coords[1] + chartBounds.origin.y);

                        var boxRect = mousedown.rectWithPoint(mouseCoords);

                        boxRect.origin.x -= chartBounds.origin.x;
                        boxRect.origin.y -= chartBounds.origin.y;

                        selectionBox.attr('x', boxRect.origin.x);
                        selectionBox.attr('y', boxRect.origin.y);
                        selectionBox.attr('width', boxRect.size.width);
                        selectionBox.attr('height', boxRect.size.height);

                        if (1){//! selectedNodes.length) {
                            var nodes = $force.forceLayout().nodes();

                            nodes.forEach(
                                function (node, idx) {

                                    var nodeRect = new Rectangle(
                                        new Point(node.x - node.radius, node.y - node.radius),
                                        new Size(node.radius * 2, node.radius * 2)
                                    );

                                    if (nodeRect.intersects(boxRect)) {
                                        selectedNodes.push(node);
                                        node.highlighted = true;
                                    }
                                    else {
                                        node.highlighted = false;
                                    }

                                }
                            );

                            $force.restart()();
                        }

                    }
                })
                .on('mouseup', function() {

                    if (mousedown == undefined) {
                        return;
                    }

                    var coords = d3.mouse(this);
                    var mouseCoords = new Point(coords[0] + chartBounds.origin.x,coords[1] + chartBounds.origin.y);
                    var boxRect = mousedown.rectWithPoint(mouseCoords);

                    mousedown = undefined;
                    selectionBox = undefined;
                    chart.select('.selectionBox').remove();

                    selectedNodes.forEach(
                        function (node, idx) {
                            node.highlighted = false;
                        }
                    );

                    selectedNodes = [];

                    $force.restart()();

                });

            return this;

        },

        renderChart : function() {

            if (this.dataset() == undefined) {
                return;
            }

            var bounds = this.chartBounds();
            var $force  = this;

            var nodes = this.data('D3svg').select('.chart').selectAll('.node');
            var links = this.data('D3svg').select('.chart').selectAll('.edge');

            var forceLayout = this.forceLayout();
            if (forceLayout == undefined) {

                var tick = function() {

                    links.attr("x1", function(d) { return d.source.x; })
                         .attr("y1", function(d) { return d.source.y; })
                         .attr("x2", function(d) { return d.target.x; })
                         .attr("y2", function(d) { return d.target.y; });

                    nodes.attr("cx", function(d) { return d.x; })
                         .attr("cy", function(d) { return d.y; });

                };

                forceLayout = d3.layout.force()
                    .nodes($force.dataset().nodes)
                    .links($force.dataset().edges)
                    .size([bounds.size.width, bounds.size.height])
                    .charge(
                        function(link, index) {
                            return link.charge || $force.options.charge;
                        }
                    )
                    .linkDistance(
                        function(link, index) {
                            return link.linkDistance || $force.options.linkDistance;
                        }
                    )
                    .on("tick", tick);

                this.forceLayout(forceLayout);
            }


            var start = function() {
                links = links.data(
                    forceLayout.links()//,
                    //function(d) { return d.source.name + "-" + d.target.name }
                );

                links
                    .enter()
                    .insert("line", ".node")
                    .attr("class", "edge")
                    .attr('stroke', function(d) { return d.color || $force.options.lineColor })
                    .attr('stroke-width', function(d) { return d.weight || $force.options.lineWeight });

                links
                    .exit()
                    .remove();

                nodes = nodes.data(
                    forceLayout.nodes()//,
                    //function(d) { return d.name}
                );

                var mouseNodeAction = function() {
                    this.on('mouseover', function(d) {
                        $force.showToolTip(
                            {
                                label : d.label || 'Node: ' + d.name,
                                coords : d3.mouse(this),
                            }
                        );
                        d.highlighted = true;
                        start();
                    })
                    .on('mouseout', function(d) {
                        $force.hideToolTip();
                        d.highlighted = false;
                        start();
                    })
                    .call(forceLayout.drag);
                    return this;
                };

                var nodeTown = function() {
                    this
                        .attr('r', function(d) { return d.radius || $force.options.nodeRadius })
                        .attr('fill', function(d) {
                            return d.color || $force.options.nodeColor
                        })
                        .attr('stroke', function(d) {
                            if (d.highlighted) {
                                return $force.options.highlightColor;
                            }
                            else {
                                return d.stroke || $force.options.nodeStrokeColor
                            }
                        })
                        .attr('stroke-width', function(d) {
                            if (d.highlighted) {
                                return $force.options.highlightNodeStrokeWeight;
                            }
                            else {
                                return d.strokeWidth || $force.options.nodeStrokeWeight;
                            }
                        })
                        .attr('data-name', function(d) { return d.name })
                    ;

                    return this;
                };

                nodes
                    .enter()
                    .append("circle")
                        .attr("class", 'node')
                        .call(nodeTown)
                        .call(mouseNodeAction);

                nodes
                    .call(mouseNodeAction)
                    .transition()
                    .duration(100)
                        .call(nodeTown);


                nodes
                    .exit()
                    .remove();

                forceLayout.start();
            }

            $force.restart(start);

            start();


        },

        renderXAxis : function() {},
        renderYAxis : function() {},


    });

} );

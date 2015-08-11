/*

*/

define(
    [
        'jquery',
        'd3',
        'kb.widget.vis.widget',
        'kb.RGBColor',
        'kb.geometry.rectangle',
        'kb.geometry.point',
        'kb.geometry.size',
    ], function( $ ) {

    'use strict';

    $.KBWidget({

	    name: "kbaseTreechart",
	  parent: "kbaseVisWidget",

        version: "1.0.0",
        options: {
            debug       : false,

            xGutter     : 0,
            xPadding    : 0,
            yGutter     : 0,
            yPadding    : 0,

            bgColor : 'none',

            red : undefined,
            blue : undefined,

            distance : 100,

            redBlue : false,

            strokeWidth : 1.5,
            transitionTime : 500,
            lineStyle  : 'curve', // curve / straight / square / step

            fixed : 0,
            displayStyle : 'NTnt',

        },

        _accessors : [
            'comparison',
        ],

        afterInArray : function (val, array) {
            var idx = array.indexOf(val) + 1;
            if (idx >= array.length) {
                idx = 0;
            }

            return array[idx];
        },

        countVisibleNodes : function(nodes) {
            var num = 1;
            if (nodes.children != undefined && (nodes.open == true || nodes.open == undefined)) {
                for (var idx = 0; idx < nodes.children.length; idx++) {
                    num += this.countVisibleNodes(nodes.children[idx]);
                }
            }

            return num;
        },

        findInChildren : function(target, search) {
            if (target == search) {
                return true;
            }
            if (search != undefined && search.children != undefined) {
                for (var idx = 0; idx < search.children.length; idx++) {
                    if (this.findInChildren(target, search.children[idx])) {
                        return true;
                    }
                }
            }

            return false;
        },

        redBlue : function(node, d) {
            var $tree = this;
            if ($tree.options.red == d) {
                $tree.options.red = undefined;
                $tree.options.redNode = undefined;
            }

            if ($tree.options.blue == d) {
                $tree.options.blue = undefined;
                $tree.options.blueNode = undefined;
            }

            var colors = ['red', 'black'];

            if ($tree.options.red != undefined && $tree.options.blue != undefined) {
                $tree.options.red.fill = 'black';
                d3.select($tree.options.redNode).attr('fill', $tree.options.red.fill);
                $tree.options.red = undefined;
                colors = ['red', 'black'];
            }
            else if ($tree.options.red != undefined) {
                colors = ['blue', 'black'];
            }

            else if ($tree.options.red == undefined && $tree.options.blue != undefined) {
                colors = ['red', 'black'];
            } 

            d.fill = $tree.afterInArray(d.fill, colors);

            if (d.fill != 'black' && d.children != undefined
                && ! $tree.findInChildren($tree.options.red, d) && ! $tree.findInChildren($tree.options.blue, d)) {

                $tree.toggle(d);
                $tree.updateTree(d);

            }

            if (d.fill != 'black') {
                $tree.options[d.fill] = d;
                $tree.options[d.fill + 'Node'] = node;
            }

            d3.select(node).attr('fill', d.fill);

            if ($tree.options.red != undefined && $tree.options.blue != undefined) {
                $tree.comparison('Comparing ' + $tree.options.red.name + ' vs ' + $tree.options.blue.name);
            }
            else {
                $tree.comparison('');
            }
        },

        updateTree : function(source) {
            var chart = this.data('D3svg').select( this.region('chart'));

            var $tree = this;

            var duration = this.initialized ? this.options.transitionTime : 0;

            var rootOffset = 0;

            var bounds = this.chartBounds();

            //okay. This is going to suck. Figure out the appropriate depth of the root element. Create a fake SVG element, toss the root node into there, and yank out its width.
            var fakeDiv = document.createElement('div');

            var root = source;
            while (root.parent != undefined) {
                root = root.parent;
            }

            var rootText = chart.append('text')
                .attr('style', 'visibility : hidden; font-size : 11px;cursor : pointer;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;')
                .attr('class', 'fake')
                .text(root.name);
            rootOffset = rootText[0][0].getBBox().width + 10 + bounds.origin.x;

var newHeight = 15 * this.countVisibleNodes(this.dataset());
//this.$elem.animate({'height' : newHeight + this.options.yGutter + this.options.yPadding}, 500);
//            this.$elem.height(newHeight);
            this.height(this.$elem.height());
            bounds.size.height = newHeight;
            this.treeLayout = this.layoutType()
                .size([bounds.size.height, bounds.size.width]);


            this.nodes = this.treeLayout.nodes(this.dataset()).reverse();

var chartOffset = 0;

            function depth(d) {

                var distance = $tree.options.distance;
                if (d.distance != undefined) {
                    distance *= d.distance;
                };

                if (d.parent != undefined) {
                    distance += depth(d.parent);
                }
                else {
                    distance = rootOffset + chartOffset;
                }

                return distance;
            };

            var maxOffset = 0;
            var minOffset = 5000000000;

            function findWidth(text, d) {
                    var box = text[0][0].getBBox();
                    var right = d.children || d._children
                        ? d.y + 10
                        : d.y + box.width + 10;
                    var left = d.children || d._children
                        ? d.y + 10 - box.width
                        : d.y + 10;

                    return [left, right, right - left];
            }

            this.nodes.forEach(
                function(d) {
                    d.y = depth(d);

                    var fakeText = chart.append('text')
                        .attr('style', 'visibility : hidden;font-size : 11px;cursor : pointer;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;')
                .attr('class', 'fake')
                        .text(d.name);

                    var fakeBounds = findWidth(fakeText, d);
                    var fakeLeft = fakeBounds[0];
                    var fakeRight = fakeBounds[1];
                    d.width = fakeBounds[2];

                    if ($tree.options.labelWidth && d.width > $tree.options.labelWidth) {
                        var words = d.name.split(/\s+/);
                        var shortWords = [words.shift()];

                        fakeText.text(shortWords.join(' '));
var throttle = 0
                        while (findWidth(fakeText, d)[2] < $tree.options.labelWidth && throttle++ < 40) {
                            shortWords.push(words.shift());
                            fakeText.text(shortWords.join(' '));
                        }

                        words.push(shortWords.pop());

                        d.name_truncated = shortWords.join(' ');

                    }

                    if (fakeRight > maxOffset) {
                        maxOffset = fakeRight;
                    }

                    if (fakeLeft < minOffset) {
                        minOffset = fakeLeft;
                    }

                }
            );

            var widthDelta = 0;
            if (minOffset < bounds.origin.x) {
                widthDelta += bounds.origin.x - minOffset;
                chartOffset = widthDelta;
            }
            if (maxOffset > bounds.origin.x + bounds.size.width) {
                widthDelta += maxOffset - bounds.size.width;
            }

            $tree.options.fixedDepth = 0;

            this.nodes.forEach(
                function(d) {
                    d.y = depth(d);

                    if (d.y > $tree.options.fixedDepth) {
                        $tree.options.fixedDepth = d.y;
                    }
                }
            );

            chart.selectAll('.fake').remove();

            var newWidth = this.options.xGutter + this.options.yGutter + widthDelta + bounds.size.width;
            if (newWidth < $tree.options.originalWidth) {
                newWidth = $tree.options.originalWidth;
            }

            this.$elem.animate(
                {
                    'width' : newWidth,
                    'height' : newHeight + this.options.yGutter + this.options.yPadding
                },
                duration
            );

            var uniqueness = function (d) {
                var name = d.name;
                if (name == undefined && $tree.options.nameFunction != undefined) {
                    name = $tree.options.nameFunction.call($tree, d);
                }

                if (d.parent != undefined) {
                    name = uniqueness(d.parent) + '/' + name;
                }

                return name;
            }

            var node = chart.selectAll("g.node")
                .data(this.nodes, uniqueness);

            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
            ;

            nodeEnter.append("circle")
                .attr("r", 1e-6)
                .attr('style', 'cursor : pointer; fill : #fff; stroke : steelblue; stroke-width : 1.5px')
                .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; })
                .on("click", function(d) {

                    if ($tree.oneClick) {

                        if ($tree.options.nodeDblClick) {
                            $tree.oneClick = false;
                            $tree.options.nodeDblClick(d);
                        }
                    }
                    else {
                        $tree.oneClick = true;
                        setTimeout( function() {
                            if ($tree.oneClick) {
                                $tree.oneClick = false;
                                if ($tree.options.nodeClick) {
                                    return $tree.options.nodeClick(d);
                                }
                                else {
                                    if (! $tree.findInChildren($tree.options.red, d) && ! $tree.findInChildren($tree.options.blue, d)) {
                                        $tree.toggle(d); $tree.updateTree(d);
                                    }
                                }
                            }
                        }, 250)
                    }

                })
                .on('mouseover', function(d) {
                    if ($tree.options.tooltip) {
                        $tree.options.tooltip(d);
                    }
                    else if (d.tooltip) {
                        $tree.showToolTip({label : d.tooltip})
                    }
                })
                .on('mouseout', function(d) {
                    $tree.hideToolTip()
                })
            ;

            nodeEnter.append("text")
                //.attr('style', 'font-size : 11px')
                .attr('style', 'font-size : 11px;cursor : pointer;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;')
                .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
                .attr("dy", ".35em")
                .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
                .text(function(d) {
                    var name = d.name;
                    if (d.width > $tree.options.labelWidth && $tree.options.truncationFunction) {
                        name = $tree.options.truncationFunction(d, this, $tree);
                    }
                    return name;
                })
                .style("fill-opacity", 1e-6)
                .attr('fill', function(d) { return d.fill || 'black'})
                .on("click", function(d) {

                    if ($tree.oneClick) {

                        if ($tree.options.textDblClick) {
                            $tree.oneClick = false;
                            $tree.options.textDblClick(d);
                        }
                    }
                    else {
                        $tree.oneClick = true;
                        setTimeout( function() {
                            if ($tree.oneClick) {
                                $tree.oneClick = false;
                                if ($tree.options.textClick) {
                                    return $tree.options.textClick(d);
                                }

                                if ($tree.options.redBlue) {
                                    $tree.redBlue(this, d);
                                }
                            }
                        }, 250)
                    }

                })

            ;

            nodeEnter.each(function(d,i) {
                if ($tree.options.nodeEnterCallback) {
                    $tree.options.nodeEnterCallback.call($tree, d, i, this, duration);
                }
            });


            // Transition nodes to their new position.
            var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function(d) {
                    var y = $tree.options.fixed && (! d.children || d.length == 0)
                        ? $tree.options.fixedDepth
                        : d.y;
                return "translate(" + y + "," + d.x + ")"; })
            ;

            nodeUpdate.select("circle")
                .attr("r", 4.5)
                .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; })

                .attr('visibility', function(d) {
                    var isLeaf = true;
                    if (d.children && d.children.length) {
                        isLeaf = false;
                    }

                    if (isLeaf && $tree.options.displayStyle.match(/n/)) {
                        return 'visible';
                    }
                    else if (! isLeaf && $tree.options.displayStyle.match(/N/)) {
                        return 'visible';
                    }
                    else {
                        return 'hidden';
                    }
                });

            nodeUpdate.select("text")
                .style("fill-opacity", 1)
                .attr('visibility', function(d) {
                    var isLeaf = true;
                    if (d.children && d.children.length) {
                        isLeaf = false;
                    }

                    if (isLeaf && $tree.options.displayStyle.match(/t/)) {
                        return 'visible';
                    }
                    else if (! isLeaf && $tree.options.displayStyle.match(/T/)) {
                        return 'visible';
                    }
                    else {
                        return 'hidden';
                    }
                });

            nodeUpdate.each(function(d,i) {
                if ($tree.options.nodeUpdateCallback) {
                    $tree.options.nodeUpdateCallback.call($tree, d, i, this, duration);
                }
            });

            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function(d) { return "translate(" + source.y  + "," + source.x + ")"; })
                .remove()
                ;

            nodeExit.select("circle")
                .attr("r", 1e-6);

            nodeExit.select("text")
                .style("fill-opacity", 1e-6);

            nodeExit.each(function(d,i) {
                if ($tree.options.nodeExitCallback) {
                    $tree.options.nodeExitCallback.call($tree, d, i, this, duration);
                }
            });

            // Update the links�
            var link = chart.selectAll("path.link")
                .data($tree.treeLayout.links($tree.nodes), function(d) { return uniqueness(d.target) });

            // Enter any new links at the parent's previous position.
            link.enter().insert("path", "g")
                .attr("class", "link")
                .attr('fill', 'none')
                .attr('stroke', '#ccc')
                .attr('stroke-width', function (d) { var weight = d.target.weight || $tree.options.strokeWidth; return weight + 'px'; } )
                .attr("d", function(d) {
                  var o = {x: source.x0, y: source.y0};
                  return $tree.diagonal({source: o, target: o});
                })
            .transition()
                .duration(duration)
                .attr("d", $tree.diagonal);

            // Transition links to their new position.
            link.transition()
                .duration(duration)
                .attr("d", $tree.diagonal);

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(duration)
                .attr("d", function(d) {
                  var o = {x: source.x, y: source.y};
                  return $tree.diagonal({source: o, target: o});
                })
                .remove();

            // Stash the old positions for transition.
            $tree.nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
            });


        },

        layoutType : function() {
            if (this.options.layout == 'cluster') {
                return d3.layout.cluster()
            }
            else {
                return d3.layout.tree();
            }
        },

        renderChart : function() {

            if (this.dataset() == undefined) {
                  return;
            }

//            this.$elem.height(30 * this.countVisibleNodes(this.dataset()));
//            this.height(this.$elem.height());

            this.options.originalWidth = this.$elem.width();

            var i = 0;
            var bounds = this.chartBounds();

            if (this.treeLayout == undefined) {
                  this.treeLayout = this.layoutType()
                      .size([bounds.size.height, bounds.size.width]);
            }

            var $tree = this;

            if (this.options.lineStyle == 'curve') {
                this.diagonal = d3.svg.diagonal()
                    .projection(function(d) {
                        var y = $tree.options.fixed && (! d.children || d.length == 0)
                            ? $tree.options.fixedDepth
                            : d.y;
                        return [y, d.x];
                    });
            }
            else if (this.options.lineStyle == 'straight') {
                this.diagonal = function(d) {

                    var y = $tree.options.fixed && (! d.target.children || d.target.length == 0)
                        ? $tree.options.fixedDepth
                        : d.target.y;

                    return "M" + d.source.y + ',' + d.source.x + 'L' + y + ',' + d.target.x;
                }
            }
            else if (this.options.lineStyle == 'square') {
                this.diagonal = function(d) {

                    var y = $tree.options.fixed && (! d.target.children || d.target.length == 0)
                        ? $tree.options.fixedDepth
                        : d.target.y;

                    return "M" + d.source.y + ',' + d.source.x +
                           'L' + d.source.y + ',' + d.target.x +
                           'L' + y + ',' + d.target.x
                    ;
                }
            }
            else if (this.options.lineStyle == 'step') {
                this.diagonal = function(d) {

                    var y = $tree.options.fixed && (! d.target.children || d.target.length == 0)
                        ? $tree.options.fixedDepth
                        : d.target.y;

                    var halfY = (y - d.source.y ) / 2 + d.source.y;

                    return "M" + d.source.y + ',' + d.source.x +
                           'L' + halfY + ',' + d.source.x +
                           'L' + halfY + ',' + d.target.x +
                           'L' + y + ',' + d.target.x
                    ;
                }
            }

            // Compute the new tree layout.
            this.nodes = this.treeLayout.nodes(this.dataset()).reverse();

            this.dataset().x0 = bounds.size.height / 2;
            this.dataset().y0 = 0;

              function toggleAll(d) {
                if (d.children) {
                  d.children.forEach(toggleAll);
                  if (d.open == false) {
                      $tree.toggle(d);
                  }
                }
              }

            var root = this.dataset();
            root.children.forEach(toggleAll);


            this.updateTree(this.dataset());
            this.initialized = true;
        },


        toggle : function(d) {
            if (d.children != undefined) {
              d._children = d.children;
              d.children = null;
            } else {
              d.children = d._children;
              d._children = null;

            }
        },


    });

} );

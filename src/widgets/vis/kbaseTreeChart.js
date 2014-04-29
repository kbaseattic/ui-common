/*

*/

define('kbaseTreechart',
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

	    name: "kbaseTreechart",
	  parent: "kbaseVisWidget",

        version: "1.0.0",
        options: {
            debug       : false,

            xGutter     : 20,
            xPadding    : 20,
            yGutter     : 20,
            yPadding    : 20,

            ticker      : 0,

            bgColor : 'none',

            red : undefined,
            blue : undefined,

            chartOffset : 0,

        },

        _accessors : [
            'ticker',
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

        updateTree : function(source) {
console.log("DISPLAY ALL");
console.log(source);
            var chart = this.data('D3svg').select('.chart');

            var $tree = this;

            var i = this.ticker();

            var duration = 500;

            var rootOffset = 0;

            //okay. This is going to suck. Figure out the appropriate depth of the root element. Create a fake SVG element, toss the root node into there, and yank out its width.
            var fakeDiv = document.createElement('div');

            var rootText = chart.append('text')
                .attr('style', 'font-size : 11px;cursor : pointer;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;')
                .attr('class', 'fake')
                .text(source.name);
            rootOffset = rootText[0][0].getBBox().width + 10;
console.log(rootText[0][0]);
console.log(rootOffset);
var newHeight = 30 * this.countVisibleNodes(this.dataset());
//this.$elem.animate({'height' : newHeight + this.options.yGutter + this.options.yPadding}, 500);
//            this.$elem.height(newHeight);
            this.height(this.$elem.height());


            var bounds = this.chartBounds();
            bounds.size.height = newHeight;
            this.treeLayout = d3.layout.tree()
                .size([bounds.size.height, bounds.size.width]);


            this.nodes = this.treeLayout.nodes(this.dataset()).reverse();

var chartOffset = 0;

            function depth(d) {

                var distance = 100;
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

            this.nodes.forEach(
                function(d) {
                    d.y = depth(d);

                    var fakeText = chart.append('text')
                        .attr('style', 'font-size : 11px;cursor : pointer;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;')
                .attr('class', 'fake')
                        .text(d.name);
                    var fakeBox = fakeText[0][0].getBBox();
                    var fakeRight = d.children || d._children
                        ? d.y - 10
                        : d.y + fakeBox.width + 10;
                    var fakeLeft = d.children || d._children
                        ? d.y - 10 - fakeBox.width
                        : d.y + 10;

                    console.log(fakeLeft + " TO " + fakeRight + ' for ' + d.name);
                    console.log(fakeBox);

                    if (fakeRight > maxOffset) {
                        maxOffset = fakeRight;
                    }

                    if (fakeLeft < minOffset) {
                        minOffset = fakeLeft;
                    }

                }
            );

            console.log("RESIZE TO " + minOffset + ' ' + maxOffset);
            console.log(bounds);

            var widthDelta = 0;
            if (minOffset < bounds.origin.x) {
            console.log('min increase');
                widthDelta += bounds.origin.x - minOffset;
                //$tree.options.chartOffset = widthDelta;
                chartOffset = widthDelta;
            }
            if (maxOffset > bounds.origin.x + bounds.size.width) {
            console.log('max increase');
                widthDelta += maxOffset - bounds.size.width;
            }

            this.nodes.forEach(
                function(d) {
                    d.y = depth(d);
                }
            );

            chart.selectAll('.fake').remove();

            console.log("INCREASE WIDTH BY " + widthDelta);

            this.$elem.animate(
                {
                    'width' : this.options.xGutter + this.options.yGutter + widthDelta + bounds.size.width,
                    'height' : newHeight + this.options.yGutter + this.options.yPadding
                },
                duration
            );

            var node = chart.selectAll("g.node")
                  .data(this.nodes, function(d) { return d.id || (d.id = ++i); });

            this.ticker(i);

            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) { return "translate(" + (source.y0 + $tree.options.chartOffset) + "," + source.x0 + ")"; })
            ;

            nodeEnter.append("circle")
                .attr("r", 1e-6)
                .attr('style', 'cursor : pointer; fill : #fff; stroke : steelblue; stroke-width : 1.5px')
                .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; })
                .on("click", function(d) {

                    if (! $tree.findInChildren($tree.options.red, d) && ! $tree.findInChildren($tree.options.blue, d)) {
                        $tree.toggle(d); $tree.updateTree(d);
                    }
                });

            nodeEnter.append("text")
                //.attr('style', 'font-size : 11px')
                .attr('style', 'font-size : 11px;cursor : pointer;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;')
                .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
                .attr("dy", ".35em")
                .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
                .text(function(d) { return d.name; })
                .style("fill-opacity", 1e-6)
                .attr('fill', function(d) { return d.fill || 'black'})
                .on("click", function(d) {

console.log(this.getComputedTextLength());
console.log(this.getBBox());
console.log($tree);
console.log($tree.absPos);
var pos = $tree.absPos(this);
console.log("ABS POS IS");
console.log(pos);

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
                        $tree.options[d.fill + 'Node'] = this;
                    }

                    d3.select(this).attr('fill', d.fill);

                    if ($tree.options.red != undefined && $tree.options.blue != undefined) {
                        $tree.comparison('Comparing ' + $tree.options.red.name + ' vs ' + $tree.options.blue.name);
                    }
                    else {
                        $tree.comparison('');
                    }
                })
                //.call(this.wrap, 50, function(d) { return d.children || d._children ? -10 : 10; })
                //.call($tree.flagResize, $tree)
            ;

  function endall(transition, callback) {
    var n = 0;
    transition
        .each(function() { ++n; })
        .each("end", function() { if (!--n) callback.apply(this, arguments); });
  }

            // Transition nodes to their new position.
            var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function(d) { return "translate(" + (d.y + $tree.options.chartOffset) + "," + d.x + ")"; })
                .call(endall, function() { chart.selectAll('text').call($tree.flagResize, $tree)  });

            nodeUpdate.select("circle")
                .attr("r", 4.5)
                .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

            nodeUpdate.select("text")
                .style("fill-opacity", 1);

            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function(d) { return "translate(" + (source.y + $tree.options.chartOffset)  + "," + source.x + ")"; })
                .remove()
                .call(endall, function() { chart.selectAll('text').call($tree.flagResize, $tree)  })
                ;

            nodeExit.select("circle")
                .attr("r", 1e-6);

            nodeExit.select("text")
                .style("fill-opacity", 1e-6);

            // Update the linksÉ
            var link = chart.selectAll("path.link")
                .data($tree.treeLayout.links($tree.nodes), function(d) { return d.target.id; });

            // Enter any new links at the parent's previous position.
            link.enter().insert("path", "g")
                .attr("class", "link")
                .attr('fill', 'none')
                .attr('stroke', '#ccc')
                .attr('stroke-width', '1.5px')
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

//            setTimeout(function() {chart.selectAll('text')
//                .call($tree.flagResize, $tree);}, 1000);

        },

        flagResize : function(labels, $tree) {
return;
            var bounds = $tree.chartBounds();
console.log("BOUNDS IS NOW");console.log(bounds);
            var chartRight = bounds.origin.x + bounds.size.width;

            var xMax = 0;
            var xMin = 5000000000000;   //Is anybody gonna have a 5 billion pixel wide display? Note - fix in 15 years.

//            console.log("CHART RIGHT IS " + chartRight);
            needsResize = false;
//console.log(labels);
//                console.log('able');
            labels.each(
                function() {
//                console.log('alpha');
//                console.log(this);

                    var width = this.getComputedTextLength();
                    var coords = $tree.absPos(this);
                    var lMax = coords.x + width;
//console.log(xMax);
//console.log(coords);console.log(width);
                    if (lMax > xMax) {
                    console.log("WIDER" + xMax + " > " + lMax);
                    console.log(this);
                        xMax = lMax;
                        //console.log("NEEDS RESIZE! " + xMax + ' > ' + chartRight);
                    }
console.log("COMPARES : " + xMin + " VS " + coords.x);
                    if (coords.x < xMin) {
                    console.log(this);
                        xMin = coords.x;
                    }
                }
            );

            var widthDelta = 0;
            var oldOffset = $tree.options.chartOffset;
console.log("WIDE BODY : " + xMax + ', ' + $tree.options.originalWidth + ', ' + chartRight);
            if (xMax > chartRight) {
                console.log("NEEDS RESIZE! " + xMax + ' > ' + chartRight);
                widthDelta = xMax - chartRight;
            }
            else if (xMax < $tree.options.originalWidth) {
                widthDelta = $tree.options.originalWidth - $tree.width();
                console.log("WD1 : " + widthDelta);
            }

            if (xMin < bounds.origin.x) {
                var minBoundsOffset = Math.round(bounds.origin.x - xMin);
                //widthDelta += minBoundsOffset;
                if ($tree.options.chartOffset < minBoundsOffset) {
                    $tree.options.chartOffset = minBoundsOffset;
                }

                console.log("NEEDS MORE WIDTH + " + minBoundsOffset);
            }
            else {
                //$tree.options.chartOffset = 0;
            }

console.log("MIN COORDS : " + bounds.origin.x + ' BUT ' + xMin + "WITH OFFSET : " + $tree.options.chartOffset);

            widthDelta = Math.round(widthDelta);

console.log("WD : " + widthDelta);

            if (widthDelta != 0) {

                var newWidth = $tree.width() + widthDelta;
console.log("NEW WIDTH WILL BE : " + newWidth + " FROM " + $tree.width());
                //$tree.$elem.width(newWidth);
                $tree.width(newWidth);

                $tree.$elem.animate({'width' : newWidth}, 500);
                //$tree.$elem.width(newWidth);

            }

            console.log("OFFSETS : " + $tree.options.chartOffset + " WAS " + oldOffset);
            if ($tree.options.chartOffset > oldOffset ) {
                $tree.updateTree($tree.dataset());
console.log("SHOULD WIDEN HERE!");
            }

        },

        renderChart : function() {

            if (this.dataset() == undefined) {
                  return;
            }

            this.$elem.height(30 * this.countVisibleNodes(this.dataset()));
            this.height(this.$elem.height());

            this.options.originalWidth = this.$elem.width();

            var i = 0;
            var bounds = this.chartBounds();

            if (this.treeLayout == undefined) {
                  this.treeLayout = d3.layout.tree()
                      .size([bounds.size.height, bounds.size.width]);
            }

            var $tree = this;

            this.diagonal = d3.svg.diagonal()
                .projection(function(d) { return [d.y + $tree.options.chartOffset, d.x]; });

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

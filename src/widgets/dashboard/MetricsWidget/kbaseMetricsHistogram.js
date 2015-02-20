(function( $, undefined ) { 
    $.KBWidget({ 
        name: "kbaseMetricsHistogram", 
        version: "1.0.0",
        
        tooltip: null,
        
        options: {
            state: null,
            x_axis: null,
            y_axis: 'Number of Users'
        },

        init: function(options) {
            this._super(options);
            var self = this;
            var container = self.$elem;
            var id = container.attr('id');
            container.empty();
            var h = 120;
            container.css({
                'margin-left': '0px',
                'margin-top': '0px', 
                'height': h+'px', 
                'width': '100%'
            });
            var w = container.width();
            container.append('<svg id="vis_'+id+'" style="height: '+h+'px"></svg>');
            self.tooltip = d3.select("body")
            .append("div")
            .classed("kbcb-tooltip", true);
            self.render();
            var onResize = null;
            onResize = function() {
                if (!container.is(':visible')) {
                    $(window).off('resize', onResize);
                } else {
                    self.render();
                }
            };
            $(window).on('resize', onResize);
            return this;
        },
        
        render: function() {
            var self = this;
            var container = self.$elem;
            var id = container.attr('id');
            var w = container.width();
            var h = container.height();
            var charts = this.options.state.chart;
            var vis = d3.select('#vis_'+id).style("width", w+'px');
            vis.selectAll("*").remove();
            
            var mar = {
              top: 25,
              right: 0,
              bottom: 25,
              left: 15
            };
            var barData = [];
            var userVal = self.options.state.user.value;
            var binNum = null;
            for (var i in charts) {
                var x = null;
                if (charts[i].lower == charts[i].upper - 1) {
                    x = "" + charts[i].lower;
                } else {
                    x = charts[i].lower + '-' + (charts[i].upper - 1);
                }
                barData.push({x: x, y: charts[i].count, lower: charts[i].lower, size: charts[i].upper - charts[i].lower});
                if (userVal >= charts[i].lower && userVal < charts[i].upper)
                    binNum = i;
            }
            var xDomain = barData.map(function (d) {
                return d.x;
            });
            var xRange = d3.scale.ordinal().rangeRoundBands([mar.left, w - mar.right], 0.1).domain(xDomain);
            var yMax = d3.max(barData, function (d) { return d.y; });
            if (yMax < 1)
                yMax = 1;
            var yRange = d3.scale.linear().range([h - mar.top, mar.bottom]).domain([0, yMax]);

            vis.selectAll("text")
            .data(barData)
            .enter()
            .append('text')
            .text(function(d) {
                 return d.y;
            })
            .attr("x", function(d) {
                 return xRange(d.x) + xRange.rangeBand() / 2;
            })
            .attr("y", function(d) {
                 return yRange(d.y) - 2;
            })
            .attr("text-anchor", "middle")
            .attr("font-size", "9px")
            .attr("fill", "gray")
            .attr("font-style", "italic");
            
            xAxis = d3.svg.axis()
            .scale(xRange)
            .tickSize(0)
            .tickSubdivide(true),

            yAxis = d3.svg.axis()
            .scale(yRange)
            .tickSize(0)
            .orient("left")
            .tickSubdivide(true);
            
            /*vis.append('svg:g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(' + (mar.left) + ',0)')
            .call(yAxis);*/
            
            vis.selectAll('rect')
            .data(barData)
            .enter()
            .append('rect')
            .attr('x', function (d) {
                return xRange(d.x);
            })
            .attr('y', function (d) {
                return yRange(d.y);
            })
            .attr('width', xRange.rangeBand())
            .attr('height', function (d) {
                return Math.max(1, (h - mar.bottom) - yRange(d.y) - .1);
            })
            .attr('fill', '#CECECE')
            .on('mouseover',function(d) {
                d3.select(this)
                .attr('fill','gray');
                self.showTooltip(true, vis, this, xRange(d.x) + xRange.rangeBand() + 3, yRange(d.y) - 10, "" + d.y);
            })
            .on('mouseout',function(d){
                d3.select(this)
                .attr('fill','#CECECE');
                self.showTooltip(false);
            });
            
            vis.append('svg:g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + (h - mar.bottom) + ')')
            .call(xAxis);

            vis.append('text')
            .attr('x', -h / 2)
            .attr('y', 10)
            .text(self.options.y_axis)
            .attr('transform', 'rotate(-90)')
            .attr('fill', 'gray')
            .attr("text-anchor", "middle")
            .attr("font-size", "9px");

            vis.append('text')
            .attr('x', w / 2)
            .attr('y', h - 2)
            .text(self.options.x_axis)
            .attr('fill', 'gray')
            .attr("text-anchor", "middle")
            .attr("font-size", "9px");

            var userX = mar.left;
            if (binNum) {
                var bin = barData[binNum];
                userX = xRange(bin.x) + (userVal - bin.lower + 0.5) * xRange.rangeBand() / bin.size - 2;
            } else if (barData.length > 0) {
                var bin = barData[0];
                userX = xRange(bin.x) - 5;
            }
            var flagY = yRange(yMax) - 15;

            vis.append('rect')
            .attr('x', userX)
            .attr('y', flagY)
            .attr('width', 5)
            .attr('height', (h - mar.bottom) - flagY)
            .attr('fill', 'rgba(75,184,86,0.7)');

            vis.append('polygon')
            .attr('points', "" + 
                    (userX + 5) + "," + flagY + ", " + 
                    (userX + 30) + "," + flagY + ", " + 
                    (userX + 17) + "," + (flagY + 7) + ", " + 
                    (userX + 30) + "," + (flagY + 14) + ", " + 
                    (userX + 5) + "," + (flagY + 14))
            .attr('fill', 'rgba(75,184,86,0.7)');

            vis.append('text')
            .attr('x', userX)
            .attr('y', flagY - 3)
            .text("You - " + userVal)
            .attr('fill', 'gray')
            .attr("font-size", "9px");
            
            return this;
        },
        
        showTooltip: function(show, vis, thisObj, x, y, value) {
            var self = this;
            if (!show) {
                self.tooltip.style("visibility", "hidden");
                return;
            }
            var e = d3.mouse(thisObj);
            var targetel = thisObj; // d3.select(this);
            while ('undefined' === typeof targetel.getScreenCTM && 'undefined' === targetel.parentNode) {
                targetel = targetel.parentNode;
            }
            var el = vis.node();
            if (el.tagName.toLowerCase() !== 'svg') {
                el = el.ownerSVGElement;
            }
            var point = el.createSVGPoint();
            point.x = x ? x : e[0];
            point.y = y ? y : e[1];
            var matrix = targetel.getScreenCTM();
            var absPoint = point.matrixTransform(matrix);
            var scrollTop  = document.documentElement.scrollTop || document.body.scrollTop;
            var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
            self.tooltip.text(value);
            var tooltipH = $(self.tooltip[0]).height();
            self.tooltip.style("top", (absPoint.y + scrollTop - tooltipH - 2) + "px").style("left", (absPoint.x + scrollLeft + 2) + "px");
            self.tooltip.style("visibility", "visible");
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
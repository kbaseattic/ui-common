(function( $, undefined ) { 
    $.KBWidget({ 
        name: "kbaseMetricsHistogram", 
        version: "1.0.0",
        
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
            var w = 400;
            var h = 120;
            container.css({
                'margin-left': '0px',
                'margin-top': '0px', 
                'height': '', 
                'display': 'inline-block',
                'position': 'relative',
                'width': '100%',
                'padding-bottom': '38%', /* aspect ratio */
                'vertical-align': 'top',
                'overflow': 'hidden'
            });
            container.append('<svg id="vis_'+id+'" style="display: inline-block; position: absolute; top: 0px; left: 0"></svg>');
            var charts = this.options.state.chart;
            var vis = d3.select('#vis_'+id).attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", "0 0 "+w+" "+h);
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
            console.log("binNum=" + binNum + ", userVal=" + userVal);
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
            .attr("fill", "gray");
            
            xAxis = d3.svg.axis()
            .scale(xRange)
            .tickSize(3)
            .tickSubdivide(true),

            yAxis = d3.svg.axis()
            .scale(yRange)
            .tickSize(3)
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
            .on('mouseover',function(d){
                d3.select(this)
                .attr('fill','blue');
            })
            .on('mouseout',function(d){
                d3.select(this)
                .attr('fill','#CECECE');
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
            }
            var flagY = yRange(yMax) - 15;

            vis.append('rect')
            .attr('x', userX)
            .attr('y', flagY)
            .attr('width', 5)
            .attr('height', (h - mar.bottom) - flagY)
            .attr('fill', 'rgba(75,184,86,0.7)');

            vis.append('polygon')
            .attr('points', "" + (userX + 5) + "," + flagY + ", " + (userX + 30) + "," + (flagY + 7) + ", " + (userX + 5) + "," + (flagY + 14))
            .attr('fill', 'rgba(75,184,86,0.7)');

            vis.append('text')
            .attr('x', userX)
            .attr('y', flagY - 3)
            .text("You - " + userVal)
            .attr('fill', 'gray')
            .attr("font-size", "9px");
            
            /*var onResize = null;
            onResize = function() {
                var newW = container.width();
                var newH = container.height();
                if (!container.is(':visible'))
                    $(window).off('resize', onResize);
                vis.attr('width', newW).attr('height', newH);
            };
            $(window).on('resize', onResize);*/
            return this;
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
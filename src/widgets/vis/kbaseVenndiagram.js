/*

*/

define('kbaseVenndiagram',
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

	    name: "kbaseVenndiagram",
	  parent: "kbaseVisWidget",

        version: "1.0.0",
        options: {
            xOffset : 0,
            yOffset : 0,
            overlap : 0.2,
            fillOpacity : 0.8,

            startAngle : 2 * Math.PI * 150 /360,

            strokeWidth : 2,
            strokeColor : function() { return 'black'},
            fillColor : d3.scale.category20(),
            circleFontSize : '18pt',
            intersectFontSize : '24pt',

            drawLabels : true,

        },

        _accessors : [

        ],

        init : function(options) {
            this._super(options);

            return this;
        },

        intersectCircles : function (c1, c2) {
            //My life is pain.

            //First, we convert the polar coordinates into cartesian.

            var cc1 = {
                x : Math.cos(c1.angle) * c1.originDistance,
                y : - Math.sin(c1.angle) * c1.originDistance,
            };

            var cc2 = {
                x : Math.cos(c2.angle) * c1.originDistance,
                y : - Math.sin(c2.angle) * c1.originDistance,
            };
//            console.log("centers at");console.log(cc1);console.log(cc2);

            var midPoint = {
                x : Math.min(cc1.x, cc2.x) + Math.abs(cc1.x - cc2.x) / 2,
                y : Math.min(cc1.y, cc2.y) + Math.abs(cc1.y - cc2.y) / 2,
            };

//console.log("MID POINT");console.log(midPoint);
//console.log(cc1.x + ' -> ' + cc2.x + ' starts at ' + Math.min(cc1.x, cc2.x) + ' for ' + Math.abs(cc1.x - cc2.x));

            var lowerLeftPoint = {
                x : Math.min(cc1.x, cc2.x),
                y : Math.min(cc1.y, cc2.y),
            };

            var width  = (cc1.x - cc2.x);
            var height = (cc1.y - cc2.y);

//            console.log(width + ' x ' + height);

            //get the lower right angle. Assume that there is no width by default
            var lowerRightAngle = Math.PI / 2;
            if (width != 0) {
                lowerRightAngle = Math.atan(height / width);
            }

            var distance = Math.sqrt( width / 2 * width / 2 + height / 2 * height / 2);

            //and the complement, in RADIANS.
            var complementAngle = (Math.PI / 2 - lowerRightAngle);

//            console.log("ANGLES ARE : " + lowerRightAngle + " TO " + complementAngle + ' over ' + c1.r);

            var i1 = {
                x : midPoint.x + Math.cos(complementAngle) * distance,//c1.r * Math.sqrt(3) / 2,
                y : midPoint.y - Math.sin(complementAngle) * distance,//c1.r * Math.sqrt(3) / 2,
            };

            var i2 = {
                x : midPoint.x + Math.cos(complementAngle + Math.PI) * distance,//c1.r * Math.sqrt(3) / 2,
                y : midPoint.y - Math.sin(complementAngle + Math.PI) * distance,//c1.r * Math.sqrt(3) / 2,
            };

//            console.log("INTERSECT AT");
//            console.log(i1);console.log(i2);

            return [i1, i2, midPoint];

        },


        renderChart : function() {
            var bounds = this.chartBounds();
            var $venn  = this;

            var radius = Math.min(bounds.size.width, bounds.size.height) / 2;

            var venn = this.data('D3svg').select( this.region('chart') ).selectAll('.venn').data([0]);
            venn.enter().append('g')
                .attr('class', 'venn')
                .attr('transform',
                    'translate('
                        + (bounds.size.width / 2 + this.options.xOffset)
                        + ','
                        + (bounds.size.height / 2  + this.options.yOffset)
                        + ')'
                );

//            console.log(radius);

            radius = radius * .5;   //basically just guessing at a magic number that looks reasonably good
//console.log("RADIUS OPT " + this.options.radius + ',' + radius);
            radius = this.options.radius || radius;
            var overlap = this.options.overlap;

            var overlapRadius = radius * (1 - overlap);

            var numCircles = 3;
var ZED = 200;
var ZEDo = $venn.options.ZEDo;//Math.PI * 2 /5;// * 7/16;
            var circleData = [
                /*{
                    id : 77,
                    x : 0,
                    y : 0,
                    r : 10,
                    strokeColor : 'blue',
                },*/
/*
                {
                    id : 0,
                    angle : $venn.options.startAngle,
                    r : radius,
                    originDistance : overlapRadius,
                    fillColor : '#f00',
                },
                {
                    id : 1,
                    angle : $venn.options.startAngle + (2 * Math.PI / numCircles),
                    r : radius,
                    originDistance : overlapRadius,
                    fillColor : '#0f0',
                },
                {
                    id : 2,
                    angle : $venn.options.startAngle + 2 * (2 * Math.PI / numCircles),
                    r : radius,
                    originDistance : overlapRadius,
                    fillColor : '#00f',
                },
//*/

//*
                {angle : ZEDo, r : ZED, originDistance : ZED / 2, id : 3, fillColor : 'green'},
                {angle : ZEDo + 2 * Math.PI /3, r : ZED, originDistance : ZED / 2, id : 4},//*/

                /*{
                    id : 3,
                    angle : $venn.options.startAngle + 3 * (2 * Math.PI / numCircles),
                    r : radius,
                    fillColor : '#0ff',
                },*/
            ];

//            this.intersectCircles(
//                {angle : 0, radius : 1, originDistance : 0.5},

var intersects = this.intersectCircles(circleData[0], circleData[1]);
circleData.push(
    {
        cx : intersects[0].x,
        cy : intersects[0].y,
        r : 4,
        strokeWidth : 1,
        strokeColor : 'red',
        fillColor : 'none',
    },
    {
        cx : intersects[1].x,
        cy : intersects[1].y,
        r : 4,
        strokeWidth : 1,
        strokeColor : 'red',
        fillColor : 'none',
    },
    {
        cx : intersects[2].x,
        cy : intersects[2].y,
        r : 4,
        strokeWidth : 1,
        strokeColor : 'green',
        fillColor : 'none',
    }
);

            var labelData = [];/*
                {
                    angle : circleData[0].angle,
                    label : 'Molecular Function',
                    radius : overlapRadius * 1.3,
                    anchor : 'end',
                    fontSize : this.options.circleFontSize,
                },
                {
                    angle : circleData[1].angle,
                    label : 'Biological Process',
                    radius : overlapRadius * 1.3,
                    anchor : 'start',
                    fontSize : this.options.circleFontSize,
                },
                {
                    angle : circleData[2].angle,
                    label : 'Cellular Component',
                    radius : overlapRadius * 1.3,
                    anchor : 'middle',
                    fontSize : this.options.circleFontSize,
                },
                {
                    angle : 2 * Math.PI * 90 / 360,
                    label : '161',
                    radius : overlapRadius * 0.7,
                    fontSize : this.options.intersectFontSize,
                },
                {
                    angle : 2 * Math.PI * 210 / 360,
                    label : '23',
                    radius : overlapRadius * 0.7,
                    fontSize : this.options.intersectFontSize,
                },
                {
                    angle : 2 * Math.PI * 330 / 360,
                    label : '56',
                    radius : overlapRadius * 0.7,
                    fontSize : this.options.intersectFontSize,
                },

                {
                    angle : 0,
                    label : '273',
                    radius : 0,
                    fontSize : this.options.intersectFontSize,
                },
            ];//*/

//console.log(circleData);
            var filledCircles = venn.selectAll('.filledCircle').data(circleData );

            filledCircles.enter()
                .append('circle')
                    .attr('class', 'filledCircle')
            ;

            var transitionTime = this.initialized
                ? this.options.transitionTime
                : 0;

            var circleAction = function() {

                this
                    .on('mouseover', function(d) {
                        console.log("OVER IT");
                        d3.select(this).attr('fill-opacity', 1);
                    })
                    .on('mouseout', function(d) {
                        d3.select(this).attr('fill-opacity', d.fillOpacity || $venn.options.fillOpacity);
                    })
            };


            filledCircles
                .call(circleAction)
                .transition().duration(transitionTime)
                //.attr('cx', function (d) { var x = return Math.cos(d.angle) * d.originDistance } )
                .attr('cx', function (d, idx) { var x =   Math.cos(d.angle) * d.originDistance; return d.cx || x; } )
                .attr('cy', function (d, idx) { var y = - Math.sin(d.angle) * d.originDistance; return d.cy || y; } )
                .attr('r', function (d) {return d.r} )
                //.attr('stroke', function(d, idx) { return d.strokeColor || $venn.options.strokeColor(idx, d) })
                //.attr('stroke-width', function (d) { return d.strokeWidth || $venn.options.strokeWidth } )
                .attr('fill', function(d, idx) { var c =  d.fillColor || $venn.options.fillColor(idx, d, $venn); return c; })
                .attr('fill-opacity', function (d) { return d.fillOpacity || $venn.options.fillOpacity })
                .call($venn.endall, function() {
                    $venn.initialized = true;
                })
            ;

            filledCircles.exit().remove();

            var strokedCircles = venn.selectAll('.strokedCircle').data(circleData );

            strokedCircles.enter()
                .append('circle')
                    .attr('class', 'strokedCircle')
            ;

            strokedCircles
                .call(circleAction)
                .transition().duration(transitionTime)
                .attr('cx', function (d) { return d.cx || Math.cos(d.angle) * d.originDistance } )
                .attr('cy', function (d) { return d.cy || - Math.sin(d.angle) * d.originDistance } )
                .attr('r', function (d) {return d.r} )
                .attr('fill', 'none')
                .attr('stroke', function(d, idx) { return d.strokeColor || $venn.options.strokeColor(idx, d) })
                .attr('stroke-width', function (d) { return d.strokeWidth || $venn.options.strokeWidth } )
            ;

            strokedCircles.exit().remove();



            var labelTown = function( opacity ) {

                if (opacity == undefined) {
                    opacity = 1;
                }

                this
                    .attr("text-anchor", "middle")
                    .attr('dy', '0.5em')
                ;

                if (this.attrTween) {

                    this
                        .text(function(d) {
                            return d.label;
                        })
                        .attrTween("transform", function(d, idx) {
                            //this._current=  this._current || d;
                            if (this._current == undefined) {
                                this._current = d;
                            }

                            var endPoint = d;
                            if (endPoint.radius == undefined) {
                                endPoint.radius = overlapRadius * 0.7;
                            }

                            var interpolate = d3.interpolate(this._current, endPoint);

                            this._current = interpolate(0);

                            return function(t) {
                                var d2 = interpolate(t);
                                var pos = [Math.cos(d2.angle) * d2.radius, - Math.sin(d2.angle) * d2.radius];
                                return "translate("+ pos +")";
                            };

                        })
                        .attr('font-size', function(d) { return d.fontSize || '12pt'})
                        //.attr("text-anchor", function (d) {console.log(d.anchor); return d.anchor || 'middle' } );

                    }


                return this;
            }

            if ($venn.options.drawLabels) {

                var labels = venn.selectAll('text').data(labelData );

                labels.enter()
                    .append('text')
                ;

                labels
                    .transition().duration(transitionTime)
                    .call(labelTown)
                ;
                labels.exit().remove();
            }




        },


        renderXAxis : function() {},
        renderYAxis : function() {},


    });

} );

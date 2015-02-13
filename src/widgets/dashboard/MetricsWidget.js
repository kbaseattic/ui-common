define(['kb.widget.dashboard.base', 'postal'], function (DashboardWidget, Postal) {
   return Object.create(DashboardWidget, {
      init: {
         value: function (cfg) {
            cfg.name = 'MetricsWidget';
            cfg.title = 'Metrics';
            this.DashboardWidget_init(cfg);

            return this;
         }
      },
      go: {
         value: function () {
            this.start();



            /*Postal.channel('dashboard.metrics')
            .subscribe('update.narratives', function (data) {
               this.setState('narratives.count', data.count);
            }.bind(this));
            
            Postal.channel('dashboard.metrics')
            .subscribe('update.sharedNarratives', function (data) {
               this.setState('sharedNarratives.count', data.count);
            }.bind(this));
             
            Postal.channel('dashboard.metrics')
            .subscribe('update.collaborators', function (data) {
               this.setState('collaborators.count', data.count);
            }.bind(this));
            */

            return this;
         }
      },
      setup: {
         value: function () {}
      },
      calcNarrativeMetrics: {
         value: function (userValue) {
            // Just dummy data for now.
            var bins = {
                "bins": [
                    {
                        "count": 38,
                        "label": "[1-2)",
                        "lower": 1,
                        "upper": 2
                    },
                    {
                        "count": 29,
                        "label": "[2-4)",
                        "lower": 2,
                        "upper": 4
                    },
                    {
                        "count": 10,
                        "label": "[4-5)",
                        "lower": 4,
                        "upper": 5
                    },
                    {
                        "count": 14,
                        "label": "[5-7)",
                        "lower": 5,
                        "upper": 7
                    },
                    {
                        "count": 1,
                        "label": "[7-9)",
                        "lower": 7,
                        "upper": 9
                    },
                    {
                        "count": 3,
                        "label": "[9-11)",
                        "lower": 9,
                        "upper": 11
                    },
                    {
                        "count": 3,
                        "label": "[11-13)",
                        "lower": 11,
                        "upper": 13
                    },
                    {
                        "count": 2,
                        "label": "[13-14)",
                        "lower": 13,
                        "upper": 14
                    },
                    {
                        "count": 0,
                        "label": "[14-16)",
                        "lower": 14,
                        "upper": 16
                    },
                    {
                        "count": 5,
                        "label": "[16-19)",
                        "lower": 16,
                        "upper": 19,
                        "upperInclusive": 19
                    }
                ],
                "min": 1,
                "max": 19,
                "binSize": 1.8,
                "binCount": 10,
                "count": 105,
                "binned": [
                    38,
                    29,
                    10,
                    14,
                    1,
                    3,
                    3,
                    2,
                    0,
                    5
                ],
                "labels": [
                    "[1-2)",
                    "[2-4)",
                    "[4-5)",
                    "[5-7)",
                    "[7-9)",
                    "[9-11)",
                    "[11-13)",
                    "[13-14)",
                    "[14-16)",
                    "[16-19)"
                ],
                "unbinnable": [

                ]
            };
            // var data = bins.binned;
            // Calculate widths, height.
            var width = 100/bins.binned.length;
            var maxBinSize = Math.max.apply(null, bins.binned);
            var minBinSize = Math.min.apply(null, bins.binned);
            
            // consider the user's value in max/min too.
            maxBinSize = Math.max(maxBinSize, userValue);
            minBinSize = Math.min(minBinSize, userValue);

            var chartHeight = maxBinSize + maxBinSize/10;
            var setup = bins.bins.map(function (col) {
               col.width = width;
               col.height = Math.round(100*col.count/chartHeight);
               return col;
            });
            
            // user scaled to histogram.
            // put user value into the correct bin.
            var userBin;
            for (var i=0; i<bins.bins.length; i++) {
               var bin = bins.bins[i];
               // console.log('test');console.log(userValue); console.log(bin.lower); console.log(bin.upper); console.log(bin.upperInclusive);
               if (userValue >= bin.lower && ( (bin.upperInclusive && userValue <= bin.upper) || (userValue < bin.upper))) {
                  userBin = i;
                  break;
               }
            }
            // console.log('user?'); console.log(userBin);
            if (userBin !== undefined) {            
               var user = {
                  scale: userBin * width + width/2,
                  value: userValue
               }
            } else {
               var user = {scale: 0, value: 0}
            }
            
            this.setState('histogram.narrative', {
               maxBinSize: maxBinSize, 
               minBinSize: minBinSize,
               chartMax: chartHeight,
               binData: bins, 
               chart: setup,
               user: user
            });
         }
      },
      setInitialState: {
         value: function () {
            return Q.promise(function (resolve) {
               // We don't really have any initial state, it is all fed in from postal.

               // hey, cool, these calls may return immediately IF the state machine 
               // already has values for these properties.
               this.viewState.listen('narratives', function (value) {
                  this.setState('narratives', value);
                  this.calcNarrativeMetrics(value.count);
               }.bind(this));

               this.viewState.listen('sharedNarratives', function (value) {
                  this.setState('sharedNarratives', value);
               }.bind(this));

               this.viewState.listen('collaborators', function (value) {
                  this.setState('collaborators', value);
               }.bind(this));

               


                  /*Postal.channel('dashboard.metrics')
                  .publish('query.narratives', function (data) {});
               
                   Postal.channel('dashboard.metrics')
                  .publish('query.sharedNarratives', function (data) {});
               
                   
                   Postal.channel('dashboard.metrics')
                  .publish('query.collaborators', function (data) {});
                  */


                  /*Postal.channel('dashboard')
                  .request('metrics.get.narratives', function (data) {
                     console.log('HERE');
                     this.setState('narratives.count', data.narratives.count);
                  }.bind(this));
                  */
                  resolve();
            }.bind(this));
         }
      }
   });
});
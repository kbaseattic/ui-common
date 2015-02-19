define(['kb.widget.dashboard.base', 'postal', 'kb.config'], function (DashboardWidget, Postal, Config) {
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
            var stats = this.getState('narrativesStats');
            var bins = stats.histogram;
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
               if (userValue >= bin.lower && 
                   ( (bin.upperInclusive && userValue <= bin.upper) || 
                     (userValue < bin.upper) ||
                     (i === bins.bins.length-1)
                   )) {
                  userBin = i;
                  if ( (i === bins.bins.length-1) && (userValue > bin.upper) ) {                     
                     bin.upper = userValue;
                     bin.label = '(' + bin.lower + '-' + bin.upper + ']';
                  }
                  break;
               }
            }
            if (userBin !== undefined) {            
               var user = {
                  scale: userBin * width + width/2 ,
                  value: userValue,
                  bin: userBin,
                  side: (userBin < bins.bins.length/2 ? 'right':'left')
                  
               }
            } else {
               var user = {scale: 0, value: 0}
            }
                         
            this.setState('histogram.narratives', {
               maxBinSize: maxBinSize, 
               minBinSize: minBinSize,
               chartMax: chartHeight,
               binData: bins, 
               chart: setup,
               user: user,
               stats: stats
            });
         }
      },
       calcSharedNarrativeMetrics: {
         value: function (userValue) {
            // Just dummy data for now.
             var stats = this.getState('sharedNarrativesStats');
            var bins = stats.histogram;
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
               if (userValue >= bin.lower && 
                   ( (bin.upperInclusive && userValue <= bin.upper) || 
                     (userValue < bin.upper) ||
                     (i === bins.bins.length-1)
                   )) {               
                  userBin = i;
                  
                  if ( (i === bins.bins.length-1) && (userValue > bin.upper) ) {                     
                     bin.upper = userValue;
                     bin.label = '(' + bin.lower + '-' + bin.upper + ']';
                  }
                  
                  break;
               }
            }
             if (userBin !== undefined) {            
               var user = {
                  scale: userBin * width + width/2 ,
                  value: userValue,
                  bin: userBin,
                  side: (userBin < bins.bins.length/2 ? 'right':'left')
                  
               }
            } else {
               var user = {scale: 0, value: 0}
            }
                         
            this.setState('histogram.sharedNarratives', {
               maxBinSize: maxBinSize, 
               minBinSize: minBinSize,
               chartMax: chartHeight,
               binData: bins, 
               chart: setup,
               user: user,
               stats: stats
            });
         }
      },
        calcSharingNarrativeMetrics: {
         value: function (userValue) {
            // Just dummy data for now.
            var stats = this.getState('sharingNarrativesStats');
            var bins = stats.histogram;
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
               if (userValue >= bin.lower && 
                   ( (bin.upperInclusive && userValue <= bin.upper) || 
                     (userValue < bin.upper) ||
                     (i === bins.bins.length-1)
                   )) {               
                  userBin = i;
                  
                  if ( (i === bins.bins.length-1) && (userValue > bin.upper) ) {                     
                     bin.upper = userValue;
                     bin.label = '(' + bin.lower + '-' + bin.upper + ']';
                  }
                  
                  break;
               }
            }
             if (userBin !== undefined) {            
               var user = {
                  scale: userBin * width + width/2 ,
                  value: userValue,
                  bin: userBin,
                  side: (userBin < bins.bins.length/2 ? 'right':'left')
                  
               }
            } else {
               var user = {scale: 0, value: 0}
            }
                         
            this.setState('histogram.sharingNarratives', {
               maxBinSize: maxBinSize, 
               minBinSize: minBinSize,
               chartMax: chartHeight,
               binData: bins, 
               chart: setup,
               user: user,
               stats: stats
            });
         }
      },
      calcSharedNarrativeMetricsx: {
         value: function (userValue) {
            // Just dummy data for now.
            var bins = this.getState('sharedNarrativesStats').histogram;
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
               if (userValue >= bin.lower && ( (bin.upperInclusive && userValue <= bin.upper) || (userValue < bin.upper))) {
                  userBin = i;
                  break;
               }
            }
            if (userBin !== undefined) {            
               var user = {
                  scale: userBin * width + width/2,
                  value: userValue
               }
            } else {
               var user = {scale: 0, value: 0}
            }
                         
            this.setState('histogram.sharedNarratives', {
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
            return Q.promise(function (resolve, reject, notify) {
               // We don't really have any initial state, it is all fed in from postal.
               
               // Get the json stuff.
               Q.all([Q($.get(Config.getConfig('dashboard_metrics_url') + '/narrative_histogram.json')),
                      Q($.get(Config.getConfig('dashboard_metrics_url') + '/narrative_shared_histogram.json')),
                      Q($.get(Config.getConfig('dashboard_metrics_url') + '/narrative_sharing_histogram.json'))])
               .then(function(data) {
                  this.setState('narrativesStats', data[0]);
                  this.setState('sharedNarrativesStats', data[1]);
                  this.setState('sharingNarrativesStats', data[2]);
                  
                   // hey, cool, these calls may return immediately IF the state machine 
                  // already has values for these properties.
                  this.viewState.listen('narratives', function (value) {
                     this.setState('narratives', value);
                     this.calcNarrativeMetrics(value.count);
                     this.calcSharingNarrativeMetrics(value.sharingCount);
                  }.bind(this));

                  this.viewState.listen('sharedNarratives', function (value) {
                     this.setState('sharedNarratives', value);
                      this.calcSharedNarrativeMetrics(value.count);
                  }.bind(this));
                  

                  /*this.viewState.listen('publicNarratives', function (value) {
                     this.setState('publicNarratives', value);
                  }.bind(this));

                  this.viewState.listen('collaborators', function (value) {
                     this.setState('collaborators', value);
                  }.bind(this));*/

               }.bind(this))
               .catch(function (err) {
                  console.log('ERROR'); console.log(err);
                  reject (err);
               })
               .done();

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
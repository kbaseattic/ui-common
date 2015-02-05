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
      setInitialState: {
         value: function () {
            return Q.promise(function (resolve) {
               // We don't really have any initial state, it is all fed in from postal.

              // hey, cool, these calls may return immediately IF the state machine 
               // already has values for these properties.
              this.viewState.listen('narratives', function (value) {
                  this.setState('narratives', value);
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
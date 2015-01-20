(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseGWASTraitMaps",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        options: {
            type: "KBaseGwasData.GwasPopulationTrait",
            width: window.innerWidth/2 - 20,
            height: window.innerHeight - 120,
            resizable: false,
            draggable: false
        },

        workspaceURL: "https://kbase.us/services/ws/",
        
        init: function(options) {
            this._super(options);
            
            this.workspaceClient = new Workspace(this.workspaceURL, {token: this.authToken()});
            
            return this.render();
        },
        render: function () {
            var self = this;

            var mapDiv = $('<div/>').addClass('gmap3').attr({ id: 'mapElement'});

            self.options.allMarkers = [];

            var errorFunc = function (e) {
                self.$elem.append("<div class='alert alert-danger'>" + e.error.message + "</div>");
            };

            var success = function(data) {                    
                self.collection = data[0];

                var id = self.collection.data.GwasPopulation_obj_id;
                var traits = self.collection.data.trait_measurements;
                var traitsKeys = {};                                                                                                        

                var key = '6926';                                                                                                           

                var values = [];
                var maxValue = parseFloat(traits[0][1]);
                var minValue = parseFloat(traits[0][1]);
                              
                traits.forEach(function(trait) {
                    if (trait[1] != 'NA') {
                        if ( parseFloat(trait[1]) > maxValue ) maxValue = parseFloat(trait[1]);
                        if ( parseFloat(trait[1]) < minValue ) minValue = parseFloat(trait[1]);
                    }
                    traitsKeys[trait[0]] = trait[1];
                });

                
                var numBins = 10;
                var bins = ['0.0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1.0'];
                var factor = ( maxValue - minValue ) / numBins;


                var innerMethod = function (data2) {
                    self.collection = data2[0];
                    var iconFile = 'NA';
                    var traitId, traitValue;
                    var printoing = '';
                    
                    self.options.markerCount = 0;

                    if (self.collection.data.hasOwnProperty("ecotype_details")) {
                        for (var i = self.collection.data.ecotype_details.length - 1; i > -1; i--) {
                            var marker = {};
                            var lat = parseFloat(self.collection.data.ecotype_details[i].latitude);
                            var lng = parseFloat(self.collection.data.ecotype_details[i].longitude);

                            if (lat && lng) {
                                self.options.markerCount += 1;
                                marker.latLng = [ lat, lng ];

                                traitId = self.collection.data.ecotype_details[i].ecotype_id;

                                if (traitsKeys.hasOwnProperty(traitId)) {
                                    traitValue = traitsKeys[traitId];
                                }
                                else {
                                    traitValue = 'NA';
                                }

                                if (traitValue != 'NA') {
                                    iconFile = bins[Math.round(((traitValue - minValue) / factor))];
                                    printoing = printoing + ', ' + iconFile;
                                }

                                marker.data = self.collection.data.ecotype_details[i].nativename;
                                marker.options = {};

                                marker.options.icon = 'assets/images/' + iconFile + '.svg';

                                self.options.allMarkers.push(marker);
                            }                                                
                        }
                    }
                    else if (self.collection.data.hasOwnProperty("observation_unit_details")) {
                        for (var i = self.collection.data.observation_unit_details.length - 1; i > -1; i--) {
                            var marker = {};
                            var lat = parseFloat(self.collection.data.observation_unit_details[i].latitude);
                            var lng = parseFloat(self.collection.data.observation_unit_details[i].longitude);

                            if (lat && lng) {
                                self.options.markerCount += 1; 
                                marker.latLng = [ lat, lng ];
                                
                                traitId = self.collection.data.observation_unit_details[i].source_id;
                                
                                if (traitsKeys.hasOwnProperty(traitId)) {
                                    traitValue = traitsKeys[traitId];
                                }
                                else {
                                    traitValue = 'NA';
                                }

                                if (traitValue != 'NA') {
                                    iconFile = bins[Math.round(((traitValue - minValue) / factor))];
                                    printoing = printoing + ', ' + iconFile;
                                }

                                marker.data = self.collection.data.observation_unit_details[i].nativenames;
                                marker.options = {};

                                marker.options.icon = 'assets/images/' + iconFile + '.svg';

                                self.options.allMarkers.push(marker);
                            }                                                
                        }
                    }

                    mapDiv.width(self.options.width - 60).height(self.options.height - 130).gmap3({
                        map: {
                            options:{
                                center:[46.578498,2.457275],
                                zoom: 2 
                            }
                        },
                        marker: {
                            values: self.options.allMarkers,
                            options: {
                                draggable: false
                            },
                            events: {
                                mouseover: function(marker, event, context) {
                                    var map = $(this).gmap3("get");
                                    var infowindow = $(this).gmap3({ get: { name: "infowindow"} });
                      
                                    if (infowindow) {
                                        infowindow.open(map, marker);
                                        infowindow.setContent(context.data);
                                    } 
                                    else {
                                        $(this).gmap3({infowindow: {
                                            anchor: marker, 
                                            options: {content: context.data}
                                        }});
                                    }
                                }
                            },
                            mouseout: function() {
                                var infowindow = $(this).gmap3({get:{name:"infowindow"}});
                                if (infowindow) {
                                    infowindow.close();
                                }
                            }
                        }
                    });


                    self.$elem.append(mapDiv);

                    return self;
                };

                if (id.indexOf("/") > -1) {
                    self.workspaceClient.get_objects([{ref: id}]).then(innerMethod, errorFunc);
                }
                else {
                    self.workspaceClient.get_objects([{name: id, workspace: self.options.ws}]).then(innerMethod, errorFunc);                
                }
            };

            if (this.options.id.indexOf("/") > -1) {
                this.workspaceClient.get_objects([{ref : this.options.id}]).then(success, errorFunc);
            }
            else {
                this.workspaceClient.get_objects([{name : this.options.id, workspace: this.options.ws}]).then(success, errorFunc);            
            }

            return this;
        },
        getData: function() {
            return {
                type: this.options.type,
                id: this.options.id,
                workspace: this.options.ws,
                title: "GWAS Population Trait Distribution",
                draggable: false,
                resizable: false,
                dialogClass: 'no-close'
            };
        }
    });
})( jQuery )

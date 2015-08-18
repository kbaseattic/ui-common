(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseGWASPopMaps",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        options: {
            type: "KBaseGwasData.GwasPopulation",
            width: window.innerWidth/2 - 10,
            height: window.innerHeight - 130
        },
        workspaceURL: "https://kbase.us/services/ws/",

        init: function(options) {
            this._super(options);

            this.workspaceClient = new Workspace(this.workspaceURL, {token: this.authToken()});
            
            return this.render();
        },
        render: function() {
            var self = this;

            var mapDiv = $('<div/>').attr("id", "mapElement");

            var success = function(data) {
                self.collection = data[0];
                
                var allMarkers = [];

                if (self.collection.data.hasOwnProperty("ecotype_details")) {
                    self.options.markerCount = 0;
                    
                    for (var i = self.collection.data.ecotype_details.length - 1; i > -1 ; i--) {
                        var marker = {};
                        var lat = parseFloat(self.collection.data.ecotype_details[i].latitude);
                        var lng = parseFloat(self.collection.data.ecotype_details[i].longitude);

                        if ( lat && lng) {
                            self.options.markerCount += 1; 
                            marker.latLng = [ lat, lng ];
                            marker.data = self.collection.data.ecotype_details[i].nativename;
                            allMarkers.push(marker);
                        }                                                
                    }
                }
                else {
                    self.options.markerCount = 0;
                    
                    for (var i = self.collection.data.observation_unit_details.length - 1; i > -1 ; i--) {
                        var marker = {};
                        var lat = parseFloat(self.collection.data.observation_unit_details[i].latitude);
                        var lng = parseFloat(self.collection.data.observation_unit_details[i].longitude);

                        if ( lat && lng) {
                            self.options.markerCount += 1;
                            marker.latLng = [ lat, lng ];
                            marker.data = self.collection.data.observation_unit_details[i].nativenames;
                            allMarkers.push(marker);
                        }                                                
                    }                
                }

                self.options.allMarkers = allMarkers;

                if (self.options.hasOwnProperty("allMarkers")) {
                    mapDiv.width(self.options.width - 30).height(self.options.height - 80).gmap3({
                        map: {
                            options:{
                                center:[46.578498,2.457275],
                                zoom: 2,
                                mapTypeId: google.maps.MapTypeId.TERRAIN,
                                mapTypeControl: true,
                                mapTypeControlOptions: {
                                    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                                },
                                navigationControl: true,
                                scrollwheel: true,
                            }
                        },
                        marker: {
                            values: self.options.allMarkers,
                            events:{
                                mouseover: function(marker, event, context){
                                    var map = $('#mapElement').gmap3("get");
                                    var infowindow = $('#mapElement').gmap3({get:{name:"infowindow"}});
                                    
                                    if (infowindow) {
                                        infowindow.open(map, marker);
                                        infowindow.setContent(context.data);
                                    } 
                                    else {
                                        $('#mapElement').gmap3({
                                            infowindow:{
                                                anchor: marker, 
                                                options: {content: context.data}
                                            }
                                        });
                                    }
                                },
                                mouseout: function() {
                                    var infowindow = $('#mapElement').gmap3({get:{name:"infowindow"}});
                                
                                    if (infowindow) {
                                        infowindow.close();
                                    }
                                }
                            },
                            cluster: {
                                radius: 100,
                                maxZoom: 6,
                                // This style will be used for clusters with more than 0 markers
                                0: {
                                    content: '<div class="cluster cluster-1">CLUSTER_COUNT</div>',
                                    width: 53,
                                    height: 52
                                },
                                // This style will be used for clusters with more than 20 markers
                                20: {
                                    content: '<div class="cluster cluster-2">CLUSTER_COUNT</div>',
                                    width: 56,
                                    height: 55
                                },
                                // This style will be used for clusters with more than 50 markers
                                50: {
                                    content: '<div class="cluster cluster-3">CLUSTER_COUNT</div>',
                                    width: 66,
                                    height: 65
                                }
                            }
                        }
                    });
                }

                self.$elem.append(mapDiv);

                return self;                
            };

            var errorFunc = function (e) {
                mapDiv.append("<div class='alert alert-danger'>" + e.error.message + "</div>");
                self.$elem.append(mapDiv);
                return self;
            };

            if (this.options.id.indexOf('/') > -1) {
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
                title: "GWAS Population Observation Distribution",
                draggable: false,
                resizable: false,
                dialogClass: 'no-close'
            };
        }            
    });
})( jQuery )

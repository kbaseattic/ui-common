kb_define('kbaseMethodGallery',
    [
        'jquery',
	    'kbwidget',
	    'kbasePopularMethods',
	    'kbaseCarousel',
	    'kbaseWalkablePath',
	    'kbaseMethodDescription',
	    'kbaseAppDescription',
    ],
    function ($) {

    $.KBWidget({
        name: "kbaseMethodGallery",
        parent: "kbaseWidget",
        version: "1.0.0",
        options: {
            color: "black",
            narrativeMethodStoreURL : "https://kbase.us/services/narrative_method_store/rpc",
            topApps : ['genome_annotation', 'genome_assembly','plant_annotation', 'contigset_assembly', 'genome_reannotation'],
        },

        init: function(options) {
            this._super(options);

            var $gal = this;

            this.nms = new NarrativeMethodStore(this.options.narrativeMethodStoreURL);

            this.search_criteria = {};
            this.searches = {};

            this.nms.list_apps_spec({}, function (data) {

                $.each(
                    data,
                    function (idx, crit) {

                        var local_search = [
                            crit.info.header,
                            crit.info.id,
                            crit.info.name,
                            crit.info.subtitle,
                            crit.info.tooltip,
                            crit.info.ver,
                            crit.info.categories.join(),
                        ];

                        $.each(
                            crit.steps,
                            function (idx, step) {
                                local_search.push(
                                    step.description,
                                    step.method_id,
                                    step.step_id
                                )
                            }
                        );


                        $gal.search_criteria[ local_search.join() ] = crit.info.id;
                    }
                );

                /*$gal.nms.list_methods_spec({}, function (data) {

                    $.each(
                        data,
                        function (idx, crit) {
                            var local_search = [
                                crit.info.id,
                                crit.info.name,
                                crit.info.subtitle,
                                crit.info.tooltip,
                                crit.info.ver,
                                crit.info.categories.join(),
                            ];

                            /*$.each(
                                crit.steps,
                                function (idx, step) {
                                    local_search.push(
                                        step.description,
                                        step.method_id,
                                        step.step_id
                                    )
                                }
                            );* /


                            $gal.search_criteria[ local_search.join() ] = crit.info.id;
                        }
                    );

                });*/


            });

            this.appendUI(this.$elem);

            return this;
        },

        app_details : function(id) {
            var $details = $.jqElem('div');
            $details.kbaseAppDescription({app_id : id, gallery : this});

            this.$elem.empty();
            this.$elem.append($details);

        },

        reset : function() {
            this.$elem.empty();
            this.appendUI(this.$elem);
        },

        appendUI : function($elem) {

            var $gal = this;

            $elem.css(
                {
                    'background-color' : '#F5F5F5',
                    height: '575px',
                    width: '675px',
                    padding: '30px',
                    overflow : 'scroll',
                }
            );
            /*this.nms.list_apps({}, function(data) {

            $.each(
                data,
                function (idx, app) {

                }
            );});*/

            this.nms.get_app_full_info({ids:this.options.topApps}, function(data) {

                var topApp = data.shift();

                var $topContent = $.jqElem('div')
                    .css({
                        	width: '630px',
                            height: '250px',
                            'background-color': '#fff',
                            padding: '10px',
                            'box-shadow': '1px 1px 1px #ccc',
                            'margin-bottom': '20px',
                    })
                            .on('click', function(e) {
                                $gal.app_details(topApp.id);
                            })
                    .append(
                        $.jqElem('div')
                            .css(
                                {
                                	float: 'right',
                                    height: '180px',
                                    width: '180px',
                                    'margin-top': '20px',
                                    'margin-right': '70px',
                                }
                            )
                            .append(
                                $.jqElem('img')
                                    .css('height', '190px')
                                    .attr('src', '/static/kbase/images/kbase_logo.png')
                            )
                    )
                    .append(
                        $.jqElem('div')
                            .css(
                                {
                                	width: '310px',
                                    float: 'left',
                                    'margin-left': '30px',
                                    'margin-top': '10px',
                                }
                            )
                            .append(
                                $.jqElem('h1')
                                    .css(
                                        {
                                        	'font-size': '28px',
                                            color: '#000',
                                            'margin-top': '0px',
                                            'margin-bottom': '20px',
                                        }).append(topApp.name))
                            .append(
                                $.jqElem('div')
                                    .css({'font-size': '18px', 'color' : '#919191'})
                                    .append(topApp.subtitle)
                            )
                            .append(
                                $.jqElem('div')
                                    .css('padding-top', '25px')
                                    .append(
                                        $.jqElem('a')
                                            .attr('href', '#')
                                            .css('text-decoration' , 'none')
                                            .css('color', '#304FFE')
                                            .append('LAUNCH')
                                            .on('click', function(e) {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                $gal.launchApp(topApp.id);
                                            })
                                    )
                            )
                    )
                ;

                //$elem.append($topContent);
                $elem.append(
                    $.jqElem('div').addClass('container-fluid')
                        .append(
                            $.jqElem('div').addClass('row')
                                .append(
                                    $.jqElem('div').addClass('col-xs-12')
                                        .append($topContent)
                                )
                        )
                );

                $gal.$searchTags = $.jqElem('span');

                $elem.append(
                    $.jqElem('div')
                        .addClass('container-fluid')
                        .append(
                            $.jqElem('div').addClass('row')
                            .css(
                                {
                                    color: '#888',
                                    'font-size': '20px',
                                    //float: 'left',
                                    'padding-bottom': '7px',
                                    'border-bottom': '1px solid #CECECE',
                                    margin: '10px 0 20px 0',
                                    width: '650px',
                                    overflow: 'auto'
                                })
                            .append(
                                $.jqElem('div')
                                    .addClass('col-xs-10')
                                    .append('Browse')
                                    .append($gal.$searchTags)
                            )
                            .append(
                                $.jqElem('div')
                                    .addClass('col-xs-2')
                                    .css('font-size', '20px')
                                    .css('text-align', 'right')
                                    .css('white-space', 'nowrap')
                                    .append(
                                        $.jqElem('span')
                                            .css('font-size', '20px')
                                            .css('margin-right', '5px')
                                            .append(
                                                $.jqElem('span')
                                                    .addClass('fa fa-search')
                                                    .attr('aria-hidden', 'true')
                                                    .on('click', function(e) {
                                                        $gal.$searchDiv.toggle();
                                                        $gal.$sortByDiv.hide();
                                                        $gal.$filterTypeDiv.hide();
                                                    })
                                            )
                                    )
                                    .append(
                                        $.jqElem('span')
                                            .css('font-size', '20px')
                                            .css('margin-right', '5px')
                                            .append(
                                                $.jqElem('span')
                                                    .addClass('fa fa-sort-amount-asc')
                                                    .attr('aria-hidden', 'true')
                                                    .on('click', function(e) {
                                                        $gal.$searchDiv.hide();
                                                        $gal.$sortByDiv.toggle();
                                                        $gal.$filterTypeDiv.hide();
                                                    })
                                            )
                                    )
                                    .append(
                                        $.jqElem('span')
                                            .css('font-size', '20px')
                                            .append(
                                                $.jqElem('span')
                                                    .addClass('fa fa-filter')
                                                    .attr('aria-hidden', 'true')
                                                    .on('click', function(e) {
                                                        $gal.$searchDiv.hide();
                                                        $gal.$sortByDiv.hide();
                                                        $gal.$filterTypeDiv.toggle();
                                                    })
                                            )
                                    )
                            )
                        )
                    )
                ;

                $gal.$searchInput = $('<input type="text">').addClass('form-control');
                $gal.$searchDiv = $('<div>').addClass("input-group").css({'margin-bottom':'10px', 'display' : 'none'})
                                    .append($gal.$searchInput)
                                    .append($("<span>").addClass("input-group-addon")
                                            .on('click',function() {
                                                            var searchValue = $gal.$searchInput.val();
                                                            $gal.search(searchValue);
                                                            $gal.$searchDiv.hide();
                                                        })
                                                .append($("<span>")
                                                    .addClass("fa fa-search")
                                                    .css({'cursor':'pointer'})
                                                      ));
                $elem.append($gal.$searchDiv);

                var $byDate = $('<label id="nar-data-list-default-sort-label" class="btn btn-default">').addClass('btn btn-default')
                                    .append($('<input type="radio" name="options" id="nar-data-list-default-sort-option" autocomplete="off">'))
                                    .append("date")
                                    .on('click',function() {
                                        self.sortData(function(a,b) {
                                            if (a.info[3] > b.info[3]) return -1; // sort by date
                                            if (a.info[3] < b.info[3]) return 1;  // sort by date
                                            return 0;
                                        });
                                    });
                var $byName = $('<label class="btn btn-default">')
                                    .append($('<input type="radio" name="options" id="option2" autocomplete="off">'))
                                    .append("name")
                                    .on('click',function() {
                                        self.sortData(function(a,b) {
                                            if (a.info[1].toUpperCase() < b.info[1].toUpperCase()) return -1; // sort by name
                                            if (a.info[1].toUpperCase() > b.info[1].toUpperCase()) return 1;
                                            return 0;
                                        });
                                    });

                var $byType = $('<label class="btn btn-default">')
                                    .append($('<input type="radio" name="options" id="option3" autocomplete="off">'))
                                    .append("type")
                                    .on('click',function() {
                                        self.sortData(function(a,b) {
                                            if (a.info[2].toUpperCase() > b.info[2].toUpperCase()) return -1; // sort by type
                                            if (a.info[2].toUpperCase() < b.info[2].toUpperCase()) return 1;
                                            return 0;
                                        });
                                    });

                var $upOrDown = $('<button class="btn btn-default btn-sm" type="button">').css({'margin-left':'5px'})
                                    .append('<span class="glyphicon glyphicon-sort" style="color:#777" aria-hidden="true" />')
                                    .on('click',function() {
                                        self.reverseData();
                                    });

                var $sortByGroup = $('<div data-toggle="buttons">')
                                        .addClass("btn-group btn-group-sm")
                                        .css({"margin":"2px"})
                                        .append($byDate)
                                        .append($byName)
                                        .append($byType);

                $gal.$sortByDiv = $('<div>').css({'margin':'3px','margin-left':'5px','margin-bottom':'10px', 'display' : 'none'})
                                    .append("<small>sort by: </small>")
                                    .append($sortByGroup)
                                    .append($upOrDown);
                $elem.append($gal.$sortByDiv);

                $gal.$filterTypeSelect = $('<select>').addClass("form-control")
                                            .append($('<option value="">'))
                                            .change(function() {
                                                var optionSelected = $(this).find("option:selected");
                                                var typeSelected  = optionSelected.val();
                                                $gal.filterByType(typeSelected);
                                            });

                $gal.$filterTypeDiv = $('<div>').css({'margin':'3px','margin-left':'5px','margin-bottom':'10px', 'display' : 'none',})
                                    .append($gal.$filterTypeSelect);

                $elem.append($gal.$filterTypeDiv);


                $gal.$cardArea = $.jqElem('div')
                $elem.append($gal.$cardArea);

                $gal.topApps = data;

                $gal.addTopCards();

            });
/*
            this.nms.list_apps({}, function(data) {

            $.each(
                data,
                function (idx, app) {
                    if (app.id == $gal.options.topApps[0]) {
                        topApp = app;
                        return;
                    }
                }
            );


                $elem.append($.jqElem('div').addClass('row').append($topContent));

                $elem.append(
                    $.jqElem('div')
                        .css('background-color', 'white')
                        .css('border', '1px solid black')
                        .css('margin', '4px')
                        .css('box-shadow', '3px 3px 1px gray')
                        .css('font-size', '200%')
                        .append(
                            $.jqElem('div')
                                .addClass('row')
                                .css('padding', '4px')

                                .append(
                                    $.jqElem('div')
                                        .addClass('col-sm-2')
                                        .append('Browse')
                                )
                                .append(
                                    $.jqElem('div')
                                        .addClass('col-sm-6')
                                        .append(
                                            $.jqElem('span')
                                                //.addClass('badge')
                                                //.css('line-height', 1.52857143)
                                                .append('PLANTS')
                                                .css('background-color', 'lightgray')
                                                .css('border-radius', '5px')
                                                .css('padding', '2px')
                                                .css('color', 'white')
                                                .append(
                                                    $.jqElem('i')
                                                        .addClass('fa fa-remove')
                                                        .css('margin', '2px')
                                                        .on('click', function(e) {
                                                            $(this).parent().remove();
                                                        })
                                                )
                                        )
                                )
                                .append(
                                    $.jqElem('div')
                                        .addClass('col-sm-2')
                                        .css('text-align', 'right')
                                        .append('tags')
                                        .append($.jqElem('i').addClass('fa fa-angle-down'))
                                )
                                .append(
                                    $.jqElem('div')
                                        .addClass('col-sm-1')
                                        .append($.jqElem('i').addClass('fa fa-search'))
                                )
                                .append(
                                    $.jqElem('div')
                                        .addClass('col-sm-1')
                                        .append('AZ')
                                )
                        )
                );

                var boxes = [];

                $.each(
                    data,
                    function (idx, meth) {

                        var $methContent = $.jqElem('div')
                            //.css('height', '80px')
                            .css('border', '1px solid gray')
                            .css('box-shadow', '3px 3px 1px gray')
                            .css('margin', '4px')
                            .css('padding', '2px')
                            .css('background-color', 'white')
                            .addClass('row')
                            .append(
                                $.jqElem('div')
                                    .addClass('pull-left')
                                    .css('height', '100px')
                                    .append(
                                        $.jqElem('img')
                                            .attr('src', '/static/kbase/images/kbase_logo.png')
                                            .attr('width', '50')
                                            .attr('height', '50')
                                            .css('margin', '2px')
                                    )
                            )
                            .append(
                                $.jqElem('div')
                                    .append($.jqElem('h4').append(meth.name))
                                    .append(topApp.subtitle)
                                    .append('<br>')
                                    .append(
                                        $.jqElem('a')
                                            .append('LAUNCH')
                                            .on('click', function(e) {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if ($gal.options.sidePanel) {
                                                    $gal.options.sidePanel.toggleOverlay();
                                                }
                                                $gal.trigger('appClicked.Narrative', meth);
                                            })
                                    )
                            )
                        ;


                        boxes.push($methContent);

                        if (--topMeth <=0) {
                            return false;
                        }
                    }
                );

                var $row = $.jqElem('div').addClass('row');
                var boxesPerRow = Math.floor(boxes.length / 2);
                var cellIdx = 0;

                var boxWidth = Math.floor(12 / boxesPerRow);
                if (boxWidth < 1) {
                    boxWidth = 1;
                }

                var boxClass = 'col-sm-' + boxWidth;

                $elem.append($row);

                $.each(
                    boxes,
                    function(idx, box) {

                        if (++cellIdx > boxesPerRow) {
                            $row = $.jqElem('div').addClass('row');
                            $elem.append($row);
                            cellIdx = 0;
                        }

                        var $cell = $.jqElem('div')
                            .addClass(boxClass)
                            .append(box)
                        ;

                        $row.append($cell);

                    }
                );

            });
*/
        },

        addTopCards : function() {
            var $gal = this;
            $gal.$cardArea.empty();
            $.each(
                $gal.topApps,
                function(idx, app) {
                    $gal.addCard(app);
                }
            );
        },

        addCard : function(app) {
            var $gal = this;

                var truncated = app.subtitle;//.substring(0,50);

                var $card = $.jqElem('div')
                    .css(
                        {
                        	width: '270px',
                            height: '250px',
                            'background-color': '#fff',
                            'padding': '10px',
                            'box-shadow': '1px 1px 1px #ccc',
                            'float': 'left',
                            'margin': '10px',
                        }
                    )
                    .on('click', function(e) {
                        $gal.app_details(app.id);
                    })
                    .append(
                        $.jqElem('div')
                            .css('height', '250px')
                            .css('float', 'left')
                            .append(

                                $.jqElem('img')
                                    .css(
                                    {
                                        //float: 'left',
                                        height: '90px',
                                        width: '90px',
                                        'padding-top': '10px'
                                    })
                                    .css('height', '80px')
                                    .attr('src', '/static/kbase/images/kbase_logo.png')
                            )
                    )
                    .append(
                        $.jqElem('div').css({'font-weight' : 'bold', 'font-size' : '110%'}).append(app.name)
                    )
                    .append($.jqElem('div').append(truncated))
                    .append(
                        $.jqElem('div').append(
                            $.jqElem('a')
                                .attr('href', '#')
                                .css('text-decoration', 'none')
                                .css('color' , '#304FFE')
                                .append('LAUNCH')
                                .on('click', function(e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    $gal.launchApp(app.id);
                                })
                        )
                    )

                    /*.append(
                        $.jqElem('div')
                            .css({ width : '180px', 'float' : 'left', 'padding-left': '10px'})
                            .append(
                                $.jqElem('h1')
                                    .css(
                                    {
                                        'font-size': '18px',
                                        color: '#000',
                                        'margin-top': '0px',
                                        'margin-bottom': '10px'
                                    })
                                .append(app.name)
                            )
                            .append(
                                $.jqElem('div')
                                    .css({'font-size' : '12px', color : '#919191'})
                                    .append(app.subtitle)
                            )
                            .append(
                                $.jqElem('div')
                                    .css('padding-bop', '10px')
                                    .append(
                                        $.jqElem('a')
                                            .attr('href', '#')
                                            .css('text-decoration', 'none')
                                            .css('color' , '#304FFE')
                                            .append('LAUNCH')
                                            .on('click', function(e) {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                $gal.launchApp(app.id);
                                            })
                                    )
                            )
                    )*/
                ;

                $gal.$cardArea.append($card);
        },

        search : function (text) {

            var $gal = this;

            $gal.searches[text] = 1;

            this.$searchTags.append(
                $.jqElem('span')
                    //.addClass('badge')
                    //.css('line-height', 1.52857143)
                    .append(text)
                    .css('background-color', 'lightgray')
                    .css('border-radius', '5px')
                    .css('padding', '2px')
                    .css('color', 'white')
                    .append(
                        $.jqElem('i')
                            .addClass('fa fa-remove')
                            .css('margin', '2px')
                            .on('click', function(e) {
                                $(this).parent().remove();
                                delete $gal.searches[text];
                                $gal.research();
                            })
                    )
            );

            $gal.research();
        },

        research : function() {

            var newApps = [];
            var $gal = this;

            $.each(
                Object.keys($gal.searches),
                function (idx, search) {
                    $.each(
                        $gal.search_criteria,
                        function (key, val) {
                            var regex = new RegExp(search, 'i');
                            if (key.match(regex)) {
                                newApps.push(val);
                            }
                        }
                    )
                }
            );

            if (newApps.length == 0) {
                $gal.$cardArea.empty();
                if (Object.keys($gal.searches).length == 0) {
                    $gal.addTopCards();
                }
                else {
                    $gal.$cardArea.append('No matching apps');
                }
            }
            else {

                this.nms.get_app_full_info({ids:newApps}, function(apps) {

                    $gal.$cardArea.empty();
                    $.each(
                        apps,
                        function(idx, app) {
                            $gal.addCard(app);
                        }
                    );


                });
            }

        },

        launchApp : function(appId) {

            var $gal = this;

            if (this.options.sidePanel) {
                this.options.sidePanel.toggleOverlay();
            }

            this.nms.get_app_spec({ids:[appId]}, function(data) {
                $gal.trigger('appClicked.Narrative', data);
            });

        },

        oldAppendUI : function($elem) {

            var $root =
                $.jqElem('div')
                    .addClass('container-fluid')
                    .append(
                        $.jqElem('div')
                            .addClass('row')
                            .css('margin-top', '55px')
                            .append(
                                $.jqElem('div')
                                    .addClass('col-md-4')
                                    .append(
                                        $.jqElem('div')
                                            .attr('id', 'paths')
                                    )
                            )
                            .append(
                                $.jqElem('div')
                                    .addClass('col-md-8')
                                    .append(
                                        $.jqElem('div').attr('id', 'carousel')
                                    )
                                    .append(
                                        $.jqElem('div').attr('id', 'method-details')
                                    )
                            )
                    )
            ;

            this._rewireIds($root, this);

            var $mostPopular = $.jqElem('div').kbasePopularMethods();
            this.data('method-details').append($mostPopular.$elem);

            var $methodDetails = this.data('method-details').kbaseMethodDescription(
                {mostPopular : $mostPopular, sidePanel : this.options.sidePanel}
            );

            this.data('paths').kbaseWalkablePath({ methodDetails : $methodDetails, mostPopular : $mostPopular});

            this.data('carousel').kbaseCarousel({ methodDetails : $methodDetails});

            $elem.append($root);

            return this;
        }

    });
});

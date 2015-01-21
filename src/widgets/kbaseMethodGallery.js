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
            //topApps : ['genome_annotation', 'genome_assembly','plant_annotation', 'contigset_assembly', 'genome_reannotation'],
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
                            'Category:' + crit.info.categories.join('Category:'),
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


                        $gal.search_criteria[ local_search.join() ] = {type : 'app', id : crit.info.id};
                    }
                );

                $gal.nms.list_methods_spec({}, function (data) {

                    $.each(
                        data,
                        function (idx, crit) {
                            var local_search = [
                                crit.info.id,
                                crit.info.name,
                                crit.info.subtitle,
                                crit.info.tooltip,
                                crit.info.ver,
                                'Category:' + crit.info.categories.join('Category:'),
                            ];

                            $gal.search_criteria[ local_search.join() ] = {type : 'method', id : crit.info.id};
                        }
                    );

                });


            });

            if (this.options.method_id) {
                this.method_details(this.options.method_id);
            }
            else if (this.options.app_id) {
                this.app_details(this.options.app_id);
            }
            else {
                this.appendUI(this.$elem);
            }

            return this;
        },

        app_details : function(id) {

            window.open(
                '/functional-site/#/narrativestore/app/' + id
            );
            return;

            var $details = $.jqElem('div');
            $details.kbaseAppDescription({app_id : id, gallery : this});

            this.$elem.empty();

            this.$elem.append($details);

        },

        method_details : function(id) {

            window.open(
                '/functional-site/#/narrativestore/method/' + id
            );
            return;

            var $details = $.jqElem('div');
            $details.kbaseMethodDescription({method_id : id, gallery : this});

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
            this.nms.list_apps({}, function(data) {

                if ($gal.options.topApps == undefined) {
                    $gal.options.topApps = [];
                    $.each(
                        data,
                        function (idx, app) {
                            if (app.loading_error == undefined) {
                                $gal.options.topApps.push(app.id);
                            }
                        }
                    );
                }

//$gal.options.topApps = ["plant_annotation"];
                $gal.nms.get_app_full_info({ids:$gal.options.topApps}, function(data) {

                    data = data.sort($gal.sortByKey('name'));

                    var topApp = data.shift();

                    var topIcon = '/static/kbase/images/kbase_logo.png';
                    if (topApp.icon != undefined) {
                        topIcon = topApp.icon;
                    }

                    var $topContent = $.jqElem('div');
                    $topContent
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
                                .on('mouseover', function(e) {
                                    $topContent.css('box-shadow', '3px 3px 3px #ccc');
                                })
                                .on('mouseout', function(e) {
                                    $topContent.css('box-shadow', '1px 1px 1px #ccc');
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
                                        .attr('src', topIcon)
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
                                                            $gal.$searchInput.val('');
                                                            $gal.$searchDiv.toggle();
                                                            if ($gal.$searchDiv.is(":visible")) {
                                                                $gal.$searchInput.focus();
                                                            }
                                                            $gal.$sortByDiv.hide();
                                                            $gal.$filterTypeDiv.hide();
                                                        })
                                                )
                                        )
                                        /*.append(
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
                                        )*/
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

                    $gal.searchFunc = function() {
                        var searchValue = $gal.$searchInput.val();
                        $gal.search(searchValue);
                        $gal.$searchInput.val('');


                        //$gal.$searchDiv.hide();
                    }

                    $gal.$searchInput = $('<input type="text">').addClass('form-control')
                        .attr('Placeholder', 'Search apps and methods')
                        .on('keypress',
                            $.proxy(function(e) {
                                if (e.which == 13) {
                                    $gal.searchFunc();
                                }
                            }, this)
                        )
                    ;
                    $gal.$searchDiv = $('<div>').addClass("input-group").css({'margin-bottom':'10px', 'display' : 'none'})
                                        .append($gal.$searchInput)
                                        .append($("<span>").addClass("input-group-addon")
                                                .on('click',function() {
                                                                $gal.searchFunc();
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
                                                    var cat_id  = optionSelected.val();
                                                    $gal.search('Category:' + cat_id);
                                                });

                    $gal.nms.list_categories({}, function(data) {
                        var cats = data[0];
                        $.each(
                            cats,
                            function (key, obj) {
                                var obj = cats[key];
                                if (! key.match(/error|inactive/)) {
                                    $gal.$filterTypeSelect
                                        .append(
                                            $.jqElem('option')
                                                .attr('value', obj.id)
                                                .append(obj.name)
                                        )
                                }
                            }
                        );
                    });

                    $gal.$filterTypeDiv = $('<div>').css({'margin':'3px','margin-left':'5px','margin-bottom':'10px', 'display' : 'none',})
                                        .append($gal.$filterTypeSelect);

                    $elem.append($gal.$filterTypeDiv);


                    $gal.$cardArea = $.jqElem('div')
                    $elem.append($gal.$cardArea);

                    $gal.topApps = data;

                    $gal.addTopCards();

                    $.each(
                        Object.keys($gal.searches),
                        function (idx, search) {
                            $gal.search(search);
                        }
                    );

                    //$gal.research();

                });
            });

        },

        addTopCards : function() {
            var $gal = this;
            $gal.$cardArea.empty();
            $.each(
                $gal.topApps,
                function(idx, app) {
                    $gal.addAppCard(app);
                }
            );
        },

        addCard : function(data) {

        },

        addAppCard : function(app) {
            var $gal = this;

                var truncated = app.subtitle;//.substring(0,50);

                var cardIcon = '/static/kbase/images/kbase_logo.png';
                if (app.icon != undefined) {
                    cardIcon = app.icon;
                }

                var $card = $.jqElem('div');
                $card
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
                    .on('mouseover', function(e) {
                        $card.css('box-shadow', '3px 3px 3px #ccc');
                    })
                    .on('mouseout', function(e) {
                        $card.css('box-shadow', '1px 1px 1px #ccc');
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
                                    .attr('src', cardIcon)
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

                ;

                $gal.$cardArea.append($card);
        },

        addMethodCard : function(meth) {
            var $gal = this;

                var truncated = meth.subtitle;//.substring(0,50);

                var $card = $.jqElem('div');
                $card
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
                        $gal.method_details(meth.id);
                    })
                    .on('mouseover', function(e) {
                        $card.css('box-shadow', '3px 3px 3px #ccc');
                    })
                    .on('mouseout', function(e) {
                        $card.css('box-shadow', '1px 1px 1px #ccc');
                    })

                    .append(
                        $.jqElem('div').css({'font-weight' : 'bold', 'font-size' : '110%'}).append(meth.name)
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
                                    $gal.launchMethod(meth.id);
                                })
                        )
                    )

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
                    .css('margin-right', '2px')
                    .css('background-color', 'lightgray')
                    .css('border-radius', '5px')
                    .css('padding', '2px')
                    .css('color', 'white')
                    .append(
                        $.jqElem('i')
                            .addClass('fa fa-remove')
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
            var newMeth = [];
            var $gal = this;

            $.each(
                $gal.search_criteria,
                function (key, val) {

                    var match = true;

                    $.each(
                        Object.keys($gal.searches),
                        function (idx, search) {
                            var regex = new RegExp(search, 'i');
                            if (! key.match(regex)) {
                                match = false;
                                return;
                            }
                        }
                    );

                    if (match && Object.keys($gal.searches).length) {
                        if (val.type == 'app') {
                            newApps.push(val.id);
                        }
                        else if (val.type == 'method') {
                            newMeth.push(val.id);
                        }
                    }
                }
            );

            if (newApps.length == 0 && newMeth.length == 0) {
                $gal.$cardArea.empty();
                if (Object.keys($gal.searches).length == 0) {
                    $gal.addTopCards();
                }
                else {
                    $gal.$cardArea.append('No matching apps or methods');
                }
            }
            else {

                var app_info = this.nms.get_app_full_info({ids:newApps});
                var meth_info = this.nms.get_method_full_info({ids:newMeth});

                $.when(app_info, meth_info).done(
                    function (apps, methods) {

                        $gal.$cardArea.empty();
                        $.each(
                            apps,
                            function(idx, app) {
                                $gal.addAppCard(app);
                            }
                        );

                        $.each(
                            methods,
                            function(idx, meth) {
                                $gal.addMethodCard(meth);
                            }
                        );
                    }
                );
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

        launchMethod : function(methId) {

            var $gal = this;

            if (this.options.sidePanel) {
                this.options.sidePanel.toggleOverlay();
            }

            this.nms.get_method_spec({ids:[methId]}, function(data) {
                $gal.trigger('methodClicked.Narrative', data);
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

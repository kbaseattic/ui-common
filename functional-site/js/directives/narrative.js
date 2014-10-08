
/*
 * Narrative directives
 *  - narrativeCell : extends functionality of a cell 
 *  - kbWidget : wrapper for jquery output widgets
 *  - wsSelector : mini workspace selector dropdown
 *
 * Controllers:  (See Analysis in js/controllers.js)
*/

var narrativeDirectives = angular.module('narrative-directives', []);

angular.module('narrative-directives')

.directive('narrativeCell', function(narrative) {
    return {
        link: function(scope, ele, attrs) {

            // dictionary for fields in form.  Here, keys are the ui_name 
            scope.fields = {};  

            scope.flip = function($event) {
                $($event.target).parents('.panel').find('.narrative-cell').toggleClass('flipped')
            }

            scope.minimize = function($event) {
                $($event.target).parents('.panel').find('.panel-body').slideToggle('fast');
            }

            scope.runCell = function(index, cell) {
                var task = {name: cell.title, fields: scope.fields};
                narrative.newTask(task);
            }


        }
    }
})

.directive('kbWidget', function() {
    return {
        link: function(scope, element, attrs) {
            // instantiation of a kbase widget
        }
    }
})

.directive('animateOnChange', function($animate) {
  return {
      link: function(scope, elem, attr) {
          scope.$watch(attr.animateOnChange, function(nv,ov) {
            if (nv!=ov) {
              var c = nv > ov ? 'change-up' : 'change';
              console.log('changing', c)
              elem.addClass(c).removeClass(c, {duration: 1000})
            }
          });    

        }
   };
})


.directive('wsSelector', function() {
    return {
        link: function(scope, element, attrs) {

            var wsSelect = $('<form class="form-horizontal" role="form">'+
                                '<div class="form-group">'+
                                    '<div class="input-group col-sm-12">'+
                                        '<input type="text" class="select-ws-input form-control focusedInput" placeholder="Search workspaces">'+
                                        '<span class="input-group-btn">'+
                                            '<button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">'+
                                                '<span class="caret"></span>'+
                                            '</button>'+
                                        '</span>'+
                                    //'<a class="btn-new-ws pull-right">New WS</a>'+
                                    '</div>'+
                            '</div>');            
            element.append(wsSelect);

            var p = kb.ws.list_workspace_info({perm: 'w'});
            var prom = $.when(p).then(function(workspaces){
                var workspaces = workspaces.sort(compare)

                function compare(a,b) {
                    var t1 = kb.ui.getTimestamp(b[3]) 
                    var t2 = kb.ui.getTimestamp(a[3]) 
                    if (t1 < t2) return -1;
                    if (t1 > t2) return 1;
                    return 0;
                }

                var select = $('<ul class="dropdown-menu select-ws-dd" role="menu">');
                for (var i in workspaces) {
                    select.append('<li><a>'+workspaces[i][1]+'</a></li>');
                }

                wsSelect.find('.input-group-btn').append(select);

                var dd = wsSelect.find('.select-ws-dd');
                var input = wsSelect.find('input');

                var not_found = $('<li class="select-ws-dd-not-found"><a><b>Not Found</b></a></li>');
                dd.append(not_found);
                input.keyup(function() {
                    dd.find('li').show();

                    wsSelect.find('.input-group-btn').addClass('open');

                    var input = $(this).val();
                    dd.find('li').each(function(){
                        if ($(this).text().toLowerCase().indexOf(input.toLowerCase()) != -1) {
                            return true;
                        } else {
                            $(this).hide();
                        }
                    });

                    if (dd.find('li').is(':visible') == 1) {
                        not_found.hide();
                    } else {
                        not_found.show();
                    }
                }) 

                dd.find('li').click(function() {
                    dd.find('li').removeClass('active');

                    if (!$(this).hasClass('select-ws-dd-not-found')) {
                        $(this).addClass('active');                    

                        var val = $(this).text();
                        input.val(val);
                    }
                })

                element.append(wsSelect)
            })

        }
    }
})


.directive('recentnarratives', function($location) {
    return {
        link: function(scope, element, attrs) {
            $(element).loading()

            scope.loadRecentNarratives = function() {
                var p = kb.ws.list_objects({type: kb.nar_type}).fail(function(e){
                    $(ele).rmLoading();
                    $(ele).append('<div class="alert alert-danger">'+
                                    e.error.message+'</div>')
                });

                
                $.when(p).done(function(results){
                    $(element).rmLoading();

                    var narratives = [];
                    if (results.length > 0) {
                        for (var i in results) {
                            var nar = {};
                            nar.name = results[i][1];
                            if (nar.name.slice(0,4) == 'auto') continue;

                            nar.id = results[i][0];
                            nar.wsid = results[i][6]
                            nar.ws = results[i][7];
                            nar.owner = results[i][5];

                            nar.timestamp = kb.ui.getTimestamp(results[i][3]);
                            nar.nealtime = kb.ui.formateDate(nar.timestamp) 
                                            ? kb.ui.formateDate(nar.timestamp) : results[i][3].replace('T',' ').split('+')[0];
                            narratives.push(nar);
                        }

                        scope.$apply(function() {
                            scope.narratives = narratives;
                        })
                    } else {
                        $(element).append('no narratives');
                    }
                });
            }

            scope.loadRecentNarratives();
        }  /* end link */
    };
})

.directive('newsfeed', function(FeedLoad, $compile) {
    return  {
        link: function(scope, element, attrs) {
            var feedUrl = 'http://yogi.lbl.gov/eprojectbuilder/misc/kbasefeed2.xml';

            FeedLoad.fetch({q: feedUrl, num: 50}, {}, function (data) {
                var feed = data.responseData.feed;
                var feedContent = $("<div></div>");
                for (entry in feed.entries) {

                    var feedEntry = $("<div></div>");
                    $(feedEntry).addClass("narr-featured-narrative");

                    $(feedEntry).append(feed.entries[entry].content);
                    var copyLink = $("<a></a>");
                    $(copyLink).html("copy narrative");
                    $(copyLink).attr('ng-click',"copyNarrativeForm(\""+feed.entries[entry].title + "\")");
                    $compile(copyLink)(scope);
                    $(feedEntry).append(copyLink);
                    $(feedContent).append($(feedEntry));
                }
                
                $(element).html($(feedContent));
            });

        } 
    };
})  

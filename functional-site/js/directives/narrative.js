
/*
 * Narrative directives
 * 
*/

var narrativeDirectives = angular.module('narrative-directives', []);

angular.module('narrative-directives')
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
.directive('copyfeatured', function($state, modals) {
    return {
        link: function(scope, element, attrs) {
            $(element).find('tr').hover(function() {
                $(this).find('.btn').css('visibility', 'visible');
            }, function() {
                $(this).find('.btn').css('visibility', 'hidden');
            })

            var copyBtns = $(element).find('.btn');
            copyBtns.unbind('click');
            copyBtns.click(function() {
                console.log('click')
                var ws = $(this).data('ws');
                modals.copyWorkspace(ws, null, function() {
                    $state.go('narratives.mynarratives');
                    kb.ui.notify('Copied Narratives and Objects From: <i>'+ws+'</i>');                    
                });
            })
        }
    }
})

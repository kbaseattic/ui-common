/* Directives */

// define Search as its own module, and what it depends on
var searchApp = angular.module('search', ['ui.router','ui.bootstrap','kbaseLogin']);


// enable CORS for Angular
searchApp.config(function($httpProvider,$stateProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        $stateProvider
            .state('search', {
                url: "/search/?q&category&page&itemsPerPage&sort&facets",
                templateUrl: 'views/search/search.html',
                controller: 'searchController'
            })
            .state('search.recent', {
                url: "/recent/",
                templateUrl: 'views/search/recent.html',
                controller: 'searchController'
            })
            .state('search.favorites', {
                url: "/favorites/",
                templateUrl: 'views/search/favorites.html',
                controller: 'searchController'
            });

        
        $(document).ajaxStop($.unblockUI());
    }
);


/* Services */

/*
 *  This service is responsible for fetching the search service category information.
 */
searchApp.service('searchCategoryLoadService', function($q, $http, $rootScope) {
    // Functions for fetching and manipulating model data
    return {
        getCategoryInfo : function () {
            var deferred = $q.defer();
    
            $http.get($rootScope.kb.search_url + "categories").then(function fetchCategories(results) {
                this.categoriesJSON = results.data;
                deferred.resolve(results);                    
            });            
            
            return deferred.promise;
        }        
    };
});


searchApp.service('searchKBaseClientsService', function($q, $http, $rootScope) {
    return {
        getWorkspaceClient : function(token) {
            return new Workspace($rootScope.kb.ws_url, {token: token});
        }    
    };
});


/*
 *  This service houses the various options captured for Search, some of which
 *  are housed in local storage for persistence.
 */
searchApp.service('searchOptionsService', function searchOptionsService() {
    var genomesWorkspace = "KBasePublicGenomesV3";
    var searchGenomesWorkspace = "KBasePublicRichGenomesV3";
    var metagenomesWorkspace = "KBasePublicMetagenomes";

    // Model data that persists for all searches
    var _userData = {"token": null,
                     "selectAll": {},
                     "selectedWorkspace": null,
                     "workspaces": null,
                     "selections": {},
                     "viewType": "compact",
                     "loggedIn": false,
                     "user_id": null,
                     "data_cart": {
                         size: 0, 
                         all: false,
                         data: {},
                         types: {
                             'genome': {all: false, size: 0, markers: {}},
                             'feature': {all: false, size: 0, markers: {}},
                             'metagenome': {all: false, size: 0, markers: {}},
                             'gwas': {all: false, size: 0, markers: {}}
                         }
                     },
                     "workspace_carts": {},
                     "objectsTransferred": 0,
                     "version": 0.2
                    };


    if (!localStorage.hasOwnProperty("searchUserState") || (!localStorage.searchUserState.version || localStorage.searchUserState.version < _userData.version)) {
        localStorage.setItem("searchUserState", JSON.stringify(_userData));
    }    

    for (var p in _userData) {
        if (_userData.hasOwnProperty(p) && !localStorage.searchUserState.hasOwnProperty(p)) {
            localStorage.searchUserState[p] = _userData[p];
        }    
    }

    
    if (localStorage.searchUserState.token !== $('#signin-button').kbaseLogin('session', 'token')) {
        // check for login state
        localStorage.searchUserState.token = $('#signin-button').kbaseLogin('session', 'token');
        localStorage.searchUserState.user_id = $('#signin-button').kbaseLogin('session', 'user_id');

        if (localStorage.searchUserState.token) {
            localStorage.searchUserState.loggedIn = true;
        }
        else {
            localStorage.searchUserState.loggedIn = false;
            localStorage.searchUserState.token = null;
            localStorage.searchUserState.user_id = null;
        }
    }    
    
    return {
        categoryInfo : {},
        categoryTemplates : {},
        categoryGroups : {},
        searchCategories : {},
        categoryRelationships : {},
        related: {},
        numPageLinks : 10,
        defaultSearchOptions : {"general": {"itemsPerPage": 10},
                                "perCategory": {}
                               },    
        categoryCounts : {},
        searchOptions : this.defaultSearchOptions,                                          
        defaultMessage : "KBase is processing your request...",
        userState : JSON.parse(localStorage.searchUserState),
        publicWorkspaces: {"search_genome": searchGenomesWorkspace,
                           "genome": genomesWorkspace,
                           "feature": genomesWorkspace,
                           "metagenome": metagenomesWorkspace
                          },
        landingPages : {"genome": "/genomes/" + genomesWorkspace + "/",
                        "feature": "/genes/" + genomesWorkspace + "/",
                        "gwasPopulation": "/KBaseGwasData.GwasPopulation/",
                        "gwasTrait": "/KBaseGwasData.GwasPopulationTrait/",
                        "gwasVariation": "/KBaseGwasData.GwasPopulationVariation/",
                        "gwasGeneList": "/KBaseGwasData.GwasGeneList/",
                        "metagenome": "http://metagenomics.anl.gov/?page=MetagenomeOverview&metagenome=",
                       },
        resultJSON : {},
        objectCopyInfo : null,
        resultsAvailable : false,
        countsAvailable : false,
        transferring: false,
        selectedCategory : null,
        pageLinksRange : [],
        facets : null,
        active_facets: {},
        active_sorts: {},

        reset : function() {
            this.categoryCounts = {};
            this.resultJSON = {};
            this.objectCopyInfo = null;
            this.resultsAvailable = false;
            this.countsAvailable = false;
            this.selectedCategory = null;
            this.pageLinksRange = [];
            this.facets = null;
            this.active_facets = {};
            this.active_sorts = {};
            this.searchOptions = this.defaultSearchOptions;                                          

            this.userState = JSON.parse(localStorage.searchUserState);
        }
    };
});


/* Controllers */

// This controller is responsible for the Search Data Nav and connects to the Search view controller
searchApp.controller('searchBarController', function searchBarCtrl($rootScope, $scope, $state) {
    $scope.$on('queryChange', function(event, query) {
        $scope.query = query;
    });

    $scope.newSearch = function () {
        if ($scope.query && $scope.query.length > 0) {
            //$rootScope.$state.go('search', {q: $scope.query});
            $state.go('search', {q: $scope.query});
        }
        else {
            //$rootScope.$state.go('search', {q: "*"});
            $state.go('search', {q: "*"});        
        }
    };    
});


/*
 *  The main Search controller that is responsible for content inside the Search view.
 */
searchApp.controller('searchController', function searchCtrl($rootScope, $scope, $q, $timeout, $http, $state, $stateParams, searchCategoryLoadService, searchOptionsService, searchKBaseClientsService) {
    $scope.options = searchOptionsService;
    $scope.workspace_service;


    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        if (toState.name === "search") {
            console.log($scope.options.userState);
            console.log("state change to search");
            $scope.startSearch();      
        }  
    });


    $scope.login = function() {
        $('#signin-button').kbaseLogin('openDialog');
        $('#signin-button').on('loggedIn', function () {
            $state.go('search');       
        });
    };


    $scope.logout = function() {
        $('#signin-button').kbaseLogin('logout');
        $('#signin-button').on('loggedOut', function () {
            $state.go('search');       
        });
    };


    $scope.saveUserState = function() {
        localStorage.setItem("searchUserState", JSON.stringify($scope.options.userState));
    };


    $scope.loadCategories = function() {
        var flattenCategories = function(resource) {
            if (resource.hasOwnProperty("category") && $scope.options.categoryInfo.categories.hasOwnProperty(resource.category)) {
                $scope.options.searchCategories[resource.category] = {"category": resource.category, "label": resource.label};
            }            
        
            if (resource.hasOwnProperty("children")) {
                for (var i = 0; i < resource.children.length; i++) {
                    flattenCategories(resource.children[i]);
                }    
            }
        };

        for (var p in $scope.options.categoryInfo.displayTree) {
            if ($scope.options.categoryInfo.displayTree.hasOwnProperty(p)) {
                flattenCategories($scope.options.categoryInfo.displayTree[p]);
            }
        }                 

        var recordRelationships = function(node, nodeParent) {
            if (node.hasOwnProperty("category")) {
                $scope.options.categoryRelationships[node.category] = {"parent": nodeParent, "children": []};    
            
                if (node.hasOwnProperty("children")) {
                    for (var i = 0; i < node.children.length; i++) {
                        if (node.children[i].hasOwnProperty("category")) {
                            $scope.options.categoryRelationships[node.category].children.push(node.children[i].category);
                    
                            recordRelationships(node.children[i], node.category);
                        }
                    }
                }
            }
            else {
                if (node.hasOwnProperty("children")) {
                    for (var i = 0; i < node.children.length; i++) {
                        recordRelationships(node.children[i], nodeParent);
                    }
                }
            }
        };

        recordRelationships($scope.options.categoryInfo.displayTree['unauthenticated'], null);

        var isRelated = function(a, b) {
            var splits = [a.split("_"), b.split("_")];
        
            if (splits[0][0] !== splits[1][0]) {
                return false;
            }

            // test to see if a is an ancestor of b or just siblings
            if (splits[0].length < splits[1].length) {
                if (splits[0].length === 1) {
                    return true;
                }
                
                for (var i = 0; i < splits[0].length; i++) {
                    if (splits[0][i] !== splits[1][i]) {
                        return false;
                    }
                }
                return true;
            }
            // test to see if b is an ancestor of a or just siblings
            else {
                if (splits[1].length === 1) {
                    return true;
                }
                
                for (var i = 0; i < splits[1].length; i++) {
                    if (splits[1][i] !== splits[0][i]) {
                        return false;
                    }
                }
                return true;
            }
        };
        
        
        for (var p in $scope.options.categoryRelationships) {
            if ($scope.options.categoryRelationships.hasOwnProperty(p)) {
                $scope.options.related[p] = {};
                
                for (var psub in $scope.options.categoryRelationships) {
                    $scope.options.related[p][psub] = isRelated(p, psub);          
                }
            }
        }
        
        //console.log($scope.options.related);
        console.log($scope.options.searchCategories);
    };

    $scope.getCount = function(options, category) {
        var queryOptions = {};

        angular.copy(options, queryOptions);
        
        queryOptions["page"] = 1;
        queryOptions["itemsPerPage"] = 0;
        queryOptions["category"] = category;

        //console.log("getCount : " + JSON.stringify(queryOptions));

        if (!$scope.options.userState.hasOwnProperty("ajax_requests") || !$scope.options.userState.ajax_requests) {
            $scope.options.userState.ajax_requests = [];
        }        

        $scope.options.userState.ajax_requests.push(
            $http({method: 'GET', 
                   url: $rootScope.kb.search_url + "getResults",
                   params: queryOptions,      
                   responseType: 'json'
                  }).then(function (jsonResult) {
                      if (jsonResult.data.totalResults === undefined) {
                          $scope.options.categoryCounts[category] = 0;
                      }
                      else {
                          $scope.options.categoryCounts[category] = jsonResult.data.totalResults;                  
                      }
                      
                      if ($scope.options.selectedCategory && category === $scope.options.selectedCategory) {                      
                          $scope.options.countsAvailable = true;
                      }
                      //console.log($scope.options.categoryCounts);
                  }, function (error) {
                      console.log(error);
                      $scope.options.categoryCounts[category] = 0;
                  }, function (update) {
                      console.log(update);
                  })
        );
    };
    
    $scope.getTotalCount = function() {
        var sum = 0;
        for (var p in $scope.options.categoryCounts) {
            if ($scope.options.categoryCounts.hasOwnProperty(p)) {
                sum += $scope.options.categoryCounts[p];
            }
        }
        
        return sum;
    };
    
    $scope.getResults = function(category, options) {
        //console.log($scope.options);
        var queryOptions = {};

        if (!$scope.options.userState.hasOwnProperty("ajax_requests") || !$scope.options.userState.ajax_requests) {
            $scope.options.userState.ajax_requests = [];
        }
        
        if (category === null || category === undefined) {
            queryOptions = {'q': options.general.q};

            $("#loading_message_text").html(options.defaultMessage);
            $.blockUI({message: $("#loading_message")});
            
            for (var p in $scope.options.searchCategories) {
                if ($scope.options.searchCategories.hasOwnProperty(p) && $scope.options.searchCategories[p].category !== null) {
                    $scope.getCount(queryOptions, $scope.options.searchCategories[p].category);            
                }
                else {
                    $scope.options.categoryCounts[category] = 0;
                }
            }
    
            $scope.options.countsAvailable = true;

            // here we are waiting for all the ajax count calls to complete before unblocking the UI            
            $q.all($scope.options.userState.ajax_requests).then(function() {
                $.unblockUI();
                $scope.options.userState.ajax_requests = [];
                //console.log($scope.options.categoryCounts);
            });
            
            return;
        }

        queryOptions.category = category;
        for (var prop in options) {        
            if (prop === "general") {
                for (var gen_prop in options.general) {
                    if (options.general.hasOwnProperty(gen_prop)) {
                        queryOptions[gen_prop] = options.general[gen_prop];
                    }
                }
        
                if (queryOptions.hasOwnProperty("token")) {
                    delete queryOptions.token;
                }
            }        
            else if (prop === "perCategory") {
                for (var cat_prop in options.perCategory[category]) {
                    if (options.perCategory[category].hasOwnProperty(cat_prop)) {
                        queryOptions[cat_prop] = options.perCategory[category][cat_prop];
                    }
                }
            }    
        }

        if (queryOptions.hasOwnProperty("facets")) {
            var encodedFacets = "";
            var facets = queryOptions["facets"].split(",");
            var currentFacet;
            
            for (var i = 0; i < facets.length; i++) {
                currentFacet = facets[i].split(":");
                encodedFacets += currentFacet[0] + ":" + '"' + currentFacet[1] + '",';
            }
            
            queryOptions["facets"] = encodedFacets.substring(0,encodedFacets.length-1);
        }

        $("#loading_message_text").html(options.defaultMessage);
        $.blockUI({message: $("#loading_message")});

        //console.log("getResults : " + JSON.stringify(queryOptions));

        $http({method: 'GET', 
               url: $rootScope.kb.search_url + "getResults",
               params: queryOptions,      
               responseType: 'json'
              }).then(function (jsonResult) {
              
                  for (var i = 0; i < jsonResult.data.items.length; i++) {
                      jsonResult.data.items[i].position = (jsonResult.data.currentPage - 1) * jsonResult.data.itemsPerPage + i + 1;

                      if (jsonResult.data.items[i].hasOwnProperty("object_id")) {
                          jsonResult.data.items[i].row_id = jsonResult.data.items[i].object_id.replace(/\||\./g,"_");
                      }
                      else {
                          if (jsonResult.data.items[i].hasOwnProperty("feature_id")) {
                              jsonResult.data.items[i].row_id = jsonResult.data.items[i].feature_id.replace(/\||\./g,"_");
                          }
                          else if (jsonResult.data.items[i].hasOwnProperty("genome_id")) {
                              jsonResult.data.items[i].row_id = jsonResult.data.items[i].genome_id.replace(/\||\./g,"_");
                          }
                      }
                      
                      if (jsonResult.data.items[i].hasOwnProperty("taxonomy")) {
                          jsonResult.data.items[i].taxonomy = jsonResult.data.items[i].taxonomy.join('; ');
                      }
                  }

                  $scope.options.resultJSON = jsonResult.data;
                  $scope.options.resultsAvailable = true;
                  $scope.options.pageLinksRange = [];
              
                  $scope.options.facets = null;
              
                  if ($scope.options.resultJSON.hasOwnProperty('facets')) {
                      $scope.options.facets = [];

                      for (var p in $scope.options.resultJSON.facets) {
                          if ($scope.options.resultJSON.facets.hasOwnProperty(p)) {
                              var facet_options = [];
                      
                              for (var i = 0; i < $scope.options.resultJSON.facets[p].length - 1; i += 2) {
                                  facet_options.push({key: $scope.options.resultJSON.facets[p][i], value: $scope.options.resultJSON.facets[p][i+1]});                              
                              }
                  
                              $scope.options.facets.push({key: p, value: facet_options});
                          }
                      }
                  }
              
                  var position = $scope.options.resultJSON.currentPage % $scope.options.numPageLinks;
                  var start;
              
                  if (position === 0) {
                      start = $scope.options.resultJSON.currentPage - $scope.options.numPageLinks + 1;                  
                  }
                  else {
                      start = $scope.options.resultJSON.currentPage - position + 1;                  
                  }
              
                  var end = start + $scope.options.numPageLinks;

                  for (var p = start; p < end && (p - 1) * $scope.options.resultJSON.itemsPerPage < $scope.options.resultJSON.totalResults; p++) {                      
                      $scope.options.pageLinksRange.push(p);                      
                  }                  
                           
                  console.log($scope.options.resultJSON);     
                  $.unblockUI();
              }, function (error) {
                  console.log("getResults threw an error!");
                  console.log(error);
                  $scope.options.resultsAvailable = false;
                  $.unblockUI();
              }, function (update) {
                  console.log(update);
              });
    };


    $scope.newSearch = function () {
        if ($scope.options.searchOptions.general.q && $scope.options.searchOptions.general.q.length > 0) {
            $scope.saveUserState();

            // if we are in the category view, update the individual count
            if ($scope.options.selectedCategory) {
                $scope.getCount({q: $scope.options.searchOptions.general.q}, $scope.options.selectedCategory);        
                $state.go('search', {q: $scope.options.searchOptions.general.q, category: $scope.options.selectedCategory, page: 1, sort: null, facets: null});
            }
            else {
                $state.go('search', {q: $scope.options.searchOptions.general.q});            
            }
        }
    };    

    
    $scope.startSearch = function () {
        //console.log("Starting search with : " + $stateParams.q);
        //console.log($stateParams);

        var init = function () {
            // in here we initialize anything we would want to reset on starting a new search
            return searchCategoryLoadService.getCategoryInfo().then(function(results) {
                $scope.options.categoryInfo = results.data;
                $scope.loadCategories();
            });
        };

        var captureState = function () {
            if ($scope.options.searchOptions === undefined) {
                $scope.options.reset();
            }

            // apply query string
            if ($stateParams.q !== undefined && $stateParams.q !== null && $stateParams.q !== '') {
                $scope.options.searchOptions.general.q = $stateParams.q;
            }
            else { // search view reached without a query, reset
                $scope.options.reset();
            }            

            // apply category selection
            if ($stateParams.category !== null && $stateParams.category in $scope.options.searchCategories) {
                $scope.options.selectedCategory = $stateParams.category;
                $scope.options.resultsTemplatePath = "views/search/" + $scope.options.selectedCategory + ".html";

                if ($scope.options.selectedCategory && !$scope.options.searchOptions.perCategory.hasOwnProperty($scope.options.selectedCategory)) {
                    $scope.options.searchOptions.perCategory[$scope.options.selectedCategory] = {"page": 1};
                }
                
                if ($stateParams.page !== undefined && $stateParams.page !== null) {
                    $scope.setCurrentPage($stateParams.page, false);
                }
                else {
                    $scope.setCurrentPage(1, false);
                }

                if ($stateParams.itemsPerPage !== null && $stateParams.itemsPerPage > 0 && $stateParams.itemsPerPage <= 100) {
                    $scope.options.searchOptions.general.itemsPerPage = $stateParams.itemsPerPage;
                }
                else {
                    $scope.options.searchOptions.general.itemsPerPage = 10;                
                }
            }
            else {
                $scope.options.reset();
            }            
    
            // apply facets
            if ($stateParams.facets !== null) {
                  // clear any cached facets
                  delete $scope.options.searchOptions.perCategory[$scope.options.selectedCategory].facets;
                  $scope.options.active_facets[$scope.options.selectedCategory] = {};
                  
                  var facetSplit = $stateParams.facets.split(",");
                  
                  var facet_keyval = [];

                  for (var i = 0; i < facetSplit.length; i++) {
                      facet_keyval = facetSplit[i].split(":");                      
                      
                      $scope.addFacet(facet_keyval[0],facet_keyval[1], false);
                  }                
            }
            else {
                $scope.options.facets = null;
                
                if ($scope.options.selectedCategory && $scope.options.searchOptions.perCategory[$scope.options.selectedCategory].hasOwnProperty("facets")) {
                    delete $scope.options.searchOptions.perCategory[$scope.options.selectedCategory].facets;
                    $scope.options.active_facets[$scope.options.selectedCategory] = {};
                }
            }

            // apply sorting
            if ($stateParams.sort !== null) {
                // clear any sort cached
                $scope.options.searchOptions.perCategory[$scope.options.selectedCategory].sort = "";
                $scope.options.active_sorts[$scope.options.selectedCategory] = {count: 0, sorts: {}};
            
                var sortSplit = $stateParams.sort.split(",");
                var sort_keyval = [];                
                
                for (var i = 0; i < sortSplit.length; i++) {
                    sort_keyval = sortSplit[i].split(" ");
                    
                    $scope.addSort($scope.options.selectedCategory, sort_keyval[0], sort_keyval[1], false);
                }                
            }
            else {
                $scope.options.active_sorts[$scope.options.selectedCategory] = {count: 0, sorts: {}};
                
                if ($scope.options.selectedCategory && $scope.options.searchOptions.perCategory[$scope.options.selectedCategory].hasOwnProperty("sort")) {
                    delete $scope.options.searchOptions.perCategory[$scope.options.selectedCategory].sort;
                }
            }

            // verify logged in state            
            try {
                $scope.options.userState.token = $("#signin-button").kbaseLogin("session", "token");
                $scope.options.userState.user_id = $("#signin-button").kbaseLogin("session", "user_id");
                
                if ($scope.options.userState.token !== undefined) {
                    $scope.options.userState.loggedIn = true;
                }
                else {
                    $scope.options.userState.loggedIn = false;
                    $scope.options.userState.token = null;
                    $scope.options.userState.user_id = null;
                }
            }
            catch (e) {
                $scope.options.userState.loggedIn = false;
                $scope.options.userState.token = null;
                $scope.options.userState.user_id = null;
            }

        };


        if (!$scope.options.categoryInfo.hasOwnProperty("displayTree")) {
            init().then(function () {
                captureState();
                $scope.getResults(null, $scope.options.searchOptions);

                $scope.getResults($scope.options.selectedCategory, $scope.options.searchOptions);        
            });
        }
        else {
            captureState();
            //console.log("No category chosen");
            
            var queryOptions = {q: $scope.options.searchOptions.general.q};

            if ($scope.options.selectedCategory) {            
                if ($scope.options.searchOptions.perCategory[$scope.options.selectedCategory].hasOwnProperty("facets")) {
                    queryOptions.facets = $scope.options.searchOptions.perCategory[$scope.options.selectedCategory].facets;
                }                
            
                if ($scope.options.searchOptions.perCategory[$scope.options.selectedCategory].hasOwnProperty("sort")) {
                    queryOptions.sort = $scope.options.searchOptions.perCategory[$scope.options.selectedCategory].sort;
                }            
            }
            
            if ($scope.options.selectedCategory) {
                $scope.getCount(queryOptions, $scope.options.selectedCategory);
            }
            
            $scope.getResults($scope.options.selectedCategory, $scope.options.searchOptions);        
        }
    };
    
    $scope.selectCategory = function(value) {
        $scope.options.selectedCategory = value;
        
        //console.log("Selected category : " + value);
        $scope.saveUserState();
        
        if (value === null || value === 'null') {
            $scope.options.reset();
            $state.go("search", {category: $scope.options.selectedCategory, page: null, itemsPerPage: null, facets: null, sort: null});
        }            
        else {
            if (!$scope.options.searchOptions.perCategory.hasOwnProperty(value)) {
                $scope.options.searchOptions.perCategory[value] = {"page": 1};
            }
            
            $scope.options.resultsTemplatePath = "views/search/" + value + ".html";
            $state.go("search", {category: $scope.options.selectedCategory});
        }
    };


    $scope.isInActiveCategoryTree = function(value) {
        return $scope.options.related[value][$scope.options.selectedCategory];
    };


    $scope.removeSearchFilter = function(category, type, name, value) {
        //console.log("before remove");
        //console.log($scope.options.searchOptions.perCategory[category][type]);

        // e.g. filters=domain:bacteria,domain:archea,complete:true
        if ($scope.options.searchOptions.perCategory[category].hasOwnProperty(type)) {
            var oldFilter;
            
            if (type === "sort") {
                oldFilter = $scope.options.searchOptions.perCategory[category][type].indexOf(name);
            }
            else if (type === "facets") {
                oldFilter = $scope.options.searchOptions.perCategory[category][type].indexOf(name + ":" + value);
            }
        
            var nextComma = $scope.options.searchOptions.perCategory[category][type].indexOf(",");
    
            if (oldFilter > -1) {
            
                if (oldFilter === 0 && nextComma < 0) {
                    // only one filter, go back to empty string
                    $scope.options.searchOptions.perCategory[category][type] = "";
                }
                else if (oldFilter === 0 && nextComma > oldFilter) {
                    // remove the beginning of the string to the comma
                    $scope.options.searchOptions.perCategory[category][type] = $scope.options.searchOptions.perCategory[category][type].substring(nextComma + 1,$scope.options.searchOptions.perCategory[category][type].length);                                
                }
                else if (oldFilter > 0) {
                    // must be more than one sort option, now get the comma after oldFacet
                    nextComma = $scope.options.searchOptions.perCategory[category][type].indexOf(",", oldFilter);
            
                    // we need to cut off the end of the string before the last comma
                    if (nextComma < 0) {
                        $scope.options.searchOptions.perCategory[category][type] = $scope.options.searchOptions.perCategory[category][type].substring(0,oldFilter - 1);
                    }
                    // we are cutting out the middle of the string
                    else {
                        $scope.options.searchOptions.perCategory[category][type] = $scope.options.searchOptions.perCategory[category][type].substring(0,oldFilter - 1) +
                            $scope.options.searchOptions.perCategory[category][type].substring(nextComma, $scope.options.searchOptions.perCategory[category][type].length);
                    }
                }
            }

            //console.log("after remove");
            //console.log($scope.options.searchOptions.perCategory[category][type]);
            //console.log($scope.options.searchOptions.perCategory[category][type].length);
    
            if ($scope.options.searchOptions.perCategory[category][type].length === 0) {
                delete $scope.options.searchOptions.perCategory[category][type];
            }            
        }    
    };


    $scope.setResultsPerPage = function (value) {
        $scope.options.searchOptions.general.itemsPerPage = parseInt(value);

        //$scope.removeAllSelections();

        $scope.saveUserState();
    
        //reset the page to 1
        $state.go("search", {itemsPerPage: $scope.options.searchOptions.general.itemsPerPage, page: 1});
    };


    $scope.addSort = function (category, name, direction, searchAgain) {    
        if (!$scope.options.searchOptions.perCategory[category].hasOwnProperty("sort")) {
            $scope.options.searchOptions.perCategory[category].sort = name + " " + direction;
        }
        else {
            // attempt to remove any old sorts of this name before adding the new one
            $scope.removeSort(category, name, false);

            // sort not initialized after removal of last sort
            if (!$scope.options.searchOptions.perCategory[category].hasOwnProperty("sort")) {
                $scope.options.searchOptions.perCategory[category].sort = name + " " + direction;
            }
            // another sort exists
            else if ($scope.options.searchOptions.perCategory[category].sort.length > 0) {
                $scope.options.searchOptions.perCategory[category].sort += "," + name + " " + direction;
            }
            // sort was initialized, but empty
            else {
                $scope.options.searchOptions.perCategory[category].sort += name + " " + direction;
            }
        }
        
        // add this as the last sort type
        $scope.options.active_sorts[category].count = $scope.options.active_sorts[category].count + 1;
        $scope.options.active_sorts[category].sorts[name] = {order: $scope.options.active_sorts[category].count, direction: direction};

        if (searchAgain === undefined || searchAgain === true) {
            $scope.saveUserState();
        
            $state.go("search", {sort: $scope.options.searchOptions.perCategory[category].sort, page: 1});
        }
    };


    $scope.removeSort = function (category, name, searchAgain) {
        $scope.removeSearchFilter(category, "sort", name, null);

        if ($scope.options.active_sorts.hasOwnProperty(category) && $scope.options.active_sorts[category].sorts.hasOwnProperty(name)) {
            // if this sort was not the last ordered sort, adjust the order of other sorts
            if ($scope.options.active_sorts[category].sorts.hasOwnProperty(name) && $scope.options.active_sorts[category].count - 1 > $scope.options.active_sorts[category].sorts[name].order) {
                for (var s in $scope.options.active_sorts[category].sorts) {
                    if ($scope.options.active_sorts[category].sorts.hasOwnProperty(s) && $scope.options.active_sorts[category].sorts[s].order > $scope.options.active_sorts[category].sorts[name].order) {
                        $scope.options.active_sorts[category].sorts[s].order -= 1;
                    }
                }
            }

            $scope.options.active_sorts[category].count -= 1;
            delete $scope.options.active_sorts[category].sorts[name];
        }
        
        if (searchAgain === undefined || searchAgain === true) {
            $scope.saveUserState();
            $state.go("search", {sort: $scope.options.searchOptions.perCategory[category].sort, page: 1});
        }
    };


    $scope.setCurrentPage = function (page, searchAgain) {
        try {
            $scope.options.searchOptions.perCategory[$scope.options.selectedCategory].page = parseInt(page);
        }
        catch(e) {
            $scope.options.searchOptions.perCategory[$scope.options.selectedCategory] = {'page': parseInt(page)};
        }

        $scope.saveUserState();
        
        if (searchAgain === undefined || searchAgain === true) {
            $state.go("search", {page: $scope.options.searchOptions.perCategory[$scope.options.selectedCategory].page});
        }
    };
    

    $scope.toggleFacet = function (name, value, checked) {
        // need to reset the page when a facet changes
        $scope.options.searchOptions.perCategory[$scope.options.selectedCategory].page = 1;

        if (checked) {
            $scope.removeFacet(name, value);
        }
        else {
            $scope.addFacet(name, value, true);
        }                
    };


    $scope.addFacet = function (name, value, searchAgain) {        
        if (!$scope.options.searchOptions.perCategory[$scope.options.selectedCategory].hasOwnProperty("facets")) {
            $scope.options.searchOptions.perCategory[$scope.options.selectedCategory].facets = name + ":" + value;
        }
        else {
            $scope.options.searchOptions.perCategory[$scope.options.selectedCategory].facets += "," + name + ":" + value;        
        }        
    
        if (!$scope.options.active_facets.hasOwnProperty($scope.options.selectedCategory)) {        
            $scope.options.active_facets[$scope.options.selectedCategory] = {};
        }

        if (!$scope.options.active_facets[$scope.options.selectedCategory].hasOwnProperty(name)) {
            $scope.options.active_facets[$scope.options.selectedCategory][name] = {};        
        }
        
        $scope.options.active_facets[$scope.options.selectedCategory][name][value] = true;        

        if (searchAgain === undefined || searchAgain === true) {
            $scope.getCount({q: $scope.options.searchOptions.general.q, facets: $scope.options.searchOptions.perCategory[$scope.options.selectedCategory].facets}, $scope.options.selectedCategory);        
            $state.go("search", {category: $scope.options.selectedCategory, facets: $scope.options.searchOptions.perCategory[$scope.options.selectedCategory].facets, page: 1});
        }
    };


    $scope.removeFacet = function (name, value, searchAgain) {
        $scope.removeSearchFilter($scope.options.selectedCategory, "facets", name, value);
                
        delete $scope.options.active_facets[$scope.options.selectedCategory][name][value];
        
        if ($.isEmptyObject($scope.options.active_facets[$scope.options.selectedCategory].name)) {
            delete $scope.options.active_facets[$scope.options.selectedCategory].name;
        }
    
        if (!$scope.options.searchOptions.perCategory[$scope.options.selectedCategory].hasOwnProperty("facets")) {
            $scope.options.active_facets[$scope.options.selectedCategory] = {};
        }

        if (searchAgain === undefined || searchAgain === true) {
            $scope.getCount({q: $scope.options.searchOptions.general.q, facets: $scope.options.searchOptions.perCategory[$scope.options.selectedCategory].facets}, $scope.options.selectedCategory);        
            $state.go("search", {category: $scope.options.selectedCategory, facets: $scope.options.searchOptions.perCategory[$scope.options.selectedCategory].facets, page: 1});
        }
    };


    $scope.setView = function (type) {
        //console.log("Setting " + type);
        $scope.options.userState.viewType = type;
    };


    $scope.listWorkspaces = function() {
        try {            
            $scope.workspace_service = searchKBaseClientsService.getWorkspaceClient($scope.options.userState.token);
            $scope.options.userState.workspaces = [];

            $(".blockMsg").addClass("search-block-element");
            $("#loading_message_text").html("Looking for workspaces you can copy to...");
            $("#workspace-area").block({message: $("#loading_message")});
        
            console.log("Calling list_workspace_info");
        
            $scope.workspace_service.list_workspace_info({"perm": "w"})
                .then(function(info, status, xhr) {
                    $scope.$apply(function () {
                        $scope.options.userState.workspaces = info.sort(function (a,b) {
                            if (a[1].toLowerCase() < b[1].toLowerCase()) return -1;
                            if (a[1].toLowerCase() > b[1].toLowerCase()) return 1;
                            return 0;
                        });
                    });

                    $("#workspace-area").unblock();
                    $(".blockMsg").removeClass("search-block-element");
                    //console.log($scope.options.userState.workspaces);
                },
                function (xhr, status, error) {
                    console.log([xhr, status, error]);
                    $("#workspace-area").unblock();
                    $(".blockMsg").removeClass("search-block-element");
                });
        }
        catch (e) {
            //var trace = printStackTrace();
            //console.log(trace);

            if (e.message && e.name) {
                console.log(e.name + " : " + e.message);
            }
            else {
                console.log(e);
            }
        }
    };


    $scope.selectWorkspace = function(workspace_info) {
        if (workspace_info.length === 10) {
            $scope.options.userState.selectedWorkspace = workspace_info[2];
        }
        else {
            $scope.options.userState.selectedWorkspace = workspace_info[1];
        }
    
        $(".workspace-chosen").removeClass("workspace-chosen");
        $("#" + workspace_info[1].replace(":","_") + "_" + workspace_info[4]).addClass("workspace-chosen");
    
        // setup a cart for any data to copy or save to this workspace
        if (!$scope.options.userState.workspace_carts.hasOwnProperty($scope.options.userState.selectedWorkspace)) {
            $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace] = {all: false, size: 0, data: {}};
        }
    
        //$("#workspace-area").hide();
    };


    $scope.copyGenome = function(n) {
        return $scope.workspace_service.get_object_info([{"name": $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[n]["genome_id"], "workspace": $scope.options.publicWorkspaces['genome']}])
            .fail(function (xhr, status, error) {
                console.log(xhr);
                console.log(status);
                console.log(error);
            })
            .done(function (info, status, xhr) {
                setTimeout(function() { ; }, 200);                        
            
                var max_tries = 10;
                var tries = 0;

                var copy_genome = function () {
                    $scope.workspace_service.copy_object({"from": {"workspace": $scope.options.publicWorkspaces['genome'], "name": info[0][1]}, "to": {"workspace": $scope.options.userState.selectedWorkspace, "name": info[0][1]}}, success, error);        
                };
        
        
                function success(result) {
                    $scope.$apply(function () {
                        $scope.options.userState.objectsTransferred += 1;
                        if ($scope.options.userState.objectsTransferred === $scope.options.transferSize) {
                            $scope.completeTransfer();
                        }
                    });
                }

                function error(result) {
                    if (tries < max_tries) {
                        tries += 1;
                        console.log("Failed save, number of retries : " + (tries - 1));
                        copy_genome();
                    }
                    else {
                        console.log(xhr);
                        console.log(status);
                        console.log(error);
                        console.log(feature_obj);
                    }


                    console.log("Object failed to copy");
                    console.log(result);
                
                    $scope.transferError($scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[n]["object_name"], 
                                         $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[n]["object_id"], 
                                         result);                            
                }

                $scope.options.transferRequests += 1;
                    
                copy_genome();                    
            });
    
    };
    
    
    $scope.copyMetagenome = function(n) {
        return $scope.workspace_service.get_object_info([{"name": $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[n]["metagenome_id"], "workspace": $scope.options.publicWorkspaces['metagenome']}])
            .fail(function (xhr, status, error) {
                console.log(xhr);
                console.log(status);
                console.log(error);
            })
            .done(function (info, status, xhr) {
                function success(result) {
                    $scope.$apply(function () {
                        $scope.options.userState.objectsTransferred += 1;
                        if ($scope.options.userState.objectsTransferred === $scope.options.transferSize) {
                            $scope.completeTransfer();
                        }
                    });
                }

                function error(result) {
                    console.log("Object failed to copy");
                    console.log(result);
                    $scope.transferError($scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[n]["metagenome_id"], 
                                         $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[n]["object_id"], 
                                         result);
                }
                        
                $scope.options.transferRequests += 1;
        
                $scope.workspace_service.copy_object({"from": {"workspace": $scope.options.publicWorkspaces['metagenome'], "name": info[0][1]}, "to": {"workspace": $scope.options.userState.selectedWorkspace, "name": info[0][1]}}, success, error);        
            });                
    };
    
    
    $scope.copyFeature = function(n) {
        console.log($scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[n]["object_id"]);
        var split_id = $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[n]["object_id"].split('/');
        
        return $scope.workspace_service.get_object_subset([{"name": $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[n]["genome_id"] + ".featureset",
                                                            "workspace": $scope.options.publicWorkspaces['search_genome'], 
                                                            "included": ["/features/" + split_id[2]]
                                                          }])
            .fail(function (xhr, status, error) {
                console.log(xhr);
                console.log(status);
                console.log(error);
            })
            .done(function (data, status, xhr) {
                setTimeout(function() { ; }, 100);
                
                $scope.options.transferRequests += 1;
                
                var feature_source_obj;
                var feature_dest_obj = {};
        
                try {
                    feature_source_obj = data[0].data.features[$scope.options.userState.data_cart.data[n]["feature_id"]].data;
                    
                    for (var p in feature_source_obj) {
                        if (feature_source_obj.hasOwnProperty(p)) {
                            if (p === "feature_id") {
                                feature_dest_obj["id"] = angular.copy(feature_source_obj[p]);
                            }
                            else if (p === "feature_type") {
                                feature_dest_obj["type"] = angular.copy(feature_source_obj[p]);
                            }
                            else if (p === "location") {
                                var sortedOrdinals = feature_source_obj[p].sort(function (a,b) {
                                                          if (a[4] < b[4]) return -1;
                                                          if (a[4] > b[4]) return 1;
                                                          return 0;
                                                      });         
                                                      
                                feature_dest_obj[p] = [];
                                for (var i = sortedOrdinals.length - 1; i >= 0; i--) {
                                    feature_dest_obj[p].unshift(sortedOrdinals[i].slice(0,4));
                                }
                            }
                            else if (p === "aliases") {
                                feature_dest_obj[p] = [];
                                for (var k in feature_source_obj[p]) {
                                    if (feature_source_obj[p].hasOwnProperty(k)) {
                                        feature_dest_obj[p].push(k + ":" + feature_source[p][k])
                                    }                                
                                }
                            }
                            else {
                                if (feature_source_obj[p]) {
                                    feature_dest_obj[p] = angular.copy(feature_source_obj[p]);
                                }
                            }                                                                
                        }
                    }
                    //console.log(feature_source_obj);
                    //console.log(feature_dest_obj);
                } 
                catch (e) {
                    console.log(n);
                    console.log(e);
                }
            
                var max_tries = 10;
                var tries = 0;
            
                // wrap this in a function so that we can retry on failure
                var save_feature = function () {
                    $scope.workspace_service.save_objects({"workspace": $scope.options.userState.selectedWorkspace, 
                                                           "objects": [{"data": feature_dest_obj, 
                                                                        "type": "KBaseGenomes.Feature", 
                                                                        "name": feature_source_obj["feature_id"], 
                                                                        "provenance": [{"time": new Date().toISOString().split('.')[0] + "+0000", 
                                                                                        "service": "KBase Search", 
                                                                                        "description": "Created from a Public Genome Feature", 
                                                                                        "input_ws_objects": []}], 
                                                                        "meta": {}
                                                                       }]
                                                           })
                        .fail(function (xhr, status, error) {
                            if (tries < max_tries) {
                                tries += 1;
                                console.log("Failed save, number of retries : " + (tries - 1));
                                save_feature();
                            }
                            else {
                                console.log(xhr);
                                console.log(status);
                                console.log(error);
                                console.log(feature_dest_obj);
                                return error;
                            }
                        })
                        .done(function (info, status, xhr) {
                            console.log("Save successful, object info : " + info);
                            $scope.$apply(function () {
                                $scope.options.userState.objectsTransferred += 1;
                                if ($scope.options.userState.objectsTransferred === $scope.options.transferSize) {
                                    $scope.completeTransfer();
                                }
                            });
                            return info;
                        });        
                    
                };
            
                // start the save
                save_feature();                                                                    
            });
    };
            

    // grab a public object and make a copy to a user's workspace
    $scope.copyTypedObject = function(object_name, object_ref, from_workspace_name, to_workspace_name) {
        function success(result) {
            console.log("Object " + object_name + " copied successfully from " + from_workspace_name + " to " + to_workspace_name + " .");
            $scope.$apply(function () {
                $scope.options.userState.objectsTransferred += 1;
                if ($scope.options.userState.objectsTransferred === $scope.options.transferSize) {
                    $scope.completeTransfer();
                }
            });
        }
    
        function error(result) {
            console.log("Object " + object_name + " failed to copy from " + from_workspace_name + " to " + to_workspace_name + " .");
            console.log(result);
            $scope.transferError(object_name, object_ref, result);
        }

        $scope.options.transferRequests += 1;

        if (object_ref === undefined || object_ref === null) {
            console.log("no object ref for name " + object_name);
            return $scope.workspace_service.copy_object({"from": {"workspace": from_workspace_name, "name": object_name}, "to": {"workspace": to_workspace_name, "name": object_name}}, success, error);        
        }
        else {
            console.log("had object ref " + object_ref);
            return $scope.workspace_service.copy_object({"from": {"ref": object_ref}, "to": {"workspace": to_workspace_name, "name": object_name}}, success, error);
        }
    };


    // grab all selected search results and copy those objects to the user's selected workspace
    $scope.addAllObjects = function() {
        if (!$scope.options.userState.selectedWorkspace) {
            console.log("select a workspace first");
            return;
        }

        console.log("Copying objects...");

        $scope.workspace_service = searchKBaseClientsService.getWorkspaceClient($scope.options.userState.token);

        var loop_requests = [];
        var max_simultaneous = 10;
        var ws_requests = [];
        var batches = 1;
        var types = {};
        
        $scope.options.transferSize = $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].size;
        $scope.options.transferring = true;
        $scope.options.transferRequests = 0;

        console.log($scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace]);
        
        var batchCopyRequests = function(ws_objects) {
            var ws_requests = [];
        
            for (var i = 0; i < ws_objects.length; i++) {            
                if ($scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[ws_objects[i]]["object_type"].indexOf("KBaseSearch.Genome") > -1) {
                    ws_requests.push($scope.copyGenome(ws_objects[i]).then(function () {;}));
                    if (!types.hasOwnProperty('genome')) {
                        types['genome'] = true;
                    }
                }                    
                else if ($scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[ws_objects[i]]["object_type"].indexOf("KBaseSearch.Feature") > -1) {                
                    ws_requests.push($scope.copyFeature(ws_objects[i]).then(function () {;}));
                    if (!types.hasOwnProperty('feature')) {
                        types['feature'] = true;
                    }
                }
                else if ($scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[ws_objects[i]]["object_type"].indexOf("KBaseCommunities.Metagenome") > -1) {
                    ws_requests.push($scope.copyMetagenome(ws_objects[i]).then(function () {;}));
                    if (!types.hasOwnProperty('metagenome')) {
                        types['metagenome'] = true;
                    }
                }
                else {
                    if ($scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[ws_objects[i]]["object_type"].indexOf("KBaseGwas") > -1) {
                        if (!types.hasOwnProperty('gwas')) {
                            types['gwas'] = true;
                        }                    
                    }
            
                    //generic solution for types
                    if ($scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[ws_objects[i]].hasOwnProperty("object_name") === true) {
                        $scope.copyTypedObject($scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[ws_objects[i]]["object_name"], 
                                               $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[ws_objects[i]]["object_id"], 
                                               $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[ws_objects[i]]["workspace_name"], 
                                               $scope.options.userState.selectedWorkspace);                    
                    }
                    else if ($scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[ws_objects[i]].hasOwnProperty("object_id") === true) {
                        console.log($scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[ws_objects[i]]);

                        $scope.workspace_service.get_object_info([{"name": $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[ws_objects[i]]["object_id"], "workspace": $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[ws_objects[i]]["workspace_name"]}])
                            .fail(function (xhr, status, error) {
                                console.log(xhr);
                                console.log(status);
                                console.log(error);
                            })
                            .done(function (info, status, xhr) {
                                $scope.copyTypedObject(info[0][1], 
                                                       $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[ws_objects[i]]["object_id"], 
                                                       $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[ws_objects[i]]["workspace_name"], 
                                                       $scope.options.userState.selectedWorkspace);
                            });
                    }
                    else {
                        // create  error popover
                        console.log("no object reference found");
                        return;
                    }
                } // end type if else
            } // end for loop
                    
            $q.all(ws_requests).then(function (result) {
                    $scope.workspace_service.get_workspace_info({"workspace": $scope.options.userState.selectedWorkspace}).then(
                        function (info) {
                            for (var i = $scope.options.userState.workspaces.length - 1; i >= 0; i--) {
                                if ($scope.options.userState.workspaces[i][1] === $scope.options.userState.selectedWorkspace) {
                                     $scope.$apply(function () {
                                         $scope.options.userState.workspaces[i][4] = info[4];
                                     });
                                     
                                     break;
                                }
                            }
                            
                            console.log([$scope.options.userState.objectsTransferred, $scope.options.transferSize]);
                        },
                        function (error) {
                            console.log(error);
                        });

                    return result;
                }, 
                function (error) {
                    return error;
                });
        }; // end function

        for (var n in $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data) {
            if ($scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data.hasOwnProperty(n)) {
                loop_requests.push(n);
            }
            
            if (loop_requests.length === max_simultaneous) {
                batchCopyRequests(loop_requests);
                loop_requests = [];                
            }
        }
        
        if (loop_requests.length > 0) {
            batchCopyRequests(loop_requests);
            loop_requests = [];
        }        
        
        for (var t in types) {
            if (types.hasOwnProperty(t)) {
                $scope.options.userState.data_cart.types[t].all = false;
            }
        }        
    }; // end function

    
    $scope.copyData = function(type) {
        $scope.hideTransferCartCheckboxes();
        $scope.addAllObjects(type); 
        $scope.emptyTransfers();
        $scope.toggleAllDataCart();
    };

    $scope.hideTransferCartCheckboxes = function () {
        $("input .search-data-cart-checkbox").addClass("hidden");
    };

    $scope.showTransferCartCheckboxes = function () {
        $("input.search-data-cart-checkbox").removeClass("hidden");
    };

    $scope.completeTransfer = function() {
        if ($scope.options.transferSize === $scope.options.userState.objectsTransferred) {
            $scope.options.transferring = false;
            $scope.showTransferCartCheckboxes();
        }
    };

    $scope.removeSelection = function(n) {
        if (n.object_type.indexOf(".Genome") > -1) {
            delete $scope.options.userState.data_cart.types['genome'].markers[n]; 
            $scope.options.userState.data_cart.types['genome'].size -= 1; 
        }
        else if (n.object_type.indexOf(".Feature") > -1) {
            delete $scope.options.userState.data_cart.types['feature'].markers[n]; 
            $scope.options.userState.data_cart.types['feature'].size -= 1;         
        }
        else if (n.object_type.indexOf(".Metagenome") > -1) {
            delete $scope.options.userState.data_cart.types['metagenome'].markers[n]; 
            $scope.options.userState.data_cart.types['metagenome'].size -= 1; 
        }
        else if (n.object_type.indexOf("KBaseGwas") > -1) {
            delete $scope.options.userState.data_cart.types['gwas'].markers[n]; 
            $scope.options.userState.data_cart.types['gwas'].size -= 1; 
        }
        else {
            throw Error("Trying to delete unknown type!");        
        }
    
        delete $scope.options.userState.data_cart.data[n];
        delete $scope.options.userState.selections[n];
        $scope.options.userState.data_cart.size -= 1;        
    };
    
    
    $scope.emptyCart = function() {
        $scope.options.userState.selectAll = {};
        $scope.options.userState.selections = {};
        $scope.options.userState.data_cart = {
            all: false, 
            size: 0,
            data: {}, 
            types: {
                'genome': {all: false, size: 0, markers: {}},
                'feature': {all: false, size: 0, markers: {}},
                'metagenome': {all: false, size: 0, markers: {}},
                'gwas': {all: false, size: 0, markers: {}}
            }
        };
    };
    
    $scope.emptyTransfers = function() {        
        $scope.options.userState.objectsTransferred = 0;

        $scope.saveUserState();
    };
    
    $scope.transferError = function(object_name, object_ref, result) {
        if (!$scope.options.userState.transferErrors) {
            $scope.options.userState.tansferErrors = {};
        }
        $scope.options.userState.tansferErrors[object_name] = {error: result};        
    };

    $scope.toggleCheckbox = function(id, item) {
/*
        if ($scope.options.userState.selections === null) {
            $scope.options.userState.selections = {};
            $scope.options.userState.data_cart.size = 0;
            $scope.options.userState.data_cart = {all: false, data: {}};
        }
*/   
        if (!$scope.options.userState.selections.hasOwnProperty(id)) {
            $scope.selectCheckbox(id, item);
        }
        else {
            $scope.deselectCheckbox(id, item);
        }
    };

    $scope.selectCheckbox = function(id, item) {
        if (!$scope.options.userState.selections.hasOwnProperty(id)) {
            $scope.options.userState.selections[id] = item;
            $scope.options.userState.data_cart.size += 1;
            $scope.options.userState.data_cart.data[id] = item;

            if (item.object_type.indexOf(".Genome") > -1) {
                $scope.options.userState.data_cart.types['genome'].markers[id] = item; 
                $scope.options.userState.data_cart.types['genome'].size += 1; 
            }
            else if (item.object_type.indexOf(".Feature") > -1) {
                $scope.options.userState.data_cart.types['feature'].markers[id] = item; 
                $scope.options.userState.data_cart.types['feature'].size += 1;         
            }
            else if (item.object_type.indexOf(".Metagenome") > -1) {
                $scope.options.userState.data_cart.types['metagenome'].markers[id] = item; 
                $scope.options.userState.data_cart.types['metagenome'].size += 1; 
            }
            else if (item.object_type.indexOf("KBaseGwas") > -1) {
                $scope.options.userState.data_cart.types['gwas'].markers[id] = item; 
                $scope.options.userState.data_cart.types['gwas'].size += 1; 
            }
            else {
                throw Error("Trying to add unknown type!");        
            }

        }
    };
        
    $scope.deselectCheckbox = function(id, item) {
        if ($scope.options.userState.selections.hasOwnProperty(id)) {
            delete $scope.options.userState.selections[id];           
            delete $scope.options.userState.data_cart.data[id];           
            $scope.options.userState.data_cart.size -= 1;

            if (item.object_type.indexOf(".Genome") > -1) {
                delete $scope.options.userState.data_cart.types['genome'].markers[id]; 
                $scope.options.userState.data_cart.types['genome'].size -= 1; 
            }
            else if (item.object_type.indexOf(".Feature") > -1) {
                delete $scope.options.userState.data_cart.types['feature'].markers[id]; 
                $scope.options.userState.data_cart.types['feature'].size -= 1;         
            }
            else if (item.object_type.indexOf(".Metagenome") > -1) {
                delete $scope.options.userState.data_cart.types['metagenome'].markers[id]; 
                $scope.options.userState.data_cart.types['metagenome'].size -= 1; 
            }
            else if (item.object_type.indexOf("KBaseGwas") > -1) {
                delete $scope.options.userState.data_cart.types['gwas'].markers[id]; 
                $scope.options.userState.data_cart.types['gwas'].size -= 1; 
            }
            else {
                throw Error("Trying to delete unknown type!");        
            }
        }
    };


    $scope.toggleAll = function(items) {
        //console.log(items);
    
/*    
        if ($scope.options.userState.selections === null) {
            $scope.options.userState.selections = {};            
        }
*/
                
        if ($scope.options.userState.selectAll.hasOwnProperty($scope.options.selectedCategory)) {
            if ($scope.options.userState.selectAll[$scope.options.selectedCategory].hasOwnProperty($scope.options.searchOptions.perCategory[$scope.options.selectedCategory].page) && $scope.options.userState.selectAll[$scope.options.selectedCategory][$scope.options.searchOptions.perCategory[$scope.options.selectedCategory].page]) {
                $scope.options.userState.selectAll[$scope.options.selectedCategory][$scope.options.searchOptions.perCategory[$scope.options.selectedCategory].page] = false;

                for(var i = items.length - 1; i > -1; i--) {
                    $scope.deselectCheckbox(items[i].row_id,items[i]);
                }            

            }
            else {
                $scope.options.userState.selectAll[$scope.options.selectedCategory][$scope.options.searchOptions.perCategory[$scope.options.selectedCategory].page] = true;

                for(var i = items.length - 1; i > -1; i--) {
                    $scope.selectCheckbox(items[i].row_id,items[i]);
                }            
            }
        }
        else {
            $scope.options.userState.selectAll[$scope.options.selectedCategory] = {};
            $scope.options.userState.selectAll[$scope.options.selectedCategory][$scope.options.searchOptions.perCategory[$scope.options.selectedCategory].page] = true;

            for(var i = items.length - 1; i > -1; i--) {
                $scope.selectCheckbox(items[i].row_id,items[i]);
            }            
        }

    };


    $scope.toggleAllWorkspaceCart = function() {
        if (!$scope.options.userState.workspace_carts.hasOwnProperty($scope.options.userState.selectedWorkspace)) {
            $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace] = {all: true, size: 0, data: {}};
        }

        if ($scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].all) {
            for (var d in $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data) {
                if ($scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data.hasOwnProperty(d)) {
                    $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[d].cart_selected = true;
                }
            }        
        }
        else {
            for (var d in $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data) {
                if ($scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data.hasOwnProperty(d)) {
                    $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[d].cart_selected = false;
                }
            }                    
        }
    };


    $scope.toggleAllDataCart = function(type) {
        console.log($scope.options.userState.data_cart);
    
        if (!type) {
            if ($scope.options.userState.data_cart.all) {
                for (var d in $scope.options.userState.data_cart.data) {
                    if ($scope.options.userState.data_cart.data.hasOwnProperty(d)) {
                        $scope.options.userState.data_cart.data[d].cart_selected = true;
                    }
                }                    
                $scope.addSelectedToWorkspaceCart();
            }
            else {
                for (var d in $scope.options.userState.data_cart.data) {
                    if ($scope.options.userState.data_cart.data.hasOwnProperty(d)) {
                        $scope.options.userState.data_cart.data[d].cart_selected = false;
                    }
                }                    
                $scope.emptyWorkspaceCart();
            }    
        }
        else if ($scope.options.userState.data_cart.types.hasOwnProperty(type)) {
            if ($scope.options.userState.data_cart.types[type].all) {
                for (var d in $scope.options.userState.data_cart.types[type].markers) {
                    if ($scope.options.userState.data_cart.types[type].markers.hasOwnProperty(d)) {
                        $scope.options.userState.data_cart.data[d].cart_selected = false;
                    }
                }                    
                $scope.emptyWorkspaceCart();
            }
            else {
                for (var d in $scope.options.userState.data_cart.types[type].markers) {
                    if ($scope.options.userState.data_cart.types[type].markers.hasOwnProperty(d)) {
                        $scope.options.userState.data_cart.data[d].cart_selected = true;
                    }
                }                    
                $scope.addSelectedToWorkspaceCart();
            }    
        }
        else {
            throw Error("Unrecognized type : " + type);
        }
    };


    $scope.toggleInCart = function(id) {        
        if (!$scope.options.userState.data_cart.data.hasOwnProperty(id)) {
            $scope.options.userState.data_cart.data[id].cart_selected = true;            
            $scope.addToWorkspaceCart(id);
        }
        else if(!$scope.options.userState.data_cart.data[id].cart_selected) {
            $scope.options.userState.data_cart.data[id].cart_selected = true;
            $scope.addToWorkspaceCart(id);
        }
        else {
            $scope.options.userState.data_cart.data[id].cart_selected = false;
            $scope.removeFromWorkspaceCart(id);
        }            
    };


    $scope.addSelectedToWorkspaceCart = function() {
        if (!$scope.options.userState.hasOwnProperty("workspace_carts")) {
            $scope.options.userState.workspace_carts = {};
        }
    
        if (!$scope.options.userState.workspace_carts.hasOwnProperty($scope.options.userState.selectedWorkspace)) {
            $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace] = {all: false, size: 0, data: {}};
        }
    
        for (var d in $scope.options.userState.data_cart.data) {
            if ($scope.options.userState.data_cart.data.hasOwnProperty(d) && $scope.options.userState.data_cart.data[d].cart_selected && !$scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data.hasOwnProperty(d)) {
                $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[d] = {};
                angular.copy($scope.options.userState.data_cart.data[d], $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[d]);
                $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[d].cart_selected = false;
                $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].size += 1;                
            }
        }
        
        console.log($scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace]);
        console.log($scope.options.userState.data_cart);
    };


    $scope.removeSelectedFromWorkspaceCart = function() {
        if (!$scope.options.userState.hasOwnProperty("workspace_carts")) {
            $scope.options.userState.workspace_carts = {};
            return;
        }
    
        if (!$scope.options.userState.workspace_carts.hasOwnProperty($scope.options.userState.selectedWorkspace)) {
            $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace] = {all: false, size: 0, data: {}};
            return;
        }
    
        for (var d in $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data) {
            if ($scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data.hasOwnProperty(d) && $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[d].cart_selected) {
                $scope.removeFromWorkspaceCart(d);
            }
        }

        console.log($scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace]);
    };


    $scope.addToWorkspaceCart = function(id) {
        console.log(id);
        console.log($scope.options.userState.data_cart.data.hasOwnProperty(id) && $scope.options.userState.data_cart.data[id].cart_selected && !$scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data.hasOwnProperty(id));
        
        
        if ($scope.options.userState.data_cart.data.hasOwnProperty(id) && $scope.options.userState.data_cart.data[id].cart_selected) {
            $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[id] = {};
            angular.copy($scope.options.userState.data_cart.data[id], $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[id]);
            $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[id].cart_selected = true;
            $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].size += 1;                
        }
    };

    $scope.removeFromWorkspaceCart = function(id) {
        console.log(id);
        console.log($scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[id]);
    
        if ($scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data.hasOwnProperty(id)) {
            delete $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data[id];
            $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].size -= 1;
        }
    };


    $scope.emptyWorkspaceCart = function() {
        $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].data = {};
        $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].size = 0;
        $scope.options.userState.workspace_carts[$scope.options.userState.selectedWorkspace].all = false;
    };


    $scope.getSearchbarTooltipText = function () {
        if ($scope.options.selectedCategory) {
            return "Type here to perform a search on " + $scope.options.searchCategories[$scope.options.selectedCategory].label + ".";
        }
        else {
            return "Type here to perform a search on all data categories.";
        }    
    };
    
    
    $scope.doesObjectExistInWorkspace = function(workspace_name, object_id) {
        $scope.workspace_service = searchKBaseClientsService.getWorkspaceClient($scope.options.userState.token);
        
        console.log([workspace_name, object_id]);
        return $scope.workspace_service.get_object_info([{"workspace": workspace_name, "name": object_id}]).then(
            function (result) {
                console.log(result);            
            },
            function (error) {
                console.log(error);
            });    
    };

});


/*jslint browser white */
define(['kb.app', 'kb.session', 'q', 'jquery', 'knockout'], function (App, Session, Q, $, ko) {
//define(['kb.app', 'kb.session', 'q'], function (App, Session, Q) {
    'use strict';

    function SearchService(serviceURL) {
        // Populate the categories from the search service.
        function getCategories() {
            return Q.Promise(function (resolve, reject) {
                $.ajax({
                    url: serviceURL + 'categories',
                    type: 'GET',
                    success: function (data) {
                        resolve(data);
                    },
                    error: function (jqxhr, status, err) {
                        reject({
                            jqhxr: jqxhr,
                            status: status,
                            error: err
                        });
                    }
                });
            });
        }
        
        function getFacetSearch(category) {
            return Q.Promise(function (resolve, reject) {
                // Encode facets.
                // facet
                
                
                // Other query options
                var queryOptions = {
                    page: 1,
                    itemsPerPage: 0,
                    category: category
                }
                $.ajax({
                    url: serviceURL + 'getResults',
                    type: 'GET',
                    success: function (data) {
                        resolve(data);
                    },
                    error: function (jqxhr, status, err) {
                        reject({
                            jqhxr: jqxhr,
                            status: status,
                            error: err
                        });
                    }
                });
            });
        }

        return {
            getCategories: getCategories,
            getFacets: getFacetSearch
        };
    }

    function Search() {
        var categories = null;
        function getCategories() {
            return categories;
        }

        var searchService = SearchService(App.getConfig('search_url'));
        function setupSearch(params) {
            return Q.Promise(function (resolve, reject) {
                searchService.getCategories()
                    .then(function (data) {
                        categories = data;
                        resolve();
                    })
                    .done();
            });
        }

        return {
            setup: setupSearch,
            getCategories: getCategories
        };
    }

    var search = Search();

    function categoryComponent() {
        function ViewModel(params) {
            var selectedCategoryId =  params.selectedCategoryId;
            
            function removeCategory() {
                selectedCategoryId(null);
            }
            
            return {
                selectedCategoryId: selectedCategoryId,
                removeCategory: removeCategory
            };
        }
        
        var div = App.tag('div');
        var template = div({}, [
            div({dataBind: {text: 'selectedCategoryId', click: 'removeCategory'}, style: {cursor: 'pointer'}})
        ]);
        
        return {
            viewModel: {createViewModel: ViewModel},
            template: template
        };
    }
    
    function categoryFacetsComponent() {
        function ViewModel(params) {
            // var currentCategory =  params.currentCategory;
            //var facets = ko.observableArray(params.currentCategory);
            // var facets = params.facets;
            
            var facets = ko.computed
            
            return {
                facets: facets
            };
        }
        
        var div = App.tag('div');
        var template = div({}, [
             div({dataBind: {foreach: 'facets'}}, [
                div({dataBind: {text: '$data', click: '$parent.selectFacet'}, style: {cursor: 'pointer'}}) 
            ])
        ]);
        
        return {
            viewModel: {createViewModel: ViewModel},
            template: template
        };
    }
    
    function resultsComponent() {
        // Mostly just switches between differen results views
       
        var div = App.tag('div');
        var template =  div({}, [
            div({dataBind: {component: {
                name: '"search-results-categories"',
                params: {selectedCategoryId: 'selectedCategoryId',
                         categories: 'categories'}
            }}})
        ]);
        
        function ViewModel(params) {
            var resultsComponent = ko.observable(params.resultsComponent);
            
            return {
                categories: params.categories,
                resultsComponent: resultsComponent,
                selectedCategoryId: params.selectedCategoryId
            };
        }
        
        return {
            template: template,
            viewModel: {createViewModel: ViewModel}
        };
    } 
       
    function searchNarrativeComponent() {
        // This will actually render results based on what type of results 
        // are pending.
        // TODO: switch view based on type of results
        // TODO: use knockout
        // At the moment we assume results are just categories.
       
        var div = App.tag('div'),
            p = App.tag('p');
        var template =  div({}, [
            div({dataBind: {if: 'isSignedIn'}}, [
                p('You are not signed in. When signed in you will be able to save data into any writable Narrative.')
            ]),
            div({dataBind: {ifnot: 'isSignedIn'}}, [
                p('Select a narrative to copy to ')
                
            ])
        ]);
        
        function ViewModel(params) {
            return {
                isSignedIn: params.isSignedIn
            };
        }
        
        return {
            template: template,
            viewModel: {createViewModel: ViewModel}
        };
    }
    
    function resultsCategoriesComponent() {
        // This will actually render results based on what type of results 
        // are pending.
        // TODO: switch view based on type of results
        // TODO: use knockout
        // At the moment we assume results are just categories.
       
        var div = App.tag('div'),
            header = App.tag('h2');
        var template =  div({}, [
            header({}, 'Categories'),
            div({style: 'border: 1px red solid'}, [
                div({dataBind: {foreach: 'categories'}}, [
                   div({dataBind: {text: '$data', click: '$parent.selectCategory'}, style: {cursor: 'pointer'}}) 
                ])
            ])
        ]);

        function ViewModel(params) {
            var categoryInfo = params.categories;
            var categoryKeys = Object.keys(categoryInfo.categories);
            var categories = ko.observableArray(categoryKeys);
            var selectedCategoryId = params.selectedCategoryId;

            function selectCategory(value) {
                selectedCategoryId(value);
                console.log
                var fac = categoryInfo.categories[value];
                console.log(fac);
            }
            function selectFacet(value) {
                alert("selecte facet " + value);
                // addSelectedFacet(value);
            }
            return {
                categories: categories,
                selectCategory: selectCategory,
                selectFacet: selectFacet
            };
        }

        return {
            template: template,
            viewModel: {createViewModel: ViewModel}
        };
    }

    /**
     * Our own packaging of knockout components.
     * 
     * @returns {datasearch_L1.searchBarComponent.datasearchAnonym$37}
     */
    function searchBarComponent() {
        var div = App.tag('div'),
            form = App.tag('form'),
            input = App.tag('input'),
            span = App.tag('span'),
            button = App.tag('button');
        var template = div({class: 'row search-bar'}, [
            form({class: 'input-group', dataBind: {submit: 'submitSearch'}}, [
                input({'data-toggle': 'tooltip', 'data-placement': 'bottom',
                        tooltip: 'search here', 'tooltip-placement': 'bottom',
                        class: 'form-control', autofocus: true, required: true,
                        placeholder: 'Search KBase Data', autocomplete: 'off',
                        type: 'search', dataBind: {value: 'searchText'}}),
                span({class: 'input-group-btn'}, [
                    button({type: 'submiit', class: 'btn', 
                            style: {'background-color': '#ebebeb', 
                                    'border-color': '$adadad', 'border-left': 'none'}}, [
                        span({class: 'glyphicon glyphicon-search', style: {'line-height': '0.9'}})
                    ])
                ])
            ])
        ]);
        
        function ViewModel() {
            // Fields
            var searchText= ko.observable();

            // Actions
            function submitSearch(form) {
                alert('Submtting search for ' + this.searchText());
            }
            
            return {
                searchText: searchText,
                submitSearch: submitSearch
            };
        };
        
        return {
            viewModel: {createViewModel: ViewModel},
            template: template
        };
    }

    function renderBSPanel(title, content) {
        var div = App.tag('div'),
            span = App.tag('span');

        return div({class: 'panel panel-default'}, [
            div({class: 'panel-heading'}, [
                span({class: 'panel-title'}, title)
            ]),
            div({class: 'panel-body'}, [
                content
            ])
        ]);
    }
    
    function searchAppComponent() {
        var div = App.tag('div');
        
        function ViewModel() {
            var categories = search.getCategories();
            var selectedCategoryId = ko.observable(null);
            var selectedCategory = ko.computed(function (thing) {
                if (selectedCategoryId()) {
                    return categories.categories[selectedCategoryId()];
                } else {
                    return null;
                }
            });
            var selectedFacets = ko.observableArray();

            var isLoggedIn = ko.observable(Session.isLoggedIn());
             
            return {
                 categories: categories, 
                 selectedCategoryId: selectedCategoryId,
                 selectedCategory: selectedCategory,
                 selectedFacets: selectedFacets,
                 isLoggedIn: isLoggedIn
            };
        }

        var template = div({class: 'row'}, [
            div({class: 'col-md-3'}, [
                renderBSPanel('Select Narrative', div({dataBind: {component: {name: '"search-narrative"', params: {isLoggedIn: 'isLoggedIn'}}}})),
                renderBSPanel('Shopping Cart', 'your shopping cart'),
                renderBSPanel('Category', div({dataBind: {component: {name: '"search-category"', params: {selectedCategoryId: 'selectedCategoryId'}}}})),
                renderBSPanel('Refine', div({dataBind: {component: {name: '"search-category-facets"', params: {selectedCategory: 'selectedCategory', selectedFacets: 'selectedFacets'}}}}))
            ]),
            div({class: 'col-md-9'}, [
                renderBSPanel('Search', div({dataBind: {component: '"search-bar"'}})),
                renderBSPanel('Results', div({dataBind: {component: {name: '"search-results"', 
                                                                     params: {selectedCategoryId: 'selectedCategoryId',
                                                                              categories: 'categories',
                                                                              resultsComponent: '"search-results-categories"'}}}}))
            ])
        ]);
        
        return {
            viewModel: {createViewModel: ViewModel},
            template: template
        };
    }

    function setup() {
        // var ngInclude = App.tag('ng-include');
        App.addRoute({
            path: ['search'],
            queryParams: {
                q: {},
                category: {},
                page: {},
                itemsPerPage: {},
                sort: {},
                facets: {}
            },
            promise: function (params) {
                return Q.promise(function (resolve) {
                    //var content = [
                    //    ngInclude({src: '\'/functional-site/views/search/search.html\''})
                    //];
                    var div = App.tag('div');
                    search.setup(params)
                        .then(function () {
                            resolve({
                                content: div({dataBind: {component: '"search-app"'}}),
                                title: 'Data Search'
                            });
                        })
                        .done();
                });
            },
            start: function (node) {
                ko.components.register('search-narrative', searchNarrativeComponent());
                ko.components.register('search-bar', searchBarComponent());
                ko.components.register('search-results', resultsComponent());
                ko.components.register('search-results-categories', resultsCategoriesComponent());
                ko.components.register('search-category', categoryComponent());
                ko.components.register('search-category-facets', categoryFacetsComponent());
                ko.components.register('search-app', searchAppComponent());
                ko.applyBindings();
                //console.log(node);
                //Search.start(node);
                //Search.search(node, 'search', {q: '*'} );
            }
        });
    }
    function teardown() {
        // TODO: remove routes
        return false;
    }
    function start() {
        //
        return false;
    }
    function stop() {
        //
        return false;
    }
    return {
        setup: setup,
        teardown: teardown,
        start: start,
        stop: stop
    };
});

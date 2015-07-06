/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define(['kb.html', 'kb.session', 'kb.app', 'q', 'jquery', 'knockout'],
    function (html, Session, App, Q, $, ko) {
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
                var selectedCategoryId = params.selectedCategoryId;

                function removeCategory() {
                    selectedCategoryId(null);
                }

                return {
                    selectedCategoryId: selectedCategoryId,
                    removeCategory: removeCategory
                };
            }

            var div = html.tag('div');
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

            var div = html.tag('div');
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
        
         function selectNarrativeComponent() {
            // This will actually render results based on what type of results 
            // are pending.
            // TODO: switch view based on type of results
            // TODO: use knockout
            // At the moment we assume results are just categories.

            var div = html.tag('div'),
                p = html.tag('p');
            var template = div({}, [
                div({dataBind: {if : 'isSignedIn'}}, [
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


        /**
         * Shows the current results based on the current search mode. There are
         * essentially 2 main modes:
         * - show all search categories with counts
         * - show current search results for the seected category
         * The task of this component is ensure the relevant search results
         * component.
         * 
         * @returns {}
         */
        function resultsComponent() {
            // Mostly just switches between differen results views

            function ViewModel(params) {
                var resultsComponentName = params.resultsComponentName;

                return {
                    categories: params.categories,
                    resultsComponentName: resultsComponentName,
                    selectedCategoryId: params.selectedCategoryId
                };
            }
            
            var div = html.tag('div');
            var template = div({}, [
                div({dataBind: {component: {
                            name: 'resultsComponentName',
                            params: {selectedCategoryId: 'selectedCategoryId',
                                categories: 'categories'}
                        }}})
            ]);

            return {
                template: template,
                viewModel: {createViewModel: ViewModel}
            };
        }
        
        function resultsCategoryDefaultComponent() {
            function ViewModel(params) {
                return {
                    
                }
            }
            
            var div = html.tag('div');
            var template = div({}, [
                'This is the defulat search component...'
            ]);
            
            return {
                template: template,
                viewModel: {createViewModel: ViewModel}
            }
        }

       
        /**
         * A component for showing search categories, with the ability to select
         * a category and set the currently selected category.
         * 
         * @returns {}
         */
        function resultsCategoriesComponent() {
            // This will actually render results based on what type of results 
            // are pending.
            // TODO: switch view based on type of results
            // TODO: use knockout
            // At the moment we assume results are just categories.

            var div = html.tag('div'),
                header = html.tag('h2');
            var template = div({}, [
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
            var div = html.tag('div'),
                form = html.tag('form'),
                input = html.tag('input'),
                span = html.tag('span'),
                button = html.tag('button');
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
                var searchText = ko.observable();

                // Actions
                function submitSearch(form) {
                    alert('Submtting search for ' + this.searchText());
                }

                return {
                    searchText: searchText,
                    submitSearch: submitSearch
                };
            }
            ;

            return {
                viewModel: {createViewModel: ViewModel},
                template: template
            };
        }

        function searchAppComponent() {
            var div = html.tag('div');

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
                var resultsComponentName = ko.computed(function (thing) {
                    if (selectedCategory() === null) {
                        return 'search-results-categories';
                    } else {
                        return 'search-results-category-default';
                    }
                });
                var selectedFacets = ko.observableArray();

                var isLoggedIn = ko.observable(Session.isLoggedIn());

                return {
                    categories: categories,
                    selectedCategoryId: selectedCategoryId,
                    selectedCategory: selectedCategory,
                    resultsComponentName: resultsComponentName,
                    selectedFacets: selectedFacets,
                    isLoggedIn: isLoggedIn
                };
            }

            var template = div({class: 'row'}, [
                div({class: 'col-md-3'}, [
                    html.panel('Select Narrative', div({dataBind: {component: {name: '"select-narrative"', params: {isLoggedIn: 'isLoggedIn'}}}})),
                    html.panel('Shopping Cart', 'your shopping cart'),
                    html.panel('Category', div({dataBind: {component: {name: '"search-category"', params: {selectedCategoryId: 'selectedCategoryId'}}}})),
                    html.panel('Refine', div({dataBind: {component: {name: '"search-category-facets"', params: {selectedCategory: 'selectedCategory', selectedFacets: 'selectedFacets'}}}}))
                ]),
                div({class: 'col-md-9'}, [
                    html.panel('Search', div({dataBind: {component: '"search-bar"'}})),
                    html.panel('Results', div({dataBind: {component: {name: '"search-results"',
                                params: {selectedCategoryId: 'selectedCategoryId',
                                    categories: 'categories',
                                    resultsComponentName: 'resultsComponentName'}}}}))
                ])
            ]);

            return {
                viewModel: {createViewModel: ViewModel},
                template: template
            };
        }
        function unapplyBindings(node, remove) {
            // Unbind DOM events 
            $(node).find('*').each(function () {
                $(this).unbind();
            });
            
            // Remove KO subscriptions.
            if (remove) {
                ko.removeNode(node);                
            } else {
                ko.cleanNode(node);
            }
        }
        ko.components.register('select-narrative', selectNarrativeComponent());
        ko.components.register('search-bar', searchBarComponent());
        ko.components.register('search-results', resultsComponent());
        ko.components.register('search-results-categories', resultsCategoriesComponent());
        ko.components.register('search-results-category-default', resultsCategoryDefaultComponent());
        ko.components.register('search-category', categoryComponent());
        ko.components.register('search-category-facets', categoryFacetsComponent());
        ko.components.register('search-app', searchAppComponent());

        function setup(app) {
            app.addRoute({
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
                        var div = html.tag('div');
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
                isBound: false,
                start: function (node, self) {
                    ///if (!self.isBound) {
                        ko.applyBindings(null, node);
                    //    self.isBound = true;
                    //}
                    //console.log(node);
                    //Search.start(node);
                    //Search.search(node, 'search', {q: '*'} ); 
                },
                stop: function (node, state) {
                    unapplyBindings(node, true);
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

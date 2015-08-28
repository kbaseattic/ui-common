/*global
 define,console
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'kb.html',
    'kb.session',
    'kb.runtime',
    'bluebird',
    'jquery',
    'knockout'],
    function (html, Session, R, Promise, $, ko) {
        'use strict';

        // Panel wide communication bus...

        var messageBus = new ko.subscribable();

        function SearchService(serviceURL) {
            // Populate the categories from the search service.
            function getCategories() {
                return new Promise.resolve($.get(serviceURL + 'categories'));
            }

            function getCategoryCount(query, category) {
                var queryOptions = {
                    page: 1,
                    itemsPerPage: 0,
                    category: category,
                    q: query
                };
                // we wrap the ajax promise because we need to trap the category
                return new Promise(function (resolve, reject) {
                    Promoise.resolve($.ajax({
                        method: 'GET',
                        url: serviceURL + 'getResults',
                        data: queryOptions,
                        responseType: 'json',
                        crossDomain: true
                    }))
                        .then(function (data) {
                            // we need to add the category on to the result object
                            // to be able to treat this independent of the query.
                            // It would be nice if the search service did this
                            // for us...
                            
                            console.log('about to notify...');
                            console.log(category);
                            console.log(data);
                            messageBus.notifySubscribers({
                                name: category,
                                count: data.totalResults
                            }, 'categoryCount');
                            
                            data.category = category;
                            resolve(data);
                        })
                        .catch(function (err) {
                            reject(err);
                        })
                        .done();

                });
            }

            function getFacetSearch(category) {
                return new Promise(function (resolve, reject) {
                    // Encode facets.
                    // facet


                    // Other query options
                    var queryOptions = {
                        page: 1,
                        itemsPerPage: 0,
                        category: category
                    };
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
                getCategoryCount: getCategoryCount,
                getFacets: getFacetSearch
            };
        }

        function Search() {
            var categoryResults = null;
            var categoryList = [];
            var categoryMap = {};

            function getCategories() {
                return categoryList;
            }

            var searchService = SearchService(R.getConfig('services.search.url'));
            function setupSearch(params) {
                return new Promise(function (resolve, reject) {
                    resolve();
                    //searchService.getCategories()
                    //    .then(function (data) {
                    //        categories = data;
                    //        resolve();
                    //    })
                    //    .done();
                });
            }


            function fetchCategories(params) {
                return new Promise(function (resolve, reject) {
                    searchService.getCategories()
                        .then(function (data) {
                            categoryList = Object.keys(data.categories).map(function (key) {
                                // var cat = categoryResults.categories[key];
                                /* TODO: add facets here too -- so that this becomes a complete map of all categories, facets, and their counts */
                                var catObj = {
                                    name: key,
                                    totalCount: null,
                                    currentCount: null
                                };
                                return catObj;
                            });
                            resolve(categoryList);
                        })
                        .catch(function (err) {
                            reject(err);
                        })
                        .done();
                });
            }

            function fetchCategoriesCounts(categories) {
                return new Promise(function (resolve, reject) {
                    // Create an array of promises for fetching the counts
                    // per category.
                    var counts = categories.map(function (category) {
                            return searchService.getCategoryCount('*', category);
                        });

                    Promise.all(counts)
                        .then(function (results) {
                            resolve();
                        })
                        .catch(function (err) {
                            console.log('ERROR1');
                            console.log(err);
                            reject(err);
                        })
                        .done();

                });
            }
            
            function xfetchCategoriesCounts(categories) {
                return new Promise(function (resolve, reject) {
                    // Create an array of promises for fetching the counts
                    // per category.
                    var categoryMap = {},
                        counts = categories.map(function (category) {
                            categoryMap[category] = category;
                            return searchService.getCategoryCount('*', category);
                        });
                                                    console.log('STARTING...');

                    Promise.all(counts)
                        .then(function (results) {
                            console.log('STARTING...');
                            results.forEach(function (result) {
                                var category = result.category,
                                    categoryObj = categoryMap[category];
                                if (categoryObj.totalCount === null) {
                                    categoryObj.totalCount = result.totalResults;
                                }
                                categoryObj.currentCount = result.totalResults;

                                // now just messages...
                                console.log('here');
                                console.log(category);
                                messageBus.notifySubscribers({
                                    name: category,
                                    count: result.totalResults
                                }, 'categoryCount');
                            });
                            resolve(categoryList);
                        })
                        .catch(function (err) {
                            console.log('ERROR1');
                            console.log(err);
                            reject(err);
                        })
                        .done();

                });
            }

            function fetchCategoryCounts(category) {
                return new Promise(function (resolve) {
                    searchService.getCategoryCount('*', category)
                        .then(function (results) {
                            resolve(results);
                        })
                        .catch(function (err) {
                            console.log('ERROR');
                            console.log(err);
                        })
                        .done();
                });
            }


            return {
                setup: setupSearch,
                getCategories: getCategories,
                fetchCategories: fetchCategories,
                fetchCategoriesCounts: fetchCategoriesCounts
            };
        }

        var search = Search();

        function categoryComponent() {
            function ViewModel(params) {
                var selectedCategoryId = params.selectedCategoryId;
                var selectedCategory = params.selectedCategory;

                function removeCategory() {
                    selectedCategoryId(null);
                }

                return {
                    selectedCategoryId: selectedCategoryId,
                    selectedCategory: selectedCategory,
                    removeCategory: removeCategory
                };
            }

            var div = html.tag('div'),
                span = html.tag('span');
            var template = div({}, [
                div(['Category Id: ', span({dataBind: {text: 'selectedCategoryId'}})]),
                div({dataBind: {with : 'selectedCategory'}}, [
                    div({dataBind: {text: 'name', click: '$parent.removeCategory'}, style: {cursor: 'pointer'}})
                ])
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

                // var facets = ko.computed
                var facets = null;

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
                'this will be the search results area...'
            ]);


            /*
             * 
             * this is an attempt to swap components in the search area
             var template = div({}, [
             div({dataBind: {component: {
             name: 'resultsComponentName',
             params: {selectedCategoryId: 'selectedCategoryId',
             categories: 'categories'}
             }}})
             ]);
             */
            return {
                template: template,
                viewModel: {createViewModel: ViewModel}
            };
        }

        function resultsCategoryDefaultComponent() {
            function ViewModel(params) {
                return {
                };
            }

            var div = html.tag('div');
            var template = div({}, [
                'This is the defulat search component...'
            ]);

            return {
                template: template,
                viewModel: {createViewModel: ViewModel}
            };
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
                header = html.tag('h2'),
                table = html.tag('table'),
                tr = html.tag('tr'),
                td = html.tag('td'),
                th = html.tag('th'),
                thead = html.tag('thead'),
                tbody = html.tag('tbody');
            
            var template = div({}, [
                header({}, 'Categories'),
                table({class: 'table table-striped'}, [
                    thead([
                        tr([
                            th('Category'),
                            th('Total'),
                            th('Current')
                        ])
                    ]),
                    tbody({dataBind: {foreach: 'categories'}}, [
                        tr({dataBind: {click: '$parent.selectCategory', 
                                       style: '{backgroundColor: name() === $parent.selectedCategoryId() ? "silver" : "transparent"}'}, 
                            style: {cursor: 'pointer'}}, [
                            td({dataBind: {text: 'name'}}),
                            td([
                                div({dataBind: {visible: 'totalCount() === null'}}, html.loading()),
                                div({dataBind: {text: 'totalCount'}})
                            ]),
                            td([
                                div({dataBind: {visible: 'currentCount() === null'}}, html.loading()),
                                div({dataBind: {text: 'currentCount'}})
                            ])
                        ])
                    ])
                ])
            ]);

            function ViewModel(params) {

                /*
                 * Okay, first thing we do is turn the categories into an
                 * observable structure, for binding to the view.
                 * 
                 * Our categories are a list of categories, and the total and
                 * current search count for each one. 
                 * 
                 * We also have a non-observable map of these, for more efficient
                 * lookup of categories which might be updated.
                 * 
                 * Note: perhaps we can just skip that for now...
                 * 
                 * Hmm, maybe the categories should already be observable when
                 * they are provided in the params?
                 * 
                 * Then we create a function for being able to update this
                 * from outside, when search conditions change...
                 * 
                 */

                var categories = params.categories;



                var selectedCategoryId = params.selectedCategoryId;

                function selectCategory(value) {
                    if (selectedCategoryId() === value.name()) {
                        selectedCategoryId(null);
                    } else {
                        selectedCategoryId(value.name());
                    }
                    //var fac = categoryInfo.categories[value];
                    //console.log(fac);
               }
                function selectFacet(value) {
                    alert("selecte facet " + value);
                    // addSelectedFacet(value);
                }
                return {
                    categories: categories,
                    selectCategory: selectCategory,
                    selectFacet: selectFacet,
                    selectedCategoryId: selectedCategoryId
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

            return {
                viewModel: {createViewModel: ViewModel},
                template: template
            };
        }

        function searchAppComponent() {
            var div = html.tag('div');

            function category(name, total, current) {
                return {
                    name: ko.observable(name),
                    totalCount: ko.observable(total),
                    currentCount: ko.observable(current)
                };
            }

            function ViewModel() {
                /*
                 * Categories are fetched initially, and updated as the search evolves.
                 * They are fixed, but the counts associated with them change.
                 * We turn the category map into an array (for sorting).
                 */
                // NB the categories are already fetched for the first time by this
                // point.
                var tempCat = search.getCategories();
                var categoryMap = {};
                var categories = ko.observableArray(tempCat.map(function (category) {
                    var observedObject = {};
                    Object.keys(category).forEach(function (key) {
                        observedObject[key] = ko.observable(category[key]);
                    });
                    categoryMap[category.name] = observedObject;
                    return observedObject;
                }));

                // Spin off something to fetch and populate categories?

                /*
                 search.fetchCategories()
                 .then(function (cats) {
                 cats.forEach(function (cat) {
                 var observedObject = {};
                 Object.keys(cat).forEach(function (key) {
                 observedObject[key] = ko.observable(cat[key]);
                 });
                 categoryMap[cat.name] = observedObject;
                 categories.push(observedObject);
                 });
                 })
                 .catch(function (err) {
                 console.log('ERROR');
                 console.log(err);
                 })
                 .done();
                 */

                /* Now do it with a subscription */
                messageBus.subscribe(function (cats) {
                    cats.forEach(function (cat) {
                        var c = category(cat.name, null, null);
                        categoryMap[cat.name] = c;
                        categories.push(c);
                    });
                }, null, 'categoriesAdded');
                
                messageBus.subscribe(function (category) {
                    var c = categoryMap[category.name];
                    if (c.totalCount() === null) {
                        c.totalCount(category.count);
                    }
                    c.currentCount(category.count);
                    
                }, null, 'categoryCount');

                /*
                 * A category may be selected, in which case we provide a computed
                 * observable which contains the currently selected category.
                 */
                var selectedCategoryId = ko.observable(null);
                var selectedCategory = ko.computed(function (thing) {
                    if (selectedCategoryId()) {
                        return categoryMap[selectedCategoryId()];
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
                    html.panel('Category', div({dataBind: {component: {name: '"search-category"', params: {selectedCategoryId: 'selectedCategoryId', selectedCategory: 'selectedCategory'}}}})),
                    html.panel('Refine', div({dataBind: {component: {name: '"search-category-facets"', params: {selectedCategory: 'selectedCategory', selectedFacets: 'selectedFacets'}}}}))
                ]),
                div({class: 'col-md-9'}, [
                    html.panel('Search', div({dataBind: {component: '"search-bar"'}})),
                    html.panel('Categories', div({dataBind: {component: {name: '"search-results-categories"',
                                params: {selectedCategoryId: 'selectedCategoryId',
                                    categories: 'categories'}}}})),
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
                    return new Promise(function (resolve) {
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
                    // Kick off knockout
                    ko.applyBindings(null, node);
                    
                    // Get initial data -- categories and their counts with the current search
                    search.fetchCategories()
                        .then(function (categories) {
                            messageBus.notifySubscribers(categories, 'categoriesAdded');
                            search.fetchCategoriesCounts(categories.map(function (cat) {return cat.name;}))
                                .then(function (results) {
                                })
                                .catch(function (err) {
                                })
                                .done();
                        })
                        .catch(function (err) {
                            console.log('ERROR');
                            console.log(err);
                        })
                        .done();

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

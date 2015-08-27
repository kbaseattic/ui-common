define([
    'jquery',
    'bluebird',
    'kb_widget_dashboard_base',
    'kb.client.methods',
    'kb.runtime',
    'kb.widget.buttonbar',
    'bootstrap'
],
    function ($, Promise, DashboardWidget, KBService, R, Buttonbar) {
        'use strict';
        var widget = Object.create(DashboardWidget, {
            init: {
                value: function (cfg) {
                    cfg.name = 'NarrativesWidget';
                    cfg.title = 'Your Narratives';
                    this.DashboardWidget_init(cfg);

                    this.templates.env.addFilter('appName', function (x) {
                        return this.getState(['appsMap', x, 'name'], x);
                    }.bind(this));
                    this.templates.env.addFilter('methodName', function (x) {
                        return this.getState(['methodsMap', x, 'name'], x);
                    }.bind(this));

                    return this;
                }
            },
            getAppName: {
                value: function (name) {
                    return this.getState(['appsMap', name, 'name'], name);
                }
            },
            getMethodName: {
                value: function (name) {
                    return this.getState(['methodsMap', name, 'name'], name);
                }
            },
            setup: {
                value: function () {
                    // User profile service

                    // The workspace will get the common settings -- url and auth token -- from the appropriate
                    // singleton modules (Session, Config)
                    this.kbservice = Object.create(KBService).init();
                }
            },
            getViewTemplate: {
                value: function () {
                    if (this.error) {
                        return 'error';
                    } else if (R.isLoggedIn()) {
                        return 'slider';
                    } else {
                        return 'unauthorized';
                    }
                }
            },
            render: {
                value: function () {
                    // Generate initial view based on the current state of this widget.
                    // Head off at the pass -- if not logged in, can't show profile.
                    this.places.title.html(this.widgetTitle);
                    this.places.content.html(this.renderTemplate(this.getViewTemplate()));
                    // NB this only applies to this widget.
                    this.container.find('[data-toggle="popover"]').popover();
                    this.container.find('[data-toggle="tooltip"]').tooltip();
                    return this;
                }
            },
            setupUI: {
                value: function () {
                    if (this.hasState('narratives') && this.getState('narratives').length > 0) {
                        this.buttonbar = Object.create(Buttonbar).init({
                            container: this.container.find('[data-placeholder="buttonbar"]')
                        });
                        this.buttonbar
                            .clear()
                            .addButton({
                                name: 'newnarrative',
                                label: 'New Narrative',
                                icon: 'plus-circle',
                                style: 'primary',
                                class: 'btn-kbase',
                                url: '#/narrativemanager/new',
                                external: true
                            })
                            /*.addRadioToggle({
                             buttons: [
                             {
                             label: 'Slider',
                             active: true,
                             class: 'btn-kbase',
                             callback: function (e) {
                             this.view = 'slider';
                             this.refresh();
                             }.bind(this)
                             },
                             {
                             label: 'Table',
                             class: 'btn-kbase',
                             callback: function (e) {
                             this.view = 'table';
                             this.refresh();
                             }.bind(this)
                             }]
                             })
                             */
                            .addInput({
                                placeholder: 'Search Your Narratives',
                                place: 'end',
                                onkeyup: function (e) {
                                    this.setParam('filter', $(e.target).val());
                                }.bind(this)
                            });
                    }
                }
            },
            filterNarratives: {
                value: function () {
                    var search = this.getParam('filter');
                    if (!search || search.length === 0) {
                        this.setState('narrativesFiltered', this.getState('narratives'));
                        return;
                    }
                    var searchRe = new RegExp(search, 'i');
                    var nar = this.getState('narratives').filter(function (x) {
                        if (x.workspace.metadata.narrative_nice_name.match(searchRe) ||
                            (x.object.metadata.cellInfo &&
                                (function (apps) {
                                    for (var i in apps) {
                                        var app = apps[i];
                                        if (app.match(searchRe) || this.getAppName(app).match(searchRe)) {
                                            return true;
                                        }
                                    }
                                }.bind(this))(Object.keys(x.object.metadata.cellInfo.app))) ||
                            (x.object.metadata.cellInfo &&
                                (function (methods) {
                                    for (var i in methods) {
                                        var method = methods[i];
                                        if (method.match(searchRe) || this.getMethodName(method).match(searchRe)) {
                                            return true;
                                        }
                                    }
                                }.bind(this))(Object.keys(x.object.metadata.cellInfo.method))))
                        {
                            return true;
                        } else {
                            return false;
                        }
                    }.bind(this));
                    this.setState('narrativesFiltered', nar);
                }
            },
            onParamChange: {
                value: function () {
                    this.filterNarratives();
                }
            },
            onStateChange: {
                value: function () {

                    // Need to filter narratives?
                    var count = this.doState('narratives', function (x) {
                        return x.length;
                    }, null);
                    var filtered = this.doState('narrativesFiltered', function (x) {
                        return x.length;
                    }, null);

                    var sharingCount = this.doState('narratives', function (narratives) {
                        if (!narratives) {
                            return 0;
                        }
                        var sharingCount = 0;
                        for (var i = 0; i < narratives.length; i++) {
                            var nar = narratives[i];
                            if (nar.permissions.length > 0) {
                                sharingCount++;
                            }
                        }
                        return sharingCount;
                    });

                    if (this.hasState('narratives')) {
                        this.viewState.setItem('narratives', {
                            count: count,
                            sharingCount: sharingCount,
                            filtered: filtered
                        });
                    }
                    /*
                     Postal
                     .channel('dashboard.metrics')
                     .publish('update.narratives', {
                     count: count
                     }
                     );
                     */
                }
            },
            setInitialState: {
                value: function (options) {
                    return new Promise(function (resolve, reject) {
                        if (!R.isLoggedIn()) {
                            // ensure that all state is zapped.
                            this.deleteState();
                            resolve();
                            return;
                        }
                        Promise.all([this.kbservice.getNarratives({
                                params: {
                                    showDeleted: 0,
                                    owners: [R.getUsername()]
                                }
                            }),
                            this.kbservice.getApps(),
                            this.kbservice.getMethods()])
                            .spread(function (narratives, apps, methods) {
                                // Set the apps as state, and then create a map of app names to app spec.
                            console.log(narratives);
                            console.log(R.getUsername());
                                this.setState('apps', apps);
                                var appsMap = {};
                                apps.forEach(function (app) {
                                    appsMap[app.id] = app;
                                });
                                this.setState('appsMap', appsMap);

                                // Same for methods.
                                this.setState('methods', methods);
                                var methodsMap = {};
                                methods.forEach(function (method) {
                                    methodsMap[method.id] = method;
                                });
                                this.setState('methodsMap', methodsMap);

                                // If we get no narratives back, we just ensure that
                                // our state objects are empty. Otheriwse, we need to 
                                // populate the permissions on the narratives, and then 
                                // run any filters.
                                if (narratives.length === 0) {
                                    this.setState('narratives', []);
                                    this.setState('narrativesFiltered', []);
                                    resolve();
                                } else {
                                    this.kbservice.getPermissions(narratives)
                                        .then(function (narratives) {
                                            narratives = narratives.sort(function (a, b) {
                                                return b.object.saveDate.getTime() - a.object.saveDate.getTime();
                                            });
                                            this.setState('narratives', narratives);
                                            this.filterNarratives();
                                            resolve();
                                        }.bind(this))
                                        .catch(function (err) {
                                            reject(err);
                                        });
                                }
                            }.bind(this))
                            .catch(function (err) {
                                // this.viewState.setError('narratives', new Error('Error getting Narratives'));
                                reject(err);
                            }.bind(this))
                            .done();
                    }.bind(this));
                }
            }
        });

        return widget;
    });
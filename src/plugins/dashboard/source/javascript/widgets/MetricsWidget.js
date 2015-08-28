define([
    'bluebird',
    'kb_widget_dashboard_base',
    'kb_data'
],
    function (Promise, DashboardWidget, data) {
        'use strict';
        return Object.create(DashboardWidget, {
            init: {
                value: function (cfg) {
                    cfg.name = 'MetricsWidget';
                    cfg.title = 'Metrics';
                    this.DashboardWidget_init(cfg);

                    return this;
                }
            },
            afterStart: {
                value: function () {
                    /*
                     * Set listeners for updates to the narratives and sharedNarratives summary data.
                     * This data is set by the "your narratives" and "narratives shared with you"
                     * widgets.
                     */
                    this.viewState.listen('narratives', {
                        onSet: function (value) {
                            this.setState('narratives', value);
                            this.calcNarrativeMetrics(value.count);
                            this.calcSharingNarrativeMetrics(value.sharingCount);
                        }.bind(this),
                        onError: function (err) {
                            this.setError(err);
                        }.bind(this)
                    });

                    // we dont' do this one any longer.
                    //this.viewState.listen('sharedNarratives', function (value) {
                    //   this.setState('sharedNarratives', value);
                    //    this.calcSharedNarrativeMetrics(value.count);
                    //}.bind(this)); 
                }
            },
            setup: {
                value: function () {
                    return this;
                }
            },
            calcNarrativeMetrics: {
                value: function (userValue) {
                    // Just dummy data for now.
                    var stats = this.getState('narrativesStats');
                    var bins = stats.histogram;
                    // var data = bins.binned;
                    // Calculate widths, height.
                    var width = 100 / bins.binned.length;
                    var maxBinSize = Math.max.apply(null, bins.binned);
                    var minBinSize = Math.min.apply(null, bins.binned);

                    // consider the user's value in max/min too.
                    maxBinSize = Math.max(maxBinSize, userValue);
                    minBinSize = Math.min(minBinSize, userValue);

                    var chartHeight = maxBinSize + maxBinSize / 10;
                    var setup = bins.bins.map(function (col) {
                        col.width = width;
                        col.height = Math.round(100 * col.count / chartHeight);
                        return col;
                    });

                    // user scaled to histogram.
                    // put user value into the correct bin.
                    var userBin;
                    for (var i = 0; i < bins.bins.length; i++) {
                        var bin = bins.bins[i];
                        if (userValue >= bin.lower &&
                            ((bin.upperInclusive && userValue <= bin.upper) ||
                                (userValue < bin.upper) ||
                                (i === bins.bins.length - 1)
                                )) {
                            userBin = i;
                            if ((i === bins.bins.length - 1) && (userValue > bin.upper)) {
                                bin.upper = userValue;
                                bin.label = '(' + bin.lower + '-' + bin.upper + ']';
                            }
                            break;
                        }
                    }
                    if (userBin !== undefined) {
                        var user = {
                            scale: userBin * width + width / 2,
                            value: userValue,
                            bin: userBin,
                            side: (userBin < bins.bins.length / 2 ? 'right' : 'left')

                        }
                    } else {
                        var user = {scale: 0, value: 0}
                    }

                    this.setState('histogram.narratives', {
                        maxBinSize: maxBinSize,
                        minBinSize: minBinSize,
                        chartMax: chartHeight,
                        binData: bins,
                        chart: setup,
                        user: user,
                        stats: stats
                    });
                }
            },
            calcSharedNarrativeMetrics: {
                value: function (userValue) {
                    // Just dummy data for now.
                    var stats = this.getState('sharedNarrativesStats');
                    var bins = stats.histogram;
                    // var data = bins.binned;
                    // Calculate widths, height.
                    var width = 100 / bins.binned.length;
                    var maxBinSize = Math.max.apply(null, bins.binned);
                    var minBinSize = Math.min.apply(null, bins.binned);

                    // consider the user's value in max/min too.
                    maxBinSize = Math.max(maxBinSize, userValue);
                    minBinSize = Math.min(minBinSize, userValue);

                    var chartHeight = maxBinSize + maxBinSize / 10;
                    var setup = bins.bins.map(function (col) {
                        col.width = width;
                        col.height = Math.round(100 * col.count / chartHeight);
                        return col;
                    });

                    // user scaled to histogram.
                    // put user value into the correct bin.

                    var userBin;
                    for (var i = 0; i < bins.bins.length; i++) {
                        var bin = bins.bins[i];
                        if (userValue >= bin.lower &&
                            ((bin.upperInclusive && userValue <= bin.upper) ||
                                (userValue < bin.upper) ||
                                (i === bins.bins.length - 1)
                                )) {
                            userBin = i;

                            if ((i === bins.bins.length - 1) && (userValue > bin.upper)) {
                                bin.upper = userValue;
                                bin.label = '(' + bin.lower + '-' + bin.upper + ']';
                            }

                            break;
                        }
                    }
                    if (userBin !== undefined) {
                        var user = {
                            scale: userBin * width + width / 2,
                            value: userValue,
                            bin: userBin,
                            side: (userBin < bins.bins.length / 2 ? 'right' : 'left')

                        }
                    } else {
                        var user = {scale: 0, value: 0}
                    }

                    this.setState('histogram.sharedNarratives', {
                        maxBinSize: maxBinSize,
                        minBinSize: minBinSize,
                        chartMax: chartHeight,
                        binData: bins,
                        chart: setup,
                        user: user,
                        stats: stats
                    });
                }
            },
            calcSharingNarrativeMetrics: {
                value: function (userValue) {
                    // Just dummy data for now.
                    var stats = this.getState('sharingNarrativesStats');
                    var bins = stats.histogram;
                    // var data = bins.binned;
                    // Calculate widths, height.
                    var width = 100 / bins.binned.length;
                    var maxBinSize = Math.max.apply(null, bins.binned);
                    var minBinSize = Math.min.apply(null, bins.binned);

                    // consider the user's value in max/min too.
                    maxBinSize = Math.max(maxBinSize, userValue);
                    minBinSize = Math.min(minBinSize, userValue);

                    var chartHeight = maxBinSize + maxBinSize / 10;
                    var setup = bins.bins.map(function (col) {
                        col.width = width;
                        col.height = Math.round(100 * col.count / chartHeight);
                        return col;
                    });

                    // user scaled to histogram.
                    // put user value into the correct bin.

                    var userBin;
                    for (var i = 0; i < bins.bins.length; i++) {
                        var bin = bins.bins[i];
                        if (userValue >= bin.lower &&
                            ((bin.upperInclusive && userValue <= bin.upper) ||
                                (userValue < bin.upper) ||
                                (i === bins.bins.length - 1)
                                )) {
                            userBin = i;

                            if ((i === bins.bins.length - 1) && (userValue > bin.upper)) {
                                bin.upper = userValue;
                                bin.label = '(' + bin.lower + '-' + bin.upper + ']';
                            }

                            break;
                        }
                    }
                    if (userBin !== undefined) {
                        var user = {
                            scale: userBin * width + width / 2,
                            value: userValue,
                            bin: userBin,
                            side: (userBin < bins.bins.length / 2 ? 'right' : 'left')

                        }
                    } else {
                        var user = {scale: 0, value: 0}
                    }

                    this.setState('histogram.sharingNarratives', {
                        maxBinSize: maxBinSize,
                        minBinSize: minBinSize,
                        chartMax: chartHeight,
                        binData: bins,
                        chart: setup,
                        user: user,
                        stats: stats
                    });
                }
            },
            calcSharedNarrativeMetricsx: {
                value: function (userValue) {
                    // Just dummy data for now.
                    var bins = this.getState('sharedNarrativesStats').histogram;
                    // var data = bins.binned;
                    // Calculate widths, height.
                    var width = 100 / bins.binned.length;
                    var maxBinSize = Math.max.apply(null, bins.binned);
                    var minBinSize = Math.min.apply(null, bins.binned);

                    // consider the user's value in max/min too.
                    maxBinSize = Math.max(maxBinSize, userValue);
                    minBinSize = Math.min(minBinSize, userValue);

                    var chartHeight = maxBinSize + maxBinSize / 10;
                    var setup = bins.bins.map(function (col) {
                        col.width = width;
                        col.height = Math.round(100 * col.count / chartHeight);
                        return col;
                    });


                    // user scaled to histogram.
                    // put user value into the correct bin.
                    var userBin;
                    for (var i = 0; i < bins.bins.length; i++) {
                        var bin = bins.bins[i];
                        if (userValue >= bin.lower && ((bin.upperInclusive && userValue <= bin.upper) || (userValue < bin.upper))) {
                            userBin = i;
                            break;
                        }
                    }
                    if (userBin !== undefined) {
                        var user = {
                            scale: userBin * width + width / 2,
                            value: userValue
                        }
                    } else {
                        var user = {scale: 0, value: 0}
                    }

                    this.setState('histogram.sharedNarratives', {
                        maxBinSize: maxBinSize,
                        minBinSize: minBinSize,
                        chartMax: chartHeight,
                        binData: bins,
                        chart: setup,
                        user: user
                    });
                }
            },
            setInitialState: {
                value: function () {
                    return new Promise(function (resolve, reject) {
                        Promise.all([data.getJSON({path: 'metrics', file: 'narrative_histogram'}),
                              data.getJSON({path: 'metrics', file:'narrative_sharing_histogram'}),
                            this.viewState.whenItem('narratives', 10000)
                        ])
                            .then(function (data) {
                                this.setState('narrativesStats', data[0]);
                                // this.setState('sharedNarrativesStats', data[1]);
                                this.setState('sharingNarrativesStats', data[1]);
                                this.setState('narratives', data[2]);
                                this.calcNarrativeMetrics(data[2].count);
                                this.calcSharingNarrativeMetrics(data[2].sharingCount);
                                resolve();
                            }.bind(this))
                            .catch(function (err) {
                                reject(err);
                            })
                            .done();
                    }.bind(this));
                }
            }
        });
    });
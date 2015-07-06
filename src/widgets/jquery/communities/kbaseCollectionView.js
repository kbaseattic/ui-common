/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
/**
 * KBase widget to display a Metagenome Collection
 */
define(['jquery', 'kb.jquery.authenticatedwidget', 'kb.service.workspace', 'kb.app', 'kb.utils.api', 'kb.html', 'datatables_bootstrap'],
    function ($, _AuthenticatedWidget, Workspace, App, APIUtils, html) {
        'use strict';
        $.KBWidget({
            name: 'CollectionView',
            parent: 'kbaseAuthenticatedWidget',
            version: '1.0.0',
            token: null,
            options: {
                id: null,
                ws: null
            },
            ws_url: App.getConfig('workspace_url'),
            loading_image: 'assets/img/ajax-loader.gif',
            init: function (options) {
                this._super(options);
                return this;
            },
            render: function () {
                var self = this;

                var container = this.$elem;
                container.empty();
                if (self.token === null) {
                    container.append('<div>[Error] You're not logged in</div>');
                    return;
                }
                container.append('<div><img src="' + self.loading_image + '">&nbsp;&nbsp;loading data...</div>');

                var workspace = new Workspace(self.ws_url, {token: self.token});
                workspace.get_objects([{ref: self.options.ws + '/' + self.options.id}],
                    function (data) {
                        // parse data
                        console.log(data);
                        if (data.length === 0) {
                            var msg = '[Error] Object ' + self.options.id + ' does not exist in workspace ' + self.options.ws;
                            container.empty();
                            container.append('<div><p>' + msg + '>/p></div>');
                        } else {
                            // parse data		
                            console.log(data);
                            var d = data[0].data,
                                idList = [],
                                id, found, ref;
                            for (var i = 0; i < d.members.length; i++) {
                                idList.push({ref: d.members[i].URL});
                                /*
                                id = d.members[i].ID;
                                found = id.match(/(.*)\.(\d*)$/, id);
                                if (found) {
                                    idList.push({ref: APIUtils.makeWorkspaceObjectRef(self.options.ws, found[1], found[2])});
                                }
                                */
                            }
                            if (idList.length > 0) {
                                workspace.get_objects(idList,
                                    function (resData) {
                                        var rows = resData.map(function (item) {
                                            var data = item.data;
                                            return [
                                                data.id,
                                                data.name,
                                                data.mixs.project_name,
                                                data.mixs.PI_lastname,
                                                data.mixs.biome,
                                                data.mixs.sequence_type,
                                                data.mixs.seq_method,
                                                data.statistics.sequence_stats.bp_count_raw,
                                                data.created
                                            ];
                                        });

                                        var columns = ['ID', 'Name', 'Project', 'PI', 'Biome', 'Sequence Type', 'Sequencing Method', 'bp Count', 'Created'];
                                        var options = {
                                            class: 'table table-striped'
                                        };
                                        var content = html.makeTable(columns, rows, options);
                                        

                                        /*
                                         var tlen = 0;
                                         if (window.hasOwnProperty('rendererTable') && rendererTable.length) {
                                         tlen = rendererTable.length;
                                         }
                                         
                                         var html = '<h4>Metagenome Collection ' + d.name + '</h4><div id="collectionTable' + tlen + '" style="width: 95%;"></div>';
                                         */
                                        container.empty();
                                        container.append(content);
                                        // console.log($('#' + options.generated.id));
                                        $('#' + options.generated.id).dataTable();

                                        /*
                                         var tableCollection = standaloneTable.create({index: tlen});
                                         tableCollection.settings.target = document.getElementById("collectionTable" + tlen);
                                         tableCollection.settings.data = {header: ["ID", "Name", "Project", "PI", "Biome", "Sequence Type", "Sequencing Method", "bp Count", "Created"], data: tdata};
                                         tableCollection.render(tlen);
                                         */
                                    },
                                    function (err) {
                                        console.error('ERROR');
                                        console.error(err);
                                    });
                            } else {
                                container.empty();
                                var main = $('<div>');
                                main.append($('<p>')
                                    .css({'padding': '10px 20px'})
                                    .text('[Error] collection is empty'));
                                container.append(main);
                            }
                        }
                    },
                    function (data) {
                        console.log('ERROR');
                        container.empty();
                        var main = $('<div>');
                        main.append($('<p>')
                            .css({'padding': '10px 20px'})
                            .text('[Error] ' + data.error.message));
                        container.append(main);
                    });
                return self;
            },
            loggedInCallback: function (event, auth) {
                this.token = auth.token;
                this.render();
                return this;
            },
            loggedOutCallback: function (event, auth) {
                this.token = null;
                this.render();
                return this;
            }
        });
    });

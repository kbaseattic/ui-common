/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'kb.runtime',
    'bluebird',
    'kb_widget_vis_heatMap'],
    function (R, Promise) {
        'use strict';
        function widget(config) {
            var mount, container;
            function render() {
                /*var heatmap =
                    {
                        row_ids : [],
                        row_labels : [],
                        column_ids : [],
                        column_labels : [],
                        data : [],
                    };
                var numCells = 20;
                var colors = ['red', 'green', 'blue', 'purple', 'cyan'];
                for (var idx = 0; idx < numCells; idx++) {
                    var row = [];
                    heatmap.data.push(row);
                    for (var jdx = 0; jdx < numCells; jdx++) {
                        row.push(Math.random() * 2 - 1);
                    }
                    heatmap.row_ids.push('Wingding' + idx);
                    heatmap.row_labels.push('Wingding' + idx);
                    heatmap.column_ids.push('Frobnoz' + idx);
                    heatmap.column_labels.push('Frobnoz' + idx);
                }*/
                var pavel_data = {"data":[[0,0,1],[0,1,0.22437378465723734],[0,2,-0.05282216846735438],[0,3,-0.0657336809229566],[0,4,0.6097317208913948],[0,5,0.5425176628844238],[0,6,0.3439309383221102],[0,7,0.037145407026350594],[0,8,0.3089556469216014],[0,9,0.7417790860781828],[0,10,-0.46134326224504935],[1,0,0.22437378465723734],[1,1,1],[1,2,0.8302880807243083],[1,3,0.7636362475320498],[1,4,0.5779936789503318],[1,5,0.839948116422643],[1,6,0.8103994528862233],[1,7,0.7998426636454904],[1,8,0.861243414952622],[1,9,0.5590565296292523],[1,10,0.39261594349622286],[2,0,-0.05282216846735438],[2,1,0.8302880807243083],[2,2,1],[2,3,0.9539172382917777],[2,4,0.4878810638547996],[2,5,0.7069512016501768],[2,6,0.5392833855877311],[2,7,0.8462648456039754],[2,8,0.7922441597490814],[2,9,0.1432476127981901],[2,10,0.2660510734471336],[3,0,-0.0657336809229566],[3,1,0.7636362475320498],[3,2,0.9539172382917777],[3,3,1],[3,4,0.5532743721921256],[3,5,0.7059430904874227],[3,6,0.4675358273403718],[3,7,0.8323376367269241],[3,8,0.7283585026398363],[3,9,0.12217567101908242],[3,10,0.15325316115813803],[4,0,0.6097317208913948],[4,1,0.5779936789503318],[4,2,0.4878810638547996],[4,3,0.5532743721921256],[4,4,1],[4,5,0.8292934171251002],[4,6,0.5990312343088248],[4,7,0.37503028486045814],[4,8,0.5344077210261144],[4,9,0.5959107085990492],[4,10,-0.28738289592618543],[5,0,0.5425176628844238],[5,1,0.839948116422643],[5,2,0.7069512016501768],[5,3,0.7059430904874227],[5,4,0.8292934171251002],[5,5,1],[5,6,0.6209056238338956],[5,7,0.7560802936681007],[5,8,0.8087395364615049],[5,9,0.5604869559136527],[5,10,-0.05083306073047172],[6,0,0.3439309383221102],[6,1,0.8103994528862233],[6,2,0.5392833855877311],[6,3,0.4675358273403718],[6,4,0.5990312343088248],[6,5,0.6209056238338956],[6,6,1],[6,7,0.428199713846343],[6,8,0.5870017427704819],[6,9,0.6863426121415102],[6,10,0.46752671641992993],[7,0,0.037145407026350594],[7,1,0.7998426636454904],[7,2,0.8462648456039754],[7,3,0.8323376367269241],[7,4,0.37503028486045814],[7,5,0.7560802936681007],[7,6,0.428199713846343],[7,7,1],[7,8,0.8696648038744825],[7,9,0.18044270237528454],[7,10,0.21519669543929473],[8,0,0.3089556469216014],[8,1,0.861243414952622],[8,2,0.7922441597490814],[8,3,0.7283585026398363],[8,4,0.5344077210261144],[8,5,0.8087395364615049],[8,6,0.5870017427704819],[8,7,0.8696648038744825],[8,8,1],[8,9,0.5433832909292271],[8,10,0.036165574629291444],[9,0,0.7417790860781828],[9,1,0.5590565296292523],[9,2,0.1432476127981901],[9,3,0.12217567101908242],[9,4,0.5959107085990492],[9,5,0.5604869559136527],[9,6,0.6863426121415102],[9,7,0.18044270237528454],[9,8,0.5433832909292271],[9,9,1],[9,10,-0.09118786691187009],[10,0,-0.46134326224504935],[10,1,0.39261594349622286],[10,2,0.2660510734471336],[10,3,0.15325316115813803],[10,4,-0.28738289592618543],[10,5,-0.05083306073047172],[10,6,0.46752671641992993],[10,7,0.21519669543929473],[10,8,0.036165574629291444],[10,9,-0.09118786691187009],[10,10,1]],"labels":["VNG0001H","VNG0002G","VNG0003C","VNG0006G","VNG0013C","VNG0014C","VNG0361C","VNG0518H","VNG0868H","VNG0289H","VNG0852C"]};

                var heatmap =
                    {
                        row_ids : [],
                        row_labels : [],
                        column_ids : [],
                        column_labels : [],
                        data : []
                    };

                for (var idx = 0; idx < 11; idx++) {
                    var row = [];
                    heatmap.data.push(row);
                    for (var jdx = 10; jdx >= 0; jdx--) {
                        row.push(pavel_data.data[idx * 11 + jdx][2]);
                    }
                }

                for (var ldx = pavel_data.labels.length - 1; ldx >= 0 ; ldx--) {
                    var label = pavel_data.labels[ldx];
                    heatmap.row_ids.push(label + '-row');
                    heatmap.row_labels.push(label);
                    heatmap.column_ids.unshift(label + '-column');
                    heatmap.column_labels.unshift(label);
                }

                var $hm = $.jqElem('div').css({width : '1000px', height : '500px'}).kbaseHeatmap(
                    {
                        dataset : heatmap,
                        colors : ['#0000AA', '#FFFFFF', '#AA0000'],
                        //ulIcon : '/functional-site/assets/navbar/images/kbase_logo.png',
                        minValue : -1.0,
                        maxValue : 1.0
                    }
                );

                return {
                    title: 'Sample Heat map',
                    content: $hm.$elem
                };

            }

            function init(config) {
                return new Promise(function (resolve) {
                    resolve();
                });
            }

            function attach(node) {
                return new Promise(function (resolve) {
                    mount = node;
                    container = document.createElement('div');
                    mount.appendChild(container);
                    var rendered = render();

                    R.send('app', 'title', rendered.title);
                    $(container).append(rendered.content);

                    resolve();
                });
            }
            function start(params) {
                return new Promise(function (resolve) {
                    resolve();
                });
            }
            function stop(node) {
                return new Promise(function (resolve) {

                    resolve();
                });
            }
            function detach(node) {
                return new Promise(function (resolve) {

                    resolve();
                });
            }

            return {
                init: init,
                attach: attach,
                start: start,
                stop: stop,
                detach: detach
            };
        }


        return {
            make: function (config) {
                return widget(config);
            }
        };
    });

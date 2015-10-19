/**
 * Output widget to vizualize KBaseAssembly.SingleEndLibrary object.
 *
 * Pavel Novichkov <psnovichkov@lbl.gov>
 * @public
 */
/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'jquery',
    'kb_widget_dataview_assembly_singleObjectBasic'
],
    function ($) {
        'use strict';
        $.KBWidget({
            name: 'kbaseSingleEndLibrary',
            parent: 'kbaseSingleObjectBasicWidget',
            version: '1.0.1',
            getDataModel: function (objData) {
                var model = {
                    description: "This data object is a reference to a single end read library",
                    items: []
                };

                if (objData.handle)
                    model.items.push({name: 'Source file name', value: objData.handle.file_name});
                return model;
            }
        });
    });





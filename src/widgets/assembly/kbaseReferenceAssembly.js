/**
 * Output widget to vizualize KBaseAssembly.ReferenceAssembly object.
 *
 * Pavel Novichkov <psnovichkov@lbl.gov>
 * @public
 */


(function($, undefined) {
    $.KBWidget({
        name: 'kbaseReferenceAssembly',
        parent: 'kbaseSingleObjectBasicWidget',
        version: '1.0.1',

        getDataModel: function(objData){
            var model = {
                description : "This data object is a reference to the uploaded assemebly",
                items: []
            };           
            
            if(objData.reference_name)
                model.items.push({name:'Reference name', value: objData.reference_name});
            if(objData.handle)
                model.items.push({name:'Source file name', value: objData.handle.file_name});
            return model;            
        }
    });
})( jQuery );





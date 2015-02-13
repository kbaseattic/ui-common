

function ExpressionServices(url,auth) {

    var _url = url;
    var _auth = auth ? auth : { 'token' : '',
                                'user_id' : ''};


    this.get_expression_samples_data = function(sampleIds)
    {
        var resp = json_call_ajax_sync("ExpressionServices.get_expression_samples_data", [sampleIds]);
//      var resp = json_call_sync("ExpressionServices.get_expression_samples_data", [sampleIds]);
        return resp[0];
    }

    this.get_expression_samples_data_async = function(sampleIds, _callback, _error_callback)
    {
        json_call_ajax_async("ExpressionServices.get_expression_samples_data", [sampleIds], 1, _callback, _error_callback)
    }

    this.get_expression_samples_data_by_series_ids = function(seriesIds)
    {
        var resp = json_call_ajax_sync("ExpressionServices.get_expression_samples_data_by_series_ids", [seriesIds]);
//      var resp = json_call_sync("ExpressionServices.get_expression_samples_data_by_series_ids", [seriesIds]);
        return resp[0];
    }

    this.get_expression_samples_data_by_series_ids_async = function(seriesIds, _callback, _error_callback)
    {
        json_call_ajax_async("ExpressionServices.get_expression_samples_data_by_series_ids", [seriesIds], 1, _callback, _error_callback)
    }

    this.get_expression_samples_data_by_experimental_unit_ids = function(experimentalUnitIDs)
    {
        var resp = json_call_ajax_sync("ExpressionServices.get_expression_samples_data_by_experimental_unit_ids", [experimentalUnitIDs]);
//      var resp = json_call_sync("ExpressionServices.get_expression_samples_data_by_experimental_unit_ids", [experimentalUnitIDs]);
        return resp[0];
    }

    this.get_expression_samples_data_by_experimental_unit_ids_async = function(experimentalUnitIDs, _callback, _error_callback)
    {
        json_call_ajax_async("ExpressionServices.get_expression_samples_data_by_experimental_unit_ids", [experimentalUnitIDs], 1, _callback, _error_callback)
    }

    this.get_expression_experimental_unit_samples_data_by_experiment_meta_ids = function(experimentMetaIDs)
    {
        var resp = json_call_ajax_sync("ExpressionServices.get_expression_experimental_unit_samples_data_by_experiment_meta_ids", [experimentMetaIDs]);
//      var resp = json_call_sync("ExpressionServices.get_expression_experimental_unit_samples_data_by_experiment_meta_ids", [experimentMetaIDs]);
        return resp[0];
    }

    this.get_expression_experimental_unit_samples_data_by_experiment_meta_ids_async = function(experimentMetaIDs, _callback, _error_callback)
    {
        json_call_ajax_async("ExpressionServices.get_expression_experimental_unit_samples_data_by_experiment_meta_ids", [experimentMetaIDs], 1, _callback, _error_callback)
    }

    this.get_expression_samples_data_by_strain_ids = function(strainIDs, sampleType)
    {
        var resp = json_call_ajax_sync("ExpressionServices.get_expression_samples_data_by_strain_ids", [strainIDs, sampleType]);
//      var resp = json_call_sync("ExpressionServices.get_expression_samples_data_by_strain_ids", [strainIDs, sampleType]);
        return resp[0];
    }

    this.get_expression_samples_data_by_strain_ids_async = function(strainIDs, sampleType, _callback, _error_callback)
    {
        json_call_ajax_async("ExpressionServices.get_expression_samples_data_by_strain_ids", [strainIDs, sampleType], 1, _callback, _error_callback)
    }

    this.get_expression_samples_data_by_genome_ids = function(genomeIDs, sampleType, wildTypeOnly)
    {
        var resp = json_call_ajax_sync("ExpressionServices.get_expression_samples_data_by_genome_ids", [genomeIDs, sampleType, wildTypeOnly]);
//      var resp = json_call_sync("ExpressionServices.get_expression_samples_data_by_genome_ids", [genomeIDs, sampleType, wildTypeOnly]);
        return resp[0];
    }

    this.get_expression_samples_data_by_genome_ids_async = function(genomeIDs, sampleType, wildTypeOnly, _callback, _error_callback)
    {
        json_call_ajax_async("ExpressionServices.get_expression_samples_data_by_genome_ids", [genomeIDs, sampleType, wildTypeOnly], 1, _callback, _error_callback)
    }

    this.get_expression_data_by_feature_ids = function(featureIds, sampleType, wildTypeOnly)
    {
        var resp = json_call_ajax_sync("ExpressionServices.get_expression_data_by_feature_ids", [featureIds, sampleType, wildTypeOnly]);
//      var resp = json_call_sync("ExpressionServices.get_expression_data_by_feature_ids", [featureIds, sampleType, wildTypeOnly]);
        return resp[0];
    }

    this.get_expression_data_by_feature_ids_async = function(featureIds, sampleType, wildTypeOnly, _callback, _error_callback)
    {
        json_call_ajax_async("ExpressionServices.get_expression_data_by_feature_ids", [featureIds, sampleType, wildTypeOnly], 1, _callback, _error_callback)
    }

    function _json_call_prepare(url, method, params, async_flag)
    {
        var rpc = { 'params' : params,
                    'method' : method,
                    'version': "1.1",
                    'id': String(Math.random()).slice(2),
        };
        
        var body = JSON.stringify(rpc);
        
        var http = new XMLHttpRequest();
        
        http.open("POST", url, async_flag);
        
        //Send the proper header information along with the request
        http.setRequestHeader("Content-type", "application/json");
        //http.setRequestHeader("Content-length", body.length);
        //http.setRequestHeader("Connection", "close");
        return [http, body];
    }

    /*
     * JSON call using jQuery method.
     */

    function json_call_ajax_sync(method, params)
    {
        var rpc = { 'params' : params,
                    'method' : method,
                    'version': "1.1",
                    'id': String(Math.random()).slice(2),
        };
        
        var body = JSON.stringify(rpc);
        var resp_txt;
        var code;
        
        var x = jQuery.ajax({       "async": false,
                                    dataType: "text",
                                    url: _url,
                                    beforeSend: function (xhr){ 
                                        xhr.setRequestHeader('Authorization', _auth.token); 
                                    },
                                    success: function (data, status, xhr) { resp_txt = data; code = xhr.status },
                                    error: function(xhr, textStatus, errorThrown) { resp_txt = xhr.responseText, code = xhr.status },
                                    data: body,
                                    processData: false,
                                    type: 'POST',
                                    });

        var result;

        if (resp_txt)
        {
            var resp = JSON.parse(resp_txt);
            
            if (code >= 500)
            {
                throw resp.error;
            }
            else
            {
                return resp.result;
            }
        }
        else
        {
            return null;
        }
    }

    function json_call_ajax_async(method, params, num_rets, callback, error_callback)
    {
        var rpc = { 'params' : params,
                    'method' : method,
                    'version': "1.1",
                    'id': String(Math.random()).slice(2),
        };
        
        var body = JSON.stringify(rpc);
        var resp_txt;
        var code;
        
        var x = jQuery.ajax({       "async": true,
                                    dataType: "text",
                                    url: _url,
                                    beforeSend: function (xhr){ 
                                        xhr.setRequestHeader('Authorization', _auth.token); 
                                    },
                                    success: function (data, status, xhr)
                                {
                                    resp = JSON.parse(data);
                                    var result = resp["result"];
                                    if (num_rets == 1)
                                    {
                                        callback(result[0]);
                                    }
                                    else
                                    {
                                        callback(result);
                                    }
                                    
                                },
                                    error: function(xhr, textStatus, errorThrown)
                                {
                                    if (xhr.responseText)
                                    {
                                        resp = JSON.parse(xhr.responseText);
                                        if (error_callback)
                                        {
                                            error_callback(resp.error);
                                        }
                                        else
                                        {
                                            throw resp.error;
                                        }
                                    }
                                },
                                    data: body,
                                    processData: false,
                                    type: 'POST',
                                    });

    }

    function json_call_async(method, params, num_rets, callback)
    {
        var tup = _json_call_prepare(_url, method, params, true);
        var http = tup[0];
        var body = tup[1];
        
        http.onreadystatechange = function() {
            if (http.readyState == 4 && http.status == 200) {
                var resp_txt = http.responseText;
                var resp = JSON.parse(resp_txt);
                var result = resp["result"];
                if (num_rets == 1)
                {
                    callback(result[0]);
                }
                else
                {
                    callback(result);
                }
            }
        }
        
        http.send(body);
        
    }
    
    function json_call_sync(method, params)
    {
        var tup = _json_call_prepare(url, method, params, false);
        var http = tup[0];
        var body = tup[1];
        
        http.send(body);
        
        var resp_txt = http.responseText;
        
        var resp = JSON.parse(resp_txt);
        var result = resp["result"];
            
        return result;
    }
}



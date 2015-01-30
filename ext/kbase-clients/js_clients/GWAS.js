

function GWAS(url, auth, auth_cb) {

    this.url = url;
    var _url = url;
    var deprecationWarningSent = false;

    function deprecationWarning() {
        if (!deprecationWarningSent) {
            deprecationWarningSent = true;
            if (!window.console) return;
            console.log(
                "DEPRECATION WARNING: '*_async' method names will be removed",
                "in a future version. Please use the identical methods without",
                "the'_async' suffix.");
        }
    }

    var _auth = auth ? auth : { 'token' : '', 'user_id' : ''};
    var _auth_cb = auth_cb;


    this.prepare_variation = function (args, _callback, _errorCallback) {
    return json_call_ajax("GWAS.prepare_variation",
        [args], 1, _callback, _errorCallback);
};

    this.prepare_variation_async = function (args, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GWAS.prepare_variation", [args], 1, _callback, _error_callback);
    };

    this.calculate_kinship_matrix = function (args, _callback, _errorCallback) {
    return json_call_ajax("GWAS.calculate_kinship_matrix",
        [args], 1, _callback, _errorCallback);
};

    this.calculate_kinship_matrix_async = function (args, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GWAS.calculate_kinship_matrix", [args], 1, _callback, _error_callback);
    };

    this.run_gwas = function (args, _callback, _errorCallback) {
    return json_call_ajax("GWAS.run_gwas",
        [args], 1, _callback, _errorCallback);
};

    this.run_gwas_async = function (args, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GWAS.run_gwas", [args], 1, _callback, _error_callback);
    };

    this.variations_to_genes = function (args, _callback, _errorCallback) {
    return json_call_ajax("GWAS.variations_to_genes",
        [args], 1, _callback, _errorCallback);
};

    this.variations_to_genes_async = function (args, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GWAS.variations_to_genes", [args], 1, _callback, _error_callback);
    };

    this.genelist_to_networks = function (args, _callback, _errorCallback) {
    return json_call_ajax("GWAS.genelist_to_networks",
        [args], 1, _callback, _errorCallback);
};

    this.genelist_to_networks_async = function (args, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GWAS.genelist_to_networks", [args], 1, _callback, _error_callback);
    };

    this.gwas_genelist_to_networks = function (args, _callback, _errorCallback) {
    return json_call_ajax("GWAS.gwas_genelist_to_networks",
        [args], 1, _callback, _errorCallback);
};

    this.gwas_genelist_to_networks_async = function (args, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GWAS.gwas_genelist_to_networks", [args], 1, _callback, _error_callback);
    };
 

    /*
     * JSON call using jQuery method.
     */
    function json_call_ajax(method, params, numRets, callback, errorCallback) {
        var deferred = $.Deferred();

        if (typeof callback === 'function') {
           deferred.done(callback);
        }

        if (typeof errorCallback === 'function') {
           deferred.fail(errorCallback);
        }

        var rpc = {
            params : params,
            method : method,
            version: "1.1",
            id: String(Math.random()).slice(2),
        };

        var beforeSend = null;
        var token = (_auth_cb && typeof _auth_cb === 'function') ? _auth_cb()
            : (_auth.token ? _auth.token : null);
        if (token != null) {
            beforeSend = function (xhr) {
                xhr.setRequestHeader("Authorization", token);
            }
        }

        var xhr = jQuery.ajax({
            url: _url,
            dataType: "text",
            type: 'POST',
            processData: false,
            data: JSON.stringify(rpc),
            beforeSend: beforeSend,
            success: function (data, status, xhr) {
                var result;
                try {
                    var resp = JSON.parse(data);
                    result = (numRets === 1 ? resp.result[0] : resp.result);
                } catch (err) {
                    deferred.reject({
                        status: 503,
                        error: err,
                        url: _url,
                        resp: data
                    });
                    return;
                }
                deferred.resolve(result);
            },
            error: function (xhr, textStatus, errorThrown) {
                var error;
                if (xhr.responseText) {
                    try {
                        var resp = JSON.parse(xhr.responseText);
                        error = resp.error;
                    } catch (err) { // Not JSON
                        error = "Unknown error - " + xhr.responseText;
                    }
                } else {
                    error = "Unknown Error";
                }
                deferred.reject({
                    status: 500,
                    error: error
                });
            }
        });

        var promise = deferred.promise();
        promise.xhr = xhr;
        return promise;
    }
}



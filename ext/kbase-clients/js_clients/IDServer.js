

function IDServerAPI(url, auth, auth_cb) {

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

    if (typeof(_url) != "string" || _url.length == 0) {
        _url = "http://localhost:7031";
    }
    var _auth = auth ? auth : { 'token' : '', 'user_id' : ''};
    var _auth_cb = auth_cb;


    this.kbase_ids_to_external_ids = function (ids, _callback, _errorCallback) {
    return json_call_ajax("IDServerAPI.kbase_ids_to_external_ids",
        [ids], 1, _callback, _errorCallback);
};

    this.kbase_ids_to_external_ids_async = function (ids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("IDServerAPI.kbase_ids_to_external_ids", [ids], 1, _callback, _error_callback);
    };

    this.external_ids_to_kbase_ids = function (external_db, ext_ids, _callback, _errorCallback) {
    return json_call_ajax("IDServerAPI.external_ids_to_kbase_ids",
        [external_db, ext_ids], 1, _callback, _errorCallback);
};

    this.external_ids_to_kbase_ids_async = function (external_db, ext_ids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("IDServerAPI.external_ids_to_kbase_ids", [external_db, ext_ids], 1, _callback, _error_callback);
    };

    this.register_ids = function (prefix, db_name, ids, _callback, _errorCallback) {
    return json_call_ajax("IDServerAPI.register_ids",
        [prefix, db_name, ids], 1, _callback, _errorCallback);
};

    this.register_ids_async = function (prefix, db_name, ids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("IDServerAPI.register_ids", [prefix, db_name, ids], 1, _callback, _error_callback);
    };

    this.allocate_id_range = function (kbase_id_prefix, count, _callback, _errorCallback) {
    return json_call_ajax("IDServerAPI.allocate_id_range",
        [kbase_id_prefix, count], 1, _callback, _errorCallback);
};

    this.allocate_id_range_async = function (kbase_id_prefix, count, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("IDServerAPI.allocate_id_range", [kbase_id_prefix, count], 1, _callback, _error_callback);
    };

    this.register_allocated_ids = function (prefix, db_name, assignments, _callback, _errorCallback) {
    return json_call_ajax("IDServerAPI.register_allocated_ids",
        [prefix, db_name, assignments], 0, _callback, _errorCallback);
};

    this.register_allocated_ids_async = function (prefix, db_name, assignments, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("IDServerAPI.register_allocated_ids", [prefix, db_name, assignments], 0, _callback, _error_callback);
    };

    this.get_identifier_prefix = function (_callback, _errorCallback) {
    return json_call_ajax("IDServerAPI.get_identifier_prefix",
        [], 1, _callback, _errorCallback);
};

    this.get_identifier_prefix_async = function (_callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("IDServerAPI.get_identifier_prefix", [], 1, _callback, _error_callback);
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



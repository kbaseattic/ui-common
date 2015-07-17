

function MEME(url, auth, auth_cb) {

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


    this.find_motifs_with_meme = function (sequenceSet, params, _callback, _errorCallback) {
    return json_call_ajax("MEME.find_motifs_with_meme",
        [sequenceSet, params], 1, _callback, _errorCallback);
};

    this.find_motifs_with_meme_async = function (sequenceSet, params, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("MEME.find_motifs_with_meme", [sequenceSet, params], 1, _callback, _error_callback);
    };

    this.find_motifs_with_meme_from_ws = function (ws_name, params, _callback, _errorCallback) {
    return json_call_ajax("MEME.find_motifs_with_meme_from_ws",
        [ws_name, params], 1, _callback, _errorCallback);
};

    this.find_motifs_with_meme_from_ws_async = function (ws_name, params, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("MEME.find_motifs_with_meme_from_ws", [ws_name, params], 1, _callback, _error_callback);
    };

    this.find_motifs_with_meme_job_from_ws = function (ws_name, params, _callback, _errorCallback) {
    return json_call_ajax("MEME.find_motifs_with_meme_job_from_ws",
        [ws_name, params], 1, _callback, _errorCallback);
};

    this.find_motifs_with_meme_job_from_ws_async = function (ws_name, params, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("MEME.find_motifs_with_meme_job_from_ws", [ws_name, params], 1, _callback, _error_callback);
    };

    this.compare_motifs_with_tomtom = function (query, target, params, _callback, _errorCallback) {
    return json_call_ajax("MEME.compare_motifs_with_tomtom",
        [query, target, params], 1, _callback, _errorCallback);
};

    this.compare_motifs_with_tomtom_async = function (query, target, params, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("MEME.compare_motifs_with_tomtom", [query, target, params], 1, _callback, _error_callback);
    };

    this.compare_motifs_with_tomtom_by_collection = function (query, target, params, _callback, _errorCallback) {
    return json_call_ajax("MEME.compare_motifs_with_tomtom_by_collection",
        [query, target, params], 1, _callback, _errorCallback);
};

    this.compare_motifs_with_tomtom_by_collection_async = function (query, target, params, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("MEME.compare_motifs_with_tomtom_by_collection", [query, target, params], 1, _callback, _error_callback);
    };

    this.compare_motifs_with_tomtom_by_collection_from_ws = function (ws_name, params, _callback, _errorCallback) {
    return json_call_ajax("MEME.compare_motifs_with_tomtom_by_collection_from_ws",
        [ws_name, params], 1, _callback, _errorCallback);
};

    this.compare_motifs_with_tomtom_by_collection_from_ws_async = function (ws_name, params, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("MEME.compare_motifs_with_tomtom_by_collection_from_ws", [ws_name, params], 1, _callback, _error_callback);
    };

    this.compare_motifs_with_tomtom_job_by_collection_from_ws = function (ws_name, params, _callback, _errorCallback) {
    return json_call_ajax("MEME.compare_motifs_with_tomtom_job_by_collection_from_ws",
        [ws_name, params], 1, _callback, _errorCallback);
};

    this.compare_motifs_with_tomtom_job_by_collection_from_ws_async = function (ws_name, params, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("MEME.compare_motifs_with_tomtom_job_by_collection_from_ws", [ws_name, params], 1, _callback, _error_callback);
    };

    this.find_sites_with_mast = function (query, target, params, _callback, _errorCallback) {
    return json_call_ajax("MEME.find_sites_with_mast",
        [query, target, params], 1, _callback, _errorCallback);
};

    this.find_sites_with_mast_async = function (query, target, params, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("MEME.find_sites_with_mast", [query, target, params], 1, _callback, _error_callback);
    };

    this.find_sites_with_mast_by_collection = function (query, target, params, _callback, _errorCallback) {
    return json_call_ajax("MEME.find_sites_with_mast_by_collection",
        [query, target, params], 1, _callback, _errorCallback);
};

    this.find_sites_with_mast_by_collection_async = function (query, target, params, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("MEME.find_sites_with_mast_by_collection", [query, target, params], 1, _callback, _error_callback);
    };

    this.find_sites_with_mast_by_collection_from_ws = function (ws_name, params, _callback, _errorCallback) {
    return json_call_ajax("MEME.find_sites_with_mast_by_collection_from_ws",
        [ws_name, params], 1, _callback, _errorCallback);
};

    this.find_sites_with_mast_by_collection_from_ws_async = function (ws_name, params, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("MEME.find_sites_with_mast_by_collection_from_ws", [ws_name, params], 1, _callback, _error_callback);
    };

    this.find_sites_with_mast_job_by_collection_from_ws = function (ws_name, params, _callback, _errorCallback) {
    return json_call_ajax("MEME.find_sites_with_mast_job_by_collection_from_ws",
        [ws_name, params], 1, _callback, _errorCallback);
};

    this.find_sites_with_mast_job_by_collection_from_ws_async = function (ws_name, params, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("MEME.find_sites_with_mast_job_by_collection_from_ws", [ws_name, params], 1, _callback, _error_callback);
    };

    this.get_pspm_collection_from_meme_result = function (meme_run_result, _callback, _errorCallback) {
    return json_call_ajax("MEME.get_pspm_collection_from_meme_result",
        [meme_run_result], 1, _callback, _errorCallback);
};

    this.get_pspm_collection_from_meme_result_async = function (meme_run_result, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("MEME.get_pspm_collection_from_meme_result", [meme_run_result], 1, _callback, _error_callback);
    };

    this.get_pspm_collection_from_meme_result_from_ws = function (ws_name, input_id, _callback, _errorCallback) {
    return json_call_ajax("MEME.get_pspm_collection_from_meme_result_from_ws",
        [ws_name, input_id], 1, _callback, _errorCallback);
};

    this.get_pspm_collection_from_meme_result_from_ws_async = function (ws_name, input_id, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("MEME.get_pspm_collection_from_meme_result_from_ws", [ws_name, input_id], 1, _callback, _error_callback);
    };

    this.get_pspm_collection_from_meme_result_job_from_ws = function (ws_name, input_id, _callback, _errorCallback) {
    return json_call_ajax("MEME.get_pspm_collection_from_meme_result_job_from_ws",
        [ws_name, input_id], 1, _callback, _errorCallback);
};

    this.get_pspm_collection_from_meme_result_job_from_ws_async = function (ws_name, input_id, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("MEME.get_pspm_collection_from_meme_result_job_from_ws", [ws_name, input_id], 1, _callback, _error_callback);
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





function AbstractHandle(url, auth, auth_cb) {

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
        _url = "http://localhost:7109";
    }
    var _auth = auth ? auth : { 'token' : '', 'user_id' : ''};
    var _auth_cb = auth_cb;


    this.new_handle = function (_callback, _errorCallback) {
    return json_call_ajax("AbstractHandle.new_handle",
        [], 1, _callback, _errorCallback);
};

    this.new_handle_async = function (_callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("AbstractHandle.new_handle", [], 1, _callback, _error_callback);
    };

    this.localize_handle = function (h1, service_name, _callback, _errorCallback) {
    return json_call_ajax("AbstractHandle.localize_handle",
        [h1, service_name], 1, _callback, _errorCallback);
};

    this.localize_handle_async = function (h1, service_name, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("AbstractHandle.localize_handle", [h1, service_name], 1, _callback, _error_callback);
    };

    this.initialize_handle = function (h1, _callback, _errorCallback) {
    return json_call_ajax("AbstractHandle.initialize_handle",
        [h1], 1, _callback, _errorCallback);
};

    this.initialize_handle_async = function (h1, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("AbstractHandle.initialize_handle", [h1], 1, _callback, _error_callback);
    };

    this.persist_handle = function (h, _callback, _errorCallback) {
    return json_call_ajax("AbstractHandle.persist_handle",
        [h], 1, _callback, _errorCallback);
};

    this.persist_handle_async = function (h, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("AbstractHandle.persist_handle", [h], 1, _callback, _error_callback);
    };

    this.upload = function (infile, _callback, _errorCallback) {
    return json_call_ajax("AbstractHandle.upload",
        [infile], 1, _callback, _errorCallback);
};

    this.upload_async = function (infile, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("AbstractHandle.upload", [infile], 1, _callback, _error_callback);
    };

    this.download = function (h, outfile, _callback, _errorCallback) {
    return json_call_ajax("AbstractHandle.download",
        [h, outfile], 0, _callback, _errorCallback);
};

    this.download_async = function (h, outfile, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("AbstractHandle.download", [h, outfile], 0, _callback, _error_callback);
    };

    this.upload_metadata = function (h, infile, _callback, _errorCallback) {
    return json_call_ajax("AbstractHandle.upload_metadata",
        [h, infile], 0, _callback, _errorCallback);
};

    this.upload_metadata_async = function (h, infile, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("AbstractHandle.upload_metadata", [h, infile], 0, _callback, _error_callback);
    };

    this.download_metadata = function (h, outfile, _callback, _errorCallback) {
    return json_call_ajax("AbstractHandle.download_metadata",
        [h, outfile], 0, _callback, _errorCallback);
};

    this.download_metadata_async = function (h, outfile, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("AbstractHandle.download_metadata", [h, outfile], 0, _callback, _error_callback);
    };

    this.ids_to_handles = function (ids, _callback, _errorCallback) {
    return json_call_ajax("AbstractHandle.ids_to_handles",
        [ids], 1, _callback, _errorCallback);
};

    this.ids_to_handles_async = function (ids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("AbstractHandle.ids_to_handles", [ids], 1, _callback, _error_callback);
    };

    this.hids_to_handles = function (hids, _callback, _errorCallback) {
    return json_call_ajax("AbstractHandle.hids_to_handles",
        [hids], 1, _callback, _errorCallback);
};

    this.hids_to_handles_async = function (hids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("AbstractHandle.hids_to_handles", [hids], 1, _callback, _error_callback);
    };

    this.are_readable = function (arg_1, _callback, _errorCallback) {
    return json_call_ajax("AbstractHandle.are_readable",
        [arg_1], 1, _callback, _errorCallback);
};

    this.are_readable_async = function (arg_1, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("AbstractHandle.are_readable", [arg_1], 1, _callback, _error_callback);
    };

    this.is_readable = function (id, _callback, _errorCallback) {
    return json_call_ajax("AbstractHandle.is_readable",
        [id], 1, _callback, _errorCallback);
};

    this.is_readable_async = function (id, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("AbstractHandle.is_readable", [id], 1, _callback, _error_callback);
    };

    this.list_handles = function (_callback, _errorCallback) {
    return json_call_ajax("AbstractHandle.list_handles",
        [], 1, _callback, _errorCallback);
};

    this.list_handles_async = function (_callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("AbstractHandle.list_handles", [], 1, _callback, _error_callback);
    };

    this.delete_handles = function (l, _callback, _errorCallback) {
    return json_call_ajax("AbstractHandle.delete_handles",
        [l], 0, _callback, _errorCallback);
};

    this.delete_handles_async = function (l, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("AbstractHandle.delete_handles", [l], 0, _callback, _error_callback);
    };

    this.give = function (user, perm, h, _callback, _errorCallback) {
    return json_call_ajax("AbstractHandle.give",
        [user, perm, h], 0, _callback, _errorCallback);
};

    this.give_async = function (user, perm, h, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("AbstractHandle.give", [user, perm, h], 0, _callback, _error_callback);
    };

    this.ids_to_handles = function (ids, _callback, _errorCallback) {
    return json_call_ajax("AbstractHandle.ids_to_handles",
        [ids], 1, _callback, _errorCallback);
};

    this.ids_to_handles_async = function (ids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("AbstractHandle.ids_to_handles", [ids], 1, _callback, _error_callback);
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



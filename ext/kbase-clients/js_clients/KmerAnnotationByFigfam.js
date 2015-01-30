

function KmerAnnotationByFigfam(url, auth, auth_cb) {

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
        _url = "http://10.0.16.184:7105";
    }
    var _auth = auth ? auth : { 'token' : '', 'user_id' : ''};
    var _auth_cb = auth_cb;


    this.get_dataset_names = function (_callback, _errorCallback) {
    return json_call_ajax("KmerAnnotationByFigfam.get_dataset_names",
        [], 1, _callback, _errorCallback);
};

    this.get_dataset_names_async = function (_callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KmerAnnotationByFigfam.get_dataset_names", [], 1, _callback, _error_callback);
    };

    this.get_default_dataset_name = function (_callback, _errorCallback) {
    return json_call_ajax("KmerAnnotationByFigfam.get_default_dataset_name",
        [], 1, _callback, _errorCallback);
};

    this.get_default_dataset_name_async = function (_callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KmerAnnotationByFigfam.get_default_dataset_name", [], 1, _callback, _error_callback);
    };

    this.annotate_proteins = function (proteins, params, _callback, _errorCallback) {
    return json_call_ajax("KmerAnnotationByFigfam.annotate_proteins",
        [proteins, params], 1, _callback, _errorCallback);
};

    this.annotate_proteins_async = function (proteins, params, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KmerAnnotationByFigfam.annotate_proteins", [proteins, params], 1, _callback, _error_callback);
    };

    this.annotate_proteins_fasta = function (protein_fasta, params, _callback, _errorCallback) {
    return json_call_ajax("KmerAnnotationByFigfam.annotate_proteins_fasta",
        [protein_fasta, params], 1, _callback, _errorCallback);
};

    this.annotate_proteins_fasta_async = function (protein_fasta, params, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KmerAnnotationByFigfam.annotate_proteins_fasta", [protein_fasta, params], 1, _callback, _error_callback);
    };

    this.call_genes_in_dna = function (dna, params, _callback, _errorCallback) {
    return json_call_ajax("KmerAnnotationByFigfam.call_genes_in_dna",
        [dna, params], 1, _callback, _errorCallback);
};

    this.call_genes_in_dna_async = function (dna, params, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KmerAnnotationByFigfam.call_genes_in_dna", [dna, params], 1, _callback, _error_callback);
    };

    this.estimate_closest_genomes = function (proteins, dataset_name, _callback, _errorCallback) {
    return json_call_ajax("KmerAnnotationByFigfam.estimate_closest_genomes",
        [proteins, dataset_name], 1, _callback, _errorCallback);
};

    this.estimate_closest_genomes_async = function (proteins, dataset_name, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KmerAnnotationByFigfam.estimate_closest_genomes", [proteins, dataset_name], 1, _callback, _error_callback);
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



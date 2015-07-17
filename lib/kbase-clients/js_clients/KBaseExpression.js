

function KBaseExpression(url, auth, auth_cb) {

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


    this.get_expression_samples_data = function (sample_ids, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_samples_data",
        [sample_ids], 1, _callback, _errorCallback);
};

    this.get_expression_samples_data_async = function (sample_ids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_samples_data", [sample_ids], 1, _callback, _error_callback);
    };

    this.get_expression_data_by_samples_and_features = function (sample_ids, feature_ids, numerical_interpretation, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_data_by_samples_and_features",
        [sample_ids, feature_ids, numerical_interpretation], 1, _callback, _errorCallback);
};

    this.get_expression_data_by_samples_and_features_async = function (sample_ids, feature_ids, numerical_interpretation, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_data_by_samples_and_features", [sample_ids, feature_ids, numerical_interpretation], 1, _callback, _error_callback);
    };

    this.get_expression_samples_data_by_series_ids = function (series_ids, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_samples_data_by_series_ids",
        [series_ids], 1, _callback, _errorCallback);
};

    this.get_expression_samples_data_by_series_ids_async = function (series_ids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_samples_data_by_series_ids", [series_ids], 1, _callback, _error_callback);
    };

    this.get_expression_sample_ids_by_series_ids = function (series_ids, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_sample_ids_by_series_ids",
        [series_ids], 1, _callback, _errorCallback);
};

    this.get_expression_sample_ids_by_series_ids_async = function (series_ids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_sample_ids_by_series_ids", [series_ids], 1, _callback, _error_callback);
    };

    this.get_expression_samples_data_by_experimental_unit_ids = function (experimental_unit_ids, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_samples_data_by_experimental_unit_ids",
        [experimental_unit_ids], 1, _callback, _errorCallback);
};

    this.get_expression_samples_data_by_experimental_unit_ids_async = function (experimental_unit_ids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_samples_data_by_experimental_unit_ids", [experimental_unit_ids], 1, _callback, _error_callback);
    };

    this.get_expression_sample_ids_by_experimental_unit_ids = function (experimental_unit_ids, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_sample_ids_by_experimental_unit_ids",
        [experimental_unit_ids], 1, _callback, _errorCallback);
};

    this.get_expression_sample_ids_by_experimental_unit_ids_async = function (experimental_unit_ids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_sample_ids_by_experimental_unit_ids", [experimental_unit_ids], 1, _callback, _error_callback);
    };

    this.get_expression_samples_data_by_experiment_meta_ids = function (experiment_meta_ids, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_samples_data_by_experiment_meta_ids",
        [experiment_meta_ids], 1, _callback, _errorCallback);
};

    this.get_expression_samples_data_by_experiment_meta_ids_async = function (experiment_meta_ids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_samples_data_by_experiment_meta_ids", [experiment_meta_ids], 1, _callback, _error_callback);
    };

    this.get_expression_sample_ids_by_experiment_meta_ids = function (experiment_meta_ids, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_sample_ids_by_experiment_meta_ids",
        [experiment_meta_ids], 1, _callback, _errorCallback);
};

    this.get_expression_sample_ids_by_experiment_meta_ids_async = function (experiment_meta_ids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_sample_ids_by_experiment_meta_ids", [experiment_meta_ids], 1, _callback, _error_callback);
    };

    this.get_expression_samples_data_by_strain_ids = function (strain_ids, sample_type, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_samples_data_by_strain_ids",
        [strain_ids, sample_type], 1, _callback, _errorCallback);
};

    this.get_expression_samples_data_by_strain_ids_async = function (strain_ids, sample_type, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_samples_data_by_strain_ids", [strain_ids, sample_type], 1, _callback, _error_callback);
    };

    this.get_expression_sample_ids_by_strain_ids = function (strain_ids, sample_type, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_sample_ids_by_strain_ids",
        [strain_ids, sample_type], 1, _callback, _errorCallback);
};

    this.get_expression_sample_ids_by_strain_ids_async = function (strain_ids, sample_type, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_sample_ids_by_strain_ids", [strain_ids, sample_type], 1, _callback, _error_callback);
    };

    this.get_expression_samples_data_by_genome_ids = function (genome_ids, sample_type, wild_type_only, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_samples_data_by_genome_ids",
        [genome_ids, sample_type, wild_type_only], 1, _callback, _errorCallback);
};

    this.get_expression_samples_data_by_genome_ids_async = function (genome_ids, sample_type, wild_type_only, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_samples_data_by_genome_ids", [genome_ids, sample_type, wild_type_only], 1, _callback, _error_callback);
    };

    this.get_expression_sample_ids_by_genome_ids = function (genome_ids, sample_type, wild_type_only, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_sample_ids_by_genome_ids",
        [genome_ids, sample_type, wild_type_only], 1, _callback, _errorCallback);
};

    this.get_expression_sample_ids_by_genome_ids_async = function (genome_ids, sample_type, wild_type_only, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_sample_ids_by_genome_ids", [genome_ids, sample_type, wild_type_only], 1, _callback, _error_callback);
    };

    this.get_expression_samples_data_by_ontology_ids = function (ontology_ids, and_or, genome_id, sample_type, wild_type_only, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_samples_data_by_ontology_ids",
        [ontology_ids, and_or, genome_id, sample_type, wild_type_only], 1, _callback, _errorCallback);
};

    this.get_expression_samples_data_by_ontology_ids_async = function (ontology_ids, and_or, genome_id, sample_type, wild_type_only, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_samples_data_by_ontology_ids", [ontology_ids, and_or, genome_id, sample_type, wild_type_only], 1, _callback, _error_callback);
    };

    this.get_expression_sample_ids_by_ontology_ids = function (ontology_ids, and_or, genome_id, sample_type, wild_type_only, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_sample_ids_by_ontology_ids",
        [ontology_ids, and_or, genome_id, sample_type, wild_type_only], 1, _callback, _errorCallback);
};

    this.get_expression_sample_ids_by_ontology_ids_async = function (ontology_ids, and_or, genome_id, sample_type, wild_type_only, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_sample_ids_by_ontology_ids", [ontology_ids, and_or, genome_id, sample_type, wild_type_only], 1, _callback, _error_callback);
    };

    this.get_expression_data_by_feature_ids = function (feature_ids, sample_type, wild_type_only, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_data_by_feature_ids",
        [feature_ids, sample_type, wild_type_only], 1, _callback, _errorCallback);
};

    this.get_expression_data_by_feature_ids_async = function (feature_ids, sample_type, wild_type_only, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_data_by_feature_ids", [feature_ids, sample_type, wild_type_only], 1, _callback, _error_callback);
    };

    this.compare_samples = function (numerators_data_mapping, denominators_data_mapping, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.compare_samples",
        [numerators_data_mapping, denominators_data_mapping], 1, _callback, _errorCallback);
};

    this.compare_samples_async = function (numerators_data_mapping, denominators_data_mapping, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.compare_samples", [numerators_data_mapping, denominators_data_mapping], 1, _callback, _error_callback);
    };

    this.compare_samples_vs_default_controls = function (numerator_sample_ids, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.compare_samples_vs_default_controls",
        [numerator_sample_ids], 1, _callback, _errorCallback);
};

    this.compare_samples_vs_default_controls_async = function (numerator_sample_ids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.compare_samples_vs_default_controls", [numerator_sample_ids], 1, _callback, _error_callback);
    };

    this.compare_samples_vs_the_average = function (numerator_sample_ids, denominator_sample_ids, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.compare_samples_vs_the_average",
        [numerator_sample_ids, denominator_sample_ids], 1, _callback, _errorCallback);
};

    this.compare_samples_vs_the_average_async = function (numerator_sample_ids, denominator_sample_ids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.compare_samples_vs_the_average", [numerator_sample_ids, denominator_sample_ids], 1, _callback, _error_callback);
    };

    this.get_on_off_calls = function (sample_comparison_mapping, off_threshold, on_threshold, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_on_off_calls",
        [sample_comparison_mapping, off_threshold, on_threshold], 1, _callback, _errorCallback);
};

    this.get_on_off_calls_async = function (sample_comparison_mapping, off_threshold, on_threshold, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_on_off_calls", [sample_comparison_mapping, off_threshold, on_threshold], 1, _callback, _error_callback);
    };

    this.get_top_changers = function (sample_comparison_mapping, direction, count, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_top_changers",
        [sample_comparison_mapping, direction, count], 1, _callback, _errorCallback);
};

    this.get_top_changers_async = function (sample_comparison_mapping, direction, count, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_top_changers", [sample_comparison_mapping, direction, count], 1, _callback, _error_callback);
    };

    this.get_expression_samples_titles = function (sample_ids, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_samples_titles",
        [sample_ids], 1, _callback, _errorCallback);
};

    this.get_expression_samples_titles_async = function (sample_ids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_samples_titles", [sample_ids], 1, _callback, _error_callback);
    };

    this.get_expression_samples_descriptions = function (sample_ids, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_samples_descriptions",
        [sample_ids], 1, _callback, _errorCallback);
};

    this.get_expression_samples_descriptions_async = function (sample_ids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_samples_descriptions", [sample_ids], 1, _callback, _error_callback);
    };

    this.get_expression_samples_molecules = function (sample_ids, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_samples_molecules",
        [sample_ids], 1, _callback, _errorCallback);
};

    this.get_expression_samples_molecules_async = function (sample_ids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_samples_molecules", [sample_ids], 1, _callback, _error_callback);
    };

    this.get_expression_samples_types = function (sample_ids, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_samples_types",
        [sample_ids], 1, _callback, _errorCallback);
};

    this.get_expression_samples_types_async = function (sample_ids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_samples_types", [sample_ids], 1, _callback, _error_callback);
    };

    this.get_expression_samples_external_source_ids = function (sample_ids, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_samples_external_source_ids",
        [sample_ids], 1, _callback, _errorCallback);
};

    this.get_expression_samples_external_source_ids_async = function (sample_ids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_samples_external_source_ids", [sample_ids], 1, _callback, _error_callback);
    };

    this.get_expression_samples_original_log2_medians = function (sample_ids, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_samples_original_log2_medians",
        [sample_ids], 1, _callback, _errorCallback);
};

    this.get_expression_samples_original_log2_medians_async = function (sample_ids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_samples_original_log2_medians", [sample_ids], 1, _callback, _error_callback);
    };

    this.get_expression_series_titles = function (series_ids, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_series_titles",
        [series_ids], 1, _callback, _errorCallback);
};

    this.get_expression_series_titles_async = function (series_ids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_series_titles", [series_ids], 1, _callback, _error_callback);
    };

    this.get_expression_series_summaries = function (series_ids, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_series_summaries",
        [series_ids], 1, _callback, _errorCallback);
};

    this.get_expression_series_summaries_async = function (series_ids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_series_summaries", [series_ids], 1, _callback, _error_callback);
    };

    this.get_expression_series_designs = function (series_ids, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_series_designs",
        [series_ids], 1, _callback, _errorCallback);
};

    this.get_expression_series_designs_async = function (series_ids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_series_designs", [series_ids], 1, _callback, _error_callback);
    };

    this.get_expression_series_external_source_ids = function (series_ids, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_series_external_source_ids",
        [series_ids], 1, _callback, _errorCallback);
};

    this.get_expression_series_external_source_ids_async = function (series_ids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_series_external_source_ids", [series_ids], 1, _callback, _error_callback);
    };

    this.get_expression_sample_ids_by_sample_external_source_ids = function (external_source_ids, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_sample_ids_by_sample_external_source_ids",
        [external_source_ids], 1, _callback, _errorCallback);
};

    this.get_expression_sample_ids_by_sample_external_source_ids_async = function (external_source_ids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_sample_ids_by_sample_external_source_ids", [external_source_ids], 1, _callback, _error_callback);
    };

    this.get_expression_sample_ids_by_platform_external_source_ids = function (external_source_ids, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_sample_ids_by_platform_external_source_ids",
        [external_source_ids], 1, _callback, _errorCallback);
};

    this.get_expression_sample_ids_by_platform_external_source_ids_async = function (external_source_ids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_sample_ids_by_platform_external_source_ids", [external_source_ids], 1, _callback, _error_callback);
    };

    this.get_expression_series_ids_by_series_external_source_ids = function (external_source_ids, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_series_ids_by_series_external_source_ids",
        [external_source_ids], 1, _callback, _errorCallback);
};

    this.get_expression_series_ids_by_series_external_source_ids_async = function (external_source_ids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_series_ids_by_series_external_source_ids", [external_source_ids], 1, _callback, _error_callback);
    };

    this.get_GEO_GSE = function (gse_input_id, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_GEO_GSE",
        [gse_input_id], 1, _callback, _errorCallback);
};

    this.get_GEO_GSE_async = function (gse_input_id, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_GEO_GSE", [gse_input_id], 1, _callback, _error_callback);
    };

    this.get_expression_float_data_table_by_samples_and_features = function (sample_ids, feature_ids, numerical_interpretation, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_float_data_table_by_samples_and_features",
        [sample_ids, feature_ids, numerical_interpretation], 1, _callback, _errorCallback);
};

    this.get_expression_float_data_table_by_samples_and_features_async = function (sample_ids, feature_ids, numerical_interpretation, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_float_data_table_by_samples_and_features", [sample_ids, feature_ids, numerical_interpretation], 1, _callback, _error_callback);
    };

    this.get_expression_float_data_table_by_genome = function (genome_id, numerical_interpretation, _callback, _errorCallback) {
    return json_call_ajax("KBaseExpression.get_expression_float_data_table_by_genome",
        [genome_id, numerical_interpretation], 1, _callback, _errorCallback);
};

    this.get_expression_float_data_table_by_genome_async = function (genome_id, numerical_interpretation, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("KBaseExpression.get_expression_float_data_table_by_genome", [genome_id, numerical_interpretation], 1, _callback, _error_callback);
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



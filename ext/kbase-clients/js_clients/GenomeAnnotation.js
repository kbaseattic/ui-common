

function GenomeAnnotation(url, auth, auth_cb) {

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
        _url = "https://kbase.us/services/genome_annotation";
    }
    var _auth = auth ? auth : { 'token' : '', 'user_id' : ''};
    var _auth_cb = auth_cb;


    this.genome_ids_to_genomes = function (ids, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.genome_ids_to_genomes",
        [ids], 1, _callback, _errorCallback);
};

    this.genome_ids_to_genomes_async = function (ids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.genome_ids_to_genomes", [ids], 1, _callback, _error_callback);
    };

    this.create_genome = function (metadata, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.create_genome",
        [metadata], 1, _callback, _errorCallback);
};

    this.create_genome_async = function (metadata, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.create_genome", [metadata], 1, _callback, _error_callback);
    };

    this.create_genome_from_SEED = function (genome_id, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.create_genome_from_SEED",
        [genome_id], 1, _callback, _errorCallback);
};

    this.create_genome_from_SEED_async = function (genome_id, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.create_genome_from_SEED", [genome_id], 1, _callback, _error_callback);
    };

    this.create_genome_from_RAST = function (genome_or_job_id, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.create_genome_from_RAST",
        [genome_or_job_id], 1, _callback, _errorCallback);
};

    this.create_genome_from_RAST_async = function (genome_or_job_id, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.create_genome_from_RAST", [genome_or_job_id], 1, _callback, _error_callback);
    };

    this.set_metadata = function (genome_in, metadata, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.set_metadata",
        [genome_in, metadata], 1, _callback, _errorCallback);
};

    this.set_metadata_async = function (genome_in, metadata, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.set_metadata", [genome_in, metadata], 1, _callback, _error_callback);
    };

    this.add_contigs = function (genome_in, contigs, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.add_contigs",
        [genome_in, contigs], 1, _callback, _errorCallback);
};

    this.add_contigs_async = function (genome_in, contigs, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.add_contigs", [genome_in, contigs], 1, _callback, _error_callback);
    };

    this.add_contigs_from_handle = function (genome_in, contigs, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.add_contigs_from_handle",
        [genome_in, contigs], 1, _callback, _errorCallback);
};

    this.add_contigs_from_handle_async = function (genome_in, contigs, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.add_contigs_from_handle", [genome_in, contigs], 1, _callback, _error_callback);
    };

    this.add_features = function (genome_in, features, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.add_features",
        [genome_in, features], 1, _callback, _errorCallback);
};

    this.add_features_async = function (genome_in, features, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.add_features", [genome_in, features], 1, _callback, _error_callback);
    };

    this.genomeTO_to_reconstructionTO = function (genomeTO, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.genomeTO_to_reconstructionTO",
        [genomeTO], 1, _callback, _errorCallback);
};

    this.genomeTO_to_reconstructionTO_async = function (genomeTO, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.genomeTO_to_reconstructionTO", [genomeTO], 1, _callback, _error_callback);
    };

    this.genomeTO_to_feature_data = function (genomeTO, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.genomeTO_to_feature_data",
        [genomeTO], 1, _callback, _errorCallback);
};

    this.genomeTO_to_feature_data_async = function (genomeTO, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.genomeTO_to_feature_data", [genomeTO], 1, _callback, _error_callback);
    };

    this.reconstructionTO_to_roles = function (reconstructionTO, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.reconstructionTO_to_roles",
        [reconstructionTO], 1, _callback, _errorCallback);
};

    this.reconstructionTO_to_roles_async = function (reconstructionTO, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.reconstructionTO_to_roles", [reconstructionTO], 1, _callback, _error_callback);
    };

    this.reconstructionTO_to_subsystems = function (reconstructionTO, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.reconstructionTO_to_subsystems",
        [reconstructionTO], 1, _callback, _errorCallback);
};

    this.reconstructionTO_to_subsystems_async = function (reconstructionTO, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.reconstructionTO_to_subsystems", [reconstructionTO], 1, _callback, _error_callback);
    };

    this.assign_functions_to_CDSs = function (genomeTO, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.assign_functions_to_CDSs",
        [genomeTO], 1, _callback, _errorCallback);
};

    this.assign_functions_to_CDSs_async = function (genomeTO, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.assign_functions_to_CDSs", [genomeTO], 1, _callback, _error_callback);
    };

    this.annotate_genome = function (genomeTO, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.annotate_genome",
        [genomeTO], 1, _callback, _errorCallback);
};

    this.annotate_genome_async = function (genomeTO, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.annotate_genome", [genomeTO], 1, _callback, _error_callback);
    };

    this.call_selenoproteins = function (genomeTO, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.call_selenoproteins",
        [genomeTO], 1, _callback, _errorCallback);
};

    this.call_selenoproteins_async = function (genomeTO, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.call_selenoproteins", [genomeTO], 1, _callback, _error_callback);
    };

    this.call_pyrrolysoproteins = function (genomeTO, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.call_pyrrolysoproteins",
        [genomeTO], 1, _callback, _errorCallback);
};

    this.call_pyrrolysoproteins_async = function (genomeTO, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.call_pyrrolysoproteins", [genomeTO], 1, _callback, _error_callback);
    };

    this.call_features_selenoprotein = function (genomeTO, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.call_features_selenoprotein",
        [genomeTO], 1, _callback, _errorCallback);
};

    this.call_features_selenoprotein_async = function (genomeTO, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.call_features_selenoprotein", [genomeTO], 1, _callback, _error_callback);
    };

    this.call_features_pyrrolysoprotein = function (genomeTO, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.call_features_pyrrolysoprotein",
        [genomeTO], 1, _callback, _errorCallback);
};

    this.call_features_pyrrolysoprotein_async = function (genomeTO, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.call_features_pyrrolysoprotein", [genomeTO], 1, _callback, _error_callback);
    };

    this.call_features_insertion_sequences = function (genomeTO, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.call_features_insertion_sequences",
        [genomeTO], 1, _callback, _errorCallback);
};

    this.call_features_insertion_sequences_async = function (genomeTO, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.call_features_insertion_sequences", [genomeTO], 1, _callback, _error_callback);
    };

    this.call_features_rRNA_SEED = function (genome_in, types, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.call_features_rRNA_SEED",
        [genome_in, types], 1, _callback, _errorCallback);
};

    this.call_features_rRNA_SEED_async = function (genome_in, types, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.call_features_rRNA_SEED", [genome_in, types], 1, _callback, _error_callback);
    };

    this.call_features_tRNA_trnascan = function (genome_in, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.call_features_tRNA_trnascan",
        [genome_in], 1, _callback, _errorCallback);
};

    this.call_features_tRNA_trnascan_async = function (genome_in, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.call_features_tRNA_trnascan", [genome_in], 1, _callback, _error_callback);
    };

    this.call_RNAs = function (genome_in, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.call_RNAs",
        [genome_in], 1, _callback, _errorCallback);
};

    this.call_RNAs_async = function (genome_in, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.call_RNAs", [genome_in], 1, _callback, _error_callback);
    };

    this.call_features_CDS_glimmer3 = function (genomeTO, params, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.call_features_CDS_glimmer3",
        [genomeTO, params], 1, _callback, _errorCallback);
};

    this.call_features_CDS_glimmer3_async = function (genomeTO, params, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.call_features_CDS_glimmer3", [genomeTO, params], 1, _callback, _error_callback);
    };

    this.call_features_CDS_prodigal = function (genomeTO, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.call_features_CDS_prodigal",
        [genomeTO], 1, _callback, _errorCallback);
};

    this.call_features_CDS_prodigal_async = function (genomeTO, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.call_features_CDS_prodigal", [genomeTO], 1, _callback, _error_callback);
    };

    this.call_features_CDS_genemark = function (genomeTO, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.call_features_CDS_genemark",
        [genomeTO], 1, _callback, _errorCallback);
};

    this.call_features_CDS_genemark_async = function (genomeTO, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.call_features_CDS_genemark", [genomeTO], 1, _callback, _error_callback);
    };

    this.call_features_CDS_SEED_projection = function (genomeTO, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.call_features_CDS_SEED_projection",
        [genomeTO], 1, _callback, _errorCallback);
};

    this.call_features_CDS_SEED_projection_async = function (genomeTO, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.call_features_CDS_SEED_projection", [genomeTO], 1, _callback, _error_callback);
    };

    this.call_features_CDS_FragGeneScan = function (genomeTO, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.call_features_CDS_FragGeneScan",
        [genomeTO], 1, _callback, _errorCallback);
};

    this.call_features_CDS_FragGeneScan_async = function (genomeTO, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.call_features_CDS_FragGeneScan", [genomeTO], 1, _callback, _error_callback);
    };

    this.call_features_repeat_region_SEED = function (genome_in, params, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.call_features_repeat_region_SEED",
        [genome_in, params], 1, _callback, _errorCallback);
};

    this.call_features_repeat_region_SEED_async = function (genome_in, params, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.call_features_repeat_region_SEED", [genome_in, params], 1, _callback, _error_callback);
    };

    this.call_features_prophage_phispy = function (genome_in, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.call_features_prophage_phispy",
        [genome_in], 1, _callback, _errorCallback);
};

    this.call_features_prophage_phispy_async = function (genome_in, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.call_features_prophage_phispy", [genome_in], 1, _callback, _error_callback);
    };

    this.call_features_scan_for_matches = function (genome_in, pattern, feature_type, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.call_features_scan_for_matches",
        [genome_in, pattern, feature_type], 1, _callback, _errorCallback);
};

    this.call_features_scan_for_matches_async = function (genome_in, pattern, feature_type, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.call_features_scan_for_matches", [genome_in, pattern, feature_type], 1, _callback, _error_callback);
    };

    this.annotate_proteins_similarity = function (genomeTO, params, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.annotate_proteins_similarity",
        [genomeTO, params], 1, _callback, _errorCallback);
};

    this.annotate_proteins_similarity_async = function (genomeTO, params, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.annotate_proteins_similarity", [genomeTO, params], 1, _callback, _error_callback);
    };

    this.annotate_proteins_kmer_v1 = function (genomeTO, params, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.annotate_proteins_kmer_v1",
        [genomeTO, params], 1, _callback, _errorCallback);
};

    this.annotate_proteins_kmer_v1_async = function (genomeTO, params, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.annotate_proteins_kmer_v1", [genomeTO, params], 1, _callback, _error_callback);
    };

    this.annotate_proteins_kmer_v2 = function (genome_in, params, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.annotate_proteins_kmer_v2",
        [genome_in, params], 1, _callback, _errorCallback);
};

    this.annotate_proteins_kmer_v2_async = function (genome_in, params, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.annotate_proteins_kmer_v2", [genome_in, params], 1, _callback, _error_callback);
    };

    this.resolve_overlapping_features = function (genome_in, params, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.resolve_overlapping_features",
        [genome_in, params], 1, _callback, _errorCallback);
};

    this.resolve_overlapping_features_async = function (genome_in, params, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.resolve_overlapping_features", [genome_in, params], 1, _callback, _error_callback);
    };

    this.call_features_ProtoCDS_kmer_v1 = function (genomeTO, params, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.call_features_ProtoCDS_kmer_v1",
        [genomeTO, params], 1, _callback, _errorCallback);
};

    this.call_features_ProtoCDS_kmer_v1_async = function (genomeTO, params, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.call_features_ProtoCDS_kmer_v1", [genomeTO, params], 1, _callback, _error_callback);
    };

    this.call_features_ProtoCDS_kmer_v2 = function (genome_in, params, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.call_features_ProtoCDS_kmer_v2",
        [genome_in, params], 1, _callback, _errorCallback);
};

    this.call_features_ProtoCDS_kmer_v2_async = function (genome_in, params, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.call_features_ProtoCDS_kmer_v2", [genome_in, params], 1, _callback, _error_callback);
    };

    this.enumerate_special_protein_databases = function (_callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.enumerate_special_protein_databases",
        [], 1, _callback, _errorCallback);
};

    this.enumerate_special_protein_databases_async = function (_callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.enumerate_special_protein_databases", [], 1, _callback, _error_callback);
    };

    this.compute_special_proteins = function (genome_in, database_names, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.compute_special_proteins",
        [genome_in, database_names], 1, _callback, _errorCallback);
};

    this.compute_special_proteins_async = function (genome_in, database_names, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.compute_special_proteins", [genome_in, database_names], 1, _callback, _error_callback);
    };

    this.compute_cdd = function (genome_in, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.compute_cdd",
        [genome_in], 1, _callback, _errorCallback);
};

    this.compute_cdd_async = function (genome_in, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.compute_cdd", [genome_in], 1, _callback, _error_callback);
    };

    this.annotate_proteins = function (genomeTO, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.annotate_proteins",
        [genomeTO], 1, _callback, _errorCallback);
};

    this.annotate_proteins_async = function (genomeTO, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.annotate_proteins", [genomeTO], 1, _callback, _error_callback);
    };

    this.estimate_crude_phylogenetic_position_kmer = function (genomeTO, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.estimate_crude_phylogenetic_position_kmer",
        [genomeTO], 1, _callback, _errorCallback);
};

    this.estimate_crude_phylogenetic_position_kmer_async = function (genomeTO, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.estimate_crude_phylogenetic_position_kmer", [genomeTO], 1, _callback, _error_callback);
    };

    this.find_close_neighbors = function (genomeTO, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.find_close_neighbors",
        [genomeTO], 1, _callback, _errorCallback);
};

    this.find_close_neighbors_async = function (genomeTO, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.find_close_neighbors", [genomeTO], 1, _callback, _error_callback);
    };

    this.call_features_strep_suis_repeat = function (genomeTO, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.call_features_strep_suis_repeat",
        [genomeTO], 1, _callback, _errorCallback);
};

    this.call_features_strep_suis_repeat_async = function (genomeTO, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.call_features_strep_suis_repeat", [genomeTO], 1, _callback, _error_callback);
    };

    this.call_features_strep_pneumo_repeat = function (genomeTO, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.call_features_strep_pneumo_repeat",
        [genomeTO], 1, _callback, _errorCallback);
};

    this.call_features_strep_pneumo_repeat_async = function (genomeTO, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.call_features_strep_pneumo_repeat", [genomeTO], 1, _callback, _error_callback);
    };

    this.call_features_crispr = function (genome_in, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.call_features_crispr",
        [genome_in], 1, _callback, _errorCallback);
};

    this.call_features_crispr_async = function (genome_in, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.call_features_crispr", [genome_in], 1, _callback, _error_callback);
    };

    this.update_functions = function (genome_in, functions, event, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.update_functions",
        [genome_in, functions, event], 1, _callback, _errorCallback);
};

    this.update_functions_async = function (genome_in, functions, event, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.update_functions", [genome_in, functions, event], 1, _callback, _error_callback);
    };

    this.renumber_features = function (genome_in, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.renumber_features",
        [genome_in], 1, _callback, _errorCallback);
};

    this.renumber_features_async = function (genome_in, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.renumber_features", [genome_in], 1, _callback, _error_callback);
    };

    this.export_genome = function (genome_in, format, feature_types, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.export_genome",
        [genome_in, format, feature_types], 1, _callback, _errorCallback);
};

    this.export_genome_async = function (genome_in, format, feature_types, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.export_genome", [genome_in, format, feature_types], 1, _callback, _error_callback);
    };

    this.enumerate_classifiers = function (_callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.enumerate_classifiers",
        [], 1, _callback, _errorCallback);
};

    this.enumerate_classifiers_async = function (_callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.enumerate_classifiers", [], 1, _callback, _error_callback);
    };

    this.query_classifier_groups = function (classifier, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.query_classifier_groups",
        [classifier], 1, _callback, _errorCallback);
};

    this.query_classifier_groups_async = function (classifier, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.query_classifier_groups", [classifier], 1, _callback, _error_callback);
    };

    this.query_classifier_taxonomies = function (classifier, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.query_classifier_taxonomies",
        [classifier], 1, _callback, _errorCallback);
};

    this.query_classifier_taxonomies_async = function (classifier, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.query_classifier_taxonomies", [classifier], 1, _callback, _error_callback);
    };

    this.classify_into_bins = function (classifier, dna_input, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.classify_into_bins",
        [classifier, dna_input], 1, _callback, _errorCallback);
};

    this.classify_into_bins_async = function (classifier, dna_input, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.classify_into_bins", [classifier, dna_input], 1, _callback, _error_callback);
    };

    this.classify_full = function (classifier, dna_input, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.classify_full",
        [classifier, dna_input], 3, _callback, _errorCallback);
};

    this.classify_full_async = function (classifier, dna_input, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.classify_full", [classifier, dna_input], 3, _callback, _error_callback);
    };

    this.default_workflow = function (_callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.default_workflow",
        [], 1, _callback, _errorCallback);
};

    this.default_workflow_async = function (_callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.default_workflow", [], 1, _callback, _error_callback);
    };

    this.complete_workflow_template = function (_callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.complete_workflow_template",
        [], 1, _callback, _errorCallback);
};

    this.complete_workflow_template_async = function (_callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.complete_workflow_template", [], 1, _callback, _error_callback);
    };

    this.run_pipeline = function (genome_in, workflow, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.run_pipeline",
        [genome_in, workflow], 1, _callback, _errorCallback);
};

    this.run_pipeline_async = function (genome_in, workflow, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.run_pipeline", [genome_in, workflow], 1, _callback, _error_callback);
    };

    this.pipeline_batch_start = function (genomes, workflow, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.pipeline_batch_start",
        [genomes, workflow], 1, _callback, _errorCallback);
};

    this.pipeline_batch_start_async = function (genomes, workflow, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.pipeline_batch_start", [genomes, workflow], 1, _callback, _error_callback);
    };

    this.pipeline_batch_status = function (batch_id, _callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.pipeline_batch_status",
        [batch_id], 1, _callback, _errorCallback);
};

    this.pipeline_batch_status_async = function (batch_id, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.pipeline_batch_status", [batch_id], 1, _callback, _error_callback);
    };

    this.pipeline_batch_enumerate_batches = function (_callback, _errorCallback) {
    return json_call_ajax("GenomeAnnotation.pipeline_batch_enumerate_batches",
        [], 1, _callback, _errorCallback);
};

    this.pipeline_batch_enumerate_batches_async = function (_callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("GenomeAnnotation.pipeline_batch_enumerate_batches", [], 1, _callback, _error_callback);
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



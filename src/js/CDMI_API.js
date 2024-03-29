/*


*/

define (
	[
		'kbwidget',
		'bootstrap',
		'jquery'
	], function(
		KBWidget,
		bootstrap,
		$
	) {

window.CDMI_API = function (url, auth, auth_cb) {

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
        _url = "http://kbase.us/services/cdmi_api";
    }
    var _auth = auth ? auth : { 'token' : '', 'user_id' : ''};
    var _auth_cb = auth_cb;


    this.fids_to_annotations = function (fids, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.fids_to_annotations",
        [fids], 1, _callback, _errorCallback);
};

    this.fids_to_annotations_async = function (fids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.fids_to_annotations", [fids], 1, _callback, _error_callback);
    };

    this.fids_to_functions = function (fids, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.fids_to_functions",
        [fids], 1, _callback, _errorCallback);
};

    this.fids_to_functions_async = function (fids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.fids_to_functions", [fids], 1, _callback, _error_callback);
    };

    this.fids_to_literature = function (fids, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.fids_to_literature",
        [fids], 1, _callback, _errorCallback);
};

    this.fids_to_literature_async = function (fids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.fids_to_literature", [fids], 1, _callback, _error_callback);
    };

    this.fids_to_protein_families = function (fids, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.fids_to_protein_families",
        [fids], 1, _callback, _errorCallback);
};

    this.fids_to_protein_families_async = function (fids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.fids_to_protein_families", [fids], 1, _callback, _error_callback);
    };

    this.fids_to_roles = function (fids, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.fids_to_roles",
        [fids], 1, _callback, _errorCallback);
};

    this.fids_to_roles_async = function (fids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.fids_to_roles", [fids], 1, _callback, _error_callback);
    };

    this.fids_to_subsystems = function (fids, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.fids_to_subsystems",
        [fids], 1, _callback, _errorCallback);
};

    this.fids_to_subsystems_async = function (fids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.fids_to_subsystems", [fids], 1, _callback, _error_callback);
    };

    this.fids_to_co_occurring_fids = function (fids, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.fids_to_co_occurring_fids",
        [fids], 1, _callback, _errorCallback);
};

    this.fids_to_co_occurring_fids_async = function (fids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.fids_to_co_occurring_fids", [fids], 1, _callback, _error_callback);
    };

    this.fids_to_locations = function (fids, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.fids_to_locations",
        [fids], 1, _callback, _errorCallback);
};

    this.fids_to_locations_async = function (fids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.fids_to_locations", [fids], 1, _callback, _error_callback);
    };

    this.locations_to_fids = function (region_of_dna_strings, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.locations_to_fids",
        [region_of_dna_strings], 1, _callback, _errorCallback);
};

    this.locations_to_fids_async = function (region_of_dna_strings, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.locations_to_fids", [region_of_dna_strings], 1, _callback, _error_callback);
    };

    this.alleles_to_bp_locs = function (alleles, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.alleles_to_bp_locs",
        [alleles], 1, _callback, _errorCallback);
};

    this.alleles_to_bp_locs_async = function (alleles, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.alleles_to_bp_locs", [alleles], 1, _callback, _error_callback);
    };

    this.region_to_fids = function (region_of_dna, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.region_to_fids",
        [region_of_dna], 1, _callback, _errorCallback);
};

    this.region_to_fids_async = function (region_of_dna, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.region_to_fids", [region_of_dna], 1, _callback, _error_callback);
    };

    this.region_to_alleles = function (region_of_dna, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.region_to_alleles",
        [region_of_dna], 1, _callback, _errorCallback);
};

    this.region_to_alleles_async = function (region_of_dna, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.region_to_alleles", [region_of_dna], 1, _callback, _error_callback);
    };

    this.alleles_to_traits = function (alleles, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.alleles_to_traits",
        [alleles], 1, _callback, _errorCallback);
};

    this.alleles_to_traits_async = function (alleles, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.alleles_to_traits", [alleles], 1, _callback, _error_callback);
    };

    this.traits_to_alleles = function (traits, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.traits_to_alleles",
        [traits], 1, _callback, _errorCallback);
};

    this.traits_to_alleles_async = function (traits, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.traits_to_alleles", [traits], 1, _callback, _error_callback);
    };

    this.ous_with_trait = function (genome, trait, measurement_type, min_value, max_value, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.ous_with_trait",
        [genome, trait, measurement_type, min_value, max_value], 1, _callback, _errorCallback);
};

    this.ous_with_trait_async = function (genome, trait, measurement_type, min_value, max_value, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.ous_with_trait", [genome, trait, measurement_type, min_value, max_value], 1, _callback, _error_callback);
    };

    this.locations_to_dna_sequences = function (locations, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.locations_to_dna_sequences",
        [locations], 1, _callback, _errorCallback);
};

    this.locations_to_dna_sequences_async = function (locations, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.locations_to_dna_sequences", [locations], 1, _callback, _error_callback);
    };

    this.proteins_to_fids = function (proteins, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.proteins_to_fids",
        [proteins], 1, _callback, _errorCallback);
};

    this.proteins_to_fids_async = function (proteins, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.proteins_to_fids", [proteins], 1, _callback, _error_callback);
    };

    this.proteins_to_protein_families = function (proteins, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.proteins_to_protein_families",
        [proteins], 1, _callback, _errorCallback);
};

    this.proteins_to_protein_families_async = function (proteins, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.proteins_to_protein_families", [proteins], 1, _callback, _error_callback);
    };

    this.proteins_to_literature = function (proteins, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.proteins_to_literature",
        [proteins], 1, _callback, _errorCallback);
};

    this.proteins_to_literature_async = function (proteins, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.proteins_to_literature", [proteins], 1, _callback, _error_callback);
    };

    this.proteins_to_functions = function (proteins, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.proteins_to_functions",
        [proteins], 1, _callback, _errorCallback);
};

    this.proteins_to_functions_async = function (proteins, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.proteins_to_functions", [proteins], 1, _callback, _error_callback);
    };

    this.proteins_to_roles = function (proteins, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.proteins_to_roles",
        [proteins], 1, _callback, _errorCallback);
};

    this.proteins_to_roles_async = function (proteins, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.proteins_to_roles", [proteins], 1, _callback, _error_callback);
    };

    this.roles_to_proteins = function (roles, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.roles_to_proteins",
        [roles], 1, _callback, _errorCallback);
};

    this.roles_to_proteins_async = function (roles, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.roles_to_proteins", [roles], 1, _callback, _error_callback);
    };

    this.roles_to_subsystems = function (roles, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.roles_to_subsystems",
        [roles], 1, _callback, _errorCallback);
};

    this.roles_to_subsystems_async = function (roles, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.roles_to_subsystems", [roles], 1, _callback, _error_callback);
    };

    this.roles_to_protein_families = function (roles, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.roles_to_protein_families",
        [roles], 1, _callback, _errorCallback);
};

    this.roles_to_protein_families_async = function (roles, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.roles_to_protein_families", [roles], 1, _callback, _error_callback);
    };

    this.fids_to_coexpressed_fids = function (fids, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.fids_to_coexpressed_fids",
        [fids], 1, _callback, _errorCallback);
};

    this.fids_to_coexpressed_fids_async = function (fids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.fids_to_coexpressed_fids", [fids], 1, _callback, _error_callback);
    };

    this.protein_families_to_fids = function (protein_families, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.protein_families_to_fids",
        [protein_families], 1, _callback, _errorCallback);
};

    this.protein_families_to_fids_async = function (protein_families, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.protein_families_to_fids", [protein_families], 1, _callback, _error_callback);
    };

    this.protein_families_to_proteins = function (protein_families, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.protein_families_to_proteins",
        [protein_families], 1, _callback, _errorCallback);
};

    this.protein_families_to_proteins_async = function (protein_families, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.protein_families_to_proteins", [protein_families], 1, _callback, _error_callback);
    };

    this.protein_families_to_functions = function (protein_families, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.protein_families_to_functions",
        [protein_families], 1, _callback, _errorCallback);
};

    this.protein_families_to_functions_async = function (protein_families, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.protein_families_to_functions", [protein_families], 1, _callback, _error_callback);
    };

    this.protein_families_to_co_occurring_families = function (protein_families, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.protein_families_to_co_occurring_families",
        [protein_families], 1, _callback, _errorCallback);
};

    this.protein_families_to_co_occurring_families_async = function (protein_families, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.protein_families_to_co_occurring_families", [protein_families], 1, _callback, _error_callback);
    };

    this.co_occurrence_evidence = function (pairs_of_fids, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.co_occurrence_evidence",
        [pairs_of_fids], 1, _callback, _errorCallback);
};

    this.co_occurrence_evidence_async = function (pairs_of_fids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.co_occurrence_evidence", [pairs_of_fids], 1, _callback, _error_callback);
    };

    this.contigs_to_sequences = function (contigs, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.contigs_to_sequences",
        [contigs], 1, _callback, _errorCallback);
};

    this.contigs_to_sequences_async = function (contigs, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.contigs_to_sequences", [contigs], 1, _callback, _error_callback);
    };

    this.contigs_to_lengths = function (contigs, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.contigs_to_lengths",
        [contigs], 1, _callback, _errorCallback);
};

    this.contigs_to_lengths_async = function (contigs, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.contigs_to_lengths", [contigs], 1, _callback, _error_callback);
    };

    this.contigs_to_md5s = function (contigs, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.contigs_to_md5s",
        [contigs], 1, _callback, _errorCallback);
};

    this.contigs_to_md5s_async = function (contigs, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.contigs_to_md5s", [contigs], 1, _callback, _error_callback);
    };

    this.md5s_to_genomes = function (md5s, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.md5s_to_genomes",
        [md5s], 1, _callback, _errorCallback);
};

    this.md5s_to_genomes_async = function (md5s, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.md5s_to_genomes", [md5s], 1, _callback, _error_callback);
    };

    this.genomes_to_md5s = function (genomes, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.genomes_to_md5s",
        [genomes], 1, _callback, _errorCallback);
};

    this.genomes_to_md5s_async = function (genomes, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.genomes_to_md5s", [genomes], 1, _callback, _error_callback);
    };

    this.genomes_to_contigs = function (genomes, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.genomes_to_contigs",
        [genomes], 1, _callback, _errorCallback);
};

    this.genomes_to_contigs_async = function (genomes, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.genomes_to_contigs", [genomes], 1, _callback, _error_callback);
    };

    this.genomes_to_fids = function (genomes, types_of_fids, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.genomes_to_fids",
        [genomes, types_of_fids], 1, _callback, _errorCallback);
};

    this.genomes_to_fids_async = function (genomes, types_of_fids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.genomes_to_fids", [genomes, types_of_fids], 1, _callback, _error_callback);
    };

    this.genomes_to_taxonomies = function (genomes, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.genomes_to_taxonomies",
        [genomes], 1, _callback, _errorCallback);
};

    this.genomes_to_taxonomies_async = function (genomes, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.genomes_to_taxonomies", [genomes], 1, _callback, _error_callback);
    };

    this.genomes_to_subsystems = function (genomes, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.genomes_to_subsystems",
        [genomes], 1, _callback, _errorCallback);
};

    this.genomes_to_subsystems_async = function (genomes, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.genomes_to_subsystems", [genomes], 1, _callback, _error_callback);
    };

    this.subsystems_to_genomes = function (subsystems, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.subsystems_to_genomes",
        [subsystems], 1, _callback, _errorCallback);
};

    this.subsystems_to_genomes_async = function (subsystems, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.subsystems_to_genomes", [subsystems], 1, _callback, _error_callback);
    };

    this.subsystems_to_fids = function (subsystems, genomes, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.subsystems_to_fids",
        [subsystems, genomes], 1, _callback, _errorCallback);
};

    this.subsystems_to_fids_async = function (subsystems, genomes, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.subsystems_to_fids", [subsystems, genomes], 1, _callback, _error_callback);
    };

    this.subsystems_to_roles = function (subsystems, aux, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.subsystems_to_roles",
        [subsystems, aux], 1, _callback, _errorCallback);
};

    this.subsystems_to_roles_async = function (subsystems, aux, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.subsystems_to_roles", [subsystems, aux], 1, _callback, _error_callback);
    };

    this.subsystems_to_spreadsheets = function (subsystems, genomes, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.subsystems_to_spreadsheets",
        [subsystems, genomes], 1, _callback, _errorCallback);
};

    this.subsystems_to_spreadsheets_async = function (subsystems, genomes, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.subsystems_to_spreadsheets", [subsystems, genomes], 1, _callback, _error_callback);
    };

    this.all_roles_used_in_models = function (_callback, _errorCallback) {
    return json_call_ajax("CDMI_API.all_roles_used_in_models",
        [], 1, _callback, _errorCallback);
};

    this.all_roles_used_in_models_async = function (_callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.all_roles_used_in_models", [], 1, _callback, _error_callback);
    };

    this.complexes_to_complex_data = function (complexes, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.complexes_to_complex_data",
        [complexes], 1, _callback, _errorCallback);
};

    this.complexes_to_complex_data_async = function (complexes, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.complexes_to_complex_data", [complexes], 1, _callback, _error_callback);
    };

    this.genomes_to_genome_data = function (genomes, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.genomes_to_genome_data",
        [genomes], 1, _callback, _errorCallback);
};

    this.genomes_to_genome_data_async = function (genomes, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.genomes_to_genome_data", [genomes], 1, _callback, _error_callback);
    };

    this.fids_to_regulon_data = function (fids, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.fids_to_regulon_data",
        [fids], 1, _callback, _errorCallback);
};

    this.fids_to_regulon_data_async = function (fids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.fids_to_regulon_data", [fids], 1, _callback, _error_callback);
    };

    this.regulons_to_fids = function (regulons, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.regulons_to_fids",
        [regulons], 1, _callback, _errorCallback);
};

    this.regulons_to_fids_async = function (regulons, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.regulons_to_fids", [regulons], 1, _callback, _error_callback);
    };

    this.fids_to_feature_data = function (fids, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.fids_to_feature_data",
        [fids], 1, _callback, _errorCallback);
};

    this.fids_to_feature_data_async = function (fids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.fids_to_feature_data", [fids], 1, _callback, _error_callback);
    };

    this.equiv_sequence_assertions = function (proteins, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.equiv_sequence_assertions",
        [proteins], 1, _callback, _errorCallback);
};

    this.equiv_sequence_assertions_async = function (proteins, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.equiv_sequence_assertions", [proteins], 1, _callback, _error_callback);
    };

    this.fids_to_atomic_regulons = function (fids, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.fids_to_atomic_regulons",
        [fids], 1, _callback, _errorCallback);
};

    this.fids_to_atomic_regulons_async = function (fids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.fids_to_atomic_regulons", [fids], 1, _callback, _error_callback);
    };

    this.atomic_regulons_to_fids = function (atomic_regulons, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.atomic_regulons_to_fids",
        [atomic_regulons], 1, _callback, _errorCallback);
};

    this.atomic_regulons_to_fids_async = function (atomic_regulons, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.atomic_regulons_to_fids", [atomic_regulons], 1, _callback, _error_callback);
    };

    this.fids_to_protein_sequences = function (fids, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.fids_to_protein_sequences",
        [fids], 1, _callback, _errorCallback);
};

    this.fids_to_protein_sequences_async = function (fids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.fids_to_protein_sequences", [fids], 1, _callback, _error_callback);
    };

    this.fids_to_proteins = function (fids, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.fids_to_proteins",
        [fids], 1, _callback, _errorCallback);
};

    this.fids_to_proteins_async = function (fids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.fids_to_proteins", [fids], 1, _callback, _error_callback);
    };

    this.fids_to_dna_sequences = function (fids, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.fids_to_dna_sequences",
        [fids], 1, _callback, _errorCallback);
};

    this.fids_to_dna_sequences_async = function (fids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.fids_to_dna_sequences", [fids], 1, _callback, _error_callback);
    };

    this.roles_to_fids = function (roles, genomes, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.roles_to_fids",
        [roles, genomes], 1, _callback, _errorCallback);
};

    this.roles_to_fids_async = function (roles, genomes, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.roles_to_fids", [roles, genomes], 1, _callback, _error_callback);
    };

    this.reactions_to_complexes = function (reactions, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.reactions_to_complexes",
        [reactions], 1, _callback, _errorCallback);
};

    this.reactions_to_complexes_async = function (reactions, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.reactions_to_complexes", [reactions], 1, _callback, _error_callback);
    };

    this.aliases_to_fids = function (aliases, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.aliases_to_fids",
        [aliases], 1, _callback, _errorCallback);
};

    this.aliases_to_fids_async = function (aliases, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.aliases_to_fids", [aliases], 1, _callback, _error_callback);
    };

    this.aliases_to_fids_by_source = function (aliases, source, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.aliases_to_fids_by_source",
        [aliases, source], 1, _callback, _errorCallback);
};

    this.aliases_to_fids_by_source_async = function (aliases, source, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.aliases_to_fids_by_source", [aliases, source], 1, _callback, _error_callback);
    };

    this.source_ids_to_fids = function (aliases, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.source_ids_to_fids",
        [aliases], 1, _callback, _errorCallback);
};

    this.source_ids_to_fids_async = function (aliases, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.source_ids_to_fids", [aliases], 1, _callback, _error_callback);
    };

    this.external_ids_to_fids = function (external_ids, prefix_match, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.external_ids_to_fids",
        [external_ids, prefix_match], 1, _callback, _errorCallback);
};

    this.external_ids_to_fids_async = function (external_ids, prefix_match, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.external_ids_to_fids", [external_ids, prefix_match], 1, _callback, _error_callback);
    };

    this.reaction_strings = function (reactions, name_parameter, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.reaction_strings",
        [reactions, name_parameter], 1, _callback, _errorCallback);
};

    this.reaction_strings_async = function (reactions, name_parameter, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.reaction_strings", [reactions, name_parameter], 1, _callback, _error_callback);
    };

    this.roles_to_complexes = function (roles, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.roles_to_complexes",
        [roles], 1, _callback, _errorCallback);
};

    this.roles_to_complexes_async = function (roles, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.roles_to_complexes", [roles], 1, _callback, _error_callback);
    };

    this.complexes_to_roles = function (complexes, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.complexes_to_roles",
        [complexes], 1, _callback, _errorCallback);
};

    this.complexes_to_roles_async = function (complexes, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.complexes_to_roles", [complexes], 1, _callback, _error_callback);
    };

    this.fids_to_subsystem_data = function (fids, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.fids_to_subsystem_data",
        [fids], 1, _callback, _errorCallback);
};

    this.fids_to_subsystem_data_async = function (fids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.fids_to_subsystem_data", [fids], 1, _callback, _error_callback);
    };

    this.representative = function (genomes, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.representative",
        [genomes], 1, _callback, _errorCallback);
};

    this.representative_async = function (genomes, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.representative", [genomes], 1, _callback, _error_callback);
    };

    this.otu_members = function (genomes, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.otu_members",
        [genomes], 1, _callback, _errorCallback);
};

    this.otu_members_async = function (genomes, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.otu_members", [genomes], 1, _callback, _error_callback);
    };

    this.otus_to_representatives = function (otus, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.otus_to_representatives",
        [otus], 1, _callback, _errorCallback);
};

    this.otus_to_representatives_async = function (otus, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.otus_to_representatives", [otus], 1, _callback, _error_callback);
    };

    this.fids_to_genomes = function (fids, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.fids_to_genomes",
        [fids], 1, _callback, _errorCallback);
};

    this.fids_to_genomes_async = function (fids, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.fids_to_genomes", [fids], 1, _callback, _error_callback);
    };

    this.text_search = function (input, start, count, entities, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.text_search",
        [input, start, count, entities], 1, _callback, _errorCallback);
};

    this.text_search_async = function (input, start, count, entities, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.text_search", [input, start, count, entities], 1, _callback, _error_callback);
    };

    this.corresponds = function (fids, genome, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.corresponds",
        [fids, genome], 1, _callback, _errorCallback);
};

    this.corresponds_async = function (fids, genome, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.corresponds", [fids, genome], 1, _callback, _error_callback);
    };

    this.corresponds_from_sequences = function (g1_sequences, g1_locations, g2_sequences, g2_locations, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.corresponds_from_sequences",
        [g1_sequences, g1_locations, g2_sequences, g2_locations], 1, _callback, _errorCallback);
};

    this.corresponds_from_sequences_async = function (g1_sequences, g1_locations, g2_sequences, g2_locations, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.corresponds_from_sequences", [g1_sequences, g1_locations, g2_sequences, g2_locations], 1, _callback, _error_callback);
    };

    this.close_genomes = function (seq_set, n, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.close_genomes",
        [seq_set, n], 1, _callback, _errorCallback);
};

    this.close_genomes_async = function (seq_set, n, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.close_genomes", [seq_set, n], 1, _callback, _error_callback);
    };

    this.representative_sequences = function (seq_set, rep_seq_parms, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.representative_sequences",
        [seq_set, rep_seq_parms], 2, _callback, _errorCallback);
};

    this.representative_sequences_async = function (seq_set, rep_seq_parms, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.representative_sequences", [seq_set, rep_seq_parms], 2, _callback, _error_callback);
    };

    this.align_sequences = function (seq_set, align_seq_parms, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.align_sequences",
        [seq_set, align_seq_parms], 1, _callback, _errorCallback);
};

    this.align_sequences_async = function (seq_set, align_seq_parms, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.align_sequences", [seq_set, align_seq_parms], 1, _callback, _error_callback);
    };

    this.build_tree = function (alignment, build_tree_parms, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.build_tree",
        [alignment, build_tree_parms], 1, _callback, _errorCallback);
};

    this.build_tree_async = function (alignment, build_tree_parms, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.build_tree", [alignment, build_tree_parms], 1, _callback, _error_callback);
    };

    this.alignment_by_id = function (aln_id, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.alignment_by_id",
        [aln_id], 1, _callback, _errorCallback);
};

    this.alignment_by_id_async = function (aln_id, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.alignment_by_id", [aln_id], 1, _callback, _error_callback);
    };

    this.tree_by_id = function (tree_id, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.tree_by_id",
        [tree_id], 1, _callback, _errorCallback);
};

    this.tree_by_id_async = function (tree_id, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.tree_by_id", [tree_id], 1, _callback, _error_callback);
    };

    this.all_entities = function (_callback, _errorCallback) {
    return json_call_ajax("CDMI_API.all_entities",
        [], 1, _callback, _errorCallback);
};

    this.all_entities_async = function (_callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.all_entities", [], 1, _callback, _error_callback);
    };

    this.all_relationships = function (_callback, _errorCallback) {
    return json_call_ajax("CDMI_API.all_relationships",
        [], 1, _callback, _errorCallback);
};

    this.all_relationships_async = function (_callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.all_relationships", [], 1, _callback, _error_callback);
    };

    this.get_entity = function (entity_names, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.get_entity",
        [entity_names], 1, _callback, _errorCallback);
};

    this.get_entity_async = function (entity_names, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.get_entity", [entity_names], 1, _callback, _error_callback);
    };

    this.get_relationship = function (relationship_names, _callback, _errorCallback) {
    return json_call_ajax("CDMI_API.get_relationship",
        [relationship_names], 1, _callback, _errorCallback);
};

    this.get_relationship_async = function (relationship_names, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_API.get_relationship", [relationship_names], 1, _callback, _error_callback);
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


window.CDMI_EntityAPI = function (url, auth, auth_cb) {

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
        _url = "http://kbase.us/services/cdmi_api";
    }
    var _auth = auth ? auth : { 'token' : '', 'user_id' : ''};
    var _auth_cb = auth_cb;


    this.get_all = function (object_names, filter_clause, parameters, fields, count, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_all",
        [object_names, filter_clause, parameters, fields, count], 1, _callback, _errorCallback);
};

    this.get_all_async = function (object_names, filter_clause, parameters, fields, count, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_all", [object_names, filter_clause, parameters, fields, count], 1, _callback, _error_callback);
    };

    this.get_entity_Alignment = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Alignment",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Alignment_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Alignment", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Alignment = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Alignment",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Alignment_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Alignment", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Alignment = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Alignment",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Alignment_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Alignment", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_AlignmentAttribute = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_AlignmentAttribute",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_AlignmentAttribute_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_AlignmentAttribute", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_AlignmentAttribute = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_AlignmentAttribute",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_AlignmentAttribute_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_AlignmentAttribute", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_AlignmentAttribute = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_AlignmentAttribute",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_AlignmentAttribute_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_AlignmentAttribute", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_AlignmentRow = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_AlignmentRow",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_AlignmentRow_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_AlignmentRow", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_AlignmentRow = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_AlignmentRow",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_AlignmentRow_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_AlignmentRow", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_AlignmentRow = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_AlignmentRow",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_AlignmentRow_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_AlignmentRow", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_AlleleFrequency = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_AlleleFrequency",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_AlleleFrequency_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_AlleleFrequency", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_AlleleFrequency = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_AlleleFrequency",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_AlleleFrequency_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_AlleleFrequency", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_AlleleFrequency = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_AlleleFrequency",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_AlleleFrequency_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_AlleleFrequency", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Annotation = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Annotation",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Annotation_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Annotation", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Annotation = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Annotation",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Annotation_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Annotation", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Annotation = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Annotation",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Annotation_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Annotation", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Assay = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Assay",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Assay_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Assay", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Assay = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Assay",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Assay_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Assay", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Assay = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Assay",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Assay_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Assay", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Association = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Association",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Association_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Association", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Association = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Association",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Association_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Association", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Association = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Association",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Association_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Association", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_AssociationDataset = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_AssociationDataset",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_AssociationDataset_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_AssociationDataset", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_AssociationDataset = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_AssociationDataset",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_AssociationDataset_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_AssociationDataset", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_AssociationDataset = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_AssociationDataset",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_AssociationDataset_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_AssociationDataset", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_AssociationDetectionType = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_AssociationDetectionType",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_AssociationDetectionType_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_AssociationDetectionType", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_AssociationDetectionType = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_AssociationDetectionType",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_AssociationDetectionType_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_AssociationDetectionType", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_AssociationDetectionType = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_AssociationDetectionType",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_AssociationDetectionType_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_AssociationDetectionType", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_AtomicRegulon = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_AtomicRegulon",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_AtomicRegulon_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_AtomicRegulon", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_AtomicRegulon = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_AtomicRegulon",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_AtomicRegulon_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_AtomicRegulon", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_AtomicRegulon = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_AtomicRegulon",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_AtomicRegulon_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_AtomicRegulon", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Attribute = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Attribute",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Attribute_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Attribute", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Attribute = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Attribute",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Attribute_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Attribute", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Attribute = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Attribute",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Attribute_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Attribute", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Biomass = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Biomass",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Biomass_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Biomass", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Biomass = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Biomass",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Biomass_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Biomass", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Biomass = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Biomass",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Biomass_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Biomass", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_CodonUsage = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_CodonUsage",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_CodonUsage_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_CodonUsage", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_CodonUsage = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_CodonUsage",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_CodonUsage_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_CodonUsage", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_CodonUsage = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_CodonUsage",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_CodonUsage_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_CodonUsage", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Complex = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Complex",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Complex_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Complex", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Complex = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Complex",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Complex_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Complex", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Complex = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Complex",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Complex_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Complex", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Compound = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Compound",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Compound_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Compound", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Compound = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Compound",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Compound_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Compound", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Compound = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Compound",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Compound_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Compound", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_CompoundInstance = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_CompoundInstance",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_CompoundInstance_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_CompoundInstance", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_CompoundInstance = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_CompoundInstance",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_CompoundInstance_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_CompoundInstance", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_CompoundInstance = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_CompoundInstance",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_CompoundInstance_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_CompoundInstance", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_ConservedDomainModel = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_ConservedDomainModel",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_ConservedDomainModel_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_ConservedDomainModel", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_ConservedDomainModel = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_ConservedDomainModel",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_ConservedDomainModel_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_ConservedDomainModel", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_ConservedDomainModel = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_ConservedDomainModel",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_ConservedDomainModel_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_ConservedDomainModel", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Contig = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Contig",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Contig_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Contig", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Contig = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Contig",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Contig_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Contig", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Contig = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Contig",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Contig_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Contig", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_ContigChunk = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_ContigChunk",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_ContigChunk_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_ContigChunk", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_ContigChunk = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_ContigChunk",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_ContigChunk_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_ContigChunk", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_ContigChunk = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_ContigChunk",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_ContigChunk_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_ContigChunk", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_ContigSequence = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_ContigSequence",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_ContigSequence_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_ContigSequence", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_ContigSequence = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_ContigSequence",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_ContigSequence_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_ContigSequence", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_ContigSequence = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_ContigSequence",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_ContigSequence_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_ContigSequence", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_CoregulatedSet = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_CoregulatedSet",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_CoregulatedSet_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_CoregulatedSet", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_CoregulatedSet = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_CoregulatedSet",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_CoregulatedSet_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_CoregulatedSet", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_CoregulatedSet = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_CoregulatedSet",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_CoregulatedSet_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_CoregulatedSet", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Diagram = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Diagram",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Diagram_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Diagram", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Diagram = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Diagram",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Diagram_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Diagram", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Diagram = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Diagram",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Diagram_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Diagram", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_EcNumber = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_EcNumber",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_EcNumber_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_EcNumber", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_EcNumber = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_EcNumber",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_EcNumber_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_EcNumber", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_EcNumber = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_EcNumber",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_EcNumber_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_EcNumber", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Effector = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Effector",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Effector_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Effector", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Effector = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Effector",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Effector_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Effector", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Effector = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Effector",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Effector_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Effector", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Environment = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Environment",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Environment_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Environment", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Environment = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Environment",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Environment_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Environment", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Environment = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Environment",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Environment_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Environment", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Experiment = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Experiment",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Experiment_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Experiment", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Experiment = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Experiment",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Experiment_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Experiment", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Experiment = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Experiment",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Experiment_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Experiment", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_ExperimentMeta = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_ExperimentMeta",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_ExperimentMeta_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_ExperimentMeta", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_ExperimentMeta = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_ExperimentMeta",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_ExperimentMeta_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_ExperimentMeta", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_ExperimentMeta = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_ExperimentMeta",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_ExperimentMeta_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_ExperimentMeta", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_ExperimentalUnit = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_ExperimentalUnit",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_ExperimentalUnit_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_ExperimentalUnit", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_ExperimentalUnit = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_ExperimentalUnit",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_ExperimentalUnit_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_ExperimentalUnit", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_ExperimentalUnit = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_ExperimentalUnit",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_ExperimentalUnit_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_ExperimentalUnit", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_ExperimentalUnitGroup = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_ExperimentalUnitGroup",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_ExperimentalUnitGroup_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_ExperimentalUnitGroup", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_ExperimentalUnitGroup = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_ExperimentalUnitGroup",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_ExperimentalUnitGroup_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_ExperimentalUnitGroup", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_ExperimentalUnitGroup = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_ExperimentalUnitGroup",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_ExperimentalUnitGroup_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_ExperimentalUnitGroup", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Family = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Family",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Family_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Family", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Family = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Family",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Family_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Family", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Family = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Family",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Family_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Family", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Feature = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Feature",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Feature_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Feature", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Feature = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Feature",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Feature_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Feature", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Feature = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Feature",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Feature_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Feature", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Genome = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Genome",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Genome_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Genome", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Genome = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Genome",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Genome_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Genome", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Genome = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Genome",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Genome_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Genome", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Locality = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Locality",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Locality_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Locality", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Locality = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Locality",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Locality_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Locality", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Locality = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Locality",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Locality_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Locality", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_LocalizedCompound = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_LocalizedCompound",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_LocalizedCompound_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_LocalizedCompound", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_LocalizedCompound = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_LocalizedCompound",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_LocalizedCompound_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_LocalizedCompound", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_LocalizedCompound = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_LocalizedCompound",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_LocalizedCompound_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_LocalizedCompound", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Location = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Location",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Location_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Location", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Location = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Location",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Location_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Location", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Location = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Location",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Location_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Location", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_LocationInstance = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_LocationInstance",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_LocationInstance_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_LocationInstance", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_LocationInstance = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_LocationInstance",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_LocationInstance_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_LocationInstance", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_LocationInstance = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_LocationInstance",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_LocationInstance_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_LocationInstance", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Measurement = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Measurement",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Measurement_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Measurement", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Measurement = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Measurement",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Measurement_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Measurement", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Measurement = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Measurement",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Measurement_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Measurement", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_MeasurementDescription = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_MeasurementDescription",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_MeasurementDescription_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_MeasurementDescription", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_MeasurementDescription = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_MeasurementDescription",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_MeasurementDescription_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_MeasurementDescription", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_MeasurementDescription = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_MeasurementDescription",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_MeasurementDescription_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_MeasurementDescription", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Media = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Media",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Media_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Media", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Media = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Media",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Media_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Media", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Media = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Media",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Media_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Media", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Model = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Model",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Model_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Model", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Model = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Model",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Model_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Model", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Model = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Model",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Model_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Model", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_OTU = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_OTU",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_OTU_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_OTU", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_OTU = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_OTU",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_OTU_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_OTU", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_OTU = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_OTU",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_OTU_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_OTU", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_ObservationalUnit = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_ObservationalUnit",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_ObservationalUnit_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_ObservationalUnit", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_ObservationalUnit = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_ObservationalUnit",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_ObservationalUnit_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_ObservationalUnit", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_ObservationalUnit = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_ObservationalUnit",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_ObservationalUnit_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_ObservationalUnit", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Ontology = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Ontology",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Ontology_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Ontology", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Ontology = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Ontology",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Ontology_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Ontology", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Ontology = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Ontology",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Ontology_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Ontology", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Operon = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Operon",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Operon_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Operon", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Operon = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Operon",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Operon_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Operon", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Operon = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Operon",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Operon_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Operon", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_PairSet = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_PairSet",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_PairSet_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_PairSet", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_PairSet = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_PairSet",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_PairSet_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_PairSet", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_PairSet = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_PairSet",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_PairSet_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_PairSet", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Pairing = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Pairing",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Pairing_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Pairing", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Pairing = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Pairing",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Pairing_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Pairing", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Pairing = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Pairing",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Pairing_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Pairing", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Parameter = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Parameter",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Parameter_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Parameter", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Parameter = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Parameter",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Parameter_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Parameter", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Parameter = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Parameter",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Parameter_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Parameter", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Person = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Person",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Person_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Person", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Person = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Person",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Person_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Person", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Person = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Person",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Person_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Person", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Platform = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Platform",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Platform_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Platform", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Platform = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Platform",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Platform_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Platform", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Platform = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Platform",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Platform_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Platform", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_ProbeSet = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_ProbeSet",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_ProbeSet_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_ProbeSet", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_ProbeSet = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_ProbeSet",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_ProbeSet_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_ProbeSet", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_ProbeSet = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_ProbeSet",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_ProbeSet_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_ProbeSet", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_ProteinSequence = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_ProteinSequence",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_ProteinSequence_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_ProteinSequence", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_ProteinSequence = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_ProteinSequence",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_ProteinSequence_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_ProteinSequence", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_ProteinSequence = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_ProteinSequence",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_ProteinSequence_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_ProteinSequence", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Protocol = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Protocol",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Protocol_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Protocol", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Protocol = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Protocol",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Protocol_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Protocol", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Protocol = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Protocol",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Protocol_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Protocol", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Publication = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Publication",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Publication_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Publication", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Publication = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Publication",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Publication_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Publication", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Publication = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Publication",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Publication_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Publication", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Reaction = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Reaction",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Reaction_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Reaction", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Reaction = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Reaction",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Reaction_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Reaction", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Reaction = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Reaction",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Reaction_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Reaction", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_ReactionInstance = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_ReactionInstance",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_ReactionInstance_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_ReactionInstance", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_ReactionInstance = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_ReactionInstance",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_ReactionInstance_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_ReactionInstance", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_ReactionInstance = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_ReactionInstance",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_ReactionInstance_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_ReactionInstance", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Regulator = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Regulator",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Regulator_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Regulator", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Regulator = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Regulator",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Regulator_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Regulator", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Regulator = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Regulator",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Regulator_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Regulator", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Regulog = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Regulog",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Regulog_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Regulog", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Regulog = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Regulog",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Regulog_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Regulog", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Regulog = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Regulog",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Regulog_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Regulog", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_RegulogCollection = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_RegulogCollection",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_RegulogCollection_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_RegulogCollection", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_RegulogCollection = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_RegulogCollection",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_RegulogCollection_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_RegulogCollection", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_RegulogCollection = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_RegulogCollection",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_RegulogCollection_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_RegulogCollection", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Regulome = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Regulome",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Regulome_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Regulome", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Regulome = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Regulome",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Regulome_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Regulome", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Regulome = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Regulome",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Regulome_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Regulome", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Regulon = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Regulon",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Regulon_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Regulon", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Regulon = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Regulon",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Regulon_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Regulon", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Regulon = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Regulon",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Regulon_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Regulon", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_ReplicateGroup = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_ReplicateGroup",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_ReplicateGroup_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_ReplicateGroup", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_ReplicateGroup = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_ReplicateGroup",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_ReplicateGroup_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_ReplicateGroup", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_ReplicateGroup = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_ReplicateGroup",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_ReplicateGroup_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_ReplicateGroup", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Role = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Role",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Role_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Role", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Role = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Role",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Role_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Role", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Role = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Role",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Role_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Role", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_SSCell = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_SSCell",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_SSCell_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_SSCell", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_SSCell = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_SSCell",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_SSCell_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_SSCell", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_SSCell = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_SSCell",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_SSCell_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_SSCell", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_SSRow = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_SSRow",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_SSRow_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_SSRow", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_SSRow = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_SSRow",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_SSRow_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_SSRow", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_SSRow = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_SSRow",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_SSRow_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_SSRow", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Sample = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Sample",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Sample_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Sample", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Sample = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Sample",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Sample_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Sample", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Sample = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Sample",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Sample_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Sample", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_SampleAnnotation = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_SampleAnnotation",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_SampleAnnotation_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_SampleAnnotation", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_SampleAnnotation = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_SampleAnnotation",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_SampleAnnotation_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_SampleAnnotation", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_SampleAnnotation = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_SampleAnnotation",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_SampleAnnotation_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_SampleAnnotation", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Scenario = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Scenario",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Scenario_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Scenario", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Scenario = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Scenario",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Scenario_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Scenario", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Scenario = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Scenario",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Scenario_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Scenario", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Series = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Series",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Series_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Series", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Series = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Series",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Series_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Series", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Series = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Series",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Series_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Series", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Source = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Source",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Source_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Source", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Source = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Source",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Source_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Source", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Source = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Source",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Source_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Source", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Strain = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Strain",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Strain_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Strain", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Strain = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Strain",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Strain_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Strain", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Strain = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Strain",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Strain_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Strain", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_StudyExperiment = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_StudyExperiment",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_StudyExperiment_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_StudyExperiment", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_StudyExperiment = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_StudyExperiment",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_StudyExperiment_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_StudyExperiment", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_StudyExperiment = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_StudyExperiment",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_StudyExperiment_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_StudyExperiment", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Subsystem = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Subsystem",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Subsystem_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Subsystem", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Subsystem = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Subsystem",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Subsystem_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Subsystem", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Subsystem = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Subsystem",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Subsystem_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Subsystem", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_SubsystemClass = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_SubsystemClass",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_SubsystemClass_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_SubsystemClass", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_SubsystemClass = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_SubsystemClass",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_SubsystemClass_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_SubsystemClass", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_SubsystemClass = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_SubsystemClass",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_SubsystemClass_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_SubsystemClass", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_TaxonomicGrouping = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_TaxonomicGrouping",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_TaxonomicGrouping_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_TaxonomicGrouping", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_TaxonomicGrouping = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_TaxonomicGrouping",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_TaxonomicGrouping_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_TaxonomicGrouping", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_TaxonomicGrouping = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_TaxonomicGrouping",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_TaxonomicGrouping_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_TaxonomicGrouping", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_TimeSeries = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_TimeSeries",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_TimeSeries_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_TimeSeries", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_TimeSeries = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_TimeSeries",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_TimeSeries_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_TimeSeries", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_TimeSeries = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_TimeSeries",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_TimeSeries_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_TimeSeries", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Trait = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Trait",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Trait_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Trait", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Trait = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Trait",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Trait_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Trait", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Trait = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Trait",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Trait_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Trait", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Tree = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Tree",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Tree_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Tree", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Tree = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Tree",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Tree_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Tree", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Tree = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Tree",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Tree_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Tree", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_TreeAttribute = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_TreeAttribute",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_TreeAttribute_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_TreeAttribute", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_TreeAttribute = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_TreeAttribute",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_TreeAttribute_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_TreeAttribute", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_TreeAttribute = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_TreeAttribute",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_TreeAttribute_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_TreeAttribute", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_TreeNodeAttribute = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_TreeNodeAttribute",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_TreeNodeAttribute_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_TreeNodeAttribute", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_TreeNodeAttribute = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_TreeNodeAttribute",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_TreeNodeAttribute_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_TreeNodeAttribute", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_TreeNodeAttribute = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_TreeNodeAttribute",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_TreeNodeAttribute_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_TreeNodeAttribute", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_entity_Variant = function (ids, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_entity_Variant",
        [ids, fields], 1, _callback, _errorCallback);
};

    this.get_entity_Variant_async = function (ids, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_entity_Variant", [ids, fields], 1, _callback, _error_callback);
    };

    this.query_entity_Variant = function (qry, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.query_entity_Variant",
        [qry, fields], 1, _callback, _errorCallback);
};

    this.query_entity_Variant_async = function (qry, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.query_entity_Variant", [qry, fields], 1, _callback, _error_callback);
    };

    this.all_entities_Variant = function (start, count, fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.all_entities_Variant",
        [start, count, fields], 1, _callback, _errorCallback);
};

    this.all_entities_Variant_async = function (start, count, fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.all_entities_Variant", [start, count, fields], 1, _callback, _error_callback);
    };

    this.get_relationship_AffectsLevelOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_AffectsLevelOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_AffectsLevelOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_AffectsLevelOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsAffectedIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsAffectedIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsAffectedIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsAffectedIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Aligned = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Aligned",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Aligned_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Aligned", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_WasAlignedBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_WasAlignedBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_WasAlignedBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_WasAlignedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_AssertsFunctionFor = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_AssertsFunctionFor",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_AssertsFunctionFor_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_AssertsFunctionFor", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasAssertedFunctionFrom = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasAssertedFunctionFrom",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasAssertedFunctionFrom_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasAssertedFunctionFrom", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_AssociationFeature = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_AssociationFeature",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_AssociationFeature_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_AssociationFeature", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_FeatureInteractsIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_FeatureInteractsIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_FeatureInteractsIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_FeatureInteractsIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_CompoundMeasuredBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_CompoundMeasuredBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_CompoundMeasuredBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_CompoundMeasuredBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_MeasuresCompound = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_MeasuresCompound",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_MeasuresCompound_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_MeasuresCompound", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Concerns = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Concerns",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Concerns_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Concerns", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsATopicOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsATopicOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsATopicOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsATopicOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_ConsistsOfCompounds = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_ConsistsOfCompounds",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_ConsistsOfCompounds_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_ConsistsOfCompounds", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_ComponentOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_ComponentOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_ComponentOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_ComponentOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Contains = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Contains",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Contains_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Contains", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsContainedIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsContainedIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsContainedIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsContainedIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_ContainsAlignedDNA = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_ContainsAlignedDNA",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_ContainsAlignedDNA_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_ContainsAlignedDNA", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsAlignedDNAComponentOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsAlignedDNAComponentOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsAlignedDNAComponentOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsAlignedDNAComponentOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_ContainsAlignedProtein = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_ContainsAlignedProtein",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_ContainsAlignedProtein_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_ContainsAlignedProtein", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsAlignedProteinComponentOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsAlignedProteinComponentOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsAlignedProteinComponentOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsAlignedProteinComponentOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_ContainsExperimentalUnit = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_ContainsExperimentalUnit",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_ContainsExperimentalUnit_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_ContainsExperimentalUnit", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_GroupedBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_GroupedBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_GroupedBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_GroupedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Controls = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Controls",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Controls_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Controls", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsControlledUsing = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsControlledUsing",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsControlledUsing_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsControlledUsing", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_DefaultControlSample = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_DefaultControlSample",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_DefaultControlSample_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_DefaultControlSample", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_SamplesDefaultControl = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_SamplesDefaultControl",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_SamplesDefaultControl_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_SamplesDefaultControl", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Describes = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Describes",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Describes_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Describes", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsDescribedBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsDescribedBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsDescribedBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsDescribedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_DescribesAlignment = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_DescribesAlignment",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_DescribesAlignment_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_DescribesAlignment", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasAlignmentAttribute = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasAlignmentAttribute",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasAlignmentAttribute_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasAlignmentAttribute", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_DescribesMeasurement = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_DescribesMeasurement",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_DescribesMeasurement_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_DescribesMeasurement", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsDefinedBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsDefinedBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsDefinedBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsDefinedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_DescribesTree = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_DescribesTree",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_DescribesTree_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_DescribesTree", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasTreeAttribute = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasTreeAttribute",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasTreeAttribute_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasTreeAttribute", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_DescribesTreeNode = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_DescribesTreeNode",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_DescribesTreeNode_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_DescribesTreeNode", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasNodeAttribute = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasNodeAttribute",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasNodeAttribute_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasNodeAttribute", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_DetectedWithMethod = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_DetectedWithMethod",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_DetectedWithMethod_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_DetectedWithMethod", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_DetectedBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_DetectedBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_DetectedBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_DetectedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Displays = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Displays",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Displays_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Displays", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsDisplayedOn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsDisplayedOn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsDisplayedOn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsDisplayedOn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Encompasses = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Encompasses",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Encompasses_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Encompasses", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsEncompassedIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsEncompassedIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsEncompassedIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsEncompassedIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_EvaluatedIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_EvaluatedIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_EvaluatedIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_EvaluatedIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IncludesStrain = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IncludesStrain",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IncludesStrain_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IncludesStrain", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_FeatureIsTranscriptionFactorFor = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_FeatureIsTranscriptionFactorFor",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_FeatureIsTranscriptionFactorFor_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_FeatureIsTranscriptionFactorFor", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasTranscriptionFactorFeature = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasTranscriptionFactorFeature",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasTranscriptionFactorFeature_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasTranscriptionFactorFeature", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_FeatureMeasuredBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_FeatureMeasuredBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_FeatureMeasuredBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_FeatureMeasuredBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_MeasuresFeature = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_MeasuresFeature",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_MeasuresFeature_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_MeasuresFeature", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Formulated = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Formulated",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Formulated_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Formulated", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_WasFormulatedBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_WasFormulatedBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_WasFormulatedBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_WasFormulatedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_GeneratedLevelsFor = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_GeneratedLevelsFor",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_GeneratedLevelsFor_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_GeneratedLevelsFor", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_WasGeneratedFrom = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_WasGeneratedFrom",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_WasGeneratedFrom_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_WasGeneratedFrom", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_GenomeParentOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_GenomeParentOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_GenomeParentOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_GenomeParentOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_DerivedFromGenome = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_DerivedFromGenome",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_DerivedFromGenome_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_DerivedFromGenome", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasAliasAssertedFrom = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasAliasAssertedFrom",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasAliasAssertedFrom_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasAliasAssertedFrom", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_AssertsAliasFor = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_AssertsAliasFor",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_AssertsAliasFor_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_AssertsAliasFor", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasCompoundAliasFrom = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasCompoundAliasFrom",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasCompoundAliasFrom_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasCompoundAliasFrom", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_UsesAliasForCompound = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_UsesAliasForCompound",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_UsesAliasForCompound_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_UsesAliasForCompound", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasEffector = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasEffector",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasEffector_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasEffector", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsEffectorFor = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsEffectorFor",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsEffectorFor_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsEffectorFor", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasExperimentalUnit = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasExperimentalUnit",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasExperimentalUnit_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasExperimentalUnit", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsExperimentalUnitOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsExperimentalUnitOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsExperimentalUnitOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsExperimentalUnitOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasExpressionSample = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasExpressionSample",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasExpressionSample_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasExpressionSample", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_SampleBelongsToExperimentalUnit = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_SampleBelongsToExperimentalUnit",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_SampleBelongsToExperimentalUnit_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_SampleBelongsToExperimentalUnit", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasGenomes = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasGenomes",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasGenomes_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasGenomes", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsInRegulogCollection = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsInRegulogCollection",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsInRegulogCollection_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsInRegulogCollection", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasIndicatedSignalFrom = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasIndicatedSignalFrom",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasIndicatedSignalFrom_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasIndicatedSignalFrom", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IndicatesSignalFor = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IndicatesSignalFor",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IndicatesSignalFor_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IndicatesSignalFor", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasKnockoutIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasKnockoutIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasKnockoutIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasKnockoutIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_KnockedOutIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_KnockedOutIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_KnockedOutIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_KnockedOutIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasMeasurement = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasMeasurement",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasMeasurement_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasMeasurement", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsMeasureOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsMeasureOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsMeasureOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsMeasureOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasMember = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasMember",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasMember_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasMember", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsMemberOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsMemberOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsMemberOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsMemberOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasParameter = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasParameter",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasParameter_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasParameter", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_OfEnvironment = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_OfEnvironment",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_OfEnvironment_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_OfEnvironment", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasParticipant = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasParticipant",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasParticipant_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasParticipant", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_ParticipatesIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_ParticipatesIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_ParticipatesIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_ParticipatesIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasPresenceOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasPresenceOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasPresenceOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasPresenceOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsPresentIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsPresentIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsPresentIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsPresentIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasProteinMember = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasProteinMember",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasProteinMember_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasProteinMember", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsProteinMemberOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsProteinMemberOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsProteinMemberOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsProteinMemberOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasReactionAliasFrom = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasReactionAliasFrom",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasReactionAliasFrom_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasReactionAliasFrom", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_UsesAliasForReaction = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_UsesAliasForReaction",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_UsesAliasForReaction_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_UsesAliasForReaction", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasRegulogs = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasRegulogs",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasRegulogs_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasRegulogs", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsInCollection = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsInCollection",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsInCollection_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsInCollection", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasRepresentativeOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasRepresentativeOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasRepresentativeOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasRepresentativeOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsRepresentedIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsRepresentedIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsRepresentedIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsRepresentedIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasRequirementOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasRequirementOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasRequirementOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasRequirementOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsARequirementOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsARequirementOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsARequirementOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsARequirementOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasResultsIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasResultsIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasResultsIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasResultsIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasResultsFor = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasResultsFor",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasResultsFor_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasResultsFor", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasSection = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasSection",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasSection_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasSection", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsSectionOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsSectionOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsSectionOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsSectionOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasStep = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasStep",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasStep_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasStep", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsStepOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsStepOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsStepOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsStepOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasTrait = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasTrait",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasTrait_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasTrait", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Measures = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Measures",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Measures_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Measures", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasUnits = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasUnits",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasUnits_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasUnits", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsLocated = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsLocated",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsLocated_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsLocated", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasUsage = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasUsage",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasUsage_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasUsage", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsUsageOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsUsageOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsUsageOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsUsageOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasValueFor = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasValueFor",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasValueFor_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasValueFor", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasValueIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasValueIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasValueIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasValueIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasVariationIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasVariationIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasVariationIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasVariationIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsVariedIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsVariedIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsVariedIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsVariedIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Impacts = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Impacts",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Impacts_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Impacts", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsImpactedBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsImpactedBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsImpactedBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsImpactedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_ImplementsReaction = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_ImplementsReaction",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_ImplementsReaction_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_ImplementsReaction", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_ImplementedBasedOn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_ImplementedBasedOn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_ImplementedBasedOn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_ImplementedBasedOn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Includes = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Includes",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Includes_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Includes", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsIncludedIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsIncludedIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsIncludedIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsIncludedIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IncludesAdditionalCompounds = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IncludesAdditionalCompounds",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IncludesAdditionalCompounds_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IncludesAdditionalCompounds", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IncludedIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IncludedIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IncludedIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IncludedIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IncludesAlignmentRow = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IncludesAlignmentRow",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IncludesAlignmentRow_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IncludesAlignmentRow", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsAlignmentRowIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsAlignmentRowIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsAlignmentRowIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsAlignmentRowIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IncludesPart = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IncludesPart",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IncludesPart_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IncludesPart", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsPartOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsPartOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsPartOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsPartOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IndicatedLevelsFor = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IndicatedLevelsFor",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IndicatedLevelsFor_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IndicatedLevelsFor", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasLevelsFrom = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasLevelsFrom",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasLevelsFrom_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasLevelsFrom", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Involves = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Involves",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Involves_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Involves", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsInvolvedIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsInvolvedIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsInvolvedIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsInvolvedIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsAnnotatedBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsAnnotatedBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsAnnotatedBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsAnnotatedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Annotates = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Annotates",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Annotates_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Annotates", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsAssayOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsAssayOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsAssayOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsAssayOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsAssayedBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsAssayedBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsAssayedBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsAssayedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsClassFor = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsClassFor",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsClassFor_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsClassFor", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsInClass = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsInClass",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsInClass_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsInClass", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsCollectionOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsCollectionOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsCollectionOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsCollectionOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsCollectedInto = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsCollectedInto",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsCollectedInto_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsCollectedInto", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsComposedOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsComposedOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsComposedOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsComposedOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsComponentOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsComponentOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsComponentOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsComponentOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsComprisedOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsComprisedOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsComprisedOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsComprisedOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Comprises = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Comprises",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Comprises_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Comprises", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsConfiguredBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsConfiguredBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsConfiguredBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsConfiguredBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_ReflectsStateOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_ReflectsStateOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_ReflectsStateOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_ReflectsStateOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsConservedDomainModelFor = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsConservedDomainModelFor",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsConservedDomainModelFor_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsConservedDomainModelFor", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasConservedDomainModel = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasConservedDomainModel",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasConservedDomainModel_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasConservedDomainModel", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsConsistentWith = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsConsistentWith",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsConsistentWith_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsConsistentWith", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsConsistentTo = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsConsistentTo",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsConsistentTo_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsConsistentTo", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsContextOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsContextOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsContextOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsContextOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasEnvironment = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasEnvironment",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasEnvironment_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasEnvironment", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsCoregulatedWith = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsCoregulatedWith",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsCoregulatedWith_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsCoregulatedWith", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasCoregulationWith = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasCoregulationWith",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasCoregulationWith_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasCoregulationWith", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsCoupledTo = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsCoupledTo",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsCoupledTo_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsCoupledTo", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsCoupledWith = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsCoupledWith",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsCoupledWith_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsCoupledWith", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsDatasetFor = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsDatasetFor",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsDatasetFor_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsDatasetFor", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasAssociationDataset = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasAssociationDataset",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasAssociationDataset_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasAssociationDataset", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsDeterminedBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsDeterminedBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsDeterminedBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsDeterminedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Determines = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Determines",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Determines_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Determines", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsDividedInto = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsDividedInto",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsDividedInto_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsDividedInto", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsDivisionOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsDivisionOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsDivisionOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsDivisionOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsExecutedAs = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsExecutedAs",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsExecutedAs_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsExecutedAs", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsExecutionOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsExecutionOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsExecutionOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsExecutionOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsExemplarOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsExemplarOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsExemplarOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsExemplarOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasAsExemplar = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasAsExemplar",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasAsExemplar_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasAsExemplar", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsFamilyFor = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsFamilyFor",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsFamilyFor_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsFamilyFor", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_DeterminesFunctionOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_DeterminesFunctionOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_DeterminesFunctionOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_DeterminesFunctionOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsFormedOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsFormedOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsFormedOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsFormedOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsFormedInto = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsFormedInto",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsFormedInto_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsFormedInto", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsFunctionalIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsFunctionalIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsFunctionalIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsFunctionalIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasFunctional = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasFunctional",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasFunctional_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasFunctional", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsGroupFor = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsGroupFor",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsGroupFor_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsGroupFor", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsInGroup = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsInGroup",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsInGroup_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsInGroup", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsGroupingOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsGroupingOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsGroupingOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsGroupingOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_InAssociationDataset = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_InAssociationDataset",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_InAssociationDataset_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_InAssociationDataset", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsImplementedBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsImplementedBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsImplementedBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsImplementedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Implements = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Implements",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Implements_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Implements", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsInOperon = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsInOperon",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsInOperon_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsInOperon", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_OperonContains = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_OperonContains",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_OperonContains_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_OperonContains", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsInPair = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsInPair",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsInPair_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsInPair", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsPairOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsPairOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsPairOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsPairOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsInstantiatedBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsInstantiatedBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsInstantiatedBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsInstantiatedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsInstanceOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsInstanceOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsInstanceOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsInstanceOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsLocatedIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsLocatedIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsLocatedIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsLocatedIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsLocusFor = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsLocusFor",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsLocusFor_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsLocusFor", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsMeasurementMethodOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsMeasurementMethodOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsMeasurementMethodOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsMeasurementMethodOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_WasMeasuredBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_WasMeasuredBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_WasMeasuredBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_WasMeasuredBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsModeledBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsModeledBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsModeledBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsModeledBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Models = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Models",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Models_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Models", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsModifiedToBuildAlignment = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsModifiedToBuildAlignment",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsModifiedToBuildAlignment_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsModifiedToBuildAlignment", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsModificationOfAlignment = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsModificationOfAlignment",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsModificationOfAlignment_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsModificationOfAlignment", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsModifiedToBuildTree = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsModifiedToBuildTree",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsModifiedToBuildTree_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsModifiedToBuildTree", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsModificationOfTree = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsModificationOfTree",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsModificationOfTree_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsModificationOfTree", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsOwnerOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsOwnerOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsOwnerOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsOwnerOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsOwnedBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsOwnedBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsOwnedBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsOwnedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsParticipatingAt = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsParticipatingAt",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsParticipatingAt_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsParticipatingAt", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_ParticipatesAt = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_ParticipatesAt",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_ParticipatesAt_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_ParticipatesAt", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsProteinFor = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsProteinFor",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsProteinFor_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsProteinFor", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Produces = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Produces",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Produces_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Produces", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsReagentIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsReagentIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsReagentIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsReagentIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Targets = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Targets",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Targets_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Targets", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsRealLocationOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsRealLocationOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsRealLocationOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsRealLocationOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasRealLocationIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasRealLocationIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasRealLocationIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasRealLocationIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsReferencedBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsReferencedBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsReferencedBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsReferencedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_UsesReference = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_UsesReference",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_UsesReference_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_UsesReference", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsRegulatedIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsRegulatedIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsRegulatedIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsRegulatedIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsRegulatedSetOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsRegulatedSetOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsRegulatedSetOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsRegulatedSetOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsRegulatorFor = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsRegulatorFor",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsRegulatorFor_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsRegulatorFor", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasRegulator = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasRegulator",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasRegulator_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasRegulator", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsRegulatorForRegulon = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsRegulatorForRegulon",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsRegulatorForRegulon_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsRegulatorForRegulon", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_ReglonHasRegulator = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_ReglonHasRegulator",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_ReglonHasRegulator_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_ReglonHasRegulator", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsRegulatorySiteFor = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsRegulatorySiteFor",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsRegulatorySiteFor_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsRegulatorySiteFor", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasRegulatorySite = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasRegulatorySite",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasRegulatorySite_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasRegulatorySite", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsRelevantFor = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsRelevantFor",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsRelevantFor_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsRelevantFor", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsRelevantTo = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsRelevantTo",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsRelevantTo_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsRelevantTo", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsRepresentedBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsRepresentedBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsRepresentedBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsRepresentedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_DefinedBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_DefinedBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_DefinedBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_DefinedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsRoleOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsRoleOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsRoleOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsRoleOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasRole = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasRole",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasRole_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasRole", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsRowOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsRowOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsRowOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsRowOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsRoleFor = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsRoleFor",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsRoleFor_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsRoleFor", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsSequenceOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsSequenceOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsSequenceOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsSequenceOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasAsSequence = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasAsSequence",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasAsSequence_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasAsSequence", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsSourceForAssociationDataset = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsSourceForAssociationDataset",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsSourceForAssociationDataset_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsSourceForAssociationDataset", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_AssociationDatasetSourcedBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_AssociationDatasetSourcedBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_AssociationDatasetSourcedBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_AssociationDatasetSourcedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsSubInstanceOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsSubInstanceOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsSubInstanceOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsSubInstanceOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Validates = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Validates",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Validates_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Validates", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsSummarizedBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsSummarizedBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsSummarizedBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsSummarizedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Summarizes = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Summarizes",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Summarizes_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Summarizes", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsSuperclassOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsSuperclassOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsSuperclassOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsSuperclassOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsSubclassOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsSubclassOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsSubclassOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsSubclassOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsTaxonomyOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsTaxonomyOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsTaxonomyOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsTaxonomyOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsInTaxa = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsInTaxa",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsInTaxa_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsInTaxa", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsTerminusFor = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsTerminusFor",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsTerminusFor_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsTerminusFor", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasAsTerminus = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasAsTerminus",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasAsTerminus_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasAsTerminus", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsTriggeredBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsTriggeredBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsTriggeredBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsTriggeredBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Triggers = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Triggers",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Triggers_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Triggers", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsUsedToBuildTree = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsUsedToBuildTree",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsUsedToBuildTree_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsUsedToBuildTree", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsBuiltFromAlignment = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsBuiltFromAlignment",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsBuiltFromAlignment_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsBuiltFromAlignment", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Manages = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Manages",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Manages_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Manages", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsManagedBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsManagedBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsManagedBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsManagedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_OntologyForSample = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_OntologyForSample",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_OntologyForSample_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_OntologyForSample", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_SampleHasOntology = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_SampleHasOntology",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_SampleHasOntology_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_SampleHasOntology", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_OperatesIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_OperatesIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_OperatesIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_OperatesIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsUtilizedIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsUtilizedIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsUtilizedIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsUtilizedIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_OrdersExperimentalUnit = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_OrdersExperimentalUnit",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_OrdersExperimentalUnit_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_OrdersExperimentalUnit", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsTimepointOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsTimepointOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsTimepointOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsTimepointOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Overlaps = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Overlaps",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Overlaps_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Overlaps", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IncludesPartOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IncludesPartOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IncludesPartOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IncludesPartOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_ParticipatesAs = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_ParticipatesAs",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_ParticipatesAs_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_ParticipatesAs", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsParticipationOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsParticipationOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsParticipationOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsParticipationOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_PerformedExperiment = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_PerformedExperiment",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_PerformedExperiment_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_PerformedExperiment", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_PerformedBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_PerformedBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_PerformedBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_PerformedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_PersonAnnotatedSample = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_PersonAnnotatedSample",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_PersonAnnotatedSample_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_PersonAnnotatedSample", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_SampleAnnotatedBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_SampleAnnotatedBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_SampleAnnotatedBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_SampleAnnotatedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_PlatformWithSamples = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_PlatformWithSamples",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_PlatformWithSamples_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_PlatformWithSamples", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_SampleRunOnPlatform = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_SampleRunOnPlatform",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_SampleRunOnPlatform_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_SampleRunOnPlatform", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_ProducedResultsFor = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_ProducedResultsFor",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_ProducedResultsFor_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_ProducedResultsFor", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HadResultsProducedBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HadResultsProducedBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HadResultsProducedBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HadResultsProducedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_ProtocolForSample = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_ProtocolForSample",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_ProtocolForSample_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_ProtocolForSample", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_SampleUsesProtocol = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_SampleUsesProtocol",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_SampleUsesProtocol_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_SampleUsesProtocol", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Provided = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Provided",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Provided_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Provided", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_WasProvidedBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_WasProvidedBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_WasProvidedBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_WasProvidedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_PublishedAssociation = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_PublishedAssociation",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_PublishedAssociation_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_PublishedAssociation", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_AssociationPublishedIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_AssociationPublishedIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_AssociationPublishedIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_AssociationPublishedIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_PublishedExperiment = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_PublishedExperiment",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_PublishedExperiment_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_PublishedExperiment", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_ExperimentPublishedIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_ExperimentPublishedIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_ExperimentPublishedIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_ExperimentPublishedIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_PublishedProtocol = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_PublishedProtocol",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_PublishedProtocol_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_PublishedProtocol", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_ProtocolPublishedIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_ProtocolPublishedIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_ProtocolPublishedIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_ProtocolPublishedIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_RegulogHasRegulon = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_RegulogHasRegulon",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_RegulogHasRegulon_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_RegulogHasRegulon", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_RegulonIsInRegolog = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_RegulonIsInRegolog",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_RegulonIsInRegolog_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_RegulonIsInRegolog", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_RegulomeHasGenome = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_RegulomeHasGenome",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_RegulomeHasGenome_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_RegulomeHasGenome", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_GenomeIsInRegulome = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_GenomeIsInRegulome",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_GenomeIsInRegulome_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_GenomeIsInRegulome", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_RegulomeHasRegulon = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_RegulomeHasRegulon",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_RegulomeHasRegulon_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_RegulomeHasRegulon", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_RegulonIsInRegolome = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_RegulonIsInRegolome",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_RegulonIsInRegolome_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_RegulonIsInRegolome", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_RegulomeSource = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_RegulomeSource",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_RegulomeSource_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_RegulomeSource", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_CreatedRegulome = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_CreatedRegulome",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_CreatedRegulome_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_CreatedRegulome", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_RegulonHasOperon = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_RegulonHasOperon",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_RegulonHasOperon_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_RegulonHasOperon", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_OperonIsInRegulon = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_OperonIsInRegulon",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_OperonIsInRegulon_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_OperonIsInRegulon", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_SampleAveragedFrom = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_SampleAveragedFrom",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_SampleAveragedFrom_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_SampleAveragedFrom", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_SampleComponentOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_SampleComponentOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_SampleComponentOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_SampleComponentOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_SampleContactPerson = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_SampleContactPerson",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_SampleContactPerson_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_SampleContactPerson", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_PersonPerformedSample = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_PersonPerformedSample",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_PersonPerformedSample_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_PersonPerformedSample", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_SampleHasAnnotations = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_SampleHasAnnotations",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_SampleHasAnnotations_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_SampleHasAnnotations", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_AnnotationsForSample = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_AnnotationsForSample",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_AnnotationsForSample_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_AnnotationsForSample", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_SampleInSeries = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_SampleInSeries",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_SampleInSeries_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_SampleInSeries", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_SeriesWithSamples = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_SeriesWithSamples",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_SeriesWithSamples_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_SeriesWithSamples", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_SampleMeasurements = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_SampleMeasurements",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_SampleMeasurements_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_SampleMeasurements", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_MeasurementInSample = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_MeasurementInSample",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_MeasurementInSample_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_MeasurementInSample", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_SamplesInReplicateGroup = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_SamplesInReplicateGroup",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_SamplesInReplicateGroup_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_SamplesInReplicateGroup", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_ReplicateGroupsForSample = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_ReplicateGroupsForSample",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_ReplicateGroupsForSample_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_ReplicateGroupsForSample", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_SeriesPublishedIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_SeriesPublishedIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_SeriesPublishedIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_SeriesPublishedIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_PublicationsForSeries = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_PublicationsForSeries",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_PublicationsForSeries_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_PublicationsForSeries", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Shows = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Shows",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Shows_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Shows", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsShownOn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsShownOn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsShownOn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsShownOn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_StrainParentOf = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_StrainParentOf",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_StrainParentOf_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_StrainParentOf", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_DerivedFromStrain = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_DerivedFromStrain",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_DerivedFromStrain_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_DerivedFromStrain", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_StrainWithPlatforms = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_StrainWithPlatforms",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_StrainWithPlatforms_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_StrainWithPlatforms", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_PlatformForStrain = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_PlatformForStrain",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_PlatformForStrain_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_PlatformForStrain", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_StrainWithSample = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_StrainWithSample",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_StrainWithSample_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_StrainWithSample", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_SampleForStrain = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_SampleForStrain",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_SampleForStrain_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_SampleForStrain", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Submitted = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Submitted",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Submitted_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Submitted", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_WasSubmittedBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_WasSubmittedBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_WasSubmittedBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_WasSubmittedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_SupersedesAlignment = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_SupersedesAlignment",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_SupersedesAlignment_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_SupersedesAlignment", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsSupersededByAlignment = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsSupersededByAlignment",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsSupersededByAlignment_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsSupersededByAlignment", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_SupersedesTree = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_SupersedesTree",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_SupersedesTree_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_SupersedesTree", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsSupersededByTree = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsSupersededByTree",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsSupersededByTree_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsSupersededByTree", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Treed = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Treed",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Treed_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Treed", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsTreeFrom = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsTreeFrom",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsTreeFrom_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsTreeFrom", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_UsedIn = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_UsedIn",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_UsedIn_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_UsedIn", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_HasMedia = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_HasMedia",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_HasMedia_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_HasMedia", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_Uses = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_Uses",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_Uses_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_Uses", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_IsUsedBy = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_IsUsedBy",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_IsUsedBy_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_IsUsedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_UsesCodons = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_UsesCodons",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_UsesCodons_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_UsesCodons", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
    };

    this.get_relationship_AreCodonsFor = function (ids, from_fields, rel_fields, to_fields, _callback, _errorCallback) {
    return json_call_ajax("CDMI_EntityAPI.get_relationship_AreCodonsFor",
        [ids, from_fields, rel_fields, to_fields], 1, _callback, _errorCallback);
};

    this.get_relationship_AreCodonsFor_async = function (ids, from_fields, rel_fields, to_fields, _callback, _error_callback) {
        deprecationWarning();
        return json_call_ajax("CDMI_EntityAPI.get_relationship_AreCodonsFor", [ids, from_fields, rel_fields, to_fields], 1, _callback, _error_callback);
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

} );

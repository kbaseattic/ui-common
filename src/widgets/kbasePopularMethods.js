define (
	[
		'kbwidget',
		'bootstrap',
		'jquery',
		'kbwidget',
		'kbaseAccordion',
		'kbaseTable'
	], function(
		KBWidget,
		bootstrap,
		$,
		KBWidget,
		kbaseAccordion,
		kbaseTable
	) {

    return KBWidget({
        name: "kbasePopularMethods",
        parent : kbaseWidget,
        version: "1.0.0",

        _accessors : ['stats'],

        options: {

            stats : {
                "by_method": {
                    "are_readable": {
                        "accesses_by_month": {
                            "2014-08": 18,
                            "2014-09": 5,
                            "2014-10": 54,
                            "2014-11": 1
                        },
                        "total_count": 78
                    },
                    "hids_to_handles": {
                        "accesses_by_month": {
                            "2014-08": 6,
                            "2014-09": 11,
                            "2014-10": 38,
                            "2014-11": 2
                        },
                        "total_count": 57
                    },
                    "list_handles": {
                        "accesses_by_month": {
                            "2014-05": 5,
                            "2014-08": 2,
                            "2014-10": 2404,
                            "2014-11": 3134
                        },
                        "total_count": 5545
                    },
                    "new_handle": {
                        "accesses_by_month": {
                            "2014-05": 4,
                            "2014-08": 25
                        },
                        "total_count": 29
                    },
                    "persist_handle": {
                        "accesses_by_month": {
                            "2014-08": 10,
                            "2014-09": 2,
                            "2014-10": 20
                        },
                        "total_count": 32
                    },
                    "version": {
                        "accesses_by_month": {
                            "2014-10": 2
                        },
                        "total_count": 2
                    },
                    "aliases_to_fids": {
                        "accesses_by_month": {
                            "2014-05": 14,
                            "2014-06": 760049,
                            "2014-07": 20,
                            "2014-08": 18
                        },
                        "total_count": 760101
                    },
                    "all_entities": {
                        "accesses_by_month": {
                            "2014-09": 2
                        },
                        "total_count": 2
                    },
                    "all_roles_used_in_models": {
                        "accesses_by_month": {
                            "2014-02": 54,
                            "2014-03": 24,
                            "2014-04": 34,
                            "2014-05": 16,
                            "2014-06": 66,
                            "2014-07": 4,
                            "2014-08": 2,
                            "2014-09": 38,
                            "2014-10": 118,
                            "2014-11": 12
                        },
                        "total_count": 368
                    },
                    "atomic_regulons_to_fids": {
                        "accesses_by_month": {
                            "2014-02": 10,
                            "2014-03": 990,
                            "2014-06": 3950,
                            "2014-07": 986,
                            "2014-09": 992,
                            "2014-10": 986,
                            "2014-11": 988
                        },
                        "total_count": 8902
                    },
                    "contigs_to_lengths": {
                        "accesses_by_month": {
                            "2014-02": 6378,
                            "2014-03": 56180,
                            "2014-04": 136,
                            "2014-05": 108,
                            "2014-06": 36192,
                            "2014-07": 50832,
                            "2014-08": 1588,
                            "2014-09": 440,
                            "2014-10": 2
                        },
                        "total_count": 151856
                    },
                    "contigs_to_md5s": {
                        "accesses_by_month": {
                            "2014-02": 5544,
                            "2014-03": 54916,
                            "2014-04": 8,
                            "2014-06": 35966,
                            "2014-07": 48874
                        },
                        "total_count": 145308
                    },
                    "contigs_to_sequences": {
                        "accesses_by_month": {
                            "2014-02": 331996,
                            "2014-03": 20690,
                            "2014-04": 21975,
                            "2014-05": 32581,
                            "2014-06": 56520,
                            "2014-07": 148,
                            "2014-08": 155835,
                            "2014-09": 5650,
                            "2014-10": 249750,
                            "2014-11": 393494
                        },
                        "total_count": 1268639
                    },
                    "corresponds_from_sequences": {
                        "accesses_by_month": {
                            "2014-03": 2,
                            "2014-04": 6,
                            "2014-06": 10,
                            "2014-09": 6,
                            "2014-10": 2
                        },
                        "total_count": 26
                    },
                    "external_ids_to_fids": {
                        "accesses_by_month": {
                            "2014-06": 1112,
                            "2014-07": 220
                        },
                        "total_count": 1332
                    },
                    "fids_to_annotations": {
                        "accesses_by_month": {
                            "2014-02": 1132,
                            "2014-03": 644,
                            "2014-04": 844,
                            "2014-05": 784,
                            "2014-06": 138,
                            "2014-07": 22158,
                            "2014-08": 26863,
                            "2014-09": 3891112,
                            "2014-10": 1326,
                            "2014-11": 1848
                        },
                        "total_count": 3946849
                    },
                    "fids_to_atomic_regulons": {
                        "accesses_by_month": {
                            "2014-02": 998,
                            "2014-03": 34,
                            "2014-06": 34,
                            "2014-09": 1486,
                            "2014-11": 2
                        },
                        "total_count": 2554
                    },
                    "fids_to_co_occurring_fids": {
                        "accesses_by_month": {
                            "2014-02": 1480,
                            "2014-03": 34,
                            "2014-04": 9756,
                            "2014-05": 108,
                            "2014-06": 32,
                            "2014-07": 10,
                            "2014-08": 150,
                            "2014-09": 2,
                            "2014-11": 2
                        },
                        "total_count": 11574
                    },
                    "fids_to_coexpressed_fids": {
                        "accesses_by_month": {
                            "2014-02": 16,
                            "2014-03": 44,
                            "2014-05": 6,
                            "2014-06": 87576,
                            "2014-07": 2,
                            "2014-09": 6,
                            "2014-11": 2
                        },
                        "total_count": 87652
                    },
                    "fids_to_dna_sequences": {
                        "accesses_by_month": {
                            "2014-02": 118,
                            "2014-03": 18588,
                            "2014-04": 29116,
                            "2014-05": 1262,
                            "2014-06": 52212,
                            "2014-07": 19216,
                            "2014-08": 4844,
                            "2014-09": 3030131,
                            "2014-10": 15609858,
                            "2014-11": 2606
                        },
                        "total_count": 18767951
                    },
                    "fids_to_feature_data": {
                        "accesses_by_month": {
                            "2014-02": 564,
                            "2014-03": 948,
                            "2014-04": 246,
                            "2014-05": 1882,
                            "2014-06": 30053,
                            "2014-07": 1236,
                            "2014-08": 30776,
                            "2014-09": 2594529,
                            "2014-10": 1338,
                            "2014-11": 15498
                        },
                        "total_count": 2677070
                    },
                    "fids_to_functions": {
                        "accesses_by_month": {
                            "2014-02": 12948,
                            "2014-03": 2404,
                            "2014-04": 2,
                            "2014-05": 8,
                            "2014-06": 277919,
                            "2014-07": 128897,
                            "2014-08": 1685472,
                            "2014-09": 4042667,
                            "2014-10": 2448,
                            "2014-11": 12858
                        },
                        "total_count": 6165623
                    },
                    "fids_to_genomes": {
                        "accesses_by_month": {
                            "2014-02": 359323,
                            "2014-03": 522188,
                            "2014-04": 516066,
                            "2014-05": 540926,
                            "2014-06": 518544,
                            "2014-07": 304776,
                            "2014-08": 538966,
                            "2014-09": 411120
                        },
                        "total_count": 3711909
                    },
                    "fids_to_literature": {
                        "accesses_by_month": {
                            "2014-02": 14,
                            "2014-03": 32,
                            "2014-06": 6,
                            "2014-08": 26579,
                            "2014-09": 836,
                            "2014-11": 2
                        },
                        "total_count": 27469
                    },
                    "fids_to_locations": {
                        "accesses_by_month": {
                            "2014-02": 12996,
                            "2014-03": 22718,
                            "2014-04": 320,
                            "2014-05": 70,
                            "2014-06": 40,
                            "2014-07": 24348,
                            "2014-08": 84169,
                            "2014-09": 5384,
                            "2014-10": 6466,
                            "2014-11": 4
                        },
                        "total_count": 156515
                    },
                    "fids_to_protein_families": {
                        "accesses_by_month": {
                            "2014-02": 128,
                            "2014-03": 470,
                            "2014-04": 74322,
                            "2014-05": 40,
                            "2014-06": 300,
                            "2014-07": 344,
                            "2014-08": 858,
                            "2014-09": 6,
                            "2014-11": 5506634
                        },
                        "total_count": 5583102
                    },
                    "fids_to_protein_sequences": {
                        "accesses_by_month": {
                            "2014-02": 90676,
                            "2014-03": 4620,
                            "2014-04": 87908,
                            "2014-05": 163826,
                            "2014-06": 307088,
                            "2014-07": 44164,
                            "2014-08": 40343,
                            "2014-09": 29690072,
                            "2014-10": 909292,
                            "2014-11": 2922
                        },
                        "total_count": 31340911
                    },
                    "fids_to_proteins": {
                        "accesses_by_month": {
                            "2014-02": 9587912,
                            "2014-03": 79954,
                            "2014-04": 63162,
                            "2014-05": 35202,
                            "2014-06": 33296,
                            "2014-07": 19398,
                            "2014-08": 1012542,
                            "2014-09": 36352,
                            "2014-10": 34668,
                            "2014-11": 12114
                        },
                        "total_count": 10914600
                    },
                    "fids_to_regulon_data": {
                        "accesses_by_month": {
                            "2014-02": 12,
                            "2014-03": 26,
                            "2014-06": 30,
                            "2014-09": 836
                        },
                        "total_count": 904
                    },
                    "fids_to_roles": {
                        "accesses_by_month": {
                            "2014-02": 346871,
                            "2014-03": 204574,
                            "2014-04": 3564,
                            "2014-05": 434,
                            "2014-06": 5873,
                            "2014-07": 26,
                            "2014-08": 13980,
                            "2014-09": 74836,
                            "2014-10": 3014,
                            "2014-11": 12
                        },
                        "total_count": 653184
                    },
                    "fids_to_subsystem_data": {
                        "accesses_by_month": {
                            "2014-02": 22,
                            "2014-03": 32,
                            "2014-06": 30,
                            "2014-09": 2,
                            "2014-10": 4,
                            "2014-11": 8
                        },
                        "total_count": 98
                    },
                    "fids_to_subsystems": {
                        "accesses_by_month": {
                            "2014-02": 36,
                            "2014-03": 32,
                            "2014-04": 84020,
                            "2014-05": 32,
                            "2014-06": 120,
                            "2014-07": 26,
                            "2014-09": 358,
                            "2014-10": 2266,
                            "2014-11": 2140
                        },
                        "total_count": 89030
                    },
                    "genomes_to_contigs": {
                        "accesses_by_month": {
                            "2014-02": 18682,
                            "2014-03": 61236,
                            "2014-04": 705,
                            "2014-05": 858,
                            "2014-06": 36448,
                            "2014-07": 49442,
                            "2014-08": 29474,
                            "2014-09": 575,
                            "2014-10": 1578,
                            "2014-11": 1866
                        },
                        "total_count": 200864
                    },
                    "genomes_to_fids": {
                        "accesses_by_month": {
                            "2014-02": 67007,
                            "2014-03": 1996,
                            "2014-04": 21656,
                            "2014-05": 4850,
                            "2014-06": 80042,
                            "2014-07": 110,
                            "2014-08": 20696,
                            "2014-09": 32139,
                            "2014-10": 47092,
                            "2014-11": 9993
                        },
                        "total_count": 285581
                    },
                    "genomes_to_genome_data": {
                        "accesses_by_month": {
                            "2014-02": 100754,
                            "2014-03": 130024,
                            "2014-04": 39961,
                            "2014-05": 744,
                            "2014-06": 57138,
                            "2014-07": 48996,
                            "2014-08": 220,
                            "2014-09": 9381,
                            "2014-10": 46078,
                            "2014-11": 1848
                        },
                        "total_count": 435144
                    },
                    "genomes_to_md5s": {
                        "accesses_by_month": {
                            "2014-02": 202,
                            "2014-03": 12,
                            "2014-06": 4,
                            "2014-09": 4,
                            "2014-10": 2,
                            "2014-11": 2
                        },
                        "total_count": 226
                    },
                    "genomes_to_subsystems": {
                        "accesses_by_month": {
                            "2014-02": 24,
                            "2014-03": 4,
                            "2014-04": 22,
                            "2014-06": 2,
                            "2014-08": 8,
                            "2014-09": 34,
                            "2014-11": 2
                        },
                        "total_count": 96
                    },
                    "genomes_to_taxonomies": {
                        "accesses_by_month": {
                            "2014-02": 37127,
                            "2014-03": 11513,
                            "2014-04": 6120,
                            "2014-05": 3580,
                            "2014-06": 242,
                            "2014-07": 288,
                            "2014-08": 13994,
                            "2014-09": 18579,
                            "2014-10": 4,
                            "2014-11": 2
                        },
                        "total_count": 91449
                    },
                    "locations_to_dna_sequences": {
                        "accesses_by_month": {
                            "2014-02": 2,
                            "2014-07": 2,
                            "2014-09": 4,
                            "2014-11": 2
                        },
                        "total_count": 10
                    },
                    "locations_to_fids": {
                        "accesses_by_month": {
                            "2014-02": 2,
                            "2014-03": 4,
                            "2014-05": 16,
                            "2014-06": 2,
                            "2014-07": 134,
                            "2014-09": 10,
                            "2014-11": 2
                        },
                        "total_count": 170
                    },
                    "md5s_to_genomes": {
                        "accesses_by_month": {
                            "2014-03": 2,
                            "2014-04": 2,
                            "2014-06": 4,
                            "2014-09": 6,
                            "2014-11": 2
                        },
                        "total_count": 16
                    },
                    "otu_members": {
                        "accesses_by_month": {
                            "2014-02": 4,
                            "2014-03": 58,
                            "2014-08": 4
                        },
                        "total_count": 66
                    },
                    "otus_to_representatives": {
                        "accesses_by_month": {
                            "2014-08": 384
                        },
                        "total_count": 384
                    },
                    "protein_families_to_co_occurring_families": {
                        "accesses_by_month": {
                            "2014-02": 4,
                            "2014-03": 2
                        },
                        "total_count": 6
                    },
                    "protein_families_to_fids": {
                        "accesses_by_month": {
                            "2014-02": 230,
                            "2014-03": 52,
                            "2014-06": 14,
                            "2014-08": 25430,
                            "2014-09": 2,
                            "2014-10": 12,
                            "2014-11": 8
                        },
                        "total_count": 25748
                    },
                    "protein_families_to_functions": {
                        "accesses_by_month": {
                            "2014-02": 34,
                            "2014-03": 20,
                            "2014-04": 2,
                            "2014-05": 8,
                            "2014-06": 2426,
                            "2014-07": 60,
                            "2014-08": 4,
                            "2014-09": 36726,
                            "2014-11": 87383
                        },
                        "total_count": 126663
                    },
                    "protein_families_to_proteins": {
                        "accesses_by_month": {
                            "2014-03": 2,
                            "2014-04": 2,
                            "2014-06": 2,
                            "2014-11": 2
                        },
                        "total_count": 8
                    },
                    "proteins_to_fids": {
                        "accesses_by_month": {
                            "2014-02": 11852,
                            "2014-03": 23632,
                            "2014-04": 172428,
                            "2014-05": 17476,
                            "2014-06": 16658,
                            "2014-07": 9580,
                            "2014-08": 17394,
                            "2014-09": 13274,
                            "2014-10": 8,
                            "2014-11": 2
                        },
                        "total_count": 282304
                    },
                    "proteins_to_functions": {
                        "accesses_by_month": {
                            "2014-03": 6,
                            "2014-04": 2,
                            "2014-06": 6,
                            "2014-08": 74404,
                            "2014-10": 4,
                            "2014-11": 2
                        },
                        "total_count": 74424
                    },
                    "proteins_to_literature": {
                        "accesses_by_month": {
                            "2014-06": 4,
                            "2014-09": 2,
                            "2014-11": 2
                        },
                        "total_count": 8
                    },
                    "proteins_to_protein_families": {
                        "accesses_by_month": {
                            "2014-02": 8,
                            "2014-04": 4,
                            "2014-08": 4,
                            "2014-10": 4
                        },
                        "total_count": 20
                    },
                    "proteins_to_roles": {
                        "accesses_by_month": {
                            "2014-02": 210,
                            "2014-03": 62,
                            "2014-04": 2,
                            "2014-06": 2,
                            "2014-08": 9192,
                            "2014-09": 2,
                            "2014-11": 4
                        },
                        "total_count": 9474
                    },
                    "reaction_strings": {
                        "accesses_by_month": {
                            "2014-02": 2,
                            "2014-03": 18,
                            "2014-04": 2,
                            "2014-05": 3118,
                            "2014-06": 325473,
                            "2014-09": 26414,
                            "2014-11": 13512
                        },
                        "total_count": 368539
                    },
                    "reactions_to_complexes": {
                        "accesses_by_month": {
                            "2014-03": 3,
                            "2014-04": 2,
                            "2014-06": 1,
                            "2014-11": 4
                        },
                        "total_count": 10
                    },
                    "region_to_fids": {
                        "accesses_by_month": {
                            "2014-02": 160,
                            "2014-03": 232,
                            "2014-04": 34,
                            "2014-05": 130,
                            "2014-06": 98,
                            "2014-07": 7226,
                            "2014-08": 55353,
                            "2014-09": 6310,
                            "2014-10": 400
                        },
                        "total_count": 69943
                    },
                    "regulons_to_fids": {
                        "accesses_by_month": {
                            "2014-06": 2792,
                            "2014-09": 2794,
                            "2014-11": 2792
                        },
                        "total_count": 8378
                    },
                    "roles_to_complexes": {
                        "accesses_by_month": {
                            "2014-02": 2,
                            "2014-03": 516,
                            "2014-06": 2,
                            "2014-11": 2
                        },
                        "total_count": 522
                    },
                    "roles_to_fids": {
                        "accesses_by_month": {
                            "2014-02": 90,
                            "2014-03": 1566,
                            "2014-06": 2,
                            "2014-08": 4,
                            "2014-09": 4,
                            "2014-11": 2
                        },
                        "total_count": 1668
                    },
                    "roles_to_protein_families": {
                        "accesses_by_month": {
                            "2014-02": 222,
                            "2014-03": 48,
                            "2014-06": 9622,
                            "2014-08": 25430,
                            "2014-09": 386410,
                            "2014-10": 12,
                            "2014-11": 386919
                        },
                        "total_count": 808663
                    },
                    "roles_to_proteins": {
                        "accesses_by_month": {
                            "2014-06": 5130,
                            "2014-08": 20,
                            "2014-09": 5130,
                            "2014-11": 2
                        },
                        "total_count": 10282
                    },
                    "roles_to_subsystems": {
                        "accesses_by_month": {
                            "2014-02": 8,
                            "2014-03": 8,
                            "2014-06": 2,
                            "2014-08": 2344,
                            "2014-09": 182,
                            "2014-10": 416,
                            "2014-11": 2
                        },
                        "total_count": 2962
                    },
                    "source_ids_to_fids": {
                        "accesses_by_month": {
                            "2014-06": 544,
                            "2014-07": 190,
                            "2014-08": 10412,
                            "2014-09": 384,
                            "2014-10": 214
                        },
                        "total_count": 11744
                    },
                    "subsystems_to_fids": {
                        "accesses_by_month": {
                            "2014-02": 1140,
                            "2014-03": 3714,
                            "2014-06": 2,
                            "2014-08": 470,
                            "2014-09": 148,
                            "2014-11": 2
                        },
                        "total_count": 5476
                    },
                    "subsystems_to_genomes": {
                        "accesses_by_month": {
                            "2014-06": 2,
                            "2014-09": 8,
                            "2014-11": 4
                        },
                        "total_count": 14
                    },
                    "subsystems_to_roles": {
                        "accesses_by_month": {
                            "2014-03": 322,
                            "2014-06": 300,
                            "2014-08": 242,
                            "2014-09": 468,
                            "2014-11": 2
                        },
                        "total_count": 1334
                    },
                    "subsystems_to_spreadsheets": {
                        "accesses_by_month": {
                            "2014-03": 2,
                            "2014-06": 6,
                            "2014-08": 234,
                            "2014-11": 2
                        },
                        "total_count": 244
                    },
                    "text_search": {
                        "accesses_by_month": {
                            "2014-05": 2,
                            "2014-07": 14
                        },
                        "total_count": 16
                    },
                    "traits_to_alleles": {
                        "accesses_by_month": {
                            "2014-07": 2
                        },
                        "total_count": 2
                    },
                    "tree_by_id": {
                        "accesses_by_month": {
                            "2014-07": 38
                        },
                        "total_count": 38
                    },
                    "all_entities_Alignment": {
                        "accesses_by_month": {
                            "2014-02": 4,
                            "2014-03": 4,
                            "2014-04": 4,
                            "2014-05": 4,
                            "2014-06": 4,
                            "2014-07": 8,
                            "2014-09": 4
                        },
                        "total_count": 32
                    },
                    "all_entities_AlignmentAttribute": {
                        "accesses_by_month": {
                            "2014-06": 8
                        },
                        "total_count": 8
                    },
                    "all_entities_Annotation": {
                        "accesses_by_month": {
                            "2014-05": 2,
                            "2014-06": 20,
                            "2014-08": 48,
                            "2014-10": 2
                        },
                        "total_count": 72
                    },
                    "all_entities_Assay": {
                        "accesses_by_month": {
                            "2014-02": 8,
                            "2014-04": 4
                        },
                        "total_count": 12
                    },
                    "all_entities_AssociationDataset": {
                        "accesses_by_month": {
                            "2014-06": 44,
                            "2014-08": 28
                        },
                        "total_count": 72
                    },
                    "all_entities_AssociationDetectionType": {
                        "accesses_by_month": {
                            "2014-06": 4,
                            "2014-08": 4
                        },
                        "total_count": 8
                    },
                    "all_entities_AtomicRegulon": {
                        "accesses_by_month": {
                            "2014-03": 4,
                            "2014-06": 16,
                            "2014-07": 4,
                            "2014-09": 8,
                            "2014-10": 4,
                            "2014-11": 4
                        },
                        "total_count": 40
                    },
                    "all_entities_Attribute": {
                        "accesses_by_month": {
                            "2014-05": 2
                        },
                        "total_count": 2
                    },
                    "all_entities_Biomass": {
                        "accesses_by_month": {
                            "2014-06": 4
                        },
                        "total_count": 4
                    },
                    "all_entities_CodonUsage": {
                        "accesses_by_month": {
                            "2014-05": 4
                        },
                        "total_count": 4
                    },
                    "all_entities_Complex": {
                        "accesses_by_month": {
                            "2014-03": 26,
                            "2014-06": 8,
                            "2014-08": 12
                        },
                        "total_count": 46
                    },
                    "all_entities_Compound": {
                        "accesses_by_month": {
                            "2014-02": 88,
                            "2014-03": 222,
                            "2014-04": 108,
                            "2014-06": 20,
                            "2014-08": 8,
                            "2014-10": 16
                        },
                        "total_count": 462
                    },
                    "all_entities_CompoundInstance": {
                        "accesses_by_month": {
                            "2014-03": 4,
                            "2014-04": 8,
                            "2014-06": 8
                        },
                        "total_count": 20
                    },
                    "all_entities_ConservedDomainModel": {
                        "accesses_by_month": {
                            "2014-04": 4,
                            "2014-06": 8
                        },
                        "total_count": 12
                    },
                    "all_entities_Contig": {
                        "accesses_by_month": {
                            "2014-02": 12,
                            "2014-03": 6,
                            "2014-09": 2,
                            "2014-10": 14
                        },
                        "total_count": 34
                    },
                    "all_entities_ContigChunk": {
                        "accesses_by_month": {
                            "2014-02": 28
                        },
                        "total_count": 28
                    },
                    "all_entities_ContigSequence": {
                        "accesses_by_month": {
                            "2014-02": 12,
                            "2014-09": 2
                        },
                        "total_count": 14
                    },
                    "all_entities_CoregulatedSet": {
                        "accesses_by_month": {
                            "2014-06": 8,
                            "2014-09": 12,
                            "2014-11": 8
                        },
                        "total_count": 28
                    },
                    "all_entities_Diagram": {
                        "accesses_by_month": {
                            "2014-08": 6
                        },
                        "total_count": 6
                    },
                    "all_entities_EcNumber": {
                        "accesses_by_month": {
                            "2014-04": 2
                        },
                        "total_count": 2
                    },
                    "all_entities_Experiment": {
                        "accesses_by_month": {
                            "2014-05": 4
                        },
                        "total_count": 4
                    },
                    "all_entities_Family": {
                        "accesses_by_month": {
                            "2014-03": 8,
                            "2014-05": 4,
                            "2014-06": 14,
                            "2014-08": 16,
                            "2014-09": 8,
                            "2014-11": 4
                        },
                        "total_count": 54
                    },
                    "all_entities_Feature": {
                        "accesses_by_month": {
                            "2014-02": 24,
                            "2014-03": 74,
                            "2014-04": 125,
                            "2014-05": 234,
                            "2014-06": 648,
                            "2014-07": 416,
                            "2014-08": 538,
                            "2014-09": 4,
                            "2014-10": 24
                        },
                        "total_count": 2087
                    },
                    "all_entities_Genome": {
                        "accesses_by_month": {
                            "2014-02": 2802,
                            "2014-03": 2034,
                            "2014-04": 1326,
                            "2014-05": 2132,
                            "2014-06": 2308,
                            "2014-07": 4807,
                            "2014-08": 808,
                            "2014-09": 658,
                            "2014-10": 322,
                            "2014-11": 40
                        },
                        "total_count": 17237
                    },
                    "all_entities_Locality": {
                        "accesses_by_month": {
                            "2014-04": 4
                        },
                        "total_count": 4
                    },
                    "all_entities_LocalizedCompound": {
                        "accesses_by_month": {
                            "2014-03": 4,
                            "2014-04": 4,
                            "2014-06": 8
                        },
                        "total_count": 16
                    },
                    "all_entities_Location": {
                        "accesses_by_month": {
                            "2014-03": 4,
                            "2014-04": 8,
                            "2014-06": 4
                        },
                        "total_count": 16
                    },
                    "all_entities_LocationInstance": {
                        "accesses_by_month": {
                            "2014-04": 4
                        },
                        "total_count": 4
                    },
                    "all_entities_Media": {
                        "accesses_by_month": {
                            "2014-02": 30,
                            "2014-03": 136,
                            "2014-04": 16,
                            "2014-05": 4,
                            "2014-06": 12,
                            "2014-07": 28,
                            "2014-08": 48
                        },
                        "total_count": 274
                    },
                    "all_entities_Model": {
                        "accesses_by_month": {
                            "2014-02": 4,
                            "2014-03": 10,
                            "2014-06": 8,
                            "2014-08": 4,
                            "2014-10": 4
                        },
                        "total_count": 30
                    },
                    "all_entities_OTU": {
                        "accesses_by_month": {
                            "2014-02": 20,
                            "2014-03": 202,
                            "2014-05": 16,
                            "2014-08": 24,
                            "2014-09": 12
                        },
                        "total_count": 274
                    },
                    "all_entities_Ontology": {
                        "accesses_by_month": {
                            "2014-08": 4
                        },
                        "total_count": 4
                    },
                    "all_entities_Pairing": {
                        "accesses_by_month": {
                            "2014-04": 18
                        },
                        "total_count": 18
                    },
                    "all_entities_ProbeSet": {
                        "accesses_by_month": {
                            "2014-03": 8,
                            "2014-05": 24
                        },
                        "total_count": 32
                    },
                    "all_entities_ProteinSequence": {
                        "accesses_by_month": {
                            "2014-02": 32,
                            "2014-04": 4,
                            "2014-06": 72,
                            "2014-07": 40
                        },
                        "total_count": 148
                    },
                    "all_entities_Publication": {
                        "accesses_by_month": {
                            "2014-02": 24,
                            "2014-03": 92,
                            "2014-04": 32,
                            "2014-05": 48,
                            "2014-06": 80,
                            "2014-07": 112,
                            "2014-08": 32,
                            "2014-09": 180,
                            "2014-10": 8,
                            "2014-11": 32
                        },
                        "total_count": 640
                    },
                    "all_entities_Reaction": {
                        "accesses_by_month": {
                            "2014-02": 8,
                            "2014-03": 162,
                            "2014-04": 22,
                            "2014-06": 40,
                            "2014-07": 12,
                            "2014-08": 36,
                            "2014-09": 152,
                            "2014-11": 28
                        },
                        "total_count": 460
                    },
                    "all_entities_ReactionInstance": {
                        "accesses_by_month": {
                            "2014-03": 6,
                            "2014-04": 12,
                            "2014-06": 6,
                            "2014-07": 6,
                            "2014-08": 6
                        },
                        "total_count": 36
                    },
                    "all_entities_Role": {
                        "accesses_by_month": {
                            "2014-02": 24,
                            "2014-03": 160,
                            "2014-06": 18,
                            "2014-07": 5,
                            "2014-09": 840,
                            "2014-10": 14,
                            "2014-11": 6
                        },
                        "total_count": 1067
                    },
                    "all_entities_Series": {
                        "accesses_by_month": {
                            "2014-10": 4
                        },
                        "total_count": 4
                    },
                    "all_entities_Source": {
                        "accesses_by_month": {
                            "2014-03": 20,
                            "2014-05": 8,
                            "2014-06": 32,
                            "2014-08": 8
                        },
                        "total_count": 68
                    },
                    "all_entities_Subsystem": {
                        "accesses_by_month": {
                            "2014-02": 12,
                            "2014-03": 114,
                            "2014-04": 4,
                            "2014-06": 20,
                            "2014-07": 28,
                            "2014-08": 44,
                            "2014-09": 8
                        },
                        "total_count": 230
                    },
                    "all_entities_SubsystemClass": {
                        "accesses_by_month": {
                            "2014-04": 4
                        },
                        "total_count": 4
                    },
                    "all_entities_TaxonomicGrouping": {
                        "accesses_by_month": {
                            "2014-03": 30
                        },
                        "total_count": 30
                    },
                    "all_entities_Trait": {
                        "accesses_by_month": {
                            "2014-02": 16,
                            "2014-07": 4
                        },
                        "total_count": 20
                    },
                    "all_entities_Tree": {
                        "accesses_by_month": {
                            "2014-03": 6,
                            "2014-06": 4,
                            "2014-07": 4,
                            "2014-08": 20
                        },
                        "total_count": 34
                    },
                    "all_entities_Variant": {
                        "accesses_by_month": {
                            "2014-06": 4
                        },
                        "total_count": 4
                    },
                    "get_all": {
                        "accesses_by_month": {
                            "2014-06": 550,
                            "2014-07": 953,
                            "2014-10": 2
                        },
                        "total_count": 1505
                    },
                    "get_entity_Annotation": {
                        "accesses_by_month": {
                            "2014-06": 4
                        },
                        "total_count": 4
                    },
                    "get_entity_Association": {
                        "accesses_by_month": {
                            "2014-06": 2,
                            "2014-08": 2
                        },
                        "total_count": 4
                    },
                    "get_entity_AssociationDataset": {
                        "accesses_by_month": {
                            "2014-06": 2,
                            "2014-08": 10
                        },
                        "total_count": 12
                    },
                    "get_entity_Complex": {
                        "accesses_by_month": {
                            "2014-05": 28,
                            "2014-06": 64
                        },
                        "total_count": 92
                    },
                    "get_entity_Compound": {
                        "accesses_by_month": {
                            "2014-04": 6,
                            "2014-06": 26,
                            "2014-09": 6
                        },
                        "total_count": 38
                    },
                    "get_entity_ConservedDomainModel": {
                        "accesses_by_month": {
                            "2014-04": 16,
                            "2014-06": 2
                        },
                        "total_count": 18
                    },
                    "get_entity_Contig": {
                        "accesses_by_month": {
                            "2014-02": 84,
                            "2014-03": 2,
                            "2014-04": 4,
                            "2014-05": 8,
                            "2014-07": 924,
                            "2014-08": 1566,
                            "2014-09": 440,
                            "2014-10": 2
                        },
                        "total_count": 3030
                    },
                    "get_entity_ContigChunk": {
                        "accesses_by_month": {
                            "2014-09": 6
                        },
                        "total_count": 6
                    },
                    "get_entity_ContigSequence": {
                        "accesses_by_month": {
                            "2014-04": 4
                        },
                        "total_count": 4
                    },
                    "get_entity_Family": {
                        "accesses_by_month": {
                            "2014-06": 6
                        },
                        "total_count": 6
                    },
                    "get_entity_Feature": {
                        "accesses_by_month": {
                            "2014-02": 16,
                            "2014-03": 162,
                            "2014-04": 18,
                            "2014-05": 1520,
                            "2014-06": 10842,
                            "2014-07": 6036,
                            "2014-08": 65274,
                            "2014-09": 6580,
                            "2014-10": 3428,
                            "2014-11": 13630
                        },
                        "total_count": 107506
                    },
                    "get_entity_Genome": {
                        "accesses_by_month": {
                            "2014-02": 6637,
                            "2014-03": 10144,
                            "2014-04": 8645,
                            "2014-05": 8946,
                            "2014-06": 8818,
                            "2014-07": 6178,
                            "2014-08": 10938,
                            "2014-09": 8645,
                            "2014-10": 8776,
                            "2014-11": 3148
                        },
                        "total_count": 80875
                    },
                    "get_entity_ProteinSequence": {
                        "accesses_by_month": {
                            "2014-02": 9544185,
                            "2014-03": 682,
                            "2014-04": 6,
                            "2014-05": 7217,
                            "2014-06": 126,
                            "2014-07": 250,
                            "2014-08": 822779,
                            "2014-09": 1335,
                            "2014-10": 4
                        },
                        "total_count": 10376584
                    },
                    "get_entity_Publication": {
                        "accesses_by_month": {
                            "2014-06": 24
                        },
                        "total_count": 24
                    },
                    "get_entity_Reaction": {
                        "accesses_by_month": {
                            "2014-02": 5061,
                            "2014-03": 279775,
                            "2014-04": 116300,
                            "2014-05": 91063,
                            "2014-06": 60722,
                            "2014-07": 10114,
                            "2014-08": 70916,
                            "2014-09": 5236,
                            "2014-10": 46,
                            "2014-11": 32
                        },
                        "total_count": 639265
                    },
                    "get_entity_Role": {
                        "accesses_by_month": {
                            "2014-05": 2,
                            "2014-09": 40,
                            "2014-10": 10
                        },
                        "total_count": 52
                    },
                    "get_entity_Sample": {
                        "accesses_by_month": {
                            "2014-10": 2
                        },
                        "total_count": 2
                    },
                    "get_entity_Source": {
                        "accesses_by_month": {
                            "2014-08": 2
                        },
                        "total_count": 2
                    },
                    "get_entity_Subsystem": {
                        "accesses_by_month": {
                            "2014-02": 4,
                            "2014-03": 6,
                            "2014-07": 50,
                            "2014-10": 4
                        },
                        "total_count": 64
                    },
                    "get_entity_TaxonomicGrouping": {
                        "accesses_by_month": {
                            "2014-09": 4
                        },
                        "total_count": 4
                    },
                    "get_entity_Trait": {
                        "accesses_by_month": {
                            "2014-07": 2
                        },
                        "total_count": 2
                    },
                    "get_entity_Tree": {
                        "accesses_by_month": {
                            "2014-03": 24,
                            "2014-04": 4,
                            "2014-05": 3,
                            "2014-07": 6
                        },
                        "total_count": 37
                    },
                    "get_relationship_AssertsAliasFor": {
                        "accesses_by_month": {
                            "2014-06": 10,
                            "2014-07": 2,
                            "2014-08": 4
                        },
                        "total_count": 16
                    },
                    "get_relationship_AssociationDatasetSourcedBy": {
                        "accesses_by_month": {
                            "2014-06": 2
                        },
                        "total_count": 2
                    },
                    "get_relationship_AssociationFeature": {
                        "accesses_by_month": {
                            "2014-08": 38637,
                            "2014-09": 22305
                        },
                        "total_count": 60942
                    },
                    "get_relationship_Concerns": {
                        "accesses_by_month": {
                            "2014-02": 6,
                            "2014-03": 12487,
                            "2014-04": 24944,
                            "2014-05": 12472,
                            "2014-06": 46783,
                            "2014-07": 18707,
                            "2014-08": 3336,
                            "2014-09": 20337,
                            "2014-10": 3334,
                            "2014-11": 10002
                        },
                        "total_count": 152408
                    },
                    "get_relationship_ConsistsOfCompounds": {
                        "accesses_by_month": {
                            "2014-02": 5598,
                            "2014-03": 3012
                        },
                        "total_count": 8610
                    },
                    "get_relationship_Encompasses": {
                        "accesses_by_month": {
                            "2014-03": 4,
                            "2014-07": 42,
                            "2014-08": 18
                        },
                        "total_count": 64
                    },
                    "get_relationship_HadResultsProducedBy": {
                        "accesses_by_month": {
                            "2014-05": 94
                        },
                        "total_count": 94
                    },
                    "get_relationship_HasAliasAssertedFrom": {
                        "accesses_by_month": {
                            "2014-02": 355047,
                            "2014-05": 26,
                            "2014-06": 50,
                            "2014-07": 2,
                            "2014-08": 26196
                        },
                        "total_count": 381321
                    },
                    "get_relationship_HasCompoundAliasFrom": {
                        "accesses_by_month": {
                            "2014-02": 2,
                            "2014-09": 2,
                            "2014-10": 4
                        },
                        "total_count": 8
                    },
                    "get_relationship_HasConservedDomainModel": {
                        "accesses_by_month": {
                            "2014-02": 22,
                            "2014-04": 12,
                            "2014-06": 6,
                            "2014-10": 4
                        },
                        "total_count": 44
                    },
                    "get_relationship_HasFunctional": {
                        "accesses_by_month": {
                            "2014-02": 84384,
                            "2014-03": 720512,
                            "2014-05": 14,
                            "2014-06": 232449,
                            "2014-07": 70334,
                            "2014-08": 30216,
                            "2014-09": 1020221,
                            "2014-10": 22
                        },
                        "total_count": 2158152
                    },
                    "get_relationship_HasIndicatedSignalFrom": {
                        "accesses_by_month": {
                            "2014-06": 10497572
                        },
                        "total_count": 10497572
                    },
                    "get_relationship_HasParticipant": {
                        "accesses_by_month": {
                            "2014-04": 6
                        },
                        "total_count": 6
                    },
                    "get_relationship_HasProteinMember": {
                        "accesses_by_month": {
                            "2014-03": 136464
                        },
                        "total_count": 136464
                    },
                    "get_relationship_HasReactionAliasFrom": {
                        "accesses_by_month": {
                            "2014-03": 14
                        },
                        "total_count": 14
                    },
                    "get_relationship_HasRepresentativeOf": {
                        "accesses_by_month": {
                            "2014-09": 1022
                        },
                        "total_count": 1022
                    },
                    "get_relationship_HasResultsIn": {
                        "accesses_by_month": {
                            "2014-03": 4,
                            "2014-05": 96
                        },
                        "total_count": 100
                    },
                    "get_relationship_HasRole": {
                        "accesses_by_month": {
                            "2014-09": 4
                        },
                        "total_count": 4
                    },
                    "get_relationship_HasSection": {
                        "accesses_by_month": {
                            "2014-02": 811518
                        },
                        "total_count": 811518
                    },
                    "get_relationship_HasStep": {
                        "accesses_by_month": {
                            "2014-03": 416366,
                            "2014-06": 43106,
                            "2014-09": 692365,
                            "2014-10": 12
                        },
                        "total_count": 1151849
                    },
                    "get_relationship_ImplementsReaction": {
                        "accesses_by_month": {
                            "2014-05": 940
                        },
                        "total_count": 940
                    },
                    "get_relationship_Includes": {
                        "accesses_by_month": {
                            "2014-06": 588,
                            "2014-07": 41
                        },
                        "total_count": 629
                    },
                    "get_relationship_IndicatesSignalFor": {
                        "accesses_by_month": {
                            "2014-05": 1304
                        },
                        "total_count": 1304
                    },
                    "get_relationship_Involves": {
                        "accesses_by_month": {
                            "2014-02": 24,
                            "2014-03": 928,
                            "2014-04": 4
                        },
                        "total_count": 956
                    },
                    "get_relationship_IsATopicOf": {
                        "accesses_by_month": {
                            "2014-06": 10463644,
                            "2014-09": 2803014
                        },
                        "total_count": 13266658
                    },
                    "get_relationship_IsAnnotatedBy": {
                        "accesses_by_month": {
                            "2014-06": 28,
                            "2014-08": 3686
                        },
                        "total_count": 3714
                    },
                    "get_relationship_IsCollectionOf": {
                        "accesses_by_month": {
                            "2014-02": 10,
                            "2014-03": 100,
                            "2014-05": 644,
                            "2014-08": 20
                        },
                        "total_count": 774
                    },
                    "get_relationship_IsComposedOf": {
                        "accesses_by_month": {
                            "2014-02": 248,
                            "2014-03": 428,
                            "2014-04": 140,
                            "2014-05": 652,
                            "2014-06": 132,
                            "2014-07": 22,
                            "2014-08": 140,
                            "2014-09": 78,
                            "2014-10": 1326,
                            "2014-11": 1848
                        },
                        "total_count": 5014
                    },
                    "get_relationship_IsComprisedOf": {
                        "accesses_by_month": {
                            "2014-09": 2
                        },
                        "total_count": 2
                    },
                    "get_relationship_IsDatasetFor": {
                        "accesses_by_month": {
                            "2014-08": 55021,
                            "2014-09": 52789
                        },
                        "total_count": 107810
                    },
                    "get_relationship_IsEncompassedIn": {
                        "accesses_by_month": {
                            "2014-03": 84204,
                            "2014-07": 2,
                            "2014-08": 19783,
                            "2014-09": 700,
                            "2014-10": 364
                        },
                        "total_count": 105053
                    },
                    "get_relationship_IsExecutionOf": {
                        "accesses_by_month": {
                            "2014-07": 13512
                        },
                        "total_count": 13512
                    },
                    "get_relationship_IsFunctionalIn": {
                        "accesses_by_month": {
                            "2014-05": 224,
                            "2014-06": 49686,
                            "2014-07": 68,
                            "2014-09": 384,
                            "2014-10": 48
                        },
                        "total_count": 50410
                    },
                    "get_relationship_IsGroupFor": {
                        "accesses_by_month": {
                            "2014-03": 4
                        },
                        "total_count": 4
                    },
                    "get_relationship_IsGroupingOf": {
                        "accesses_by_month": {
                            "2014-08": 32,
                            "2014-09": 6
                        },
                        "total_count": 38
                    },
                    "get_relationship_IsInClass": {
                        "accesses_by_month": {
                            "2014-06": 302,
                            "2014-08": 928
                        },
                        "total_count": 1230
                    },
                    "get_relationship_IsInGroup": {
                        "accesses_by_month": {
                            "2014-03": 170
                        },
                        "total_count": 170
                    },
                    "get_relationship_IsInTaxa": {
                        "accesses_by_month": {
                            "2014-03": 2836,
                            "2014-04": 4,
                            "2014-06": 400,
                            "2014-08": 14,
                            "2014-09": 10,
                            "2014-10": 2
                        },
                        "total_count": 3266
                    },
                    "get_relationship_IsIncludedIn": {
                        "accesses_by_month": {
                            "2014-07": 70315
                        },
                        "total_count": 70315
                    },
                    "get_relationship_IsInvolvedIn": {
                        "accesses_by_month": {
                            "2014-04": 4704,
                            "2014-05": 360,
                            "2014-06": 58,
                            "2014-07": 26,
                            "2014-09": 22,
                            "2014-10": 22
                        },
                        "total_count": 5192
                    },
                    "get_relationship_IsLocatedIn": {
                        "accesses_by_month": {
                            "2014-02": 686615,
                            "2014-03": 14,
                            "2014-04": 6,
                            "2014-05": 70,
                            "2014-06": 41,
                            "2014-09": 1293037,
                            "2014-10": 92
                        },
                        "total_count": 1979875
                    },
                    "get_relationship_IsLocusFor": {
                        "accesses_by_month": {
                            "2014-02": 20
                        },
                        "total_count": 20
                    },
                    "get_relationship_IsMemberOf": {
                        "accesses_by_month": {
                            "2014-06": 28,
                            "2014-09": 204378
                        },
                        "total_count": 204406
                    },
                    "get_relationship_IsModeledBy": {
                        "accesses_by_month": {
                            "2014-08": 4
                        },
                        "total_count": 4
                    },
                    "get_relationship_IsOwnedBy": {
                        "accesses_by_month": {
                            "2014-02": 24499,
                            "2014-03": 36797,
                            "2014-04": 88223,
                            "2014-05": 17390,
                            "2014-06": 16620,
                            "2014-07": 9609,
                            "2014-08": 1736,
                            "2014-09": 6,
                            "2014-10": 2
                        },
                        "total_count": 194882
                    },
                    "get_relationship_IsOwnerOf": {
                        "accesses_by_month": {
                            "2014-02": 104,
                            "2014-03": 1611,
                            "2014-04": 984,
                            "2014-05": 76,
                            "2014-06": 348,
                            "2014-07": 70457,
                            "2014-08": 116,
                            "2014-09": 1414,
                            "2014-10": 94,
                            "2014-11": 4
                        },
                        "total_count": 75208
                    },
                    "get_relationship_IsParticipationOf": {
                        "accesses_by_month": {
                            "2014-02": 22,
                            "2014-03": 5954
                        },
                        "total_count": 5976
                    },
                    "get_relationship_IsProteinFor": {
                        "accesses_by_month": {
                            "2014-02": 6,
                            "2014-03": 3975,
                            "2014-04": 11880,
                            "2014-05": 9058,
                            "2014-06": 15846,
                            "2014-07": 1980,
                            "2014-08": 7,
                            "2014-09": 8136
                        },
                        "total_count": 50888
                    },
                    "get_relationship_IsProteinMemberOf": {
                        "accesses_by_month": {
                            "2014-02": 161066
                        },
                        "total_count": 161066
                    },
                    "get_relationship_IsSequenceOf": {
                        "accesses_by_month": {
                            "2014-02": 12
                        },
                        "total_count": 12
                    },
                    "get_relationship_IsSourceForAssociationDataset": {
                        "accesses_by_month": {
                            "2014-08": 32,
                            "2014-09": 6
                        },
                        "total_count": 38
                    },
                    "get_relationship_IsStepOf": {
                        "accesses_by_month": {
                            "2014-03": 8,
                            "2014-05": 370,
                            "2014-06": 20292,
                            "2014-07": 6,
                            "2014-08": 4,
                            "2014-09": 13704,
                            "2014-10": 96
                        },
                        "total_count": 34480
                    },
                    "get_relationship_IsSubclassOf": {
                        "accesses_by_month": {
                            "2014-08": 216
                        },
                        "total_count": 216
                    },
                    "get_relationship_IsSuperclassOf": {
                        "accesses_by_month": {
                            "2014-08": 216
                        },
                        "total_count": 216
                    },
                    "get_relationship_IsTaxonomyOf": {
                        "accesses_by_month": {
                            "2014-03": 12,
                            "2014-09": 10
                        },
                        "total_count": 22
                    },
                    "get_relationship_IsTriggeredBy": {
                        "accesses_by_month": {
                            "2014-03": 6,
                            "2014-05": 230,
                            "2014-06": 1590,
                            "2014-07": 6,
                            "2014-08": 4,
                            "2014-09": 520,
                            "2014-10": 48
                        },
                        "total_count": 2404
                    },
                    "get_relationship_IsUsageOf": {
                        "accesses_by_month": {
                            "2014-03": 607508
                        },
                        "total_count": 607508
                    },
                    "get_relationship_IsUsedBy": {
                        "accesses_by_month": {
                            "2014-03": 928,
                            "2014-04": 6756
                        },
                        "total_count": 7684
                    },
                    "get_relationship_Models": {
                        "accesses_by_month": {
                            "2014-02": 4,
                            "2014-03": 6
                        },
                        "total_count": 10
                    },
                    "get_relationship_ParticipatesAs": {
                        "accesses_by_month": {
                            "2014-04": 5576,
                            "2014-05": 376,
                            "2014-06": 64,
                            "2014-07": 26,
                            "2014-09": 26,
                            "2014-10": 22
                        },
                        "total_count": 6090
                    },
                    "get_relationship_ParticipatesIn": {
                        "accesses_by_month": {
                            "2014-04": 8
                        },
                        "total_count": 8
                    },
                    "get_relationship_ProducedResultsFor": {
                        "accesses_by_month": {
                            "2014-03": 6,
                            "2014-05": 24
                        },
                        "total_count": 30
                    },
                    "get_relationship_Produces": {
                        "accesses_by_month": {
                            "2014-02": 688563,
                            "2014-03": 14,
                            "2014-04": 22,
                            "2014-05": 94,
                            "2014-06": 14857146,
                            "2014-07": 70982,
                            "2014-08": 2513721,
                            "2014-09": 9971843,
                            "2014-10": 510,
                            "2014-11": 42
                        },
                        "total_count": 28102937
                    },
                    "get_relationship_Submitted": {
                        "accesses_by_month": {
                            "2014-02": 134,
                            "2014-03": 24,
                            "2014-05": 12,
                            "2014-06": 100,
                            "2014-07": 14,
                            "2014-08": 140,
                            "2014-09": 36,
                            "2014-10": 106
                        },
                        "total_count": 566
                    },
                    "get_relationship_Triggers": {
                        "accesses_by_month": {
                            "2014-03": 494767,
                            "2014-06": 92325,
                            "2014-09": 1060769,
                            "2014-10": 20
                        },
                        "total_count": 1647881
                    },
                    "get_relationship_UsesAliasForCompound": {
                        "accesses_by_month": {
                            "2014-04": 77960
                        },
                        "total_count": 77960
                    },
                    "get_relationship_UsesAliasForReaction": {
                        "accesses_by_month": {
                            "2014-03": 2
                        },
                        "total_count": 2
                    },
                    "get_relationship_UsesCodons": {
                        "accesses_by_month": {
                            "2014-05": 2
                        },
                        "total_count": 2
                    },
                    "get_relationship_WasSubmittedBy": {
                        "accesses_by_month": {
                            "2014-02": 10,
                            "2014-03": 2394,
                            "2014-05": 2,
                            "2014-07": 8,
                            "2014-09": 2,
                            "2014-10": 2
                        },
                        "total_count": 2418
                    },
                    "query_entity_Compound": {
                        "accesses_by_month": {
                            "2014-06": 114
                        },
                        "total_count": 114
                    },
                    "query_entity_Contig": {
                        "accesses_by_month": {
                            "2014-04": 4
                        },
                        "total_count": 4
                    },
                    "query_entity_Diagram": {
                        "accesses_by_month": {
                            "2014-08": 2
                        },
                        "total_count": 2
                    },
                    "query_entity_Feature": {
                        "accesses_by_month": {
                            "2014-02": 14,
                            "2014-05": 6,
                            "2014-06": 4
                        },
                        "total_count": 24
                    },
                    "query_entity_Genome": {
                        "accesses_by_month": {
                            "2014-04": 4,
                            "2014-05": 8,
                            "2014-06": 4,
                            "2014-08": 4
                        },
                        "total_count": 20
                    },
                    "query_entity_Media": {
                        "accesses_by_month": {
                            "2014-06": 2,
                            "2014-07": 2
                        },
                        "total_count": 4
                    },
                    "query_entity_Reaction": {
                        "accesses_by_month": {
                            "2014-03": 2,
                            "2014-08": 2
                        },
                        "total_count": 4
                    },
                    "run_cmonkey": {
                        "accesses_by_month": {
                            "2014-02": 10
                        },
                        "total_count": 10
                    },
                    "const_coex_net_clust": {
                        "accesses_by_month": {
                            "2014-07": 4,
                            "2014-08": 2344,
                            "2014-09": 732,
                            "2014-10": 8
                        },
                        "total_count": 3088
                    },
                    "filter_genes": {
                        "accesses_by_month": {
                            "2014-07": 4,
                            "2014-08": 3514,
                            "2014-09": 1098,
                            "2014-10": 10
                        },
                        "total_count": 4626
                    },
                    "build_matrix": {
                        "accesses_by_month": {
                            "2014-01": 2023,
                            "2014-02": 4292,
                            "2014-03": 3783,
                            "2014-04": 8329,
                            "2014-05": 4473,
                            "2014-06": 4632,
                            "2014-07": 5426,
                            "2014-08": 8924,
                            "2014-09": 8500,
                            "2014-10": 8741,
                            "2014-11": 3122
                        },
                        "total_count": 62245
                    },
                    "GetAll": {
                        "accesses_by_month": {
                            "2014-03": 122576,
                            "2014-04": 347856,
                            "2014-05": 44086,
                            "2014-06": 41682,
                            "2014-07": 23590,
                            "2014-08": 44016,
                            "2014-09": 42049,
                            "2014-10": 42842,
                            "2014-11": 15232
                        },
                        "total_count": 723929
                    },
                    "runSQL": {
                        "accesses_by_month": {
                            "2014-07": 10,
                            "2014-08": 68,
                            "2014-09": 22,
                            "2014-10": 6
                        },
                        "total_count": 106
                    },
                    "get_file_type": {
                        "accesses_by_month": {
                            "2014-03": 5444,
                            "2014-04": 8483,
                            "2014-05": 8758,
                            "2014-06": 8418,
                            "2014-07": 4808,
                            "2014-08": 8910,
                            "2014-09": 8500,
                            "2014-10": 8724,
                            "2014-11": 3108
                        },
                        "total_count": 65153
                    },
                    "calculate_kinship_matrix": {
                        "accesses_by_month": {
                            "2014-08": 1164,
                            "2014-09": 372,
                            "2014-10": 4
                        },
                        "total_count": 1540
                    },
                    "genelist_to_networks": {
                        "accesses_by_month": {
                            "2014-08": 226,
                            "2014-09": 40,
                            "2014-10": 24
                        },
                        "total_count": 290
                    },
                    "prepare_variation": {
                        "accesses_by_month": {
                            "2014-08": 1266,
                            "2014-09": 370,
                            "2014-10": 12
                        },
                        "total_count": 1648
                    },
                    "run_gwas": {
                        "accesses_by_month": {
                            "2014-08": 1200,
                            "2014-09": 406,
                            "2014-10": 6
                        },
                        "total_count": 1612
                    },
                    "variations_to_genes": {
                        "accesses_by_month": {
                            "2014-08": 1222,
                            "2014-09": 420,
                            "2014-10": 4
                        },
                        "total_count": 1646
                    },
                    "add_contigs": {
                        "accesses_by_month": {
                            "2014-07": 16
                        },
                        "total_count": 16
                    },
                    "annotate_genome": {
                        "accesses_by_month": {
                            "2014-03": 122,
                            "2014-04": 179,
                            "2014-05": 212,
                            "2014-06": 185,
                            "2014-07": 22
                        },
                        "total_count": 720
                    },
                    "annotate_proteins": {
                        "accesses_by_month": {
                            "2014-03": 15,
                            "2014-04": 65,
                            "2014-05": 18,
                            "2014-06": 16,
                            "2014-07": 16
                        },
                        "total_count": 130
                    },
                    "annotate_proteins_kmer_v1": {
                        "accesses_by_month": {
                            "2014-04": 2,
                            "2014-05": 2
                        },
                        "total_count": 4
                    },
                    "annotate_proteins_kmer_v2": {
                        "accesses_by_month": {
                            "2014-03": 2,
                            "2014-04": 9,
                            "2014-05": 2,
                            "2014-07": 4
                        },
                        "total_count": 17
                    },
                    "assign_functions_to_CDSs": {
                        "accesses_by_month": {
                            "2014-04": 4048,
                            "2014-05": 8798,
                            "2014-06": 8438,
                            "2014-07": 4345
                        },
                        "total_count": 25629
                    },
                    "call_RNAs": {
                        "accesses_by_month": {
                            "2014-04": 2
                        },
                        "total_count": 2
                    },
                    "call_features_CDS_glimmer3": {
                        "accesses_by_month": {
                            "2014-04": 2
                        },
                        "total_count": 2
                    },
                    "call_features_CDS_prodigal": {
                        "accesses_by_month": {
                            "2014-03": 2,
                            "2014-04": 8,
                            "2014-05": 37,
                            "2014-06": 76,
                            "2014-07": 4
                        },
                        "total_count": 127
                    },
                    "call_features_ProtoCDS_kmer_v2": {
                        "accesses_by_month": {
                            "2014-04": 2
                        },
                        "total_count": 2
                    },
                    "call_features_crispr": {
                        "accesses_by_month": {
                            "2014-05": 18
                        },
                        "total_count": 18
                    },
                    "call_features_prophage_phispy": {
                        "accesses_by_month": {
                            "2014-04": 2,
                            "2014-05": 2
                        },
                        "total_count": 4
                    },
                    "call_features_rRNA_SEED": {
                        "accesses_by_month": {
                            "2014-04": 7,
                            "2014-05": 24,
                            "2014-06": 2
                        },
                        "total_count": 33
                    },
                    "call_features_repeat_region_SEED": {
                        "accesses_by_month": {
                            "2014-04": 5,
                            "2014-05": 20
                        },
                        "total_count": 25
                    },
                    "call_features_strep_pneumo_repeat": {
                        "accesses_by_month": {
                            "2014-03": 1
                        },
                        "total_count": 1
                    },
                    "call_features_tRNA_trnascan": {
                        "accesses_by_month": {
                            "2014-04": 7,
                            "2014-05": 18
                        },
                        "total_count": 25
                    },
                    "call_pyrrolysoproteins": {
                        "accesses_by_month": {
                            "2014-03": 2,
                            "2014-04": 6
                        },
                        "total_count": 8
                    },
                    "call_selenoproteins": {
                        "accesses_by_month": {
                            "2014-03": 4,
                            "2014-04": 6
                        },
                        "total_count": 10
                    },
                    "create_genome": {
                        "accesses_by_month": {
                            "2014-07": 16
                        },
                        "total_count": 16
                    },
                    "default_workflow": {
                        "accesses_by_month": {
                            "2014-04": 18,
                            "2014-05": 10,
                            "2014-06": 44,
                            "2014-07": 22
                        },
                        "total_count": 94
                    },
                    "export_genome": {
                        "accesses_by_month": {
                            "2014-03": 1,
                            "2014-04": 4,
                            "2014-05": 10,
                            "2014-06": 2,
                            "2014-07": 3
                        },
                        "total_count": 20
                    },
                    "genomeTO_to_feature_data": {
                        "accesses_by_month": {
                            "2014-03": 8,
                            "2014-04": 28,
                            "2014-05": 64,
                            "2014-06": 50,
                            "2014-07": 2
                        },
                        "total_count": 152
                    },
                    "genomeTO_to_reconstructionTO": {
                        "accesses_by_month": {
                            "2014-03": 6,
                            "2014-04": 24,
                            "2014-05": 10,
                            "2014-06": 38,
                            "2014-07": 2
                        },
                        "total_count": 80
                    },
                    "reconstructionTO_to_roles": {
                        "accesses_by_month": {
                            "2014-03": 4,
                            "2014-04": 24,
                            "2014-05": 10,
                            "2014-06": 30
                        },
                        "total_count": 68
                    },
                    "reconstructionTO_to_subsystems": {
                        "accesses_by_month": {
                            "2014-03": 4,
                            "2014-04": 28,
                            "2014-05": 8,
                            "2014-06": 28
                        },
                        "total_count": 68
                    },
                    "run_pipeline": {
                        "accesses_by_month": {
                            "2014-04": 7,
                            "2014-05": 4,
                            "2014-07": 15
                        },
                        "total_count": 26
                    },
                    "annotate_genome": {
                        "accesses_by_month": {
                            "2014-08": 62,
                            "2014-09": 6,
                            "2014-10": 90
                        },
                        "total_count": 158
                    },
                    "blast_proteomes": {
                        "accesses_by_month": {
                            "2014-08": 32,
                            "2014-09": 6,
                            "2014-10": 16,
                            "2014-11": 6
                        },
                        "total_count": 60
                    },
                    "get_ncbi_genome_names": {
                        "accesses_by_month": {
                            "2014-10": 6
                        },
                        "total_count": 6
                    },
                    "import_ncbi_genome": {
                        "accesses_by_month": {
                            "2014-07": 6,
                            "2014-08": 64,
                            "2014-09": 8,
                            "2014-10": 48,
                            "2014-11": 1
                        },
                        "total_count": 127
                    },
                    "get_traits": {
                        "accesses_by_month": {
                            "2014-03": 5429,
                            "2014-04": 8480,
                            "2014-05": 8756,
                            "2014-06": 8418,
                            "2014-07": 4798,
                            "2014-08": 8950,
                            "2014-09": 5080
                        },
                        "total_count": 49911
                    },
                    "add_read_acl": {
                        "accesses_by_month": {
                            "2014-09": 3,
                            "2014-10": 37,
                            "2014-11": 1
                        },
                        "total_count": 41
                    },
                    "allocate_id_range": {
                        "accesses_by_month": {
                            "2014-03": 3682,
                            "2014-04": 88809,
                            "2014-05": 169062,
                            "2014-06": 163620,
                            "2014-07": 880924,
                            "2014-08": 110852,
                            "2014-09": 149668,
                            "2014-10": 791574,
                            "2014-11": 66418
                        },
                        "total_count": 2424609
                    },
                    "external_ids_to_kbase_ids": {
                        "accesses_by_month": {
                            "2014-03": 1841,
                            "2014-04": 8496,
                            "2014-05": 9231,
                            "2014-06": 41659,
                            "2014-07": 2022133,
                            "2014-08": 25283,
                            "2014-09": 13580,
                            "2014-10": 8838,
                            "2014-11": 3125
                        },
                        "total_count": 2134186
                    },
                    "kbase_ids_to_external_ids": {
                        "accesses_by_month": {
                            "2014-03": 1846,
                            "2014-04": 83509,
                            "2014-05": 8783,
                            "2014-06": 2338378,
                            "2014-07": 4996,
                            "2014-08": 10508,
                            "2014-09": 8527,
                            "2014-10": 8788,
                            "2014-11": 3130
                        },
                        "total_count": 2468465
                    },
                    "register_allocated_ids": {
                        "accesses_by_month": {
                            "2014-06": 818,
                            "2014-07": 735230,
                            "2014-09": 1,
                            "2014-10": 10
                        },
                        "total_count": 736059
                    },
                    "register_ids": {
                        "accesses_by_month": {
                            "2014-03": 47553,
                            "2014-04": 487604,
                            "2014-05": 56597,
                            "2014-06": 3238607,
                            "2014-07": 3630,
                            "2014-08": 23182,
                            "2014-09": 21093,
                            "2014-10": 1659945,
                            "2014-11": 1927
                        },
                        "total_count": 5540138
                    },
                    "longest_cds_from_locus": {
                        "accesses_by_month": {
                            "2014-06": 234,
                            "2014-07": 3144,
                            "2014-08": 51979,
                            "2014-09": 5390,
                            "2014-10": 422
                        },
                        "total_count": 61169
                    },
                    "longest_cds_from_mrna": {
                        "accesses_by_month": {
                            "2014-08": 2,
                            "2014-09": 6,
                            "2014-10": 4
                        },
                        "total_count": 12
                    },
                    "lookup_feature_synonyms": {
                        "accesses_by_month": {
                            "2014-09": 22,
                            "2014-10": 12
                        },
                        "total_count": 34
                    },
                    "lookup_features": {
                        "accesses_by_month": {
                            "2014-06": 334,
                            "2014-07": 863218,
                            "2014-08": 2,
                            "2014-09": 5
                        },
                        "total_count": 863559
                    },
                    "version": {
                        "accesses_by_month": {
                            "2014-04": 8709,
                            "2014-05": 8760,
                            "2014-06": 8416,
                            "2014-07": 4816,
                            "2014-08": 8754,
                            "2014-09": 8512,
                            "2014-10": 8724,
                            "2014-11": 3126
                        },
                        "total_count": 59817
                    },
                    "run_inferelator": {
                        "accesses_by_month": {
                            "2014-02": 2
                        },
                        "total_count": 2
                    },
                    "change_directory": {
                        "accesses_by_month": {
                            "2014-01": 296,
                            "2014-02": 128,
                            "2014-03": 110,
                            "2014-04": 224,
                            "2014-05": 331,
                            "2014-06": 183,
                            "2014-07": 63,
                            "2014-08": 242,
                            "2014-09": 124,
                            "2014-10": 648,
                            "2014-11": 48
                        },
                        "total_count": 2397
                    },
                    "copy": {
                        "accesses_by_month": {
                            "2014-01": 2,
                            "2014-02": 2,
                            "2014-03": 6,
                            "2014-04": 8,
                            "2014-05": 25,
                            "2014-07": 3,
                            "2014-09": 3,
                            "2014-10": 18,
                            "2014-11": 1
                        },
                        "total_count": 68
                    },
                    "exit_session": {
                        "accesses_by_month": {
                            "2014-04": 164,
                            "2014-05": 252,
                            "2014-06": 766,
                            "2014-07": 1718,
                            "2014-08": 5042,
                            "2014-09": 1204,
                            "2014-10": 2064,
                            "2014-11": 448
                        },
                        "total_count": 11658
                    },
                    "get_file": {
                        "accesses_by_month": {
                            "2014-01": 3483,
                            "2014-02": 2190,
                            "2014-03": 1254,
                            "2014-04": 980,
                            "2014-05": 2662,
                            "2014-06": 2419,
                            "2014-07": 2633,
                            "2014-08": 1395,
                            "2014-09": 427,
                            "2014-10": 549,
                            "2014-11": 133
                        },
                        "total_count": 18125
                    },
                    "list_files": {
                        "accesses_by_month": {
                            "2014-01": 26292,
                            "2014-02": 10369,
                            "2014-03": 9802,
                            "2014-04": 11553,
                            "2014-05": 15483,
                            "2014-06": 19795,
                            "2014-07": 13887,
                            "2014-08": 25662,
                            "2014-09": 10836,
                            "2014-10": 10843,
                            "2014-11": 3710
                        },
                        "total_count": 158232
                    },
                    "make_directory": {
                        "accesses_by_month": {
                            "2014-01": 875,
                            "2014-02": 745,
                            "2014-03": 287,
                            "2014-04": 393,
                            "2014-05": 817,
                            "2014-06": 761,
                            "2014-07": 788,
                            "2014-08": 598,
                            "2014-09": 233,
                            "2014-10": 405,
                            "2014-11": 92
                        },
                        "total_count": 5994
                    },
                    "put_file": {
                        "accesses_by_month": {
                            "2014-01": 7790,
                            "2014-02": 7729,
                            "2014-03": 11284,
                            "2014-04": 8588,
                            "2014-05": 11310,
                            "2014-06": 45648,
                            "2014-07": 39888,
                            "2014-08": 29182,
                            "2014-09": 371250,
                            "2014-10": 42903,
                            "2014-11": 9629
                        },
                        "total_count": 585201
                    },
                    "remove_directory": {
                        "accesses_by_month": {
                            "2014-01": 22,
                            "2014-02": 23,
                            "2014-03": 10,
                            "2014-04": 21,
                            "2014-05": 79,
                            "2014-06": 76,
                            "2014-07": 71,
                            "2014-08": 52,
                            "2014-09": 30,
                            "2014-10": 48,
                            "2014-11": 16
                        },
                        "total_count": 448
                    },
                    "remove_files": {
                        "accesses_by_month": {
                            "2014-01": 953,
                            "2014-02": 1939,
                            "2014-03": 4308,
                            "2014-04": 456,
                            "2014-05": 839,
                            "2014-06": 30996,
                            "2014-07": 30559,
                            "2014-08": 16589,
                            "2014-09": 9194,
                            "2014-10": 4688,
                            "2014-11": 7282
                        },
                        "total_count": 107803
                    },
                    "rename_file": {
                        "accesses_by_month": {
                            "2014-01": 43,
                            "2014-02": 56,
                            "2014-03": 21,
                            "2014-04": 42,
                            "2014-05": 100,
                            "2014-06": 117,
                            "2014-07": 48,
                            "2014-08": 91,
                            "2014-09": 22,
                            "2014-10": 161,
                            "2014-11": 18
                        },
                        "total_count": 719
                    },
                    "run_pipeline": {
                        "accesses_by_month": {
                            "2014-01": 15752,
                            "2014-02": 7591,
                            "2014-03": 11106,
                            "2014-04": 8137,
                            "2014-05": 10345,
                            "2014-06": 46387,
                            "2014-07": 40030,
                            "2014-08": 38759,
                            "2014-09": 16442,
                            "2014-10": 14651,
                            "2014-11": 9310
                        },
                        "total_count": 218510
                    },
                    "start_session": {
                        "accesses_by_month": {
                            "2014-01": 1663,
                            "2014-02": 1343,
                            "2014-03": 485,
                            "2014-04": 898,
                            "2014-05": 2024,
                            "2014-06": 2511,
                            "2014-07": 3484,
                            "2014-08": 6535,
                            "2014-09": 1679,
                            "2014-10": 2698,
                            "2014-11": 634
                        },
                        "total_count": 23954
                    },
                    "valid_commands": {
                        "accesses_by_month": {
                            "2014-01": 1938,
                            "2014-02": 1610,
                            "2014-03": 1006,
                            "2014-04": 1008,
                            "2014-05": 2388,
                            "2014-06": 2422,
                            "2014-07": 3478,
                            "2014-08": 6682,
                            "2014-09": 1736,
                            "2014-10": 2756,
                            "2014-11": 650
                        },
                        "total_count": 25674
                    },
                    "get_expression_data_by_samples_and_features": {
                        "accesses_by_month": {
                            "2014-07": 94,
                            "2014-08": 792,
                            "2014-09": 168,
                            "2014-10": 166,
                            "2014-11": 8
                        },
                        "total_count": 1228
                    },
                    "get_expression_samples_data": {
                        "accesses_by_month": {
                            "2014-06": 2,
                            "2014-09": 31
                        },
                        "total_count": 33
                    },
                    "get_expression_samples_data_by_genome_ids": {
                        "accesses_by_month": {
                            "2014-06": 3
                        },
                        "total_count": 3
                    },
                    "all_datasets": {
                        "accesses_by_month": {
                            "2014-08": 70
                        },
                        "total_count": 70
                    },
                    "build_first_neighbor_network": {
                        "accesses_by_month": {
                            "2014-08": 4
                        },
                        "total_count": 4
                    },
                    "entity2datasets": {
                        "accesses_by_month": {
                            "2014-08": 8507,
                            "2014-09": 8433,
                            "2014-10": 8696,
                            "2014-11": 3126
                        },
                        "total_count": 28762
                    },
                    "lookup_pdb_by_fid": {
                        "accesses_by_month": {
                            "2014-07": 110,
                            "2014-08": 1125,
                            "2014-09": 155,
                            "2014-10": 388,
                            "2014-11": 22
                        },
                        "total_count": 1800
                    },
                    "lookup_pdb_by_md5": {
                        "accesses_by_month": {
                            "2014-08": 78
                        },
                        "total_count": 78
                    },
                    "construct_multiple_alignment": {
                        "accesses_by_month": {
                            "2014-07": 20,
                            "2014-08": 22
                        },
                        "total_count": 42
                    },
                    "construct_species_tree": {
                        "accesses_by_month": {
                            "2014-07": 4,
                            "2014-08": 92,
                            "2014-09": 8,
                            "2014-10": 12,
                            "2014-11": 28
                        },
                        "total_count": 144
                    },
                    "construct_tree_for_alignment": {
                        "accesses_by_month": {
                            "2014-07": 10,
                            "2014-08": 10,
                            "2014-10": 56,
                            "2014-11": 2
                        },
                        "total_count": 78
                    },
                    "get_tree": {
                        "accesses_by_month": {
                            "2014-08": 6,
                            "2014-11": 2
                        },
                        "total_count": 8
                    },
                    "get_tree_data": {
                        "accesses_by_month": {
                            "2014-07": 212,
                            "2014-08": 8924,
                            "2014-09": 8480,
                            "2014-10": 8692,
                            "2014-11": 3142
                        },
                        "total_count": 29450
                    },
                    "get_tree_ids_by_source_id_pattern": {
                        "accesses_by_month": {
                            "2014-08": 2
                        },
                        "total_count": 2
                    },
                    "guess_taxonomy_path": {
                        "accesses_by_month": {
                            "2014-08": 6,
                            "2014-09": 4
                        },
                        "total_count": 10
                    },
                    "annotate_proteins": {
                        "accesses_by_month": {
                            "2014-06": 5,
                            "2014-08": 4,
                            "2014-09": 118,
                            "2014-10": 264
                        },
                        "total_count": 391
                    },
                    "estimate_closest_genomes": {
                        "accesses_by_month": {
                            "2014-09": 6,
                            "2014-10": 68
                        },
                        "total_count": 74
                    },
                    "get_dataset_names": {
                        "accesses_by_month": {
                            "2014-08": 8,
                            "2014-09": 6,
                            "2014-11": 2
                        },
                        "total_count": 16
                    },
                    "get_default_dataset_name": {
                        "accesses_by_month": {
                            "2014-08": 6,
                            "2014-09": 20,
                            "2014-10": 136,
                            "2014-11": 2
                        },
                        "total_count": 164
                    },
                    "compare_motifs_with_tomtom_by_collection": {
                        "accesses_by_month": {
                            "2014-02": 4
                        },
                        "total_count": 4
                    },
                    "compare_motifs_with_tomtom_by_collection_from_ws": {
                        "accesses_by_month": {
                            "2014-02": 4
                        },
                        "total_count": 4
                    },
                    "compare_motifs_with_tomtom_job_by_collection_from_ws": {
                        "accesses_by_month": {
                            "2014-02": 4
                        },
                        "total_count": 4
                    },
                    "find_motifs_with_meme": {
                        "accesses_by_month": {
                            "2014-02": 8
                        },
                        "total_count": 8
                    },
                    "find_motifs_with_meme_from_ws": {
                        "accesses_by_month": {
                            "2014-02": 18
                        },
                        "total_count": 18
                    },
                    "find_motifs_with_meme_job_from_ws": {
                        "accesses_by_month": {
                            "2014-02": 6,
                            "2014-03": 2
                        },
                        "total_count": 8
                    },
                    "find_sites_with_mast": {
                        "accesses_by_month": {
                            "2014-02": 4
                        },
                        "total_count": 4
                    },
                    "find_sites_with_mast_by_collection": {
                        "accesses_by_month": {
                            "2014-02": 4
                        },
                        "total_count": 4
                    },
                    "find_sites_with_mast_by_collection_from_ws": {
                        "accesses_by_month": {
                            "2014-02": 4
                        },
                        "total_count": 4
                    },
                    "find_sites_with_mast_job_by_collection_from_ws": {
                        "accesses_by_month": {
                            "2014-02": 8
                        },
                        "total_count": 8
                    },
                    "get_pspm_collection_from_meme_result": {
                        "accesses_by_month": {
                            "2014-02": 8
                        },
                        "total_count": 8
                    },
                    "get_pspm_collection_from_meme_result_from_ws": {
                        "accesses_by_month": {
                            "2014-02": 4
                        },
                        "total_count": 4
                    },
                    "get_pspm_collection_from_meme_result_job_from_ws": {
                        "accesses_by_month": {
                            "2014-02": 4
                        },
                        "total_count": 4
                    },
                    "fids_to_moLocusIds": {
                        "accesses_by_month": {
                            "2014-03": 5145,
                            "2014-04": 8503,
                            "2014-05": 8760,
                            "2014-06": 8420,
                            "2014-07": 4830,
                            "2014-08": 8914,
                            "2014-09": 8513,
                            "2014-10": 8740,
                            "2014-11": 3122
                        },
                        "total_count": 64947
                    },
                    "get_app_full_info": {
                        "accesses_by_month": {
                            "2014-10": 1
                        },
                        "total_count": 1
                    },
                    "get_app_spec": {
                        "accesses_by_month": {
                            "2014-11": 294
                        },
                        "total_count": 294
                    },
                    "get_category": {
                        "accesses_by_month": {
                            "2014-11": 4
                        },
                        "total_count": 4
                    },
                    "get_method_full_info": {
                        "accesses_by_month": {
                            "2014-10": 257,
                            "2014-11": 3331
                        },
                        "total_count": 3588
                    },
                    "get_method_spec": {
                        "accesses_by_month": {
                            "2014-10": 251,
                            "2014-11": 3020
                        },
                        "total_count": 3271
                    },
                    "list_apps": {
                        "accesses_by_month": {
                            "2014-11": 1332
                        },
                        "total_count": 1332
                    },
                    "list_categories": {
                        "accesses_by_month": {
                            "2014-10": 387,
                            "2014-11": 1350
                        },
                        "total_count": 1737
                    },
                    "list_methods": {
                        "accesses_by_month": {
                            "2014-10": 126,
                            "2014-11": 1455
                        },
                        "total_count": 1581
                    },
                    "list_methods_full_info": {
                        "accesses_by_month": {
                            "2014-11": 3
                        },
                        "total_count": 3
                    },
                    "status": {
                        "accesses_by_month": {
                            "2014-11": 3183
                        },
                        "total_count": 3183
                    },
                    "association_test": {
                        "accesses_by_month": {
                            "2014-07": 43,
                            "2014-08": 138,
                            "2014-09": 12,
                            "2014-10": 2
                        },
                        "total_count": 195
                    },
                    "get_go_annotation": {
                        "accesses_by_month": {
                            "2014-09": 2
                        },
                        "total_count": 2
                    },
                    "get_go_description": {
                        "accesses_by_month": {
                            "2014-03": 10349,
                            "2014-04": 16972,
                            "2014-05": 17514,
                            "2014-06": 16838,
                            "2014-07": 9646,
                            "2014-08": 17809,
                            "2014-09": 18575,
                            "2014-10": 17432,
                            "2014-11": 6230
                        },
                        "total_count": 131365
                    },
                    "get_go_enrichment": {
                        "accesses_by_month": {
                            "2014-03": 4,
                            "2014-06": 14,
                            "2014-07": 56,
                            "2014-08": 1978,
                            "2014-09": 8,
                            "2014-10": 6
                        },
                        "total_count": 2066
                    },
                    "get_goidlist": {
                        "accesses_by_month": {
                            "2014-04": 2,
                            "2014-07": 2008948,
                            "2014-08": 489,
                            "2014-09": 10,
                            "2014-10": 7
                        },
                        "total_count": 2009456
                    },
                    "change_regulatory_network_namespace": {
                        "accesses_by_month": {
                            "2014-05": 2
                        },
                        "total_count": 2
                    },
                    "create_prom_constraints": {
                        "accesses_by_month": {
                            "2014-05": 2
                        },
                        "total_count": 2
                    },
                    "get_expression_data_by_genome": {
                        "accesses_by_month": {
                            "2014-05": 24
                        },
                        "total_count": 24
                    },
                    "get_regulatory_network_by_genome": {
                        "accesses_by_month": {
                            "2014-05": 11
                        },
                        "total_count": 11
                    },
                    "version": {
                        "accesses_by_month": {
                            "2014-03": 1848,
                            "2014-04": 8488,
                            "2014-05": 8758,
                            "2014-06": 8418,
                            "2014-07": 4816,
                            "2014-08": 8894,
                            "2014-09": 8498,
                            "2014-10": 5822
                        },
                        "total_count": 55542
                    },
                    "find_prophages": {
                        "accesses_by_month": {
                            "2014-03": 4,
                            "2014-04": 4,
                            "2014-05": 6,
                            "2014-06": 20,
                            "2014-10": 2
                        },
                        "total_count": 36
                    },
                    "get_all_training_sets": {
                        "accesses_by_month": {
                            "2014-03": 4,
                            "2014-04": 12,
                            "2014-05": 2,
                            "2014-06": 36,
                            "2014-07": 12,
                            "2014-08": 6,
                            "2014-09": 4,
                            "2014-10": 2,
                            "2014-11": 2
                        },
                        "total_count": 80
                    },
                    "get_all_eo": {
                        "accesses_by_month": {
                            "2014-04": 56,
                            "2014-05": 10,
                            "2014-06": 2,
                            "2014-07": 2
                        },
                        "total_count": 70
                    },
                    "get_all_po": {
                        "accesses_by_month": {
                            "2014-03": 3700,
                            "2014-04": 17056,
                            "2014-05": 17528,
                            "2014-06": 16838,
                            "2014-07": 9636,
                            "2014-08": 17804,
                            "2014-09": 16924,
                            "2014-10": 17478,
                            "2014-11": 6254
                        },
                        "total_count": 123218
                    },
                    "get_eo_descriptions": {
                        "accesses_by_month": {
                            "2014-04": 6,
                            "2014-05": 56,
                            "2014-07": 16,
                            "2014-08": 276,
                            "2014-10": 6
                        },
                        "total_count": 360
                    },
                    "get_eo_sampleidlist": {
                        "accesses_by_month": {
                            "2014-04": 10,
                            "2014-07": 2
                        },
                        "total_count": 12
                    },
                    "get_experiments_by_sampleid": {
                        "accesses_by_month": {
                            "2014-07": 26
                        },
                        "total_count": 26
                    },
                    "get_po_descriptions": {
                        "accesses_by_month": {
                            "2014-04": 16,
                            "2014-05": 48,
                            "2014-07": 18,
                            "2014-08": 276,
                            "2014-10": 6
                        },
                        "total_count": 364
                    },
                    "get_po_sampleidlist": {
                        "accesses_by_month": {
                            "2014-05": 2,
                            "2014-07": 20
                        },
                        "total_count": 22
                    },
                    "get_repid_by_sampleid": {
                        "accesses_by_month": {
                            "2014-04": 2
                        },
                        "total_count": 2
                    },
                    "annotate": {
                        "accesses_by_month": {
                            "2014-02": 7,
                            "2014-03": 39,
                            "2014-04": 2,
                            "2014-06": 1,
                            "2014-07": 4,
                            "2014-08": 8,
                            "2014-09": 2,
                            "2014-11": 2
                        },
                        "total_count": 65
                    },
                    "calculate": {
                        "accesses_by_month": {
                            "2014-02": 2,
                            "2014-03": 16,
                            "2014-04": 2,
                            "2014-06": 2,
                            "2014-07": 4,
                            "2014-08": 30,
                            "2014-09": 2
                        },
                        "total_count": 58
                    },
                    "get_probanno": {
                        "accesses_by_month": {
                            "2014-02": 2,
                            "2014-03": 5,
                            "2014-04": 164,
                            "2014-08": 12
                        },
                        "total_count": 183
                    },
                    "get_rxnprobs": {
                        "accesses_by_month": {
                            "2014-03": 2,
                            "2014-04": 58,
                            "2014-05": 96,
                            "2014-06": 40
                        },
                        "total_count": 196
                    },
                    "ver": {
                        "accesses_by_month": {
                            "2014-08": 18
                        },
                        "total_count": 18
                    },
                    "version": {
                        "accesses_by_month": {
                            "2014-08": 4
                        },
                        "total_count": 4
                    },
                    "domains_to_domain_annotations": {
                        "accesses_by_month": {
                            "2014-04": 6,
                            "2014-05": 6,
                            "2014-06": 18,
                            "2014-07": 48
                        },
                        "total_count": 78
                    },
                    "fids_to_domains": {
                        "accesses_by_month": {
                            "2014-04": 10,
                            "2014-05": 22,
                            "2014-06": 20,
                            "2014-07": 80,
                            "2014-08": 4,
                            "2014-09": 1878,
                            "2014-10": 8698,
                            "2014-11": 3126
                        },
                        "total_count": 13838
                    },
                    "fids_to_operons": {
                        "accesses_by_month": {
                            "2014-03": 1846,
                            "2014-04": 8564,
                            "2014-05": 8810,
                            "2014-06": 8442,
                            "2014-07": 4878,
                            "2014-08": 8940,
                            "2014-09": 6718
                        },
                        "total_count": 48198
                    },
                    "fids_to_orthologs": {
                        "accesses_by_month": {
                            "2014-03": 78,
                            "2014-04": 24,
                            "2014-08": 2,
                            "2014-09": 4,
                            "2014-10": 4
                        },
                        "total_count": 112
                    },
                    "compute_abundance_profile": {
                        "accesses_by_month": {
                            "2014-04": 1,
                            "2014-06": 1
                        },
                        "total_count": 2
                    },
                    "extract_leaf_node_names": {
                        "accesses_by_month": {
                            "2014-03": 495,
                            "2014-04": 14,
                            "2014-07": 212,
                            "2014-08": 8932,
                            "2014-09": 8520,
                            "2014-10": 8692,
                            "2014-11": 3144
                        },
                        "total_count": 30009
                    },
                    "get_alignment": {
                        "accesses_by_month": {
                            "2014-04": 12
                        },
                        "total_count": 12
                    },
                    "get_alignment_ids_by_feature": {
                        "accesses_by_month": {
                            "2014-04": 2
                        },
                        "total_count": 2
                    },
                    "get_leaf_count": {
                        "accesses_by_month": {
                            "2014-06": 4
                        },
                        "total_count": 4
                    },
                    "get_leaf_to_feature_map": {
                        "accesses_by_month": {
                            "2014-04": 2
                        },
                        "total_count": 2
                    },
                    "get_node_count": {
                        "accesses_by_month": {
                            "2014-03": 4
                        },
                        "total_count": 4
                    },
                    "get_tree": {
                        "accesses_by_month": {
                            "2014-03": 190,
                            "2014-04": 34,
                            "2014-05": 39,
                            "2014-06": 2,
                            "2014-07": 32,
                            "2014-08": 6,
                            "2014-11": 2
                        },
                        "total_count": 305
                    },
                    "get_tree_data": {
                        "accesses_by_month": {
                            "2014-03": 5143,
                            "2014-04": 8518,
                            "2014-05": 8764,
                            "2014-06": 8436,
                            "2014-07": 4814,
                            "2014-08": 8924,
                            "2014-09": 8480,
                            "2014-10": 8692,
                            "2014-11": 3142
                        },
                        "total_count": 64913
                    },
                    "get_tree_ids_by_feature": {
                        "accesses_by_month": {
                            "2014-03": 46,
                            "2014-04": 26,
                            "2014-07": 14
                        },
                        "total_count": 86
                    },
                    "get_tree_ids_by_protein_sequence": {
                        "accesses_by_month": {
                            "2014-06": 2
                        },
                        "total_count": 2
                    },
                    "get_tree_ids_by_source_id_pattern": {
                        "accesses_by_month": {
                            "2014-06": 10,
                            "2014-07": 2,
                            "2014-08": 2
                        },
                        "total_count": 14
                    },
                    "remove_node_names_and_simplify": {
                        "accesses_by_month": {
                            "2014-03": 28
                        },
                        "total_count": 28
                    },
                    "replace_node_names": {
                        "accesses_by_month": {
                            "2014-03": 139
                        },
                        "total_count": 139
                    },
                    "complete_job": {
                        "accesses_by_month": {
                            "2014-02": 2091,
                            "2014-03": 308,
                            "2014-07": 253,
                            "2014-08": 9355,
                            "2014-09": 8706,
                            "2014-10": 8983,
                            "2014-11": 3372
                        },
                        "total_count": 33068
                    },
                    "create_and_start_job": {
                        "accesses_by_month": {
                            "2014-02": 2064,
                            "2014-03": 298,
                            "2014-07": 282,
                            "2014-08": 18870,
                            "2014-09": 11696,
                            "2014-10": 9072,
                            "2014-11": 3368
                        },
                        "total_count": 45650
                    },
                    "create_job": {
                        "accesses_by_month": {
                            "2014-02": 38,
                            "2014-03": 96,
                            "2014-08": 50,
                            "2014-10": 24,
                            "2014-11": 22
                        },
                        "total_count": 230
                    },
                    "delete_job": {
                        "accesses_by_month": {
                            "2014-02": 207,
                            "2014-03": 231,
                            "2014-07": 24,
                            "2014-08": 169,
                            "2014-09": 164,
                            "2014-10": 32,
                            "2014-11": 38
                        },
                        "total_count": 865
                    },
                    "force_delete_job": {
                        "accesses_by_month": {
                            "2014-03": 46
                        },
                        "total_count": 46
                    },
                    "get_detailed_error": {
                        "accesses_by_month": {
                            "2014-02": 160,
                            "2014-03": 78,
                            "2014-07": 2,
                            "2014-08": 28,
                            "2014-09": 6,
                            "2014-10": 16,
                            "2014-11": 6
                        },
                        "total_count": 296
                    },
                    "get_job_description": {
                        "accesses_by_month": {
                            "2014-11": 6
                        },
                        "total_count": 6
                    },
                    "get_job_info": {
                        "accesses_by_month": {
                            "2014-02": 2849,
                            "2014-03": 36870,
                            "2014-07": 28,
                            "2014-08": 12176,
                            "2014-09": 650,
                            "2014-10": 56,
                            "2014-11": 2544
                        },
                        "total_count": 55173
                    },
                    "get_job_shared": {
                        "accesses_by_month": {
                            "2014-10": 2,
                            "2014-11": 2
                        },
                        "total_count": 4
                    },
                    "get_job_status": {
                        "accesses_by_month": {
                            "2014-02": 6599,
                            "2014-03": 5631,
                            "2014-07": 4640,
                            "2014-08": 41661,
                            "2014-09": 5957,
                            "2014-10": 75639,
                            "2014-11": 2349279
                        },
                        "total_count": 2489406
                    },
                    "get_results": {
                        "accesses_by_month": {
                            "2014-02": 28,
                            "2014-03": 8,
                            "2014-08": 4,
                            "2014-09": 8,
                            "2014-10": 4,
                            "2014-11": 6
                        },
                        "total_count": 58
                    },
                    "get_state": {
                        "accesses_by_month": {
                            "2014-07": 86,
                            "2014-08": 1349,
                            "2014-09": 4
                        },
                        "total_count": 1439
                    },
                    "list_job_services": {
                        "accesses_by_month": {
                            "2014-03": 1152,
                            "2014-07": 218,
                            "2014-08": 8950,
                            "2014-09": 8495,
                            "2014-10": 8726,
                            "2014-11": 3137
                        },
                        "total_count": 30678
                    },
                    "list_jobs": {
                        "accesses_by_month": {
                            "2014-02": 12069,
                            "2014-03": 8468,
                            "2014-07": 1306,
                            "2014-08": 3192,
                            "2014-09": 15,
                            "2014-10": 6,
                            "2014-11": 1292
                        },
                        "total_count": 26348
                    },
                    "set_state": {
                        "accesses_by_month": {
                            "2014-07": 2,
                            "2014-08": 2
                        },
                        "total_count": 4
                    },
                    "share_job": {
                        "accesses_by_month": {
                            "2014-10": 2,
                            "2014-11": 1802
                        },
                        "total_count": 1804
                    },
                    "start_job": {
                        "accesses_by_month": {
                            "2014-02": 38,
                            "2014-03": 91,
                            "2014-08": 50,
                            "2014-10": 24,
                            "2014-11": 22
                        },
                        "total_count": 225
                    },
                    "update_job": {
                        "accesses_by_month": {
                            "2014-02": 150,
                            "2014-03": 22,
                            "2014-07": 34,
                            "2014-08": 250,
                            "2014-09": 38,
                            "2014-10": 222,
                            "2014-11": 212
                        },
                        "total_count": 928
                    },
                    "update_job_progress": {
                        "accesses_by_month": {
                            "2014-02": 3072,
                            "2014-03": 1456,
                            "2014-07": 268,
                            "2014-08": 9810,
                            "2014-09": 9370,
                            "2014-10": 9042,
                            "2014-11": 3432
                        },
                        "total_count": 36450
                    },
                    "ver": {
                        "accesses_by_month": {
                            "2014-09": 4,
                            "2014-10": 4,
                            "2014-11": 4
                        },
                        "total_count": 12
                    },
                    "administer": {
                        "accesses_by_month": {
                            "2014-02": 53144,
                            "2014-03": 77206,
                            "2014-04": 22,
                            "2014-05": 2,
                            "2014-06": 9,
                            "2014-07": 22,
                            "2014-08": 709,
                            "2014-09": 6,
                            "2014-10": 29
                        },
                        "total_count": 131149
                    },
                    "clone_workspace": {
                        "accesses_by_month": {
                            "2014-02": 98,
                            "2014-03": 1,
                            "2014-04": 4,
                            "2014-05": 2,
                            "2014-06": 24,
                            "2014-07": 14,
                            "2014-08": 485,
                            "2014-09": 69,
                            "2014-10": 113,
                            "2014-11": 9
                        },
                        "total_count": 819
                    },
                    "copy_object": {
                        "accesses_by_month": {
                            "2014-02": 4139,
                            "2014-03": 305,
                            "2014-04": 3003,
                            "2014-05": 1271,
                            "2014-06": 2922,
                            "2014-07": 13726,
                            "2014-08": 16460,
                            "2014-09": 819,
                            "2014-10": 1807,
                            "2014-11": 1005
                        },
                        "total_count": 45457
                    },
                    "create_workspace": {
                        "accesses_by_month": {
                            "2014-01": 31,
                            "2014-02": 1121,
                            "2014-03": 391,
                            "2014-04": 348,
                            "2014-05": 365,
                            "2014-06": 509,
                            "2014-07": 535,
                            "2014-08": 692,
                            "2014-09": 198,
                            "2014-10": 239,
                            "2014-11": 84
                        },
                        "total_count": 4513
                    },
                    "delete_objects": {
                        "accesses_by_month": {
                            "2014-01": 16,
                            "2014-02": 492,
                            "2014-03": 181,
                            "2014-04": 703,
                            "2014-05": 234,
                            "2014-06": 405,
                            "2014-07": 415,
                            "2014-08": 8878,
                            "2014-09": 2950,
                            "2014-10": 642,
                            "2014-11": 215
                        },
                        "total_count": 15131
                    },
                    "delete_workspace": {
                        "accesses_by_month": {
                            "2014-02": 300,
                            "2014-03": 22,
                            "2014-04": 36,
                            "2014-05": 71,
                            "2014-06": 73,
                            "2014-07": 17,
                            "2014-08": 359,
                            "2014-09": 53,
                            "2014-10": 56,
                            "2014-11": 15
                        },
                        "total_count": 1002
                    },
                    "get_all_type_info": {
                        "accesses_by_month": {
                            "2014-06": 1
                        },
                        "total_count": 1
                    },
                    "get_func_info": {
                        "accesses_by_month": {
                            "2014-02": 6,
                            "2014-04": 56,
                            "2014-05": 2,
                            "2014-06": 4,
                            "2014-08": 8,
                            "2014-09": 2,
                            "2014-10": 9
                        },
                        "total_count": 87
                    },
                    "get_jsonschema": {
                        "accesses_by_month": {
                            "2014-03": 4,
                            "2014-04": 10,
                            "2014-06": 8,
                            "2014-07": 434,
                            "2014-08": 2
                        },
                        "total_count": 458
                    },
                    "get_module_info": {
                        "accesses_by_month": {
                            "2014-01": 1893,
                            "2014-02": 1899,
                            "2014-03": 90,
                            "2014-04": 676,
                            "2014-05": 278,
                            "2014-06": 626,
                            "2014-07": 475,
                            "2014-08": 2321,
                            "2014-09": 229,
                            "2014-10": 2525,
                            "2014-11": 350
                        },
                        "total_count": 11362
                    },
                    "get_object": {
                        "accesses_by_month": {
                            "2014-01": 82,
                            "2014-02": 9170,
                            "2014-03": 18258,
                            "2014-04": 17901,
                            "2014-05": 13435,
                            "2014-06": 18121,
                            "2014-07": 21548,
                            "2014-08": 47819,
                            "2014-09": 16096,
                            "2014-10": 13033,
                            "2014-11": 207
                        },
                        "total_count": 175670
                    },
                    "get_object_history": {
                        "accesses_by_month": {
                            "2014-01": 8,
                            "2014-02": 1237,
                            "2014-03": 571,
                            "2014-04": 529,
                            "2014-05": 490,
                            "2014-06": 449,
                            "2014-07": 612,
                            "2014-08": 5585,
                            "2014-09": 1508,
                            "2014-10": 2510,
                            "2014-11": 616
                        },
                        "total_count": 14115
                    },
                    "get_object_info": {
                        "accesses_by_month": {
                            "2014-01": 2117,
                            "2014-02": 142185,
                            "2014-03": 716796,
                            "2014-04": 453556,
                            "2014-05": 7208,
                            "2014-06": 30070,
                            "2014-07": 614065,
                            "2014-08": 534983,
                            "2014-09": 4998,
                            "2014-10": 13511,
                            "2014-11": 6304
                        },
                        "total_count": 2525793
                    },
                    "get_object_info_new": {
                        "accesses_by_month": {
                            "2014-03": 1439,
                            "2014-04": 78,
                            "2014-05": 2,
                            "2014-06": 71,
                            "2014-07": 265,
                            "2014-08": 6504,
                            "2014-09": 2757,
                            "2014-10": 2541,
                            "2014-11": 415
                        },
                        "total_count": 14072
                    },
                    "get_object_provenance": {
                        "accesses_by_month": {
                            "2014-07": 664,
                            "2014-08": 6761,
                            "2014-09": 2237,
                            "2014-10": 4170,
                            "2014-11": 729
                        },
                        "total_count": 14561
                    },
                    "get_object_subset": {
                        "accesses_by_month": {
                            "2014-01": 44,
                            "2014-02": 198,
                            "2014-03": 42198,
                            "2014-04": 27,
                            "2014-05": 52,
                            "2014-06": 1773,
                            "2014-07": 1288,
                            "2014-08": 27163,
                            "2014-09": 5432,
                            "2014-10": 7998,
                            "2014-11": 1784
                        },
                        "total_count": 87957
                    },
                    "get_objectmeta": {
                        "accesses_by_month": {
                            "2014-02": 328,
                            "2014-03": 18049,
                            "2014-04": 24202,
                            "2014-05": 40017,
                            "2014-06": 30275,
                            "2014-07": 13640,
                            "2014-08": 21060,
                            "2014-09": 146427,
                            "2014-10": 52449
                        },
                        "total_count": 346447
                    },
                    "get_objects": {
                        "accesses_by_month": {
                            "2014-01": 25437,
                            "2014-02": 257713,
                            "2014-03": 880195,
                            "2014-04": 662946,
                            "2014-05": 1511363,
                            "2014-06": 971921,
                            "2014-07": 321389,
                            "2014-08": 1584160,
                            "2014-09": 1305726,
                            "2014-10": 4561990,
                            "2014-11": 273361
                        },
                        "total_count": 12356201
                    },
                    "get_permissions": {
                        "accesses_by_month": {
                            "2014-01": 36,
                            "2014-02": 60214,
                            "2014-03": 16316,
                            "2014-04": 20606,
                            "2014-05": 32196,
                            "2014-06": 72994,
                            "2014-07": 201259,
                            "2014-08": 124538,
                            "2014-09": 45449,
                            "2014-10": 47199,
                            "2014-11": 20310
                        },
                        "total_count": 641117
                    },
                    "get_type_info": {
                        "accesses_by_month": {
                            "2014-01": 20,
                            "2014-02": 523,
                            "2014-03": 385,
                            "2014-04": 283,
                            "2014-05": 92,
                            "2014-06": 382,
                            "2014-07": 752,
                            "2014-08": 210,
                            "2014-09": 210,
                            "2014-10": 305,
                            "2014-11": 60
                        },
                        "total_count": 3222
                    },
                    "get_workspace_description": {
                        "accesses_by_month": {
                            "2014-01": 62,
                            "2014-02": 898,
                            "2014-03": 652,
                            "2014-04": 512,
                            "2014-05": 572,
                            "2014-06": 1174,
                            "2014-07": 756,
                            "2014-08": 7139,
                            "2014-09": 6236,
                            "2014-10": 11021,
                            "2014-11": 3837
                        },
                        "total_count": 32859
                    },
                    "get_workspace_info": {
                        "accesses_by_month": {
                            "2014-01": 288,
                            "2014-02": 11071,
                            "2014-03": 3688,
                            "2014-04": 5548,
                            "2014-05": 2860,
                            "2014-06": 9093,
                            "2014-07": 4006,
                            "2014-08": 12618,
                            "2014-09": 2908,
                            "2014-10": 4996,
                            "2014-11": 3219
                        },
                        "total_count": 60295
                    },
                    "get_workspacemeta": {
                        "accesses_by_month": {
                            "2014-01": 154,
                            "2014-02": 354,
                            "2014-03": 228,
                            "2014-04": 252,
                            "2014-05": 242,
                            "2014-06": 248,
                            "2014-07": 537,
                            "2014-08": 1103,
                            "2014-09": 182,
                            "2014-11": 5
                        },
                        "total_count": 3305
                    },
                    "list_all_types": {
                        "accesses_by_month": {
                            "2014-08": 496,
                            "2014-09": 2,
                            "2014-10": 12
                        },
                        "total_count": 510
                    },
                    "list_module_versions": {
                        "accesses_by_month": {
                            "2014-01": 14,
                            "2014-02": 64,
                            "2014-03": 38,
                            "2014-04": 132,
                            "2014-05": 254,
                            "2014-06": 216,
                            "2014-07": 70,
                            "2014-08": 178,
                            "2014-09": 97,
                            "2014-10": 543,
                            "2014-11": 6
                        },
                        "total_count": 1612
                    },
                    "list_modules": {
                        "accesses_by_month": {
                            "2014-01": 88,
                            "2014-02": 2327,
                            "2014-03": 1537,
                            "2014-04": 1012,
                            "2014-05": 1282,
                            "2014-06": 1438,
                            "2014-07": 2374,
                            "2014-08": 3202,
                            "2014-09": 1171,
                            "2014-10": 1968,
                            "2014-11": 267
                        },
                        "total_count": 16666
                    },
                    "list_objects": {
                        "accesses_by_month": {
                            "2014-01": 398,
                            "2014-02": 66810,
                            "2014-03": 35802,
                            "2014-04": 45461,
                            "2014-05": 37394,
                            "2014-06": 55348,
                            "2014-07": 71633,
                            "2014-08": 106823,
                            "2014-09": 42898,
                            "2014-10": 88802,
                            "2014-11": 35504
                        },
                        "total_count": 586873
                    },
                    "list_referencing_objects": {
                        "accesses_by_month": {
                            "2014-05": 1337,
                            "2014-06": 1000,
                            "2014-07": 3876,
                            "2014-08": 18684,
                            "2014-09": 5261,
                            "2014-10": 7547,
                            "2014-11": 1257
                        },
                        "total_count": 38962
                    },
                    "list_workspace_info": {
                        "accesses_by_month": {
                            "2014-01": 103,
                            "2014-02": 5799,
                            "2014-03": 141954,
                            "2014-04": 301735,
                            "2014-05": 608595,
                            "2014-06": 344872,
                            "2014-07": 193435,
                            "2014-08": 329377,
                            "2014-09": 256281,
                            "2014-10": 772667,
                            "2014-11": 54827
                        },
                        "total_count": 3009645
                    },
                    "list_workspace_objects": {
                        "accesses_by_month": {
                            "2014-02": 110154,
                            "2014-03": 450,
                            "2014-04": 117401,
                            "2014-05": 330,
                            "2014-06": 196532,
                            "2014-07": 92,
                            "2014-08": 249,
                            "2014-09": 11907,
                            "2014-10": 257,
                            "2014-11": 3
                        },
                        "total_count": 437375
                    },
                    "list_workspaces": {
                        "accesses_by_month": {
                            "2014-01": 256,
                            "2014-02": 16503,
                            "2014-03": 7159,
                            "2014-04": 5206,
                            "2014-05": 3816,
                            "2014-06": 4898,
                            "2014-07": 2236,
                            "2014-08": 474,
                            "2014-09": 347,
                            "2014-10": 378,
                            "2014-11": 177
                        },
                        "total_count": 41450
                    },
                    "register_typespec": {
                        "accesses_by_month": {
                            "2014-02": 90,
                            "2014-03": 40,
                            "2014-04": 59,
                            "2014-05": 45,
                            "2014-06": 89,
                            "2014-07": 49,
                            "2014-08": 31,
                            "2014-09": 21,
                            "2014-10": 17,
                            "2014-11": 30
                        },
                        "total_count": 471
                    },
                    "release_module": {
                        "accesses_by_month": {
                            "2014-02": 34,
                            "2014-03": 25,
                            "2014-04": 23,
                            "2014-05": 24,
                            "2014-06": 44,
                            "2014-07": 40,
                            "2014-08": 12,
                            "2014-09": 8,
                            "2014-10": 27,
                            "2014-11": 17
                        },
                        "total_count": 254
                    },
                    "rename_object": {
                        "accesses_by_month": {
                            "2014-02": 198,
                            "2014-03": 79,
                            "2014-04": 25,
                            "2014-05": 65,
                            "2014-06": 111,
                            "2014-07": 58,
                            "2014-08": 302,
                            "2014-09": 264,
                            "2014-10": 202,
                            "2014-11": 122
                        },
                        "total_count": 1426
                    },
                    "rename_workspace": {
                        "accesses_by_month": {
                            "2014-07": 6,
                            "2014-08": 9,
                            "2014-11": 3
                        },
                        "total_count": 18
                    },
                    "request_module_ownership": {
                        "accesses_by_month": {
                            "2014-02": 5,
                            "2014-03": 1,
                            "2014-04": 4,
                            "2014-05": 9,
                            "2014-06": 2,
                            "2014-07": 2,
                            "2014-09": 4,
                            "2014-10": 9,
                            "2014-11": 3
                        },
                        "total_count": 39
                    },
                    "revert_object": {
                        "accesses_by_month": {
                            "2014-03": 3,
                            "2014-04": 48,
                            "2014-05": 13,
                            "2014-06": 24,
                            "2014-07": 14,
                            "2014-08": 5,
                            "2014-09": 21,
                            "2014-10": 9,
                            "2014-11": 6
                        },
                        "total_count": 143
                    },
                    "save_object": {
                        "accesses_by_month": {
                            "2014-01": 3,
                            "2014-02": 990,
                            "2014-03": 675,
                            "2014-04": 1035,
                            "2014-05": 1164,
                            "2014-06": 2490,
                            "2014-07": 1621,
                            "2014-08": 5283,
                            "2014-09": 899,
                            "2014-10": 155,
                            "2014-11": 28
                        },
                        "total_count": 14343
                    },
                    "save_objects": {
                        "accesses_by_month": {
                            "2014-01": 19021,
                            "2014-02": 82066,
                            "2014-03": 170986,
                            "2014-04": 42825,
                            "2014-05": 122594,
                            "2014-06": 69732,
                            "2014-07": 63008,
                            "2014-08": 304640,
                            "2014-09": 234902,
                            "2014-10": 583908,
                            "2014-11": 59346
                        },
                        "total_count": 1753028
                    },
                    "set_global_permission": {
                        "accesses_by_month": {
                            "2014-01": 6,
                            "2014-02": 77,
                            "2014-03": 92,
                            "2014-04": 61,
                            "2014-05": 66,
                            "2014-06": 163,
                            "2014-07": 75,
                            "2014-08": 480,
                            "2014-09": 112,
                            "2014-10": 93,
                            "2014-11": 27
                        },
                        "total_count": 1252
                    },
                    "set_permissions": {
                        "accesses_by_month": {
                            "2014-01": 18,
                            "2014-02": 188,
                            "2014-03": 109,
                            "2014-04": 54,
                            "2014-05": 168,
                            "2014-06": 269,
                            "2014-07": 113,
                            "2014-08": 369,
                            "2014-09": 77,
                            "2014-10": 107,
                            "2014-11": 21
                        },
                        "total_count": 1493
                    },
                    "set_workspace_description": {
                        "accesses_by_month": {
                            "2014-01": 2,
                            "2014-02": 64,
                            "2014-03": 92,
                            "2014-04": 52,
                            "2014-05": 67,
                            "2014-06": 157,
                            "2014-07": 63,
                            "2014-08": 483,
                            "2014-09": 112,
                            "2014-10": 93,
                            "2014-11": 27
                        },
                        "total_count": 1212
                    },
                    "translate_from_MD5_types": {
                        "accesses_by_month": {
                            "2014-10": 3
                        },
                        "total_count": 3
                    },
                    "translate_to_MD5_types": {
                        "accesses_by_month": {
                            "2014-10": 11
                        },
                        "total_count": 11
                    },
                    "undelete_objects": {
                        "accesses_by_month": {
                            "2014-02": 5,
                            "2014-03": 2,
                            "2014-04": 6,
                            "2014-10": 3
                        },
                        "total_count": 16
                    },
                    "undelete_workspace": {
                        "accesses_by_month": {
                            "2014-02": 7,
                            "2014-03": 2,
                            "2014-04": 2,
                            "2014-05": 6,
                            "2014-07": 2,
                            "2014-08": 2,
                            "2014-10": 8,
                            "2014-11": 3
                        },
                        "total_count": 32
                    },
                    "ver": {
                        "accesses_by_month": {
                            "2014-02": 5412,
                            "2014-03": 8570,
                            "2014-04": 8478,
                            "2014-05": 8792,
                            "2014-06": 8682,
                            "2014-07": 5046,
                            "2014-08": 8094,
                            "2014-09": 9334,
                            "2014-10": 16708,
                            "2014-11": 5235
                        },
                        "total_count": 84351
                    },
                    "ContigSet_to_Genome": {
                        "accesses_by_month": {
                            "2014-02": 35,
                            "2014-03": 6,
                            "2014-04": 2,
                            "2014-05": 56,
                            "2014-06": 30,
                            "2014-07": 2,
                            "2014-08": 37,
                            "2014-09": 10,
                            "2014-10": 71,
                            "2014-11": 4
                        },
                        "total_count": 253
                    },
                    "add_media_transporters": {
                        "accesses_by_month": {
                            "2014-09": 45
                        },
                        "total_count": 45
                    },
                    "addmedia": {
                        "accesses_by_month": {
                            "2014-02": 70,
                            "2014-03": 105,
                            "2014-04": 64,
                            "2014-05": 159,
                            "2014-06": 94,
                            "2014-07": 161,
                            "2014-08": 575,
                            "2014-09": 273,
                            "2014-10": 280,
                            "2014-11": 128
                        },
                        "total_count": 1909
                    },
                    "adjust_biomass_reaction": {
                        "accesses_by_month": {
                            "2014-02": 2,
                            "2014-03": 34,
                            "2014-04": 12,
                            "2014-05": 16,
                            "2014-06": 34,
                            "2014-07": 302,
                            "2014-08": 2794
                        },
                        "total_count": 3194
                    },
                    "adjust_mapping_complex": {
                        "accesses_by_month": {
                            "2014-10": 30
                        },
                        "total_count": 30
                    },
                    "adjust_model_reaction": {
                        "accesses_by_month": {
                            "2014-03": 2,
                            "2014-04": 8,
                            "2014-05": 10,
                            "2014-06": 643,
                            "2014-07": 56,
                            "2014-08": 8222,
                            "2014-09": 36933
                        },
                        "total_count": 45874
                    },
                    "adjust_template_biomass": {
                        "accesses_by_month": {
                            "2014-03": 459,
                            "2014-04": 277,
                            "2014-05": 33
                        },
                        "total_count": 769
                    },
                    "build_pangenome": {
                        "accesses_by_month": {
                            "2014-08": 13,
                            "2014-10": 1
                        },
                        "total_count": 14
                    },
                    "compare_genomes": {
                        "accesses_by_month": {
                            "2014-03": 1,
                            "2014-04": 9,
                            "2014-06": 9,
                            "2014-08": 15,
                            "2014-09": 15,
                            "2014-10": 3
                        },
                        "total_count": 52
                    },
                    "compare_models": {
                        "accesses_by_month": {
                            "2014-02": 24,
                            "2014-03": 480,
                            "2014-08": 41,
                            "2014-09": 4,
                            "2014-10": 32,
                            "2014-11": 6
                        },
                        "total_count": 587
                    },
                    "create_promconstraint": {
                        "accesses_by_month": {
                            "2014-08": 5,
                            "2014-09": 3,
                            "2014-10": 2
                        },
                        "total_count": 10
                    },
                    "export_fba": {
                        "accesses_by_month": {
                            "2014-02": 12,
                            "2014-03": 71,
                            "2014-04": 6,
                            "2014-06": 20,
                            "2014-07": 2,
                            "2014-08": 2,
                            "2014-10": 13
                        },
                        "total_count": 126
                    },
                    "export_fbamodel": {
                        "accesses_by_month": {
                            "2014-02": 127,
                            "2014-03": 351,
                            "2014-04": 91,
                            "2014-05": 450,
                            "2014-06": 110,
                            "2014-07": 76,
                            "2014-08": 107,
                            "2014-09": 4862,
                            "2014-10": 64307,
                            "2014-11": 48
                        },
                        "total_count": 70529
                    },
                    "export_genome": {
                        "accesses_by_month": {
                            "2014-04": 2,
                            "2014-05": 5,
                            "2014-06": 4,
                            "2014-07": 6,
                            "2014-08": 4,
                            "2014-09": 34,
                            "2014-10": 6749,
                            "2014-11": 3540
                        },
                        "total_count": 10344
                    },
                    "export_media": {
                        "accesses_by_month": {
                            "2014-02": 1,
                            "2014-03": 6,
                            "2014-04": 8,
                            "2014-05": 4,
                            "2014-07": 9,
                            "2014-08": 5,
                            "2014-09": 4,
                            "2014-10": 15,
                            "2014-11": 7268
                        },
                        "total_count": 7320
                    },
                    "export_object": {
                        "accesses_by_month": {
                            "2014-02": 48,
                            "2014-03": 30,
                            "2014-04": 2,
                            "2014-05": 6,
                            "2014-06": 2,
                            "2014-08": 1,
                            "2014-09": 7,
                            "2014-11": 4
                        },
                        "total_count": 100
                    },
                    "export_phenotypeSimulationSet": {
                        "accesses_by_month": {
                            "2014-03": 16,
                            "2014-04": 8,
                            "2014-05": 35,
                            "2014-06": 187,
                            "2014-07": 3,
                            "2014-08": 4,
                            "2014-09": 87,
                            "2014-10": 6
                        },
                        "total_count": 346
                    },
                    "fasta_to_ContigSet": {
                        "accesses_by_month": {
                            "2014-02": 6,
                            "2014-03": 2,
                            "2014-06": 6,
                            "2014-08": 6,
                            "2014-09": 2,
                            "2014-10": 102,
                            "2014-11": 2
                        },
                        "total_count": 126
                    },
                    "fasta_to_ProteinSet": {
                        "accesses_by_month": {
                            "2014-06": 4,
                            "2014-10": 23
                        },
                        "total_count": 27
                    },
                    "gapfill_model": {
                        "accesses_by_month": {
                            "2014-07": 1,
                            "2014-08": 434,
                            "2014-09": 481,
                            "2014-10": 293,
                            "2014-11": 425
                        },
                        "total_count": 1634
                    },
                    "genome_object_to_workspace": {
                        "accesses_by_month": {
                            "2014-02": 12,
                            "2014-03": 53,
                            "2014-04": 56,
                            "2014-05": 7,
                            "2014-06": 103,
                            "2014-07": 18,
                            "2014-08": 6,
                            "2014-10": 245,
                            "2014-11": 22
                        },
                        "total_count": 522
                    },
                    "genome_to_fbamodel": {
                        "accesses_by_month": {
                            "2014-02": 303,
                            "2014-03": 1085,
                            "2014-04": 622,
                            "2014-05": 617,
                            "2014-06": 376,
                            "2014-07": 97,
                            "2014-08": 495,
                            "2014-09": 35555,
                            "2014-10": 16064,
                            "2014-11": 198
                        },
                        "total_count": 55412
                    },
                    "genome_to_workspace": {
                        "accesses_by_month": {
                            "2014-02": 372,
                            "2014-03": 813,
                            "2014-04": 228,
                            "2014-05": 9950,
                            "2014-06": 237,
                            "2014-07": 87,
                            "2014-08": 374,
                            "2014-09": 2616,
                            "2014-10": 14869,
                            "2014-11": 1814
                        },
                        "total_count": 31360
                    },
                    "get_aliassets": {
                        "accesses_by_month": {
                            "2014-03": 19
                        },
                        "total_count": 19
                    },
                    "get_biochemistry": {
                        "accesses_by_month": {
                            "2014-02": 2,
                            "2014-04": 13,
                            "2014-05": 19,
                            "2014-06": 124,
                            "2014-07": 6,
                            "2014-09": 48,
                            "2014-10": 30,
                            "2014-11": 26
                        },
                        "total_count": 268
                    },
                    "get_compounds": {
                        "accesses_by_month": {
                            "2014-02": 5857,
                            "2014-03": 8716,
                            "2014-04": 43145,
                            "2014-05": 12946,
                            "2014-06": 11332,
                            "2014-07": 5496,
                            "2014-08": 10953,
                            "2014-09": 12293,
                            "2014-10": 9936,
                            "2014-11": 5038
                        },
                        "total_count": 125712
                    },
                    "get_fbas": {
                        "accesses_by_month": {
                            "2014-02": 1684,
                            "2014-03": 787,
                            "2014-04": 1645,
                            "2014-05": 1052,
                            "2014-06": 562,
                            "2014-07": 3037,
                            "2014-08": 4442,
                            "2014-09": 1083,
                            "2014-10": 1476,
                            "2014-11": 304
                        },
                        "total_count": 16072
                    },
                    "get_gapfills": {
                        "accesses_by_month": {
                            "2014-02": 37,
                            "2014-03": 197,
                            "2014-04": 15,
                            "2014-05": 262,
                            "2014-06": 412,
                            "2014-07": 422,
                            "2014-08": 584,
                            "2014-09": 80,
                            "2014-10": 68,
                            "2014-11": 76
                        },
                        "total_count": 2153
                    },
                    "get_mapping": {
                        "accesses_by_month": {
                            "2014-05": 4,
                            "2014-06": 134,
                            "2014-07": 2,
                            "2014-08": 2,
                            "2014-09": 4,
                            "2014-10": 82
                        },
                        "total_count": 228
                    },
                    "get_media": {
                        "accesses_by_month": {
                            "2014-02": 23,
                            "2014-03": 2,
                            "2014-04": 55,
                            "2014-05": 152,
                            "2014-06": 240,
                            "2014-07": 780,
                            "2014-08": 1194,
                            "2014-09": 478,
                            "2014-10": 405,
                            "2014-11": 219
                        },
                        "total_count": 3548
                    },
                    "get_models": {
                        "accesses_by_month": {
                            "2014-02": 4252,
                            "2014-03": 2561,
                            "2014-04": 2254,
                            "2014-05": 2181,
                            "2014-06": 1474,
                            "2014-07": 2828,
                            "2014-08": 6273,
                            "2014-09": 21060,
                            "2014-10": 239570,
                            "2014-11": 754
                        },
                        "total_count": 283207
                    },
                    "get_reactions": {
                        "accesses_by_month": {
                            "2014-02": 6500,
                            "2014-03": 90,
                            "2014-04": 54,
                            "2014-05": 761,
                            "2014-06": 3984,
                            "2014-07": 75962,
                            "2014-08": 2390,
                            "2014-09": 2010,
                            "2014-10": 1106,
                            "2014-11": 380
                        },
                        "total_count": 93237
                    },
                    "get_template_model": {
                        "accesses_by_month": {
                            "2014-08": 2,
                            "2014-09": 14
                        },
                        "total_count": 16
                    },
                    "import_expression": {
                        "accesses_by_month": {
                            "2014-08": 2
                        },
                        "total_count": 2
                    },
                    "import_fbamodel": {
                        "accesses_by_month": {
                            "2014-05": 9,
                            "2014-06": 10,
                            "2014-07": 4,
                            "2014-08": 10,
                            "2014-11": 5
                        },
                        "total_count": 38
                    },
                    "import_metagenome_annotation": {
                        "accesses_by_month": {
                            "2014-02": 14,
                            "2014-08": 40
                        },
                        "total_count": 54
                    },
                    "import_phenotypes": {
                        "accesses_by_month": {
                            "2014-03": 12,
                            "2014-04": 2,
                            "2014-05": 18,
                            "2014-06": 44,
                            "2014-07": 9,
                            "2014-08": 38,
                            "2014-09": 3182,
                            "2014-10": 21
                        },
                        "total_count": 3326
                    },
                    "import_regulome": {
                        "accesses_by_month": {
                            "2014-08": 2,
                            "2014-10": 6
                        },
                        "total_count": 8
                    },
                    "import_template_fbamodel": {
                        "accesses_by_month": {
                            "2014-09": 6,
                            "2014-10": 4
                        },
                        "total_count": 10
                    },
                    "integrate_reconciliation_solutions": {
                        "accesses_by_month": {
                            "2014-02": 45,
                            "2014-03": 7,
                            "2014-04": 16,
                            "2014-05": 28,
                            "2014-06": 88,
                            "2014-07": 147,
                            "2014-08": 78,
                            "2014-10": 10
                        },
                        "total_count": 419
                    },
                    "metagenome_to_fbamodels": {
                        "accesses_by_month": {
                            "2014-02": 2,
                            "2014-08": 27
                        },
                        "total_count": 29
                    },
                    "models_to_community_model": {
                        "accesses_by_month": {
                            "2014-03": 35,
                            "2014-05": 6,
                            "2014-06": 76,
                            "2014-07": 9,
                            "2014-08": 19,
                            "2014-09": 8,
                            "2014-10": 11,
                            "2014-11": 12
                        },
                        "total_count": 176
                    },
                    "queue_gapfill_model": {
                        "accesses_by_month": {
                            "2014-02": 147,
                            "2014-03": 2645,
                            "2014-04": 240,
                            "2014-05": 720,
                            "2014-06": 2293,
                            "2014-07": 544,
                            "2014-08": 460,
                            "2014-09": 2110,
                            "2014-10": 22736,
                            "2014-11": 10
                        },
                        "total_count": 31905
                    },
                    "queue_gapgen_model": {
                        "accesses_by_month": {
                            "2014-04": 2,
                            "2014-05": 2,
                            "2014-07": 2,
                            "2014-10": 4
                        },
                        "total_count": 10
                    },
                    "queue_job": {
                        "accesses_by_month": {
                            "2014-02": 2,
                            "2014-03": 4,
                            "2014-06": 122,
                            "2014-08": 24,
                            "2014-09": 2,
                            "2014-10": 50,
                            "2014-11": 44
                        },
                        "total_count": 248
                    },
                    "queue_runfba": {
                        "accesses_by_month": {
                            "2014-10": 2
                        },
                        "total_count": 2
                    },
                    "reaction_sensitivity_analysis": {
                        "accesses_by_month": {
                            "2014-03": 8
                        },
                        "total_count": 8
                    },
                    "role_to_reactions": {
                        "accesses_by_month": {
                            "2014-03": 76,
                            "2014-04": 10,
                            "2014-06": 54,
                            "2014-08": 2,
                            "2014-09": 29,
                            "2014-10": 8
                        },
                        "total_count": 179
                    },
                    "run_job": {
                        "accesses_by_month": {
                            "2014-04": 20,
                            "2014-05": 2,
                            "2014-06": 5,
                            "2014-07": 4
                        },
                        "total_count": 31
                    },
                    "runfba": {
                        "accesses_by_month": {
                            "2014-02": 209,
                            "2014-03": 152,
                            "2014-04": 96,
                            "2014-05": 167,
                            "2014-06": 568,
                            "2014-07": 1058,
                            "2014-08": 1204,
                            "2014-09": 491,
                            "2014-10": 4863,
                            "2014-11": 257
                        },
                        "total_count": 9065
                    },
                    "simulate_phenotypes": {
                        "accesses_by_month": {
                            "2014-02": 1,
                            "2014-03": 22,
                            "2014-04": 2,
                            "2014-05": 7,
                            "2014-06": 327,
                            "2014-07": 6,
                            "2014-08": 37,
                            "2014-09": 98,
                            "2014-10": 28
                        },
                        "total_count": 528
                    },
                    "translate_fbamodel": {
                        "accesses_by_month": {
                            "2014-08": 4,
                            "2014-09": 8
                        },
                        "total_count": 12
                    },
                    "version": {
                        "accesses_by_month": {
                            "2014-09": 4,
                            "2014-11": 10
                        },
                        "total_count": 14
                    },
                    "add_type": {
                        "accesses_by_month": {
                            "2014-01": 809,
                            "2014-02": 601
                        },
                        "total_count": 1410
                    },
                    "clone_workspace": {
                        "accesses_by_month": {
                            "2014-02": 2
                        },
                        "total_count": 2
                    },
                    "copy_object": {
                        "accesses_by_month": {
                            "2014-01": 46,
                            "2014-02": 16,
                            "2014-03": 6
                        },
                        "total_count": 68
                    },
                    "create_workspace": {
                        "accesses_by_month": {
                            "2014-01": 396,
                            "2014-02": 187,
                            "2014-03": 12,
                            "2014-05": 21,
                            "2014-07": 4
                        },
                        "total_count": 620
                    },
                    "delete_object": {
                        "accesses_by_month": {
                            "2014-01": 73,
                            "2014-02": 12
                        },
                        "total_count": 85
                    },
                    "delete_object_permanently": {
                        "accesses_by_month": {
                            "2014-01": 38
                        },
                        "total_count": 38
                    },
                    "delete_workspace": {
                        "accesses_by_month": {
                            "2014-01": 16,
                            "2014-02": 32,
                            "2014-03": 12,
                            "2014-05": 16,
                            "2014-07": 4
                        },
                        "total_count": 80
                    },
                    "get_jobs": {
                        "accesses_by_month": {
                            "2014-01": 175319,
                            "2014-02": 479712,
                            "2014-03": 244737,
                            "2014-04": 112013,
                            "2014-05": 360226,
                            "2014-06": 320591,
                            "2014-07": 593066,
                            "2014-08": 192774,
                            "2014-09": 161748,
                            "2014-10": 182296,
                            "2014-11": 25366
                        },
                        "total_count": 2847848
                    },
                    "get_object": {
                        "accesses_by_month": {
                            "2014-01": 52475,
                            "2014-02": 99139,
                            "2014-03": 220088,
                            "2014-04": 26,
                            "2014-05": 43,
                            "2014-06": 11,
                            "2014-07": 7,
                            "2014-08": 2,
                            "2014-09": 4
                        },
                        "total_count": 371795
                    },
                    "get_object_by_ref": {
                        "accesses_by_month": {
                            "2014-01": 56914,
                            "2014-02": 43266,
                            "2014-03": 312512
                        },
                        "total_count": 412692
                    },
                    "get_objectmeta": {
                        "accesses_by_month": {
                            "2014-01": 12755,
                            "2014-02": 577,
                            "2014-03": 24,
                            "2014-04": 132,
                            "2014-08": 4
                        },
                        "total_count": 13492
                    },
                    "get_objects": {
                        "accesses_by_month": {
                            "2014-01": 69790,
                            "2014-02": 30,
                            "2014-03": 10
                        },
                        "total_count": 69830
                    },
                    "get_types": {
                        "accesses_by_month": {
                            "2014-01": 9040,
                            "2014-02": 15842,
                            "2014-03": 17092,
                            "2014-04": 16975,
                            "2014-05": 17231,
                            "2014-06": 16836,
                            "2014-07": 9600,
                            "2014-08": 17834,
                            "2014-09": 16954,
                            "2014-10": 17427,
                            "2014-11": 6248
                        },
                        "total_count": 161079
                    },
                    "get_user_settings": {
                        "accesses_by_month": {
                            "2014-01": 2548,
                            "2014-02": 1258,
                            "2014-03": 4451,
                            "2014-04": 2733,
                            "2014-05": 4376,
                            "2014-06": 7983,
                            "2014-07": 3282
                        },
                        "total_count": 26631
                    },
                    "get_workspacemeta": {
                        "accesses_by_month": {
                            "2014-01": 2015,
                            "2014-02": 573,
                            "2014-03": 24,
                            "2014-04": 132
                        },
                        "total_count": 2744
                    },
                    "get_workspacepermissions": {
                        "accesses_by_month": {
                            "2014-01": 4568,
                            "2014-02": 62,
                            "2014-03": 20,
                            "2014-04": 2,
                            "2014-07": 2,
                            "2014-08": 14,
                            "2014-09": 4
                        },
                        "total_count": 4672
                    },
                    "has_object": {
                        "accesses_by_month": {
                            "2014-01": 20212,
                            "2014-02": 46,
                            "2014-05": 76
                        },
                        "total_count": 20334
                    },
                    "list_workspace_objects": {
                        "accesses_by_month": {
                            "2014-01": 7437,
                            "2014-02": 2309,
                            "2014-03": 925,
                            "2014-04": 526,
                            "2014-05": 241,
                            "2014-06": 314,
                            "2014-07": 168,
                            "2014-08": 321,
                            "2014-09": 188,
                            "2014-10": 4
                        },
                        "total_count": 12433
                    },
                    "list_workspaces": {
                        "accesses_by_month": {
                            "2014-01": 2949,
                            "2014-02": 1177,
                            "2014-03": 828,
                            "2014-04": 376,
                            "2014-05": 296,
                            "2014-06": 364,
                            "2014-07": 224,
                            "2014-08": 360,
                            "2014-09": 190,
                            "2014-10": 4
                        },
                        "total_count": 6768
                    },
                    "move_object": {
                        "accesses_by_month": {
                            "2014-01": 2
                        },
                        "total_count": 2
                    },
                    "object_history": {
                        "accesses_by_month": {
                            "2014-01": 41,
                            "2014-02": 14,
                            "2014-03": 1
                        },
                        "total_count": 56
                    },
                    "queue_job": {
                        "accesses_by_month": {
                            "2014-01": 1270,
                            "2014-02": 684,
                            "2014-03": 8568,
                            "2014-04": 5587,
                            "2014-05": 51549,
                            "2014-06": 5038,
                            "2014-07": 3063,
                            "2014-08": 3100,
                            "2014-09": 2906,
                            "2014-10": 22864,
                            "2014-11": 52
                        },
                        "total_count": 104681
                    },
                    "save_object": {
                        "accesses_by_month": {
                            "2014-01": 6147,
                            "2014-02": 546,
                            "2014-03": 14,
                            "2014-04": 2,
                            "2014-05": 1065
                        },
                        "total_count": 7774
                    },
                    "save_object_by_ref": {
                        "accesses_by_month": {
                            "2014-01": 8975,
                            "2014-02": 747,
                            "2014-03": 10
                        },
                        "total_count": 9732
                    },
                    "set_global_workspace_permissions": {
                        "accesses_by_month": {
                            "2014-01": 2,
                            "2014-02": 16,
                            "2014-03": 2
                        },
                        "total_count": 20
                    },
                    "set_job_status": {
                        "accesses_by_month": {
                            "2014-01": 3940,
                            "2014-02": 2966,
                            "2014-03": 26525,
                            "2014-04": 15782,
                            "2014-05": 132272,
                            "2014-06": 13600,
                            "2014-07": 9492,
                            "2014-08": 9844,
                            "2014-09": 8910,
                            "2014-10": 68606,
                            "2014-11": 156
                        },
                        "total_count": 292093
                    },
                    "set_user_settings": {
                        "accesses_by_month": {
                            "2014-01": 102,
                            "2014-02": 253,
                            "2014-03": 168,
                            "2014-04": 235,
                            "2014-05": 271,
                            "2014-06": 469,
                            "2014-07": 173
                        },
                        "total_count": 1671
                    },
                    "set_workspace_permissions": {
                        "accesses_by_month": {
                            "2014-01": 2,
                            "2014-02": 4,
                            "2014-03": 6,
                            "2014-07": 2
                        },
                        "total_count": 14
                    },
                    "version": {
                        "accesses_by_month": {
                            "2014-01": 6
                        },
                        "total_count": 6
                    }
                },
                "meta": {
                    "author": "Shane Canon",
                    "comments": "Generated from a Splunk query and summarized by methods_summary",
                    "dataset": "splunk-methods-by-day",
                    "description": "Number of methods access by date summarized over each month including grand totals",
                    "generated": "2014-11-12T09:1415815038"
                },
                "top_list": [
                    "fids_to_protein_sequences",
                    "get_relationship_Produces",
                    "fids_to_dna_sequences",
                    "get_relationship_IsATopicOf",
                    "get_objects",
                    "fids_to_proteins",
                    "get_relationship_HasIndicatedSignalFrom",
                    "get_entity_ProteinSequence",
                    "fids_to_functions",
                    "fids_to_protein_families",
                    "register_ids",
                    "fids_to_annotations",
                    "fids_to_genomes",
                    "list_workspace_info",
                    "get_jobs",
                    "fids_to_feature_data",
                    "get_object_info",
                    "get_job_status",
                    "kbase_ids_to_external_ids",
                    "allocate_id_range",
                    "get_relationship_HasFunctional"
                ]
            }

        },

        init: function(options) {
            this._super(options);

            var topData = [];

            $.each(
                this.options.stats.top_list,
                $.proxy(function (idx, val) {
                    //$topUL.append($.jqElem('li').append(val));
                    topData.push({label : val, hits : this.options.stats.by_method[val].total_count});
                }, this)
            );

            var $accordion =  new kbaseAccordion($.jqElem('div'), { elements : []});

            topData = topData.sort($accordion.sortByKey('hits')).reverse();

            var $topTable =  new kbaseTable($.jqElem('div'), {
                    structure : {
                        header : [{value : 'label', label : 'Method'}, {value : 'hits', label : 'Total calls'}],
                        rows : topData,
                    }
                }
            );

            var $mostPopular = $.jqElem('div')
                .append(
                    $.jqElem('h1').append('Most popular methods')
                )
                .append($topTable.$elem);

            this.$elem.append($mostPopular);

            return this;
        }

    });
});

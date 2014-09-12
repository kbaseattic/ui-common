

module UserInfo {

    /* @range [0,1] */
    typedef int bool;

    /* name, address, contact info, etc */
    typedef structure {
        string real_name;
        string user_name;
        string title;
        string suffix;
        string location;
        list <string> email_addresses;
    } BasicPersonalInfo;



    typedef structure {
        string institution;
        string degree;
        int year;
        bool inProgress;
    } Degree;


    typedef structure {
        string title;
        string institution;
        int start_year;
        int end_year;
    } Affiliation;

    /* resume type stuff- affliation, education, work history */
    typedef structure {
        list<Affiliation> affiliations;
        list<Degree> degrees;
    } Biography;


    typedef structure {
        list<string> keywords;
        string research_statement;
    } ResearchInterests;


    typedef structure {
        string full_citation;
        int year;
        string authors;
        string title;
        string journal;
    } Publication;


    /* @id ws UserInfo.UserInfoSimple */
    typedef string user_info;
    
    /*
    We may want to get rid of this if it is recomputed on the fly.
    @optional user_info_ref
    */
    typedef structure {
        string displayname;
        string username;
        user_info user_info_ref;
    } Person;

    
    typedef structure {
        Person person;
        string role;
    } Role;

    typedef structure {
        string name;
        string description;
        list <string> funding_sources;
        list <int> workspace_ids;
        list <Role> roles;
    } Project;


    /* relationship=> author, contributer, tester, etc */
    typedef structure {
        string app_name;
        string description;
        string relationship;
        string url;
    } KBaseApp;

    typedef structure {
        string service_name;
        string description;
        string relationship;
        string code_url;
        string service_url;
        string doc_url;
    } KBaseService;


    typedef structure {
        float disk_quota;
        float disk_usage;
        string disk_units;
        float cpu_quota;
        float cpu_usage;
        string cpu_units;
    } ResourceUsage;


    typedef structure {
    
        BasicPersonalInfo basic_personal_info;
        Biography bio;
        list <string> websites;
        string personal_statement;
        ResearchInterests interests;
        
        list<Publication> publications;
        list<Person> collaborators;
        
        list <KBaseApp> my_apps;
        list <KBaseService> my_services;
        
        ResourceUsage resource_usage;
    
    } UserInfoSimple;



    typedef structure {
        int n_users_installed;
        int n_times_run;
    } AppUsage;


    /* @id ws UserInfo.AppInfo */
    typedef string app_id;
    
    /* rating should be between 1-5*/
    typedef structure {
        app_id app;
        string user_id;
        string review_text;
        string timestamp;
        int rating; 
    } AppReview;



    /* example narratives should be WS references to the Production ws! */
    typedef structure {
        string name;
        list <string> author_user_ids;
        string description;
        string src_code_url;
        
        int rank;
        
        AppUsage usage;
        
        list <string> screenshots;
        list <string> exampleNarratives;

    } AppInfo;


};
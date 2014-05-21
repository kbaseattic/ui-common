/*


*/

define('kbaseIrisConfig',
    function() {
        if (window.kbaseIrisConfig == undefined) {

            var tpl_or_def = function (tpl, def) {
                if (tpl.match(/\[%.+%\]/) || tpl == undefined || tpl.length == 0) {
                    return def;
                }
                else {
                    return tpl;
                }
            };

            window.kbaseIrisConfig = {
                terminal : {
                    invocationURL   : tpl_or_def('[% invocationURL %]', 'http://kbase.us/services/invocation'),
                    searchURL       : tpl_or_def('[% searchURL %]', 'https://kbase.us/services/search-api/search/$category/$keyword?start=$start&count=$count&format=json'),
                    run_dispatch    : [],
                },
                tutorial : {
                    config_url       : tpl_or_def('[% config_url %]', 'http://kbase.us/docs/tutorials.cfg'),
                    default_tutorial : tpl_or_def('[% default_tutorial %]', 'http://kbase.us/docs/getstarted/getstarted_iris/getstarted_iris.html'),
                },
                commands : {
                    order   : [],
                    include : [],
                    exclude : [],
                },
            }
        }
    }
);


/*
 *  Base class for workspace objects related to modeling
*/
function KBModeling(token) {
    var self = this;

    this.token = token;

    // Used for ModelSEED/Patric Biochem
    var SOLR_ENDPOINT = 'https://www.patricbrc.org/api/';

    this.kbapi = function(service, method, params) {
        var url, method;
        if (service == 'ws') {
            url = window.kbconfig.urls.workspace || "https://ci.kbase.us/services/ws/";
            method = 'Workspace.'+method;
        } else if (service == 'fba') {
            url = "https://kbase.us/services/KBaseFBAModeling/";
            method = 'fbaModelServices.'+method;
        }

        var rpc = {
            params: [params],
            method: method,
            version: "1.1",
            id: String(Math.random()).slice(2),
        };

        var prom = $.ajax({
            url: url,
            type: 'POST',
            processData: false,
            data: JSON.stringify(rpc),
            beforeSend: function (xhr) {
                if (self.token)
                    xhr.setRequestHeader("Authorization", self.token);
            }
        }).then(function(data) {
            return data.result[0];
        })

        return prom;
    }

    // Takes a type 'compounds' or 'reactions', along with
    // options for querying.  Works particularly well with datatables.
    this.biochem = function (type, opts, select) {
        var url = SOLR_ENDPOINT;

        if (type === 'compounds')
            url += 'model_compound/';
        else if (type === 'reactions')
            url += 'model_reaction/';

        url += '?http_accept=application/solr+json';

        // row selection
        if (select) {
            if (Array.isArray(select))
                url += '&select('+String(select)+')';
            else
                url += '&select('+select+')';
        }

        // pagination
        url += '&limit('+opts.length+','+opts.start+')';

        // sorting (assume single sort)
        var sort = opts.order[0],
            colIndex = sort.column,
            dir = sort.dir == 'asc' ? '+' : '-';

        var colName = opts.columns[colIndex].data;
        url += '&sort('+dir+colName+')';

        // search
        var q = opts.search.value;
        url += q ? '&keyword('+q+')' : '&keyword(*)';

        // let's do this
        return $.ajax({
            url: url,
            type: 'GET'
        }).then(function(res) {
            return res.response;
        });
    }


    this.notice = function(container, text, duration) {
        var notice = $('<div class="kb-notify kb-notify-success">'+text+'</div>');
        notice.delay(duration ? duration : 3000)
            .fadeOut(function() {
                $(this).remove();
            });
        container.append(notice);
    }

    // This is a temporary helper function for media data, which will be removed.
    // DO NOT USE ELSEWHERE
    this.getCpds = function(id, opts) {
        var url = SOLR_ENDPOINT+'model_compound/?http_accept=application/json';

        if (opts && 'select' in opts) {
            if (Array.isArray(opts.select)) url += '&select('+String(opts.select)+')';
            else                            url += '&select('+opts.select+')';
        }

        if (Array.isArray(id)) url += '&in(id,('+String(id)+'))&limit('+id.length+')';
        else                   url += '&eq(id,'+id+')';

        url += "&sort('id')"

        return $.get(url).done(function(res) {
            return Array.isArray(id) ? res.data : res.data[0];
        })
    }
}


(function() {

    // these helper methods add and remove a 'loading gif',
    // independent of anything else that is happening in the container
    $.fn.loading = function(text, big) {
        $(this).rmLoading()

        if (big) {
            if (typeof text !== 'undefined') {
                $(this).append('<p class="text-center text-muted loader"><br>'+
                     '<img src="../img/ajax-loader-big.gif"> '+text+'</p>');
            } else {
                $(this).append('<p class="text-center text-muted loader"><br>'+
                     '<img src="../img/ajax-loader-big.gif"> loading...</p>')
            }
        } else {
            if (typeof text !== 'undefined') {
                $(this).append('<p class="text-muted loader">'+
                     '<img src="//narrative.kbase.us/narrative/static/kbase/images/ajax-loader.gif"> '+text+'</p>');
            } else {
                $(this).append('<p class="text-muted loader">'+
                     '<img src="//narrative.kbase.us/narrative/static/kbase/images/ajax-loader.gif"> loading...</p>')
            }
        }

        return this;
    }

    $.fn.rmLoading = function() {
        $(this).find('.loader').remove();
    }

}());

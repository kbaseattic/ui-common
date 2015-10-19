


Here is now to do it:

if (!$.KBaseSessionSync.isLoggedIn()) {
    var hash = window.location.hash;
    var path = '/login/';
    if (hash && hash.length > 0) {
        path += '?nextPath=' + encodeURIComponent(hash.substr(1));
    } 
    $location.url(path);
    } else {
    // your code here
}   
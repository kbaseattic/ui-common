(function () {
    widget = Retina.Widget.extend({
        about: {
            title: "KBase Login",
            name: "login",
            author: "Tobias Paczian",
            requires: [ 'jquery.cookie.js' ]
        }
    });
    
    widget.setup = function () {
	return [];
    };

    widget.callback = null;
    widget.cookiename = "kbase_session";
    widget.authResources = { "default": "KBase",
			     "KBase": { "icon": "KBase_favicon.ico",
					"prefix": "kbgo4711" } };
    
    widget.display = function (wparams) {
	widget = this;
	var index = widget.index;
	
	if (wparams && wparams.hasOwnProperty('authResources')) {
	    widget.authResources = wparams.authResources;
	}

	// append the modals to the body
	var space = document.createElement('div');
	space.innerHTML = widget.modals(index);
	document.body.appendChild(space);

	// put the login thing into the target space
	wparams.target.innerHTML = widget.login_box(index);

	if (wparams.callback && typeof(wparams.callback) == 'function') {
	    widget.callback = wparams.callback;
	}

	// check for a cookie
	var udata = jQuery.cookie(widget.cookiename);
	if (udata) {
	    udata = widget.cookie2json(udata);
	    if (udata.hasOwnProperty('uname') && udata.uname != null) {
		var uname = udata.uname;
		document.getElementById('login_name_span').style.display = "none";
		document.getElementById('login_name').innerHTML = uname+'<br><a href="#" onclick="Retina.WidgetInstances.login['+index+'].perform_logout('+index+');">Sign Out</a>';
		document.getElementById('failure').innerHTML = "";
		stm.Authentication = udata.token;

		if (Retina.WidgetInstances.login[index].callback && typeof(Retina.WidgetInstances.login[index].callback) == 'function') {
		    Retina.WidgetInstances.login[index].callback.call({ 'action': 'login',
									'result': 'success',
									'uname': udata.uname,
									'uid': udata.uid,
									'token': udata.token });
		}
	    }
	}

    };

    widget.modals = function (index) {
	widget = Retina.WidgetInstances.login[index];
	var authResourceSelect = "";
	var loginStyle = "";
	if (Retina.keys(widget.authResources).length > 2) {
	    loginStyle = "class='span3' ";
	    var style = "<style>\
.selector {\
    float: right;\
    border: 1px solid #CCCCCC;\
    border-radius: 4px;\
    padding: 2px;\
    margin-left: 5px;\
    width: 40px;\
}\
.selectImage {\
    width: 21px;\
    margin: 1px;\
    cursor: pointer;\
}\
.hiddenImage {\
    display: none;\
}\
</style>";
	    authResourceSelect = style+"<div class='selector'><i class='icon-chevron-down' style='cursor: pointer;float: right;opacity: 0.2;margin-left: 1px;margin-top: 4px;' onclick=\"if(jQuery('.hiddenImage').css('display')=='none'){jQuery('.hiddenImage').css('display','block');}else{jQuery('.hiddenImage').css('display','none');}\"></i>";
	    for (var i in widget.authResources) {
		if (i=="default") {
		    continue;
		}
		if (i==widget.authResources['default']) {
		    authResourceSelect += "<img class='selectImage' src='images/"+widget.authResources[i].icon+"' onclick=\"Retina.WidgetInstances.login["+index+"].authResources['default']='"+i+"';jQuery('.selectImage').toggleClass('hiddenImage', true);this.className='selectImage';jQuery('.hiddenImage').css('display','none');\">";
		} else {
		    authResourceSelect += "<img class='selectImage hiddenImage' src='images/"+widget.authResources[i].icon+"' onclick=\"Retina.WidgetInstances.login["+index+"].authResources['default']='"+i+"';jQuery('.selectImage').toggleClass('hiddenImage', true);this.className='selectImage';jQuery('.hiddenImage').css('display','none');\">";
		}
	    }
	    authResourceSelect += "</div>";
	    loginStyle = " style='width: 155px;'";
	}
	var html = '\
        <div id="loginModal" class="modal show fade" tabindex="-1" style="width: 550px; display: none;" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="true">\
      <div class="modal-header" style="padding: 15px;">\
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true" style="font-size: 21px;">×</button>\
	<h3 id="loginModalLabel" class="modal-title" style="font-weight: normal; font-size: 24px;font-family: \'RobotoBlack\',Arial,sans-serif;">Login to KBase</h3>\
      </div>\
      <div class="modal-body" style="padding: 20px;">\
        <div id="failure"></div>\
        <table style="margin-left: 50px;">\
          <tr><th style="vertical-align: top;padding-top: 5px;width: 100px;text-align: left;font-weight: bold; font-family: \'OxygenRegular\',Arial,sans-serif;">Username: </th><td><input type="text" '+loginStyle+'id="login">'+authResourceSelect+'</td></tr>\
          <tr><th style="vertical-align: top;padding-top: 5px;width: 100px;text-align: left;font-weight: bold; font-family: \'OxygenRegular\',Arial,sans-serif;">Password: </th><td><input type="password" id="password" onkeypress="event = event || window.event;if(event.keyCode == 13) { Retina.WidgetInstances.login['+index+'].perform_login('+index+');}"></td></tr>\
        </table>\
      </div>\
      <div class="modal-footer" style="margin-top: 15px; padding: 19px 20px 20px; background-color: white;">\
        <div class="row form-horizontal">\
          <div class="text-left pull-left" style="padding-left: 15px;">\
            <span>\
              <a href="https://gologin.kbase.us/ResetPassword" target="_blank" style="font-weight: normal; font-family: \'OxygenRegular\',Arial,sans-serif;">Forgot password?</a>\
               | \
              <a href=" https://gologin.kbase.us/OAuth?response_type=code&step=SignUp&redirect_uri=http%3A%2F%2Fdemo.kbase.us%2Ffunctional-site%2Findex.html%23%2Fws%2F" target="_blank" style="font-weight: normal; font-family: \'OxygenRegular\',Arial,sans-serif;">Sign up</a>\
            </span>\
          </div>\
          <div class="" style="white-space: nowrap;">\
            <button class="btn-new btn-default" data-dismiss="modal" aria-hidden="true">Cancel</button>\
            <button class="btn-new btn-primary-new" onclick="Retina.WidgetInstances.login['+index+'].perform_login('+index+');">Login</button>\
          </div>\
        </div>\
      </div>\
    </div>\
\
    <div id="msgModal" class="modal hide fade" tabindex="-1" style="width: 400px;" role="dialog" aria-labelledby="msgModalLabel" aria-hidden="true" onkeypress="event = event || window.event;if(event.keyCode == 13) {document.getElementById(\'loginOKButton\').click();}">\
      <div class="modal-header">\
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\
	<h3 id="msgModalLabel">Login Information</h3>\
      </div>\
      <div class="modal-body">\
	<p>You have successfully logged in.</p>\
      </div>\
      <div class="modal-footer">\
	<button class="btn btn-success" aria-hidden="true" data-dismiss="modal" id="loginOKButton">OK</button>\
      </div>\
</div>';

	return html;
    };

    widget.login_box = function (index) {
	widget = Retina.WidgetInstances.login[index];
	
	var html = '\
	<p style="float: right; right:16px; position: relative;">\
	        <span  id="login_name_span">\
	          <a href="#" style="position:relative; bottom: 2px; top: 15px;" onclick="jQuery(\'#loginModal\').modal(\'show\');document.getElementById(\'login\').focus();">Sign In</a>\
	        </span>\
	        <span id="login_name"></span>\
</p>';
	
	return html;
    }
    
    widget.perform_login = function (index) {
	widget = Retina.WidgetInstances.login[index];
	var login = document.getElementById('login').value;
	var pass = document.getElementById('password').value;
	document.getElementById('password').blur();
	document.getElementById('failure').innerHTML = '<div class="alert alert-success"><button type="button" class="close" data-dismiss="alert">&times;</button><b>Logging in as:</b> '+login+'</div>';
	var auth_url = RetinaConfig.authURL;

	jQuery.ajax( { type: "POST",
		       url: auth_url,
	               data: { "user_id" : login, "password": pass, "fields": "token,kbase_sessionid,user_id" },
	               success: function(data, textStatus, jqXHR) {
			   var uname = login;
			   document.getElementById('login_name_span').style.display = "none";
			   document.getElementById('login_name').innerHTML = uname+'<br><a href="#" onclick="Retina.WidgetInstances.login['+index+'].perform_logout('+index+');">Sign Out</a>';
			   document.getElementById('failure').innerHTML = "";
			   stm.Authentication = data.token;
			   jQuery('#loginModal').modal('hide');
			   jQuery('#msgModal').modal('show');
			   jQuery.cookie(Retina.WidgetInstances.login[index].cookiename,
					 Retina.WidgetInstances.login[index].json2cookie({ "uname": data.user_id,
											   "token": data.token,
											   "session": data.kbase_sessionid,
											   "uid": data.user_id
											 }), { expires: 60, path: '/' });
			   if (Retina.WidgetInstances.login[index].callback && typeof(Retina.WidgetInstances.login[index].callback) == 'function') {
			       Retina.WidgetInstances.login[index].callback.call({ 'action': 'login',
										   'result': 'success',
										   'uname': data.user_id,
										   'uid': data.user_id,
										   'token': data.token });
			   }
		       }, 
	               error: function(jqXHR, textStatus, errorThrown) {
	                   document.getElementById('failure').innerHTML = '<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>Error:</strong> Login failed.</div>';
			   jQuery.cookie(Retina.WidgetInstances.login[index].cookiename,
					 JSON.stringify({ "uname": null,
							  "token": null }), { expires: 60, path: '/' });
			   if (Retina.WidgetInstances.login[index].callback && typeof(Retina.WidgetInstances.login[index].callback) == 'function') {
			       Retina.WidgetInstances.login[index].callback.call({ 'action': 'login',
										   'result': 'failed',
										   'uname': null,
										   'uid': null,
										   'token': null });
			   }
			   
	               },
	               dataType: "json"});
	    };
    
    widget.perform_logout = function (index) {
	document.getElementById('login_name_span').style.display = "";
	document.getElementById('login_name').innerHTML = "";
	stm.Authentication = null;
	jQuery.cookie(Retina.WidgetInstances.login[index].cookiename, null, { expires: -1, path: '/' });
	jQuery.removeCookie(Retina.WidgetInstances.login[index].cookiename);
	if (Retina.WidgetInstances.login[index].callback && typeof(Retina.WidgetInstances.login[index].callback) == 'function') {
	    Retina.WidgetInstances.login[index].callback.call({ 'action': 'logout'});
	}
    };

    widget.cookie2json = function (str) {
	var items = str.split("|");
	var jsn = { "uname": items[0].split("=")[1],
		    "session": items[1].split("=")[1],
		    "uid": items[2].split("=")[1],
		    "token": items[3].split("=")[1].replace(/EQUALSSIGN/g, "=").replace(/PIPESIGN/g, "|") };
	return jsn;
    };

    widget.json2cookie = function (jsn) {
	var str = "un="+jsn.uname+"|kbase_sessionid="+jsn.session+"|user_id="+jsn.uid+"|token="+(jsn.token.replace(/=/g, "EQUALSSIGN").replace(/\|/g, "PIPESIGN"));
	return str;
    };
    
})();
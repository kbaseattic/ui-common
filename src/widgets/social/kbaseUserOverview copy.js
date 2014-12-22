(function($, undefined) {
  $.KBWidget({
    name: "KBaseUserOverview",
    parent: "kbaseAuthenticatedWidget",
    version: "1.0.0",

     userNameFetchUrl: "https://kbase.us/services/genome_comparison/users?usernames=",


    options: {
      userInfo: null,
      //wsUserInfoUrl: "https://dev04.berkeley.kbase.us:7058",
      //wsUserInfoRef: "",
      userProfileClient: null,
      userId: null,
      kbCache: {},
    },

    // wsUserInfoClient: null,
    loggedIn: false,
    loggedInUserId: null,
    userInfoData: null,
    isMe: false,

    alertPanel: null,

    init: function(options) {
      this._super(options);
      var self = this;

      console.log(options.userInfo);

      /*
      if (options.wsUserInfoUrl) {
        if (options.kbCache.token) {
          self.wsUserInfoClient = new Workspace(options.wsUserInfoUrl, {
            token: self.options.kbCache.token
          });
          self.loggedIn = true;
          self.loggedInUserId = $('<div></div>').kbaseLogin().get_kbase_cookie('user_id');;
        }
      }
      */
      
      this.userProfileClient = options.userProfileClient;
      
      
      if (options.kbCache.token) {
        this.loggedIn = true;
        this.loggedInUserId = $('<div></div>').kbaseLogin().get_kbase_cookie('user_id');
      }
      if (options.userInfo) {
        this.userInfoData = options.userInfo;
        this.userProfile = options.userInfo;
        if (this.userInfoData['user']['username'] === this.loggedInUserId) {
          this.isMe = true;
        }
      }
      
      
      /* User roles
         Used to generate the user role checkboxes, and to provide labels for the info view
      */
      this.userRoles = [
        {id: 'gsp-researcher', label: 'GSP Researcher'},
        {id: 'berc-researcher', label: 'BERC Researcher'},
        {id: 'ber-funded', label: 'BER Funded'},
        {id: 'developer', label: 'Developer'},
        {id: 'tester', label: 'Tester'}
      ];      
      this.userRolesMap = {};
      for (var i in this.userRoles) {
        this.userRolesMap[this.userRoles[i].id] = this.userRoles[i].label;
      }
      
      
      this.userClasses = [
        {id: 'pi', label: 'Principal Investigator'},
        {id: 'gradstudent', label: 'Graduate Student'},
        {id: 'kbase-internal', label: 'KBase Staff'},
        {id: 'kbase-test', label: 'KBase Test/Beta User'}
      ];      
      this.userClassesMap = {};
      for (var i in this.userClasses) {
        this.userClassesMap[this.userClasses[i].id] = this.userClasses[i].label;
      }
      
      this.titles = [
        {id: 'mr', label: 'Mr.'},
        {id: 'ms', label: 'Ms.'},
        {id: 'dr', label: 'Dr.'},
        {id: 'prof', label: 'Prof.'}
      ];
      this.titlesMap = {};
      for (var i in this.titles) {
        this.titlesMap[this.titles[i].id] = this.titles[i].label;
      }
      
      
      // setup the alert panel
      self.alertPanel = $("<div></div>");
      self.$elem.append(self.alertPanel);

      self.setupOverallStructure();
      self.setupPicture();
      self.showInfoView();
      //self.showEditView();
      return this;
    },

    /*var userInfoData = {
                                                    basic_personal_info: {
                                                        real_name:loggedInName,
                                                        user_name:userId,
                                                        title:"",
                                                        suffix:"",
                                                        location:"",
                                                        email_addresses:[]
                                                    },
                                                    bio: {
                                                        affiliations:[],
                                                        degrees:[]
                                                    },
                                                    websites: [],
                                                    personal_statement: "",
                                                    interests: {
                                                        keywords:[],
                                                        research_statement:""
                                                    },
                                                    publications: [],
                                                    collaborators: [],
                                                    my_apps: [],
                                                    my_services: [],
                                                    resource_usage: {
                                                        disk_quota:20,
                                                        disk_usage:14,
                                                        disk_units:"GB",
                                                        cpu_quota:2000,
                                                        cpu_usage:138,
                                                        cpu_units : "CPU Hours"
                                                    }
                                                };
    */


//      get_prop: function(key, obj) {
  //      for (i=0; i<key.length; )
    //  },

      
    showEditView: function() {
      var self = this;
      this.clearMessages();
      var $infoPanel = self.$elem.find("#info");
      $infoPanel.empty();
      //var pInfo = info['basic_personal_info'];
      //var bioInfo = info['bio'];
      var $controlButtons;
      if (self.isMe) {
        var $save = $('<button type="button" class="btn btn-success">Save</button>')
          .bind("click", function() {
            if (self.saveData()) {
              self.showInfoView();
            }
          });
        var $cancel = $('<button type="button" class="btn btn-danger">Cancel</button>')
          .bind("click", function() {
            self.showInfoView();
          });

        $controlButtons = $('<span></span>').append($save).append($cancel);
      }

      var $header = $('<div class="row">')
        .append('<div class="col-md-9"></div>')
        .append($('<div class="col-md-3">').css("text-align", "right").append($controlButtons));
      $infoPanel.append($header);
      
      var user = this.userProfile.user;
      var profile = this.userProfile.profile;

      var email = "";
      if (profile["email_addresses"][0]) {
        email = profile["email_addresses"][0];
      }

      var nameTitleGroup =
        '<div><br></div><div class="panel panel-default">' +
        '<div class="panel-heading">' +
        '<h3 class="panel-title">Basic Personal Information</h3>' +
        '</div>' +
        '<div class="panel-body">' +
        '<div class="row">' +
          '<div class="col-md-2">'+
            '<label for="field_title">title</label>'+
            '<select class="form-control" id="pTitle">';
            
            for (var i=0; i<this.titles.length; i++) {
              var title = this.titles[i];
              var selected = '';
              if (title.id === this.userProfile.profile['title']) {
                var selected = ' selected';
              }
              nameTitleGroup += '<option value="' + title.id + '"'+selected+'>' + title.label + '</option>';
            }
            
        nameTitleGroup += '</select>' +
           
            '</div>' +
          '<div class="col-md-7">'+
            '<div class="form-group">' +
              '<label for="field_real_name">Your Name *</label>'+
              '<div class="input-group-lg"><input id="pRealName" type="text" class="form-control" value="' + user["realname"] + '"></div>' +
              '<div data-field-message="field_real_name" class="field-message"></div>' +
            '</div>' +
          '</div>' +
          '<div class="col-md-3">'+
            '<label for="field_suffix">Suffix</label>'+
            '<div class="input-group-lg"><input id="pSuffix" type="text" class="form-control" value="' + (profile['suffix']?profile['suffix']:'') + '"></div>' +
          '</div>' +
        '</div>' +


      '<div><br></div>' +
        '<div class="row">' +
        '<div class="col-md-12"><div class="input-group">' +
          '<span class="input-group-addon">Location</span>' +
          '<input id="pLocation" type="text" class="form-control" value="' + (profile['location']?profile['location']:'') + '"></div>' +
        '</div>' +
        '</div>' +

      '<div><br></div>' +
        '<div class="row">' +
        '<div class="col-md-12"><div class="input-group">' +
        '<span class="input-group-addon">Primary Email</span>' +
        '<input id="pEmail" type="text" class="form-control" value="' + email + '"></div>' +
        '</div>' +
        '</div>' +
        '</div></div>';
      $infoPanel.append(nameTitleGroup);
      self.$elem.find('#pTitleList li > a').click(function(e) {
        $('#pTitle').text(this.innerHTML);
      });
      
      // A panel for collecting important fields for metrics, user tracking.
      // just do kbase internal for testing...
      if (!profile['roles']) {
        profile['roles'] = [];
      }
      var roles = '<div class="panel panel-default">'+
      '<div class="panel-heading"><h3 class="panel-title">Your Roles</h3></div>'+
      '<div class="panel-body">'+
      '<div class="row">'+
      '<div class="col-md-12">';
      
      for (var i=0; i<this.userRoles.length; i++) {
        var id = this.userRoles[i].id;
        var label = this.userRoles[i].label;
        roles += '<div class="checkbox"><label><input data-field="roles" type="checkbox" value="'+id+'"'+(profile['roles'].indexOf(id)>=0?' checked':'')+'>'+label+'</div>'
      }
      
      roles += '</div>' +
      '</div>'+
      '</div>'+
      '</div>';
      $infoPanel.append(roles);
      
      //if (!info['userclass']) {
      //  info['userclass'] = [];
      //}
      var userClass = '<div class="panel panel-default">'+
      '<div class="panel-heading"><h3 class="panel-title">User Class</h3></div>'+
      '<div class="panel-body">'+
      '<div class="row">'+
      '<div class="col-md-12">';
      
      for (var i=0; i<this.userClasses.length; i++) {
        var id = this.userClasses[i].id;
        var label = this.userClasses[i].label;
        userClass += '<div class="radio"><label><input data-field="userClass" name="userClass" type="radio" value="'+id+'"'+(profile['userClass'] == id ? ' checked':'')+'>'+label+'</div>'
      }
      
      userClass += '</div>' +
      '</div>'+
      '</div>'+
      '</div>';
      $infoPanel.append(userClass);
      

      // this is not the right jquery way to do this!  but it is just a prototype and i can do this faster...

      var affiliations =
        '<div><br></div><div class="panel panel-default">' +
        '<div class="panel-heading">' +
        '<h3 class="panel-title">Affiliations</h3>' +
        '</div>' +
        '<div id="affiliationPanel" class="panel-body"></div>' +
        '<div class="row"><div class="col-md-1"></div><div class="col-md-11">' +
        '<button id="addAffiliation" type="button" class="btn btn-default"><span class="glyphicon glyphicon-plus"></span> Add Affiliation</button>' +
        '</div></div>' +
        '<div><br></div>' +
        '</div></div>';
      $infoPanel.append(affiliations);

      var $aff = self.$elem.find('#addAffiliation');
      var $affPanel = self.$elem.find('#affiliationPanel');
      $aff.click(function(e) {
        console.log($affPanel);
        var $removeAff = $('<button type="button" class="btn btn-danger">Remove</button>')
          .bind("click", function() {
            $(this).parent().parent().parent().parent().removeClass();
            $(this).parent().parent().parent().parent().empty();
          });
        var $newAffliation =
          $('<div class="panel panel-default">').append($('<div class="affiliation-input-group panel-body">').append('<div class="row">' +
            '<div class="col-md-12"><div class="input-group">' +
            '<span class="input-group-addon">Title</span>' +
            '<input id="affTitle" type="text" class="form-control" value=""></div>' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-md-12"><div class="input-group">' +
            '<span class="input-group-addon">Institution</span>' +
            '<input id="affInstitution" type="text" class="form-control" value=""></div>' +
            '</div>' +
            '</div>').append(
            $('<div class="row">').append(
              '<div class="col-md-3"><div class="input-group">' +
              '<span class="input-group-addon">Starting in Year</span>' +
              '<input id="affStart" type="text" class="form-control" value=""></div>' +
              '</div>' +
              '<div class="col-md-1"></div>' +
              '<div class="col-md-3"><div class="input-group">' +
              '<span class="input-group-addon">Ending in Year</span>' +
              '<input id="affEnd" type="text" class="form-control" value=""></div>' +
              '</div>' +
              '</div><div class="col-md-3"></div>').append($('<div class="col-md-2">').append($removeAff))));
        $affPanel.append($newAffliation);
      });
      for (var i = 0; i < profile['affiliations'].length; i++) {
        if (!profile['affiliations'][i]['start_year']) {
          profile['affiliations'][i]['start_year'] = "";
        }
        if (!profile['affiliations'][i]['end_year']) {
          profile['affiliations'][i]['end_year'] = "";
        }
        var $removeAff = $('<button type="button" class="btn btn-danger">Remove</button>')
          .bind("click", function() {
            $(this).parent().parent().parent().parent().removeClass();
            $(this).parent().parent().parent().parent().empty();
          });
        $affPanel.append(
          $('<div class="panel panel-default">').append($('<div class="affiliation-input-group panel-body">').append('<div class="row">' +
            '<div class="col-md-12"><div class="input-group">' +
            '<span class="input-group-addon">Title</span>' +
            '<input id="affTitle" type="text" class="form-control" value="' + profile['affiliations'][i]['title'] + '"></div>' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-md-12"><div class="input-group">' +
            '<span class="input-group-addon">Institution</span>' +
            '<input id="affInstitution" type="text" class="form-control" value="' + profile['affiliations'][i]['institution'] + '"></div>' +
            '</div>' +
            '</div>').append(
            $('<div class="row">').append(
              '<div class="col-md-3"><div class="input-group">' +
              '<span class="input-group-addon">Starting in Year</span>' +
              '<input id="affStart" type="text" class="form-control" value="' + profile['affiliations'][i]['start_year'] + '"></div>' +
              '</div>' +
              '<div class="col-md-1"></div>' +
              '<div class="col-md-3"><div class="input-group">' +
              '<span class="input-group-addon">Ending in Year</span>' +
              '<input id="affEnd" type="text" class="form-control" value="' + profile['affiliations'][i]['end_year'] + '"></div>' +
              '</div><div class="col-md-3"></div>').append($('<div class="col-md-2">').append($removeAff)))));
      }

      var personalStatement =
        '<div><br></div><div class="panel panel-default">' +
        '<div class="panel-heading">' +
        '<h3 class="panel-title">Personal or Research Statement</h3>' +
        '</div>' +
        '<div class="panel-body">' +
        '<div class="row">' +
        '<div class="col-md-12">' +
        '<textarea id="personalStatement" class="form-control" rows="8" style="resize:vertical;">' + profile["personal_statement"] + '</textarea>' +
        '</div>' +
        '</div>' +
        '</div></div>';
      $infoPanel.append(personalStatement);


      // for some reason, this only works if I create another copy of teh save/cancel buttons!   I don't get jquery.
      var $controlButtons2;
      if (self.isMe) {
        var $save = $('<button type="button" class="btn btn-success">Save</button>')
          .bind("click", function() {
            self.saveData();
            self.showInfoView();
          });
        var $cancel = $('<button type="button" class="btn btn-danger">Cancel</button>')
          .bind("click", function() {
            self.showInfoView();
          });

        $controlButtons2 = $('<span></span>').append($save).append($cancel);
      }
      var $footer = $('<div class="row">')
        .append('<div class="col-md-9"></div>')
        .append($('<div class="col-md-3">').css("text-align", "right").append($controlButtons2));
      $infoPanel.append($footer);

    },

    showInfoView: function() {
      var self = this;
      console.log('profile');
      console.log(this.userProfile);
      var $infoPanel = this.$elem.find("#info");
      $infoPanel.empty();
      var user = this.userProfile.user;
      var profile = this.userProfile.profile;
      // var pInfo = this.userInfoData['profile']['basic_personal_info'];
      
      /*
      var $editButton;
      if (self.isMe) {
        $editButton = $('<button type="button" class="btn btn-primary">Edit Info</button>')
          .bind("click", function() {
            self.showEditView();
          });
      }
      */
      
      var nameStr = "";
      if (profile["title"]) {
        nameStr += this.titlesMap[profile.title] + " ";
      }
      nameStr += user.realname;
      if (profile["suffix"]) {
        nameStr += ", " + profile["suffix"];
      }
      
      out = '<div class="row">' +
        '<div class="col-md-9"><h2><strong>' + nameStr + '</strong></h2></div>' +
        '<div class="col-md-3" style="text-align: right;">';
      
      if (this.isMe) {
        out += '<button type="button" class="btn btn-primary" data-button="edit-info">Edit Info</button>';
      }
      
      out += '</div></div>';


      out += '<div class="row"><div class="col-md-12">';
      if (profile['location']) {
        out += '<i>' + profile['location'] + '</i><br>';
      }
      
      if (!profile['email_addresses']) {
        profile['email_addresses'] = [];        
      }
      if (profile['email_addresses'].length >= 1) {
        out += '<p><a href="' + profile['email_addresses'][0] + '">' + 
                profile['email_addresses'][0] + '</a></p>';
      }
      out += '</div></div>';
      
      /* roles:  */
      roles = profile['roles'];
     
      out += '<div class="row"><div class="col-md-6"><div class="" style="font-weight: bold;">Roles</div>';
      if (roles) {
        $infoPanel.append('<ul>');
        for (var i=0; i< roles.length; i++) {
          var roleId = roles[i];
          var roleLabel = this.userRolesMap[roleId];
          out += '<li>'+roleLabel+'</li>';
        }
        out += '</ul>';
      } else {
        out += '<p>No roles assigned</p>'
      }
      out += '</div><div class="col-md-6"><div class="" style="font-weight: bold;">Affiliations</div>';
      
      if (profile['affiliations']) {
        var aff = profile['affiliations'];
        for (var a = 0; a < aff.length; a++) {
          var start = "";
          var end = "present";
          if (aff[a].start_year) {
            start = aff[a].start_year;
          }
          if (aff[a].end_year) {
            end = aff[a].end_year;
          }
          out += '<p><strong>' + aff[a].title + '</strong> (' + start + '-' + end + ')<br><i>' + aff[a].institution + '</i></p>';
        }
        out += '</div></div>';
      }


      if (profile['personal_statement']) {
        out += '<p>' + profile['personal_statement'] + '</p>';
      }
      
      $infoPanel.append(out);
      
      $('#info [data-button="edit-info"]').on('click', function (e) {
        self.showEditView();
      });

      /*var pLoc = self.$elem.find("#pLocation").val();
	    self.userInfoData['basic_personal_info']['location']=pLoc;
	    var pEmail = self.$elem.find("#pEmail").val();
	    if (pEmail) {
		self.userInfoData['basic_personal_info']['email_addresses']=[pEmail];
	    }*/


    },


    prop_exists: function (key, obj) {
      
    },


    saveData: function() {
      var self = this;
      
      this.clearMessages();
      this.clearFieldMessages();
      
      var validationError = false;
      
      var formHasError = false;
      var error = null;
      var fieldControl = null;
      
      // step 1: translate forms to this object...
      var pName = self.$elem.find("#pRealName").val();
      
      /* validation */
      if (!pName || pName.length==0) {
        error = 'Name field is required';
      } else if (pName.length > 100) {
        error = 'The name field may not be more than 100 characters long.';
      }
      if (error) {
        formHasError = true;
        fieldControl = self.$elem.find('#pRealName').closest('.form-group');
        if (fieldControl) {
          fieldControl.addClass('has-error');
        }
        var fieldMessage = fieldControl.find('[data-field-message]');
        if (fieldMessage) {
          fieldMessage.html(error);
        }
      } else {      
        self.userInfoData.user['realname'] = pName;
      }
      

      // SUFFIX
      var pSuffix = this.$elem.find("#pSuffix").val();
      if (pSuffix.length === 0) {
        delete this.userProfile.profile['suffix'];
      } else {
        this.userProfile.profile['suffix'] = pSuffix;
      }

      // TITLE
      var pTitle = self.$elem.find('#pTitle').val();
      if (pTitle.length === 0) {
        delete this.userProfile.profile['title'];
      } else {
        self.userInfoData.profile['title'] = pTitle;
      }

      var pLoc = self.$elem.find("#pLocation").val();
      self.userInfoData.profile['location'] = pLoc;
      var pEmail = self.$elem.find("#pEmail").val();
      if (pEmail) {
        self.userInfoData.profile['email_addresses'] = [pEmail];
      }
      
      /* Coding: Roles, Funding */
      
      var roles = [];
      var roleFields = self.$elem.find('[data-field="roles"]');
      roleFields.each(function() {
        if ($(this).is(':checked')) {
          roles.push($(this).val());
        }
      });
      self.userInfoData.profile['roles'] = roles;
     
     
      var userClassFields = self.$elem.find('[data-field="userClass"]');
      userClassFields.each(function() {
        if ($(this).is(':checked')) {
          // should only be one...
          self.userInfoData.profile['userClass'] = $(this).val();
        }
      });
        

      var bioAff = self.$elem.find(".affiliation-input-group");
      var affiliations = [];
      for (var ba = 0; ba < bioAff.length; ba++) {
        var newAff = {
          title: $(bioAff[ba]).find("#affTitle").val(),
          institution: $(bioAff[ba]).find("#affInstitution").val(),
          start_year: parseInt($(bioAff[ba]).find("#affStart").val()),
          end_year: parseInt($(bioAff[ba]).find("#affEnd").val())
        };
        if (newAff['title'] && newAff['institution']) {
          affiliations.push(newAff);
        }
      }
      self.userInfoData.profile['affiliations'] = affiliations;

      self.userInfoData.profile['personal_statement'] = self.$elem.find("#personalStatement").val();
      
      if (formHasError) {
        self.addErrorMessage('Not Saved', 'Your changes cannot be saved due to one or more errors. Please review the form, make the required corrections, and try again.');
        return false;
      }

      // step 2: save this object to the workspace
      var newObjSaveData = {
        name: "info",
        type: "UserInfo.UserInfoSimple",
        data: self.userInfoData,
        provenance: [{
          description: "created by the KBase functional site, edited by the user"
        }]
      };
      
      
      this.userProfileClient.set_user_profile({profile: this.userProfile}, function (response) {
        self.addSuccessMessage('Success!', 'Your user profile has been update.');
      },
      function (err) {
        self.addErrorMessage('Error!', 'Your user profile could not be saved: ' + err.error.message);
        console.log(err);
      });
      
      return true;
    },
    clearFieldMessages: function() {
      $('[data-field-message]').empty();
    },
    clearMessages: function() {
      this.alertPanel.empty();
    },
    addSuccessMessage: function(title, message) {
      this.alertPanel.append(
        '<div class="alert alert-success alert-dismissible" role="alert">' +
          '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
        '<strong>'+title+'</strong> '+message+'</div>');
    },
    addErrorMessage: function(title, message) {
      this.alertPanel.append(
        '<div class="alert alert-danger alert-dismissible" role="alert">' +
          '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
        '<strong>'+title+'</strong> '+message+'</div>');
    },

    setupPicture: function() {
      var self = this;
      var pic = '<center><img src="assets/images/nouserpic.png" width="95%" style="max-width: 300px;"></center>';
      self.$elem.find("#picture").append(pic);
      if (self.isMe) {
        self.$elem.find("#picture").append('<center><button type="button" class="btn btn-primary">Upload New Picture</button></center>');
      }
    },

    setupOverallStructure: function() {
      var self = this;
      self.$elem.append(
        $('<div id="mainframe">').append(
          $('<div class="row"></div>')
          .append($('<div id="picture" class="col-md-3">'))
          .append($('<div id="info" class="col-md-9">'))
        ));
    }

  });
})(jQuery)

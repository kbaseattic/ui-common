(function($, undefined) {
  $.KBWidget({
    name: "KBaseUserOverview",
    parent: "kbaseAuthenticatedWidget",
    version: "1.0.0",

    userNameFetchUrl: "https://kbase.us/services/genome_comparison/users?usernames=",

    options: {
      userInfo: null,
      userProfileClient: null,
      userId: null,
      kbCache: {},
    },

    loggedIn: false,
    loggedInUserId: null,
    userInfoData: null,
    isProfileOwner: false,
    alertPanel: null,

    init: function(options) {
      this._super(options);
      var self = this;
      console.log(options.userInfo);

      this.userProfileClient = options.userProfileClient;
      
      if (options.kbCache.token) {
        this.loggedIn = true;
        this.loggedInUserId = $('<div></div>').kbaseLogin().get_kbase_cookie('user_id');
      }
      if (options.userInfo) {
        this.userInfoData = options.userInfo;
        this.userProfile = options.userInfo;
        if (this.userInfoData['user']['username'] === this.loggedInUserId) {
          this.isProfileOwner = true;
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
      this.userProfile.env.roles = this.userRoles;
      
      
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
      this.userProfile.env.userClasses = this.userClasses;
      
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
      this.userProfile.env.titles = this.titles;
      
      var env = new nunjucks.Environment(new nunjucks.WebLoader('/src/widgets/social/templates'));
      
      var widget = this;
      env.addFilter('roleLabel', function(role) {
        if (widget.userRolesMap[role]) {
          return widget.userRolesMap[role];
        } else {
          return role;
        }
      });
      env.addFilter('userClassLabel', function(userClass) {
        if (widget.userClassesMap[userClass]) {
          return widget.userClassesMap[userClass];
        } else {
          return userClass;
        }
      });
      env.addFilter('titleLabel', function(title) {
        if (widget.titlesMap[title]) {
          return widget.titlesMap[title];
        } else {
          return title;
        }
      });
      
      this.viewTemplate = env.getTemplate('userProfile_view.html');
      this.editTemplate = env.getTemplate('userProfile_edit.html');
      this.layoutTemplate = env.getTemplate('userProfile_layout.html');
      
      this.setupLayout();
      this.alertPanel = this.$elem.find('[data-placeholder="alert"]');
      this.infoPanel = this.$elem.find('[data-placeholder="info"]');
      this.setupPicture();
      this.showInfoView();
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


  showEditView: function() {
    var self = this;
    this.infoPanel.empty();
    
    var out = this.editTemplate.render(this.userProfile);
    this.infoPanel.append(out);
    
    $('[data-button="save"]').on('click', function (e) {
      self.saveData();
      self.showInfoView();
    });
    $('[data-button="cancel"]').on('click', function (e) {
      self.showInfoView();      
    });
    
    // select options and check radio and checkbox buttons...
    // hook up the buttons
//    $('[data-placeholder="info"] [data-button="edit-info"]').on('click', function (e) {
  //    self.showEditView();
    //});
  },

    showInfoView: function() {
      var self = this;
      this.infoPanel.empty();
      
      if (this.userProfile.profile["title"]) {
        this.userProfile.titleLabel = this.titlesMap[this.userProfile.profile.title];
      }
      
      nunjucks.configure({autoescape: true});
      var out = this.viewTemplate.render(this.userProfile);
      this.infoPanel.append(out);
      
      $('[data-placeholder="info"] [data-button="edit-info"]').on('click', function (e) {
        self.clearMessages();
        self.showEditView();
      });
    },

    saveData: function() {
      this.clearMessages();
      this.clearFieldMessages();
      
      var validationError = false;
      
      var formHasError = false;
      var error = null;
      var fieldControl = null;
      
      // step 1: translate forms to this object...
      var pName = this.$elem.find("#pRealName").val();
      
      /* validation */
      if (!pName || pName.length==0) {
        error = 'Name field is required';
      } else if (pName.length > 100) {
        error = 'The name field may not be more than 100 characters long.';
      }
      if (error) {
        formHasError = true;
        fieldControl = this.$elem.find('#pRealName').closest('.form-group');
        if (fieldControl) {
          fieldControl.addClass('has-error');
        }
        var fieldMessage = fieldControl.find('[data-field-message]');
        if (fieldMessage) {
          fieldMessage.html(error);
        }
      } else {      
        this.userInfoData.user['realname'] = pName;
      }
      

      // SUFFIX
      var pSuffix = this.$elem.find("#pSuffix").val();
      if (pSuffix.length === 0) {
        delete this.userProfile.profile['suffix'];
      } else {
        this.userProfile.profile['suffix'] = pSuffix;
      }

      // TITLE
      var title = this.$elem.find('[data-field="title"]').val();
      if (title && title.length === 0) {
        delete this.userProfile.profile['title'];
      } else {
        this.userInfoData.profile['title'] = title;
      }

      var pLoc = this.$elem.find("#pLocation").val();
      this.userInfoData.profile['location'] = pLoc;
      
      // EMAIL
      var email = this.$elem.find('[data-field="email"]').val();
      if (email) {
        this.userInfoData.profile['email'] = email;
      }
      
      /* Coding: Roles, Funding */
      
      var roles = [];
      var roleFields = this.$elem.find('[data-field="roles"]');
      roleFields.each(function() {
        if ($(this).is(':checked')) {
          roles.push($(this).val());
        }
      });
      this.userInfoData.profile['roles'] = roles;
     
     
      var userClassFields = this.$elem.find('[data-field="userClass"]');
      userClassFields.each(function() {
        if ($(this).is(':checked')) {
          // should only be one...
          this.userInfoData.profile['userClass'] = $(this).val();
        }
      });
        

      var bioAff = this.$elem.find(".affiliation-input-group");
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
      this.userInfoData.profile['affiliations'] = affiliations;

      this.userInfoData.profile['personal_statement'] = this.$elem.find("#personalStatement").val();
      
      if (formHasError) {
        this.addErrorMessage('Not Saved', 'Your changes cannot be saved due to one or more errors. Please review the form, make the required corrections, and try again.');
        return false;
      }

      // step 2: save this object to the workspace
      var newObjSaveData = {
        name: "info",
        type: "UserInfo.UserInfoSimple",
        data: this.userInfoData,
        provenance: [{
          description: "created by the KBase functional site, edited by the user"
        }]
      };
      
      
      this.userProfileClient.set_user_profile({profile: this.userProfile}, 
        function (response) {
          this.addSuccessMessage('Success!', 'Your user profile has been updated.');
        },
        function (err) {
          this.addErrorMessage('Error!', 'Your user profile could not be saved: ' + err.error.message);
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
      self.$elem.find('[data-placeholder="picture"]').append(pic);
      if (self.isProfileOwner) {
        self.$elem.find('[data-placeholder="picture"]').append('<center><button type="button" class="btn btn-primary">Upload New Picture</button></center>');
      }
    },

    setupLayout: function() {
      nunjucks.configure({autoescape: true});
      var out = this.layoutTemplate.render(this.userProfile);
      this.$elem.append(out);
    }

  });
})(jQuery)

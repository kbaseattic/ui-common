



<!DOCTYPE html>
<html lang="en" class="">
  <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# object: http://ogp.me/ns/object# article: http://ogp.me/ns/article# profile: http://ogp.me/ns/profile#">
    <meta charset='utf-8'>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Content-Language" content="en">
    
    
    <title>flowjs/flow.js · GitHub</title>
    <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="GitHub">
    <link rel="fluid-icon" href="https://github.com/fluidicon.png" title="GitHub">
    <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-114.png">
    <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114.png">
    <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-144.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144.png">
    <meta property="fb:app_id" content="1401488693436528">

      <meta content="@github" name="twitter:site" /><meta content="summary" name="twitter:card" /><meta content="flowjs/flow.js" name="twitter:title" /><meta content="flow.js - A JavaScript library providing multiple simultaneous, stable, fault-tolerant and resumable/restartable file uploads via the HTML5 File API." name="twitter:description" /><meta content="https://avatars2.githubusercontent.com/u/5405302?v=2&amp;s=400" name="twitter:image:src" />
<meta content="GitHub" property="og:site_name" /><meta content="object" property="og:type" /><meta content="https://avatars2.githubusercontent.com/u/5405302?v=2&amp;s=400" property="og:image" /><meta content="flowjs/flow.js" property="og:title" /><meta content="https://github.com/flowjs/flow.js" property="og:url" /><meta content="flow.js - A JavaScript library providing multiple simultaneous, stable, fault-tolerant and resumable/restartable file uploads via the HTML5 File API." property="og:description" />

      <meta name="browser-stats-url" content="/_stats">
    <link rel="assets" href="https://assets-cdn.github.com/">
    <link rel="conduit-xhr" href="https://ghconduit.com:25035">
    
    <meta name="pjax-timeout" content="1000">

    <meta name="msapplication-TileImage" content="/windows-tile.png">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="selected-link" value="repo_source" data-pjax-transient>
      <meta name="google-analytics" content="UA-3769691-2">

    <meta content="collector.githubapp.com" name="octolytics-host" /><meta content="collector-cdn.github.com" name="octolytics-script-host" /><meta content="github" name="octolytics-app-id" /><meta content="82CA029A:3B45:37690F5E:54330741" name="octolytics-dimension-request_id" />
    <meta content="Rails, view, files#disambiguate" name="analytics-event" />

    
    
    <link rel="icon" type="image/x-icon" href="https://assets-cdn.github.com/favicon.ico">


    <meta content="authenticity_token" name="csrf-param" />
<meta content="ljfKnEoGgNHkr9s8mi740IT1Uv2SwgjtwV0f3LkEiLlFn529SR56+u5qj5fQaVKhG0GRfZX3rCVfXFzAJDO7Eg==" name="csrf-token" />

    <link href="https://assets-cdn.github.com/assets/github-8fbe7dd2bae0ea9f36bea5c6aeb36fd2c3860c95.css" media="all" rel="stylesheet" type="text/css" />
    <link href="https://assets-cdn.github.com/assets/github2-9ae9325bdf8dd21253fde438acbd4e158d45b029.css" media="all" rel="stylesheet" type="text/css" />
    


    <meta http-equiv="x-pjax-version" content="958200d6c287430e6fc816f62d5c566f">

      
  <meta name="description" content="flow.js - A JavaScript library providing multiple simultaneous, stable, fault-tolerant and resumable/restartable file uploads via the HTML5 File API.">
  <meta name="go-import" content="github.com/flowjs/flow.js git https://github.com/flowjs/flow.js.git">

  <meta content="5405302" name="octolytics-dimension-user_id" /><meta content="flowjs" name="octolytics-dimension-user_login" /><meta content="12662085" name="octolytics-dimension-repository_id" /><meta content="flowjs/flow.js" name="octolytics-dimension-repository_nwo" /><meta content="true" name="octolytics-dimension-repository_public" /><meta content="false" name="octolytics-dimension-repository_is_fork" /><meta content="12662085" name="octolytics-dimension-repository_network_root_id" /><meta content="flowjs/flow.js" name="octolytics-dimension-repository_network_root_nwo" />
  <link href="https://github.com/flowjs/flow.js/commits/master.atom" rel="alternate" title="Recent Commits to flow.js:master" type="application/atom+xml">

  </head>


  <body class="logged_out  env-production  vis-public">
    <a href="#start-of-content" tabindex="1" class="accessibility-aid js-skip-to-content">Skip to content</a>
    <div class="wrapper">
      
      
      
      


      
      <div class="header header-logged-out" role="banner">
  <div class="container clearfix">

    <a class="header-logo-wordmark" href="https://github.com/" ga-data-click="(Logged out) Header, go to homepage, icon:logo-wordmark">
      <span class="mega-octicon octicon-logo-github"></span>
    </a>

    <div class="header-actions" role="navigation">
        <a class="button primary" href="/join" data-ga-click="(Logged out) Header, clicked Sign up, text:sign-up">Sign up</a>
      <a class="button signin" href="/login?return_to=%2Fflowjs%2Fflow.js" data-ga-click="(Logged out) Header, clicked Sign in, text:sign-in">Sign in</a>
    </div>

    <div class="site-search repo-scope js-site-search" role="search">
      <form accept-charset="UTF-8" action="/flowjs/flow.js/search" class="js-site-search-form" data-global-search-url="/search" data-repo-search-url="/flowjs/flow.js/search" method="get"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /></div>
  <input type="text"
    class="js-site-search-field is-clearable"
    data-hotkey="s"
    name="q"
    placeholder="Search"
    data-global-scope-placeholder="Search GitHub"
    data-repo-scope-placeholder="Search"
    tabindex="1"
    autocapitalize="off">
  <div class="scope-badge">This repository</div>
</form>
    </div>

      <ul class="header-nav left" role="navigation">
          <li class="header-nav-item">
            <a class="header-nav-link" href="/explore" data-ga-click="(Logged out) Header, go to explore, text:explore">Explore</a>
          </li>
          <li class="header-nav-item">
            <a class="header-nav-link" href="/features" data-ga-click="(Logged out) Header, go to features, text:features">Features</a>
          </li>
          <li class="header-nav-item">
            <a class="header-nav-link" href="https://enterprise.github.com/" data-ga-click="(Logged out) Header, go to enterprise, text:enterprise">Enterprise</a>
          </li>
          <li class="header-nav-item">
            <a class="header-nav-link" href="/blog" data-ga-click="(Logged out) Header, go to blog, text:blog">Blog</a>
          </li>
      </ul>

  </div>
</div>



      <div id="start-of-content" class="accessibility-aid"></div>
          <div class="site" itemscope itemtype="http://schema.org/WebPage">
    <div id="js-flash-container">
      
    </div>
    <div class="pagehead repohead instapaper_ignore readability-menu">
      <div class="container">
        
<ul class="pagehead-actions">


  <li>
      <a href="/login?return_to=%2Fflowjs%2Fflow.js"
    class="minibutton with-count star-button tooltipped tooltipped-n"
    aria-label="You must be signed in to star a repository" rel="nofollow">
    <span class="octicon octicon-star"></span>
    Star
  </a>

    <a class="social-count js-social-count" href="/flowjs/flow.js/stargazers">
      1,302
    </a>

  </li>

    <li>
      <a href="/login?return_to=%2Fflowjs%2Fflow.js"
        class="minibutton with-count js-toggler-target fork-button tooltipped tooltipped-n"
        aria-label="You must be signed in to fork a repository" rel="nofollow">
        <span class="octicon octicon-repo-forked"></span>
        Fork
      </a>
      <a href="/flowjs/flow.js/network" class="social-count">
        86
      </a>
    </li>
</ul>

        <h1 itemscope itemtype="http://data-vocabulary.org/Breadcrumb" class="entry-title public">
          <span class="mega-octicon octicon-repo"></span>
          <span class="author"><a href="/flowjs" class="url fn" itemprop="url" rel="author"><span itemprop="title">flowjs</span></a></span><!--
       --><span class="path-divider">/</span><!--
       --><strong><a href="/flowjs/flow.js" class="js-current-repository js-repo-home-link">flow.js</a></strong>

          <span class="page-context-loader">
            <img alt="" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
          </span>

        </h1>
      </div><!-- /.container -->
    </div><!-- /.repohead -->

    <div class="container">
      <div class="repository-with-sidebar repo-container new-discussion-timeline with-full-navigation ">
        <div class="repository-sidebar clearfix">
            
<div class="sunken-menu vertical-right repo-nav js-repo-nav js-repository-container-pjax js-octicon-loaders" role="navigation" data-issue-count-url="/flowjs/flow.js/issues/counts">
  <div class="sunken-menu-contents">
    <ul class="sunken-menu-group">
      <li class="tooltipped tooltipped-w" aria-label="Code">
        <a href="/flowjs/flow.js" aria-label="Code" class="selected js-selected-navigation-item sunken-menu-item" data-hotkey="g c" data-pjax="true" data-selected-links="repo_source repo_downloads repo_commits repo_releases repo_tags repo_branches /flowjs/flow.js">
          <span class="octicon octicon-code"></span> <span class="full-word">Code</span>
          <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
</a>      </li>

        <li class="tooltipped tooltipped-w" aria-label="Issues">
          <a href="/flowjs/flow.js/issues" aria-label="Issues" class="js-selected-navigation-item sunken-menu-item js-disable-pjax" data-hotkey="g i" data-selected-links="repo_issues repo_labels repo_milestones /flowjs/flow.js/issues">
            <span class="octicon octicon-issue-opened"></span> <span class="full-word">Issues</span>
            <span class="js-issue-replace-counter"></span>
            <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
</a>        </li>

      <li class="tooltipped tooltipped-w" aria-label="Pull Requests">
        <a href="/flowjs/flow.js/pulls" aria-label="Pull Requests" class="js-selected-navigation-item sunken-menu-item js-disable-pjax" data-hotkey="g p" data-selected-links="repo_pulls /flowjs/flow.js/pulls">
            <span class="octicon octicon-git-pull-request"></span> <span class="full-word">Pull Requests</span>
            <span class="js-pull-replace-counter"></span>
            <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
</a>      </li>


    </ul>
    <div class="sunken-menu-separator"></div>
    <ul class="sunken-menu-group">

      <li class="tooltipped tooltipped-w" aria-label="Pulse">
        <a href="/flowjs/flow.js/pulse/weekly" aria-label="Pulse" class="js-selected-navigation-item sunken-menu-item" data-pjax="true" data-selected-links="pulse /flowjs/flow.js/pulse/weekly">
          <span class="octicon octicon-pulse"></span> <span class="full-word">Pulse</span>
          <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
</a>      </li>

      <li class="tooltipped tooltipped-w" aria-label="Graphs">
        <a href="/flowjs/flow.js/graphs" aria-label="Graphs" class="js-selected-navigation-item sunken-menu-item" data-pjax="true" data-selected-links="repo_graphs repo_contributors /flowjs/flow.js/graphs">
          <span class="octicon octicon-graph"></span> <span class="full-word">Graphs</span>
          <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
</a>      </li>
    </ul>


  </div>
</div>

              <div class="only-with-full-nav">
                
  
<div class="clone-url open"
  data-protocol-type="http"
  data-url="/users/set_protocol?protocol_selector=http&amp;protocol_type=clone">
  <h3><span class="text-emphasized">HTTPS</span> clone URL</h3>
  <div class="input-group">
    <input type="text" class="input-mini input-monospace js-url-field"
           value="https://github.com/flowjs/flow.js.git" readonly="readonly">
    <span class="input-group-button">
      <button aria-label="Copy to clipboard" class="js-zeroclipboard minibutton zeroclipboard-button" data-clipboard-text="https://github.com/flowjs/flow.js.git" data-copied-hint="Copied!" type="button"><span class="octicon octicon-clippy"></span></button>
    </span>
  </div>
</div>

  
<div class="clone-url "
  data-protocol-type="subversion"
  data-url="/users/set_protocol?protocol_selector=subversion&amp;protocol_type=clone">
  <h3><span class="text-emphasized">Subversion</span> checkout URL</h3>
  <div class="input-group">
    <input type="text" class="input-mini input-monospace js-url-field"
           value="https://github.com/flowjs/flow.js" readonly="readonly">
    <span class="input-group-button">
      <button aria-label="Copy to clipboard" class="js-zeroclipboard minibutton zeroclipboard-button" data-clipboard-text="https://github.com/flowjs/flow.js" data-copied-hint="Copied!" type="button"><span class="octicon octicon-clippy"></span></button>
    </span>
  </div>
</div>


<p class="clone-options">You can clone with
      <a href="#" class="js-clone-selector" data-protocol="http">HTTPS</a>
      or <a href="#" class="js-clone-selector" data-protocol="subversion">Subversion</a>.
  <a href="https://help.github.com/articles/which-remote-url-should-i-use" class="help tooltipped tooltipped-n" aria-label="Get help on which URL is right for you.">
    <span class="octicon octicon-question"></span>
  </a>
</p>



                <a href="/flowjs/flow.js/archive/master.zip"
                   class="minibutton sidebar-button"
                   aria-label="Download the contents of flowjs/flow.js as a zip file"
                   title="Download the contents of flowjs/flow.js as a zip file"
                   rel="nofollow">
                  <span class="octicon octicon-cloud-download"></span>
                  Download ZIP
                </a>
              </div>
        </div><!-- /.repository-sidebar -->

        <div id="js-repo-pjax-container" class="repository-content context-loader-container" data-pjax-container>
          
<span id="js-show-full-navigation"></span>

<div class="repository-meta js-details-container ">
    <div class="repository-description">
      <p>A JavaScript library providing multiple simultaneous, stable, fault-tolerant and resumable/restartable file uploads via the HTML5 File API.</p>
    </div>



</div>

<div class="overall-summary overall-summary-bottomless">

  <div class="stats-switcher-viewport js-stats-switcher-viewport">
    <div class="stats-switcher-wrapper">
    <ul class="numbers-summary">
      <li class="commits">
        <a data-pjax href="/flowjs/flow.js/commits/master">
            <span class="octicon octicon-history"></span>
            <span class="num text-emphasized">
              364
            </span>
            commits
        </a>
      </li>
      <li>
        <a data-pjax href="/flowjs/flow.js/branches">
          <span class="octicon octicon-git-branch"></span>
          <span class="num text-emphasized">
            2
          </span>
          branches
        </a>
      </li>

      <li>
        <a data-pjax href="/flowjs/flow.js/releases">
          <span class="octicon octicon-tag"></span>
          <span class="num text-emphasized">
            18
          </span>
          releases
        </a>
      </li>

      <li>
        
  <a href="/flowjs/flow.js/graphs/contributors">
    <span class="octicon octicon-organization"></span>
    <span class="num text-emphasized">
      35
    </span>
    contributors
  </a>
      </li>
    </ul>

      <div class="repository-lang-stats">
        <ol class="repository-lang-stats-numbers">
          <li>
              <a href="/flowjs/flow.js/search?l=javascript">
                <span class="color-block language-color" style="background-color:#f1e05a;"></span>
                <span class="lang">JavaScript</span>
                <span class="percent">100%</span>
              </a>
          </li>
        </ol>
      </div>
    </div>
  </div>

</div>

  <div class="tooltipped tooltipped-s" aria-label="Show language statistics">
    <a href="#"
     class="repository-lang-stats-graph js-toggle-lang-stats"
     style="background-color:#f1e05a">
  <span class="language-color" style="width:100%; background-color:#f1e05a;" itemprop="keywords">JavaScript</span>
    </a>
  </div>

<div class="js-deferred-content"
  data-url="/flowjs/flow.js/show_partial?partial=recently_touched_branches_list">
</div>

<div class="file-navigation in-mid-page">
  <a href="/flowjs/flow.js/find/master"
        class="js-show-file-finder minibutton empty-icon tooltipped tooltipped-s right"
        data-pjax
        data-hotkey="t"
        aria-label="Quickly jump between files">
    <span class="octicon octicon-list-unordered"></span>
  </a>
    <a href="/flowjs/flow.js/compare" aria-label="Compare, review, create a pull request" class="minibutton primary tooltipped tooltipped-s left compare-button" aria-label="Compare &amp; review" data-pjax>
      <span class="octicon octicon-git-compare"></span>
    </a>

  
<div class="select-menu js-menu-container js-select-menu left">
  <span class="minibutton select-menu-button js-menu-target css-truncate" data-hotkey="w"
    data-master-branch="master"
    data-ref="master"
    title="master"
    role="button" aria-label="Switch branches or tags" tabindex="0" aria-haspopup="true">
    <span class="octicon octicon-git-branch"></span>
    <i>branch:</i>
    <span class="js-select-button css-truncate-target">master</span>
  </span>

  <div class="select-menu-modal-holder js-menu-content js-navigation-container" data-pjax aria-hidden="true">

    <div class="select-menu-modal">
      <div class="select-menu-header">
        <span class="select-menu-title">Switch branches/tags</span>
        <span class="octicon octicon-x js-menu-close" role="button" aria-label="Close"></span>
      </div> <!-- /.select-menu-header -->

      <div class="select-menu-filters">
        <div class="select-menu-text-filter">
          <input type="text" aria-label="Filter branches/tags" id="context-commitish-filter-field" class="js-filterable-field js-navigation-enable" placeholder="Filter branches/tags">
        </div>
        <div class="select-menu-tabs">
          <ul>
            <li class="select-menu-tab">
              <a href="#" data-tab-filter="branches" class="js-select-menu-tab">Branches</a>
            </li>
            <li class="select-menu-tab">
              <a href="#" data-tab-filter="tags" class="js-select-menu-tab">Tags</a>
            </li>
          </ul>
        </div><!-- /.select-menu-tabs -->
      </div><!-- /.select-menu-filters -->

      <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket" data-tab-filter="branches">

        <div data-filterable-for="context-commitish-filter-field" data-filterable-type="substring">


            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/flowjs/flow.js/tree/develop"
                 data-name="develop"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="develop">develop</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item selected">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/flowjs/flow.js/tree/master"
                 data-name="master"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="master">master</a>
            </div> <!-- /.select-menu-item -->
        </div>

          <div class="select-menu-no-results">Nothing to show</div>
      </div> <!-- /.select-menu-list -->

      <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket" data-tab-filter="tags">
        <div data-filterable-for="context-commitish-filter-field" data-filterable-type="substring">


            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/flowjs/flow.js/tree/v2.6.2"
                 data-name="v2.6.2"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="v2.6.2">v2.6.2</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/flowjs/flow.js/tree/v2.6.1"
                 data-name="v2.6.1"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="v2.6.1">v2.6.1</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/flowjs/flow.js/tree/v2.6.0"
                 data-name="v2.6.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="v2.6.0">v2.6.0</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/flowjs/flow.js/tree/v2.5.0"
                 data-name="v2.5.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="v2.5.0">v2.5.0</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/flowjs/flow.js/tree/v2.4.0"
                 data-name="v2.4.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="v2.4.0">v2.4.0</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/flowjs/flow.js/tree/v2.3.0"
                 data-name="v2.3.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="v2.3.0">v2.3.0</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/flowjs/flow.js/tree/v2.2.2"
                 data-name="v2.2.2"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="v2.2.2">v2.2.2</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/flowjs/flow.js/tree/v2.2.1"
                 data-name="v2.2.1"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="v2.2.1">v2.2.1</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/flowjs/flow.js/tree/v2.2.0"
                 data-name="v2.2.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="v2.2.0">v2.2.0</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/flowjs/flow.js/tree/v2.1.0"
                 data-name="v2.1.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="v2.1.0">v2.1.0</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/flowjs/flow.js/tree/v2.0.1"
                 data-name="v2.0.1"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="v2.0.1">v2.0.1</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/flowjs/flow.js/tree/v2.0.0-beta5"
                 data-name="v2.0.0-beta5"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="v2.0.0-beta5">v2.0.0-beta5</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/flowjs/flow.js/tree/v2.0.0-beta4"
                 data-name="v2.0.0-beta4"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="v2.0.0-beta4">v2.0.0-beta4</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/flowjs/flow.js/tree/v2.0.0-beta3"
                 data-name="v2.0.0-beta3"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="v2.0.0-beta3">v2.0.0-beta3</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/flowjs/flow.js/tree/v2.0.0-beta2"
                 data-name="v2.0.0-beta2"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="v2.0.0-beta2">v2.0.0-beta2</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/flowjs/flow.js/tree/v2.0.0-beta"
                 data-name="v2.0.0-beta"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="v2.0.0-beta">v2.0.0-beta</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/flowjs/flow.js/tree/v2.0.0-alpha"
                 data-name="v2.0.0-alpha"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="v2.0.0-alpha">v2.0.0-alpha</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/flowjs/flow.js/tree/v2.0.0"
                 data-name="v2.0.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="v2.0.0">v2.0.0</a>
            </div> <!-- /.select-menu-item -->
        </div>

        <div class="select-menu-no-results">Nothing to show</div>
      </div> <!-- /.select-menu-list -->

    </div> <!-- /.select-menu-modal -->
  </div> <!-- /.select-menu-modal-holder -->
</div> <!-- /.select-menu -->



  <div class="breadcrumb"><span class='repo-root js-repo-root'><span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/flowjs/flow.js" class="" data-branch="master" data-direction="back" data-pjax="true" itemscope="url"><span itemprop="title">flow.js</span></a></span></span><span class="separator"> / </span><form action="/login?return_to=%2Fflowjs%2Fflow.js" aria-label="Sign in to make or propose changes" class="js-new-blob-form tooltipped tooltipped-e new-file-link" method="post"><span aria-label="Sign in to make or propose changes" class="js-new-blob-submit octicon octicon-plus" data-test-id="create-new-git-file" role="button"></span></form></div>
</div>



  
  <div class="commit commit-tease js-details-container" >
    <p class="commit-title ">
        <a href="/flowjs/flow.js/commit/47f82731a3fe0d03781cd084b650b0836f5d1e69" class="message" data-pjax="true" title="Merge pull request #47 from JasonRawlinsBPI/master

feat: http status code 202 is now considered a success.">Merge pull request</a> <a href="https://github.com/flowjs/flow.js/pull/47" class="issue-link" title="Http status code 202 is now considered a success.">#47</a> <a href="/flowjs/flow.js/commit/47f82731a3fe0d03781cd084b650b0836f5d1e69" class="message" data-pjax="true" title="Merge pull request #47 from JasonRawlinsBPI/master

feat: http status code 202 is now considered a success.">from JasonRawlinsBPI/master</a>
        <span class="hidden-text-expander inline"><a href="#" class="js-details-target">…</a></span>
    </p>
      <div class="commit-desc"><pre>feat: http status code 202 is now considered a success.</pre></div>
    <div class="commit-meta">
      <button aria-label="Copy SHA" class="js-zeroclipboard zeroclipboard-link" data-clipboard-text="47f82731a3fe0d03781cd084b650b0836f5d1e69" data-copied-hint="Copied!" type="button"><span class="octicon octicon-clippy"></span></button>
      <a href="/flowjs/flow.js/commit/47f82731a3fe0d03781cd084b650b0836f5d1e69" class="sha-block" data-pjax>latest commit <span class="sha">47f82731a3</span></a>

      <div class="authorship">
        <img alt="Aidas Klimas" class="avatar" data-user="2088484" height="20" src="https://avatars2.githubusercontent.com/u/2088484?v=2&amp;s=40" width="20" />
        <span class="author-name"><a href="/AidasK" rel="contributor">AidasK</a></span>
        authored <time class="updated" datetime="2014-09-11T10:35:54Z" is="relative-time">Sep 11, 2014</time>

      </div>
    </div>
  </div>

  <div class="file-wrap">
    <table class="files" data-pjax>

      <tbody class=""
  data-url="/flowjs/flow.js/file-list/master"
  data-deferred-content-error="Failed to load latest commit information.">

    <tr>
      <td class="icon">
        <span class="octicon octicon-file-directory"></span>
        <img alt="" class="spinner" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
      </td>
      <td class="content">
        <span class="css-truncate css-truncate-target"><a href="/flowjs/flow.js/tree/master/dist" class="js-directory-link" id="2a6d07eef8b10b84129b42424ed99327-0e8568bec7dba0f46d304d7a3e433cae4fa1c21a" title="dist">dist</a></span>
      </td>
      <td class="message">
        <span class="css-truncate css-truncate-target ">
          <a href="/flowjs/flow.js/commit/ceb1f820060872e4523216a1b929471a1be41f78" class="message" data-pjax="true" title="Release v2.6.2">Release v2.6.2</a>
        </span>
      </td>
      <td class="age">
        <span class="css-truncate css-truncate-target"><time datetime="2014-09-04T12:51:52Z" is="time-ago">Sep 4, 2014</time></span>
      </td>
    </tr>
    <tr>
      <td class="icon">
        <span class="octicon octicon-file-directory"></span>
        <img alt="" class="spinner" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
      </td>
      <td class="content">
        <span class="css-truncate css-truncate-target"><a href="/flowjs/flow.js/tree/master/samples" class="js-directory-link" id="6ef9161b900632671022358216c7dfe7-5685449392525c5cb7d78a58e455bea0e6956614" title="samples">samples</a></span>
      </td>
      <td class="message">
        <span class="css-truncate css-truncate-target ">
          <a href="/flowjs/flow.js/commit/d05fc569421aa359505393d46e3f377e3440ea8d" class="message" data-pjax="true" title="Node sample fix.

res.send(200) will always return success when checking if the file has been uploaded before; maybe an express res.send API change that happened along the way.">Node sample fix.</a>
        </span>
      </td>
      <td class="age">
        <span class="css-truncate css-truncate-target"><time datetime="2014-09-11T10:33:11Z" is="time-ago">Sep 11, 2014</time></span>
      </td>
    </tr>
    <tr>
      <td class="icon">
        <span class="octicon octicon-file-directory"></span>
        <img alt="" class="spinner" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
      </td>
      <td class="content">
        <span class="css-truncate css-truncate-target"><a href="/flowjs/flow.js/tree/master/src" class="js-directory-link" id="25d902c24283ab8cfbac54dfa101ad31-0a839646604b415b68223a950235a12311ef5b0d" title="src">src</a></span>
      </td>
      <td class="message">
        <span class="css-truncate css-truncate-target ">
          <a href="/flowjs/flow.js/commit/55d0ab9f7f269240e2b864dbeca6c69d664c5c0a" class="message" data-pjax="true" title="Http status code 202 is now considered a success.">Http status code 202 is now considered a success.</a>
        </span>
      </td>
      <td class="age">
        <span class="css-truncate css-truncate-target"><time datetime="2014-09-09T17:15:28Z" is="time-ago">Sep 9, 2014</time></span>
      </td>
    </tr>
    <tr>
      <td class="icon">
        <span class="octicon octicon-file-directory"></span>
        <img alt="" class="spinner" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
      </td>
      <td class="content">
        <span class="css-truncate css-truncate-target"><a href="/flowjs/flow.js/tree/master/test" class="js-directory-link" id="098f6bcd4621d373cade4e832627b4f6-6876a65edb0f36361ab4f33ad3ea61175016498d" title="test">test</a></span>
      </td>
      <td class="message">
        <span class="css-truncate css-truncate-target ">
          <a href="/flowjs/flow.js/commit/9f7fec4b4aa2dbfa43f1ecc076ac23a20d4d93b0" class="message" data-pjax="true" title="fix(preprocess): do not preprocess more files then simultaneousUploads opt">fix(preprocess): do not preprocess more files then simultaneousUpload…</a>
        </span>
      </td>
      <td class="age">
        <span class="css-truncate css-truncate-target"><time datetime="2014-07-16T06:55:08Z" is="time-ago">Jul 16, 2014</time></span>
      </td>
    </tr>
    <tr>
      <td class="icon">
        <span class="octicon octicon-file-text"></span>
        <img alt="" class="spinner" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
      </td>
      <td class="content">
        <span class="css-truncate css-truncate-target"><a href="/flowjs/flow.js/blob/master/.coveralls.yml" class="js-directory-link" id="609cbb49f261fa40dd49d76320116710-6b1cfdde990fe2450e385957677a5f126b128d44" title=".coveralls.yml">.coveralls.yml</a></span>
      </td>
      <td class="message">
        <span class="css-truncate css-truncate-target ">
          <a href="/flowjs/flow.js/commit/d36277c3adbb61340f407a101fbcc1f590935a74" class="message" data-pjax="true" title="feat: coveralls init">feat: coveralls init</a>
        </span>
      </td>
      <td class="age">
        <span class="css-truncate css-truncate-target"><time datetime="2013-09-08T10:11:27Z" is="time-ago">Sep 8, 2013</time></span>
      </td>
    </tr>
    <tr>
      <td class="icon">
        <span class="octicon octicon-file-text"></span>
        <img alt="" class="spinner" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
      </td>
      <td class="content">
        <span class="css-truncate css-truncate-target"><a href="/flowjs/flow.js/blob/master/.gitignore" class="js-directory-link" id="a084b794bc0759e7a6b77810e01874f2-2523ef93efc015dfedebf715a2f5dd22701ba561" title=".gitignore">.gitignore</a></span>
      </td>
      <td class="message">
        <span class="css-truncate css-truncate-target ">
          <a href="/flowjs/flow.js/commit/5cee1e6cc77e44805a1f959056fc5ac42f6a2a86" class="message" data-pjax="true" title="feat: coverage reporter">feat: coverage reporter</a>
        </span>
      </td>
      <td class="age">
        <span class="css-truncate css-truncate-target"><time datetime="2013-08-26T07:23:40Z" is="time-ago">Aug 26, 2013</time></span>
      </td>
    </tr>
    <tr>
      <td class="icon">
        <span class="octicon octicon-file-text"></span>
        <img alt="" class="spinner" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
      </td>
      <td class="content">
        <span class="css-truncate css-truncate-target"><a href="/flowjs/flow.js/blob/master/.travis.yml" class="js-directory-link" id="354f30a63fb0907d4ad57269548329e3-79f1243e6e47fb790b69e78bdaaa2895c9ea1f1a" title=".travis.yml">.travis.yml</a></span>
      </td>
      <td class="message">
        <span class="css-truncate css-truncate-target ">
          <a href="/flowjs/flow.js/commit/35971ece7b8ceb26a3dd2bb325f9facccceb3682" class="message" data-pjax="true" title="chore: rename to flow.js">chore: rename to flow.js</a>
        </span>
      </td>
      <td class="age">
        <span class="css-truncate css-truncate-target"><time datetime="2013-10-04T09:04:09Z" is="time-ago">Oct 4, 2013</time></span>
      </td>
    </tr>
    <tr>
      <td class="icon">
        <span class="octicon octicon-file-text"></span>
        <img alt="" class="spinner" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
      </td>
      <td class="content">
        <span class="css-truncate css-truncate-target"><a href="/flowjs/flow.js/blob/master/CHANGELOG.md" class="js-directory-link" id="4ac32a78649ca5bdd8e0ba38b7006a1e-60bc662918bcb5cb8cdb4ccc077305284ed96ef1" title="CHANGELOG.md">CHANGELOG.md</a></span>
      </td>
      <td class="message">
        <span class="css-truncate css-truncate-target ">
          <a href="/flowjs/flow.js/commit/35971ece7b8ceb26a3dd2bb325f9facccceb3682" class="message" data-pjax="true" title="chore: rename to flow.js">chore: rename to flow.js</a>
        </span>
      </td>
      <td class="age">
        <span class="css-truncate css-truncate-target"><time datetime="2013-10-04T09:04:09Z" is="time-ago">Oct 4, 2013</time></span>
      </td>
    </tr>
    <tr>
      <td class="icon">
        <span class="octicon octicon-file-text"></span>
        <img alt="" class="spinner" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
      </td>
      <td class="content">
        <span class="css-truncate css-truncate-target"><a href="/flowjs/flow.js/blob/master/Gruntfile.js" class="js-directory-link" id="35b4a816e0441e6a375cd925af50752c-f03a11fb4d7be49d57ef2f21683d25c7e0beca6f" title="Gruntfile.js">Gruntfile.js</a></span>
      </td>
      <td class="message">
        <span class="css-truncate css-truncate-target ">
          <a href="/flowjs/flow.js/commit/4e090bc0b1ac355e0467b44319bf9ed743b08134" class="message" data-pjax="true" title="chore: remove coveralls">chore: remove coveralls</a>
        </span>
      </td>
      <td class="age">
        <span class="css-truncate css-truncate-target"><time datetime="2014-04-12T14:17:53Z" is="time-ago">Apr 12, 2014</time></span>
      </td>
    </tr>
    <tr>
      <td class="icon">
        <span class="octicon octicon-file-text"></span>
        <img alt="" class="spinner" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
      </td>
      <td class="content">
        <span class="css-truncate css-truncate-target"><a href="/flowjs/flow.js/blob/master/LICENSE" class="js-directory-link" id="9879d6db96fd29134fc802214163b95a-72e74414155e35d1cd7794c71d86727c72c191d9" title="LICENSE">LICENSE</a></span>
      </td>
      <td class="message">
        <span class="css-truncate css-truncate-target ">
          <a href="/flowjs/flow.js/commit/f800d796242cdcd15cafaacc6b194a03377d7d68" class="message" data-pjax="true" title="Merge branch 'master' of https://github.com/resumable2/resumable.js

Conflicts:
	README.md">Merge branch 'master' of</a> <a href="https://github.com/resumable2/resumable.js">https://github.com/resumable2/resumable.js</a>
        </span>
      </td>
      <td class="age">
        <span class="css-truncate css-truncate-target"><time datetime="2013-09-07T10:21:03Z" is="time-ago">Sep 7, 2013</time></span>
      </td>
    </tr>
    <tr>
      <td class="icon">
        <span class="octicon octicon-file-text"></span>
        <img alt="" class="spinner" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
      </td>
      <td class="content">
        <span class="css-truncate css-truncate-target"><a href="/flowjs/flow.js/blob/master/README.md" class="js-directory-link" id="04c6e90faac2675aa89e2176d2eec7d8-7a8c0f95db6f11cbad885873c0ad3d1d306279a1" title="README.md">README.md</a></span>
      </td>
      <td class="message">
        <span class="css-truncate css-truncate-target ">
          <a href="/flowjs/flow.js/commit/aafd6048185fc526e950b9564dc6aca31c013ab7" class="message" data-pjax="true" title="Update README.md

I think this is better">Update README.md</a>
        </span>
      </td>
      <td class="age">
        <span class="css-truncate css-truncate-target"><time datetime="2014-06-03T10:49:05Z" is="time-ago">Jun 3, 2014</time></span>
      </td>
    </tr>
    <tr>
      <td class="icon">
        <span class="octicon octicon-file-text"></span>
        <img alt="" class="spinner" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
      </td>
      <td class="content">
        <span class="css-truncate css-truncate-target"><a href="/flowjs/flow.js/blob/master/bower.json" class="js-directory-link" id="0a08a7565aba4405282251491979bb6b-463864ae628a297ddcd7e853c7505a94e94b5547" title="bower.json">bower.json</a></span>
      </td>
      <td class="message">
        <span class="css-truncate css-truncate-target ">
          <a href="/flowjs/flow.js/commit/ceb1f820060872e4523216a1b929471a1be41f78" class="message" data-pjax="true" title="Release v2.6.2">Release v2.6.2</a>
        </span>
      </td>
      <td class="age">
        <span class="css-truncate css-truncate-target"><time datetime="2014-09-04T12:51:52Z" is="time-ago">Sep 4, 2014</time></span>
      </td>
    </tr>
    <tr>
      <td class="icon">
        <span class="octicon octicon-file-text"></span>
        <img alt="" class="spinner" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
      </td>
      <td class="content">
        <span class="css-truncate css-truncate-target"><a href="/flowjs/flow.js/blob/master/karma.conf.js" class="js-directory-link" id="a2a3b7b0c9c3b4b93b4aebf4e3ec3cfb-def3b68c193ac1c378973497c4353a93badf725a" title="karma.conf.js">karma.conf.js</a></span>
      </td>
      <td class="message">
        <span class="css-truncate css-truncate-target ">
          <a href="/flowjs/flow.js/commit/768e0fb19f7239ec24ba63d4dc3479770cbf263b" class="message" data-pjax="true" title="chore: configs">chore: configs</a>
        </span>
      </td>
      <td class="age">
        <span class="css-truncate css-truncate-target"><time datetime="2013-11-04T11:22:06Z" is="time-ago">Nov 4, 2013</time></span>
      </td>
    </tr>
    <tr>
      <td class="icon">
        <span class="octicon octicon-file-text"></span>
        <img alt="" class="spinner" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
      </td>
      <td class="content">
        <span class="css-truncate css-truncate-target"><a href="/flowjs/flow.js/blob/master/package.json" class="js-directory-link" id="b9cfc7f2cdf78a7f4b91a753d10865a2-ff31fc0147b670dd650844c3aa54f0fe2f781b49" title="package.json">package.json</a></span>
      </td>
      <td class="message">
        <span class="css-truncate css-truncate-target ">
          <a href="/flowjs/flow.js/commit/ceb1f820060872e4523216a1b929471a1be41f78" class="message" data-pjax="true" title="Release v2.6.2">Release v2.6.2</a>
        </span>
      </td>
      <td class="age">
        <span class="css-truncate css-truncate-target"><time datetime="2014-09-04T12:51:52Z" is="time-ago">Sep 4, 2014</time></span>
      </td>
    </tr>
</tbody>

    </table>
  </div>


  <div id="readme" class="boxed-group flush clearfix announce instapaper_body md">
    <h3>
      <span class="octicon octicon-book"></span>
      README.md
    </h3>

    <article class="markdown-body entry-content" itemprop="mainContentOfPage"><h2>
<a name="user-content-flowjs--" class="anchor" href="#flowjs--" aria-hidden="true"><span class="octicon octicon-link"></span></a>Flow.js <a href="https://travis-ci.org/flowjs/flow.js"><img src="https://camo.githubusercontent.com/6ffc93691cec82c93c7ed023cea331c184ad72d4/68747470733a2f2f7472617669732d63692e6f72672f666c6f776a732f666c6f772e6a732e706e67" alt="Build Status" data-canonical-src="https://travis-ci.org/flowjs/flow.js.png" style="max-width:100%;"></a> <a href="https://coveralls.io/r/flowjs/flow.js?branch=master"><img src="https://camo.githubusercontent.com/e86910c964617e5460ed3b7bd0c56f61f397b303/68747470733a2f2f636f766572616c6c732e696f2f7265706f732f666c6f776a732f666c6f772e6a732f62616467652e706e673f6272616e63683d6d6173746572" alt="Coverage Status" data-canonical-src="https://coveralls.io/repos/flowjs/flow.js/badge.png?branch=master" style="max-width:100%;"></a>
</h2>

<p>Flow.js is a JavaScript library providing multiple simultaneous, stable and resumable uploads via the HTML5 File API. </p>

<p>The library is designed to introduce fault-tolerance into the upload of large files through HTTP. This is done by splitting each file into small chunks. Then, whenever the upload of a chunk fails, uploading is retried until the procedure completes. This allows uploads to automatically resume uploading after a network connection is lost either locally or to the server. Additionally, it allows for users to pause, resume and even recover uploads without losing state because only the currently uploading chunks will be aborted, not the entire upload.</p>

<p>Flow.js does not have any external dependencies other than the <code>HTML5 File API</code>. This is relied on for the ability to chunk files into smaller pieces. Currently, this means that support is limited to Firefox 4+, Chrome 11+, Safari 6+ and Internet Explorer 10+.</p>

<p>Samples and examples are available in the <code>samples/</code> folder. Please push your own as Markdown to help document the project.</p>

<h2>
<a name="user-content-can-i-see-a-demo" class="anchor" href="#can-i-see-a-demo" aria-hidden="true"><span class="octicon octicon-link"></span></a>Can i see a demo?</h2>

<p><a href="http://flowjs.github.io/ng-flow/">Flow.js + angular.js file upload demo</a> - ng-flow extension page <a href="https://github.com/flowjs/ng-flow">https://github.com/flowjs/ng-flow</a></p>

<p>JQuery and node.js backend demo <a href="https://github.com/flowjs/flow.js/tree/master/samples/Node.js">https://github.com/flowjs/flow.js/tree/master/samples/Node.js</a></p>

<h2>
<a name="user-content-how-can-i-install-it" class="anchor" href="#how-can-i-install-it" aria-hidden="true"><span class="octicon octicon-link"></span></a>How can I install it?</h2>

<p>Download a latest build from <a href="https://github.com/flowjs/flow.js/releases">https://github.com/flowjs/flow.js/releases</a>
it contains development and minified production files in <code>dist/</code> folder.</p>

<p>or use bower:</p>

<pre><code>    bower install flow.js#~2
</code></pre>

<p>or use git clone</p>

<pre><code>    git clone https://github.com/flowjs/flow.js
</code></pre>

<h2>
<a name="user-content-how-can-i-use-it" class="anchor" href="#how-can-i-use-it" aria-hidden="true"><span class="octicon octicon-link"></span></a>How can I use it?</h2>

<p>A new <code>Flow</code> object is created with information of what and where to post:</p>

<pre><code>var flow = new Flow({
  target:'/api/photo/redeem-upload-token', 
  query:{upload_token:'my_token'}
});
// Flow.js isn't supported, fall back on a different method
if(!flow.support) location.href = '/some-old-crappy-uploader';
</code></pre>

<p>To allow files to be either selected and drag-dropped, you'll assign drop target and a DOM item to be clicked for browsing:</p>

<pre><code>flow.assignBrowse(document.getElementById('browseButton'));
flow.assignDrop(document.getElementById('dropTarget'));
</code></pre>

<p>After this, interaction with Flow.js is done by listening to events:</p>

<pre><code>flow.on('fileAdded', function(file, event){
   console.log(file, event);
});
flow.on('fileSuccess', function(file,message){
    console.log(file,message);
});
flow.on('fileError', function(file, message){
    console.log(file, message);
});
</code></pre>

<h2>
<a name="user-content-how-do-i-set-it-up-with-my-server" class="anchor" href="#how-do-i-set-it-up-with-my-server" aria-hidden="true"><span class="octicon octicon-link"></span></a>How do I set it up with my server?</h2>

<p>Most of the magic for Flow.js happens in the user's browser, but files still need to be reassembled from chunks on the server side. This should be a fairly simple task and can be achieved in any web framework or language, which is able to receive file uploads.</p>

<p>To handle the state of upload chunks, a number of extra parameters are sent along with all requests:</p>

<ul class="task-list">
<li>
<code>flowChunkNumber</code>: The index of the chunk in the current upload. First chunk is <code>1</code> (no base-0 counting here).</li>
<li>
<code>flowTotalChunks</code>: The total number of chunks.<br>
</li>
<li>
<code>flowChunkSize</code>: The general chunk size. Using this value and <code>flowTotalSize</code> you can calculate the total number of chunks. Please note that the size of the data received in the HTTP might be lower than <code>flowChunkSize</code> of this for the last chunk for a file.</li>
<li>
<code>flowTotalSize</code>: The total file size.</li>
<li>
<code>flowIdentifier</code>: A unique identifier for the file contained in the request.</li>
<li>
<code>flowFilename</code>: The original file name (since a bug in Firefox results in the file name not being transmitted in chunk multipart posts).</li>
<li>
<code>flowRelativePath</code>: The file's relative path when selecting a directory (defaults to file name in all browsers except Chrome).</li>
</ul><p>You should allow for the same chunk to be uploaded more than once; this isn't standard behaviour, but on an unstable network environment it could happen, and this case is exactly what Flow.js is designed for.</p>

<p>For every request, you can confirm reception in HTTP status codes (can be change through the <code>permanentErrors</code> option):</p>

<ul class="task-list">
<li>
<code>200</code>: The chunk was accepted and correct. No need to re-upload.</li>
<li>
<code>404</code>, <code>415</code>. <code>500</code>, <code>501</code>: The file for which the chunk was uploaded is not supported, cancel the entire upload.</li>
<li>
<em>Anything else</em>: Something went wrong, but try reuploading the file.</li>
</ul><h2>
<a name="user-content-handling-get-or-test-requests" class="anchor" href="#handling-get-or-test-requests" aria-hidden="true"><span class="octicon octicon-link"></span></a>Handling GET (or <code>test()</code> requests)</h2>

<p>Enabling the <code>testChunks</code> option will allow uploads to be resumed after browser restarts and even across browsers (in theory you could even run the same file upload across multiple tabs or different browsers).  The <code>POST</code> data requests listed are required to use Flow.js to receive data, but you can extend support by implementing a corresponding <code>GET</code> request with the same parameters:</p>

<ul class="task-list">
<li>If this request returns a <code>200</code> HTTP code, the chunks is assumed to have been completed.</li>
<li>If the request returns anything else, the chunk will be uploaded in the standard fashion.</li>
</ul><p>After this is done and <code>testChunks</code> enabled, an upload can quickly catch up even after a browser restart by simply verifying already uploaded chunks that do not need to be uploaded again.</p>

<h2>
<a name="user-content-full-documentation" class="anchor" href="#full-documentation" aria-hidden="true"><span class="octicon octicon-link"></span></a>Full documentation</h2>

<h3>
<a name="user-content-flow" class="anchor" href="#flow" aria-hidden="true"><span class="octicon octicon-link"></span></a>Flow</h3>

<h4>
<a name="user-content-configuration" class="anchor" href="#configuration" aria-hidden="true"><span class="octicon octicon-link"></span></a>Configuration</h4>

<p>The object is loaded with a configuration options:</p>

<pre><code>var r = new Flow({opt1:'val', ...});
</code></pre>

<p>Available configuration options are:</p>

<ul class="task-list">
<li>
<code>target</code> The target URL for the multipart POST request. This can be a string or a function. If a
function, it will be passed a FlowFile, a FlowChunk and isTest boolean (Default: <code>/</code>)</li>
<li>
<code>singleFile</code> Enable single file upload. Once one file is uploaded, second file will overtake existing one, first one will be canceled. (Default: false)</li>
<li>
<code>chunkSize</code> The size in bytes of each uploaded chunk of data. The last uploaded chunk will be at least this size and up to two the size, see <a href="https://github.com/23/resumable.js/issues/51">Issue #51</a> for details and reasons. (Default: <code>1*1024*1024</code>)</li>
<li>
<code>forceChunkSize</code> Force all chunks to be less or equal than chunkSize. Otherwise, the last chunk will be greater than or equal to <code>chunkSize</code>. (Default: <code>false</code>)</li>
<li>
<code>simultaneousUploads</code> Number of simultaneous uploads (Default: <code>3</code>)</li>
<li>
<code>fileParameterName</code> The name of the multipart POST parameter to use for the file chunk  (Default: <code>file</code>)</li>
<li>
<code>query</code> Extra parameters to include in the multipart POST with data. This can be an object or a
function. If a function, it will be passed a FlowFile, a FlowChunk object and a isTest boolean
(Default: <code>{}</code>)</li>
<li>
<code>headers</code> Extra headers to include in the multipart POST with data. If a function, it will be passed a FlowFile, a FlowChunk object and a isTest boolean (Default: <code>{}</code>)</li>
<li>
<code>withCredentials</code> Standard CORS requests do not send or set any cookies by default. In order to
include cookies as part of the request, you need to set the <code>withCredentials</code> property to true.
(Default: <code>false</code>)</li>
<li>
<code>method</code> Method to use when POSTing chunks to the server (<code>multipart</code> or <code>octet</code>) (Default: <code>multipart</code>)</li>
<li>
<code>prioritizeFirstAndLastChunk</code> Prioritize first and last chunks of all files. This can be handy if you can determine if a file is valid for your service from only the first or last chunk. For example, photo or video meta data is usually located in the first part of a file, making it easy to test support from only the first chunk. (Default: <code>false</code>)</li>
<li>
<code>testChunks</code> Make a GET request to the server for each chunks to see if it already exists. If implemented on the server-side, this will allow for upload resumes even after a browser crash or even a computer restart. (Default: <code>true</code>)</li>
<li>
<code>preprocess</code> Optional function to process each chunk before testing &amp; sending. Function is passed the chunk as parameter, and should call the <code>preprocessFinished</code> method on the chunk when finished. (Default: <code>null</code>)</li>
<li>
<code>generateUniqueIdentifier</code> Override the function that generates unique identifiers for each file.  (Default: <code>null</code>)</li>
<li>
<code>maxChunkRetries</code> The maximum number of retries for a chunk before the upload is failed. Valid values are any positive integer and <code>undefined</code> for no limit. (Default: <code>undefined</code>)</li>
<li>
<code>chunkRetryInterval</code> The number of milliseconds to wait before retrying a chunk on a non-permanent error.  Valid values are any positive integer and <code>undefined</code> for immediate retry. (Default: <code>undefined</code>)</li>
<li>
<code>progressCallbacksInterval</code> The time interval in milliseconds between progress reports. Set it
to 0 to handle each progress callback. (Default: <code>500</code>)</li>
<li>
<code>speedSmoothingFactor</code> Used for calculating average upload speed. Number from 1 to 0. Set to 1
and average upload speed wil be equal to current upload speed. For longer file uploads it is
better set this number to 0.02, because time remaining estimation will be more accurate. This
parameter must be adjusted together with <code>progressCallbacksInterval</code> parameter. (Default 0.1)</li>
</ul><h4>
<a name="user-content-properties" class="anchor" href="#properties" aria-hidden="true"><span class="octicon octicon-link"></span></a>Properties</h4>

<ul class="task-list">
<li>
<code>.support</code> A boolean value indicator whether or not Flow.js is supported by the current browser.</li>
<li>
<code>.supportDirectory</code> A boolean value, which indicates if browser supports directory uploads.</li>
<li>
<code>.opts</code> A hash object of the configuration of the Flow.js instance.</li>
<li>
<code>.files</code> An array of <code>FlowFile</code> file objects added by the user (see full docs for this object type below).</li>
</ul><h4>
<a name="user-content-methods" class="anchor" href="#methods" aria-hidden="true"><span class="octicon octicon-link"></span></a>Methods</h4>

<ul class="task-list">
<li>
<p><code>.assignBrowse(domNodes, isDirectory, singleFile, attributes)</code> Assign a browse action to one or more DOM nodes.</p>

<ul class="task-list">
<li>
<code>domNodes</code> array of dom nodes or a single node.</li>
<li>
<code>isDirectory</code> Pass in <code>true</code> to allow directories to be selected (Chrome only, support can be checked with <code>supportDirectory</code> property).</li>
<li>
<code>singleFile</code> To prevent multiple file uploads set this to true. Also look at config parameter <code>singleFile</code>.</li>
<li>
<code>attributes</code> Pass object of keys and values to set custom attributes on input fields.
For example, you can set <code>accept</code> attribute to <code>image/*</code>. This means that user will be able to select only images.
Full list of attributes: <a href="http://www.w3.org/TR/html-markup/input.file.html#input.file-attributes">http://www.w3.org/TR/html-markup/input.file.html#input.file-attributes</a>
</li>
</ul>
<p>Note: avoid using <code>a</code> and <code>button</code> tags as file upload buttons, use span instead.</p>
</li>
<li>
<code>.assignDrop(domNodes)</code> Assign one or more DOM nodes as a drop target.</li>
<li>
<code>.on(event, callback)</code> Listen for event from Flow.js (see below)</li>
<li>
<code>.off([event, [callback]])</code>:

<ul class="task-list">
<li>
<code>.off()</code> All events are removed.</li>
<li>
<code>.off(event)</code> Remove all callbacks of specific event.</li>
<li>
<code>.off(event, callback)</code> Remove specific callback of event. <code>callback</code> should be a <code>Function</code>.</li>
</ul>
</li>
<li>
<code>.upload()</code> Start or resume uploading.</li>
<li>
<code>.pause()</code> Pause uploading.</li>
<li>
<code>.resume()</code> Resume uploading.</li>
<li>
<code>.cancel()</code> Cancel upload of all <code>FlowFile</code> objects and remove them from the list.</li>
<li>
<code>.progress()</code> Returns a float between 0 and 1 indicating the current upload progress of all files.</li>
<li>
<code>.isUploading()</code> Returns a boolean indicating whether or not the instance is currently uploading anything.</li>
<li>
<code>.addFile(file)</code> Add a HTML5 File object to the list of files.</li>
<li>
<code>.removeFile(file)</code> Cancel upload of a specific <code>FlowFile</code> object on the list from the list.</li>
<li>
<code>.getFromUniqueIdentifier(uniqueIdentifier)</code> Look up a <code>FlowFile</code> object by its unique identifier.</li>
<li>
<code>.getSize()</code> Returns the total size of the upload in bytes.</li>
<li>
<code>.sizeUploaded()</code> Returns the total size uploaded of all files in bytes.</li>
<li>
<code>.timeRemaining()</code> Returns remaining time to upload all files in seconds. Accuracy is based on average speed. If speed is zero, time remaining will be equal to positive infinity <code>Number.POSITIVE_INFINITY</code>
</li>
</ul><h4>
<a name="user-content-events" class="anchor" href="#events" aria-hidden="true"><span class="octicon octicon-link"></span></a>Events</h4>

<ul class="task-list">
<li>
<code>.fileSuccess(file, message)</code> A specific file was completed. First argument <code>file</code> is instance of <code>FlowFile</code>, second argument <code>message</code> contains server response. Response is always a string.</li>
<li>
<code>.fileProgress(file)</code> Uploading progressed for a specific file.</li>
<li>
<code>.fileAdded(file, event)</code> This event is used for file validation. To reject this file return false.
This event is also called before file is added to upload queue,
this means that calling <code>flow.upload()</code> function will not start current file upload.
Optionally, you can use the browser <code>event</code> object from when the file was
added.</li>
<li>
<code>.filesAdded(array, event)</code> Same as fileAdded, but used for multiple file validation.</li>
<li>
<code>.filesSubmitted(array, event)</code> Can be used to start upload of currently added files.</li>
<li>
<code>.fileRetry(file)</code> Something went wrong during upload of a specific file, uploading is being retried.</li>
<li>
<code>.fileError(file, message)</code> An error occurred during upload of a specific file.</li>
<li>
<code>.uploadStart()</code> Upload has been started on the Flow object.</li>
<li>
<code>.complete()</code> Uploading completed.</li>
<li>
<code>.progress()</code> Uploading progress.</li>
<li>
<code>.error(message, file)</code> An error, including fileError, occurred.</li>
<li>
<code>.catchAll(event, ...)</code> Listen to all the events listed above with the same callback function.</li>
</ul><h3>
<a name="user-content-flowfile" class="anchor" href="#flowfile" aria-hidden="true"><span class="octicon octicon-link"></span></a>FlowFile</h3>

<p>FlowFile constructor can be accessed in <code>Flow.FlowFile</code>.</p>

<h4>
<a name="user-content-properties-1" class="anchor" href="#properties-1" aria-hidden="true"><span class="octicon octicon-link"></span></a>Properties</h4>

<ul class="task-list">
<li>
<code>.flowObj</code> A back-reference to the parent <code>Flow</code> object.</li>
<li>
<code>.file</code> The correlating HTML5 <code>File</code> object.</li>
<li>
<code>.name</code> The name of the file.</li>
<li>
<code>.relativePath</code> The relative path to the file (defaults to file name if relative path doesn't exist)</li>
<li>
<code>.size</code> Size in bytes of the file.</li>
<li>
<code>.uniqueIdentifier</code> A unique identifier assigned to this file object. This value is included in uploads to the server for reference, but can also be used in CSS classes etc when building your upload UI.</li>
<li>
<code>.averageSpeed</code> Average upload speed, bytes per second.</li>
<li>
<code>.currentSpeed</code> Current upload speed, bytes per second.</li>
<li>
<code>.chunks</code> An array of <code>FlowChunk</code> items. You shouldn't need to dig into these.</li>
<li>
<code>.paused</code> Indicated if file is paused.</li>
<li>
<code>.error</code> Indicated if file has encountered an error.</li>
</ul><h4>
<a name="user-content-methods-1" class="anchor" href="#methods-1" aria-hidden="true"><span class="octicon octicon-link"></span></a>Methods</h4>

<ul class="task-list">
<li>
<code>.progress(relative)</code> Returns a float between 0 and 1 indicating the current upload progress of the file. If <code>relative</code> is <code>true</code>, the value is returned relative to all files in the Flow.js instance.</li>
<li>
<code>.pause()</code> Pause uploading the file.</li>
<li>
<code>.resume()</code> Resume uploading the file.</li>
<li>
<code>.cancel()</code> Abort uploading the file and delete it from the list of files to upload.</li>
<li>
<code>.retry()</code> Retry uploading the file.</li>
<li>
<code>.bootstrap()</code> Rebuild the state of a <code>FlowFile</code> object, including reassigning chunks and XMLHttpRequest instances.</li>
<li>
<code>.isUploading()</code> Returns a boolean indicating whether file chunks is uploading.</li>
<li>
<code>.isComplete()</code> Returns a boolean indicating whether the file has completed uploading and received a server response.</li>
<li>
<code>.sizeUploaded()</code> Returns size uploaded in bytes.</li>
<li>
<code>.timeRemaining()</code> Returns remaining time to finish upload file in seconds. Accuracy is based on average speed. If speed is zero, time remaining will be equal to positive infinity <code>Number.POSITIVE_INFINITY</code>
</li>
<li>
<code>.getExtension()</code> Returns file extension in lowercase.</li>
<li>
<code>.getType()</code> Returns file type.</li>
</ul><h2>
<a name="user-content-contribution" class="anchor" href="#contribution" aria-hidden="true"><span class="octicon octicon-link"></span></a>Contribution</h2>

<p>To ensure consistency throughout the source code, keep these rules in mind as you are working:</p>

<ul class="task-list">
<li><p>All features or bug fixes must be tested by one or more specs.</p></li>
<li><p>We follow the rules contained in <a href="http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml">Google's JavaScript Style Guide</a> with an exception we wrap all code at 100 characters.</p></li>
</ul><h2>
<a name="user-content-installation-dependencies" class="anchor" href="#installation-dependencies" aria-hidden="true"><span class="octicon octicon-link"></span></a>Installation Dependencies</h2>

<ol class="task-list">
<li>
<p>To clone your Github repository, run:</p>

<pre><code>git clone git@github.com:&lt;github username&gt;/flow.js.git
</code></pre>
</li>
<li>
<p>To go to the Flow.js directory, run:</p>

<pre><code>cd flow.js
</code></pre>
</li>
<li>
<p>To add node.js dependencies</p>

<pre><code>npm install
</code></pre>
</li>
</ol><h2>
<a name="user-content-testing" class="anchor" href="#testing" aria-hidden="true"><span class="octicon octicon-link"></span></a>Testing</h2>

<p>Our unit and integration tests are written with Jasmine and executed with Karma. To run all of the
tests on Chrome run:</p>

<pre><code>grunt karma:watch
</code></pre>

<p>Or choose other browser</p>

<pre><code>grunt karma:watch --browsers=Firefox,Chrome
</code></pre>

<p>Browsers should be comma separated and case sensitive.</p>

<p>To re-run tests just change any source or test file.</p>

<p>Automated tests is running after every commit at travis-ci.</p>

<h3>
<a name="user-content-running-test-on-saucelabs" class="anchor" href="#running-test-on-saucelabs" aria-hidden="true"><span class="octicon octicon-link"></span></a>Running test on sauceLabs</h3>

<ol class="task-list">
<li>Connect to sauce labs <a href="https://saucelabs.com/docs/connect">https://saucelabs.com/docs/connect</a>
</li>
<li><code>grunt  test --sauce-local=true --sauce-username=**** --sauce-access-key=***</code></li>
</ol><p>other browsers can be used with <code>--browsers</code> flag, available browsers: sl_opera,sl_iphone,sl_safari,sl_ie10,sl_chorme,sl_firefox</p>

<h2>
<a name="user-content-origin" class="anchor" href="#origin" aria-hidden="true"><span class="octicon octicon-link"></span></a>Origin</h2>

<p>Flow.js was inspired by and evolved from <a href="https://github.com/23/resumable.js">https://github.com/23/resumable.js</a>. Library has been supplemented with tests and features, such as drag and drop for folders, upload speed, time remaining estimation, separate files pause, resume and more.</p></article>
  </div>


        </div>

      </div><!-- /.repo-container -->
      <div class="modal-backdrop"></div>
    </div><!-- /.container -->
  </div><!-- /.site -->


    </div><!-- /.wrapper -->

      <div class="container">
  <div class="site-footer" role="contentinfo">
    <ul class="site-footer-links right">
      <li><a href="https://status.github.com/">Status</a></li>
      <li><a href="http://developer.github.com">API</a></li>
      <li><a href="http://training.github.com">Training</a></li>
      <li><a href="http://shop.github.com">Shop</a></li>
      <li><a href="/blog">Blog</a></li>
      <li><a href="/about">About</a></li>

    </ul>

    <a href="/" aria-label="Homepage">
      <span class="mega-octicon octicon-mark-github" title="GitHub"></span>
    </a>

    <ul class="site-footer-links">
      <li>&copy; 2014 <span title="0.03725s from github-fe136-cp1-prd.iad.github.net">GitHub</span>, Inc.</li>
        <li><a href="/site/terms">Terms</a></li>
        <li><a href="/site/privacy">Privacy</a></li>
        <li><a href="/security">Security</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
  </div><!-- /.site-footer -->
</div><!-- /.container -->


    <div class="fullscreen-overlay js-fullscreen-overlay" id="fullscreen_overlay">
  <div class="fullscreen-container js-suggester-container">
    <div class="textarea-wrap">
      <textarea name="fullscreen-contents" id="fullscreen-contents" class="fullscreen-contents js-fullscreen-contents js-suggester-field" placeholder=""></textarea>
    </div>
  </div>
  <div class="fullscreen-sidebar">
    <a href="#" class="exit-fullscreen js-exit-fullscreen tooltipped tooltipped-w" aria-label="Exit Zen Mode">
      <span class="mega-octicon octicon-screen-normal"></span>
    </a>
    <a href="#" class="theme-switcher js-theme-switcher tooltipped tooltipped-w"
      aria-label="Switch themes">
      <span class="octicon octicon-color-mode"></span>
    </a>
  </div>
</div>



    <div id="ajax-error-message" class="flash flash-error">
      <span class="octicon octicon-alert"></span>
      <a href="#" class="octicon octicon-x flash-close js-ajax-error-dismiss" aria-label="Dismiss error"></a>
      Something went wrong with that request. Please try again.
    </div>


      <script crossorigin="anonymous" src="https://assets-cdn.github.com/assets/frameworks-8827b83f56326279c38cb436d8477471e04c6632.js" type="text/javascript"></script>
      <script async="async" crossorigin="anonymous" src="https://assets-cdn.github.com/assets/github-bc0d97c07a2f5156a95a57f25489cd7b03191bf4.js" type="text/javascript"></script>
      
      
        <script async src="https://www.google-analytics.com/analytics.js"></script>
  </body>
</html>


/** @jsx React.DOM */
define(['react', 'JSXTransformer', 'jquery', 'jsx!components/UserProfileWidget'], function (React, JSXTransformer, $, UserProfileWidget) {
    "use strict";

    var Main = Object.create({}, {
        init: {
            value: function (cfg) {
                this.container = cfg.container;
                 if (typeof cfg.container === 'string') {
                    this.container = $(cfg.container);
                } else {
                    this.container = cfg.container;
                }
                this.userId = cfg.userId;
                this.authToken = cfg.token;
                return this;
            }
        },
        go: {
            value: function () {               
                var W = React.createFactory(UserProfileWidget);
                React.render(W({email: "eapearson@lbl.gov"}), this.container.get(0));
            }
        }
    });

    return Main;
});
/*global
 define
 */
/*jslint
 browser: true,
 white: true,
 todo: true
 */
define(
    'ace/mode/kidl',
    [
        'ace/lib/oop',
        'ace/mode/text',
        'ace/mode/sql_highlight_rules'
    ],
    function (oop, Text, SQL) {
        'use strict';

        var Mode = function () {
            this.HighlightRules = SQL.SqlHighlightRules;
        };
        oop.inherits(Mode, Text.TextMode);

        (function () {
            this.$id = 'ace/mode/kidl';
        }).call(Mode.prototype);

        exports.Mode = Mode;
    });

define(
    'ace/mode/sql_highlight_rules',
    [
        'ace/lib/oop',
        'ace/mode/text_highlight_rules'
    ],
    function (oop, Text) {

        var SqlHighlightRules = function () {

            var keywords = (
                'module|typedef|funcdef|authentication|required|optional|none|include|' +
                'returns|string|int|float|UnspecifiedObject|list|mapping|structure|tuple'
                );

            var builtinConstants = ('');

            var builtinFunctions = ('');

            var keywordMapper = this.createKeywordMapper({
                'support.function': builtinFunctions,
                'keyword': keywords,
                'constant.language': builtinConstants
            }, 'identifier', true);

            this.$rules = {
                'start': [
                    {
                        token: 'comment',
                        start: '/\\*',
                        end: '\\*/'
                    }, {
                        token: keywordMapper,
                        regex: '[a-zA-Z_$][a-zA-Z0-9_$]*\\b'
                    }, {
                        token: 'paren.lparen',
                        regex: '[\\{\\<]'
                    }, {
                        token: 'paren.rparen',
                        regex: '[\\}\\>]'
                    }, {
                        token: 'text',
                        regex: '\\s+'
                    }]
            };
            this.normalizeRules();
        };

        oop.inherits(SqlHighlightRules, Text.TextHighlightRules);

        exports.SqlHighlightRules = SqlHighlightRules;
    });
define('ace/mode/kidl', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/mode/text', 'ace/tokenizer', 'ace/mode/sql_highlight_rules', 'ace/range'], function(require, exports, module) {


var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var SqlHighlightRules = require("./sql_highlight_rules").SqlHighlightRules;
var Range = require("../range").Range;

var Mode = function() {
    this.HighlightRules = SqlHighlightRules;
};
oop.inherits(Mode, TextMode);

(function() {

    //this.lineCommentStart = "//";

    this.$id = "ace/mode/kidl";
}).call(Mode.prototype);

exports.Mode = Mode;

});

define('ace/mode/sql_highlight_rules', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/mode/text_highlight_rules'], function(require, exports, module) {


var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var SqlHighlightRules = function() {

    var keywords = (
        "module|typedef|funcdef|authentication|required|optional|none|include|"+
        "returns|string|int|float|UnspecifiedObject|list|mapping|structure|tuple"
    );

    var builtinConstants = (
        ""
    );

    var builtinFunctions = (
        ""
    );

    var keywordMapper = this.createKeywordMapper({
        "support.function": builtinFunctions,
        "keyword": keywords,
        "constant.language": builtinConstants
    }, "identifier", true);

    this.$rules = {
        "start" : [ /* {
            token : "comment",
            regex : "//.*$"
        },*/  {
            token : "comment",
            start : "/\\*",
            end : "\\*/"
        }, {
            token : keywordMapper,
            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        }, {
            token : "paren.lparen",
            regex : "[\\{\\<]"
        }, {
            token : "paren.rparen",
            regex : "[\\}\\>]"
        }, {
            token : "text",
            regex : "\\s+"
        } ]
    };
    this.normalizeRules();
};

oop.inherits(SqlHighlightRules, TextHighlightRules);

exports.SqlHighlightRules = SqlHighlightRules;
});


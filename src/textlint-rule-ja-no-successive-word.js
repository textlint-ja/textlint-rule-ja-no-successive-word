// LICENSE : MIT
"use strict";
const tokenize = require("kuromojin").tokenize;
module.exports = function(context) {
    const {Syntax, RuleError, report, getSource} = context;
    return {
        [Syntax.Str](node){
            const text = getSource(node);
            return tokenize(text).then(tokens => {
                let prevToken = {};
                tokens.forEach(token => {
                    if (prevToken.surface_form === token.surface_form) {
                        const index = Math.max(token.word_position - 1, 0);
                        report(node, new RuleError(`"${token.surface_form}" が連続して2回使われています。`, {
                            index
                        }));
                    }
                    prevToken = token;
                });
            });
        }
    }
};
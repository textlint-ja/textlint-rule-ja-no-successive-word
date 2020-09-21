// LICENSE : MIT
"use strict";
const matchPatterns = require("@textlint/regexp-string-matcher").matchPatterns;
const tokenize = require("kuromojin").tokenize;
const DefaultOptions = {
    // オノマトペを許可する
    // 制限: オノマトペを判定する方法がないため、同じカタカナの語が連続したものをオノマトペとして扱う
    // 例) カクカク、ドキドキ、ビリビリ
    // https://ja.wikipedia.org/wiki/%E6%93%AC%E5%A3%B0%E8%AA%9E
    allowOnomatopee: true,

    // 許可する単語
    // RegExp-like Stringを使用可能
    allow: []
};

function isOnomatopee(str) {
    return /^[ァ-ロワヲンー]*$/.test(str);
}

module.exports = function(context, options = {}) {
    const allowOnomatopee = options.allowOnomatopee !== undefined ? options.allowOnomatopee
                                                                  : DefaultOptions.allowOnomatopee;
    const allow = options.allow || DefaultOptions.allow;
    const { Syntax, RuleError, report, getSource } = context;
    return {
        [Syntax.Str](node) {
            const text = getSource(node);
            return tokenize(text).then(tokens => {
                let prevToken = {};
                const reportIfMatch = (prevToken, nextToken) => {
                    const prevWord = prevToken.surface_form;
                    const currentWord = nextToken.surface_form;
                    if (0 < allow.length && 0 < matchPatterns(currentWord, allow).length) {
                        return;
                    }
                    if (prevWord !== currentWord) {
                        return;
                    }
                    if (allowOnomatopee && isOnomatopee(prevWord) && isOnomatopee(currentWord)) {
                        return;
                    }
                    const index = Math.max(nextToken.word_position - 1, 0);
                    report(node, new RuleError(`"${currentWord}" が連続して2回使われています。`, {
                        index
                    }));
                };
                tokens.forEach(token => {
                    reportIfMatch(prevToken, token);
                    prevToken = token;
                });
            });
        }
    }
};

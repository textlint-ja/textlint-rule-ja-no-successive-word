// LICENSE : MIT
"use strict";
import { matchPatterns } from "@textlint/regexp-string-matcher";
import { tokenize } from "kuromojin";

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

/**
 * 漢数字かどうかを判定する
 * https://azu.github.io/morpheme-match/?text=%E5%80%A4%E3%81%AF%E4%B9%9D%E4%B9%9D%E3%81%A7%E3%81%99%E3%80%82
 * @param {import("kuromojin").KuromojiToken} token
 * @returns {boolean}
 */
function isNumberToken(token) {
    return token.pos === "名詞" && token.pos_detail_1 === "数";
}

// ひらがな、カタカナ（半角カタカナを含む）、漢字
// https://github.com/textlint-ja/textlint-rule-preset-JTF-style/blob/465497735666ad303d5d801fe01041b1c43351a6/src/util/regexp.js#L3
const japaneseRegExp = /(?:[々〇〻\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF]|[ぁ-んァ-ヶ\uFF66-\uFF9F])/;

/**
 * ひらがな、カタカナ、漢字のいずれかを含む単語かどうかを判定する
 * 記号や空白、アルファベットだけの単語は対象外とする
 * 例) "……"、"！！"、"　　"
 * https://github.com/textlint-ja/textlint-rule-ja-no-successive-word/issues/8
 * @param {string} word
 * @returns {boolean}
 */
function isJapaneseWord(word) {
    return japaneseRegExp.test(word);
}

export default function (context, options = {}) {
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
                    // 記号や空白の連続は例外とする
                    if (!isJapaneseWord(currentWord)) {
                        return;
                    }
                    // 漢数字は例外とする
                    // 例) 値は"九九"です。
                    // https://azu.github.io/morpheme-match/?text=%E5%80%A4%E3%81%AF%E4%B9%9D%E4%B9%9D%E3%81%A7%E3%81%99%E3%80%82
                    if (isNumberToken(prevToken) && isNumberToken(nextToken)) {
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

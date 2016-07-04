const TextLintTester = require("textlint-tester");
const tester = new TextLintTester();
// rule
import rule from "../src/textlint-rule-ja-no-successive-word";
// ruleName, rule, { valid, invalid }
tester.run("ja-no-successive-word", rule, {
    valid: [
        "これは問題ない文章です。",
        "すもももももももものうち",
        "111回目の問題",
        "11,11回目の問題",
    ],
    invalid: [
        // single match
        {
            text: "これはは問題ある文章です。",
            errors: [
                {
                    message: `"は" が連続して2回使われています。`,
                    line: 1,
                    column: 4
                }
            ]
        },
        // multiple match in multiple lines
        {
            text: `これはは問題ある文章です。

これは問題あるある文章です`,
            errors: [
                {
                    message: `"は" が連続して2回使われています。`,
                    line: 1,
                    column: 4
                },
                {
                    message: `"ある" が連続して2回使われています。`,
                    line: 3,
                    column: 8
                }
            ]
        }
    ]
});
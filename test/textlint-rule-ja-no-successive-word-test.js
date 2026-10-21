import TextLintTester from "textlint-tester";
import rule from "../src/textlint-rule-ja-no-successive-word";

const tester = new TextLintTester();

// ruleName, rule, { valid, invalid }
tester.run("ja-no-successive-word", rule, {
    valid: [
        "これは問題ない文章です。",
        "すもももももももものうち",
        "111回目の問題",
        "ニニ回目の問題",
        "九九回目の問題",
        "11,11回目の問題",
        "フレームレートが落ちて動作がカクカクしてきた",
        // 記号や空白の連続は対象外
        // https://github.com/textlint-ja/textlint-rule-ja-no-successive-word/issues/8
        "うーん……。",
        "すごい！！",
        "本当？？",
        "これは　　問題ない文章です。",
        "○○する",
        "そうなんだｗｗ",
        {
            text: "＿人人人人人人＿",
            options: {
                allow: ["人人"]
            }
        }
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
        },
        {
            text: "フレームレートが落ちて動作がカクカクしてきた",
            options: {
                allowOnomatopee: false
            },
            errors: [
                {
                    message: `"カク" が連続して2回使われています。`,
                    line: 1,
                    column: 17
                }
            ]
        },
        {
            text: "＿人人人人人人＿",
            errors: [
                {
                    message: "\"人人\" が連続して2回使われています。",
                    line: 1,
                    column: 4
                },
                {
                    message: "\"人人\" が連続して2回使われています。",
                    line: 1,
                    column: 6
                }

            ]
        },
        // ひらがな・カタカナ・漢字を含む単語は引き続き対象
        {
            text: "ＴシャツＴシャツを買った",
            errors: [
                {
                    message: `"Ｔシャツ" が連続して2回使われています。`,
                    line: 1,
                    column: 5
                }
            ]
        }
    ]
});

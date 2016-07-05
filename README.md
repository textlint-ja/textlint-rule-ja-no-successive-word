# textlint-rule-ja-no-successive-word

同一の単語を間違えて連続しているのを見つけるtextlintルール

> これはは問題ある文章です。

**は**が連続している問題がある。

## Install

Install with [npm](https://www.npmjs.com/):

    npm install textlint-rule-ja-no-successive-word

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "rules": {
        "ja-no-successive-word": true
    }
}
```

Via CLI

```
textlint --rule ja-no-successive-word README.md
```


## Changelog

See [Releases page](https://github.com/textlint-ja/textlint-rule-ja-no-successive-word/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## 参考

- [RedPen 1.6 ドキュメント](http://redpen.cc/docs/latest/index_ja.html#successiveword)
- [redpen/SuccessiveWordValidator.java at master · redpen-cc/redpen](https://github.com/redpen-cc/redpen/blob/master/redpen-core/src/main/java/cc/redpen/validator/sentence/SuccessiveWordValidator.java#L29)


## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/textlint-ja/textlint-rule-ja-no-successive-word/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu

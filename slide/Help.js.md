% Help.js
% Online Reference
% @uupaa - 2014-03-22

<!-- ----------------------------------------------------- -->

<!-- ----------------------------------------------------- -->

# Help.js は

----

##

ブラウザと連携して動作する、  
まったく新しい  
オンラインリファレンス機能を  
提供します。



## 2つの機能から構成されています

1. ブラウザの DevTools で機能する  
   **Help コマンドを提供**します

2. ソースコードと**ドキュメントを分離**し、  
   ドキュメントが死蔵されずに、  
   **更新され続ける環境**を提供します



# Help コマンドは

## 関数の内容をダンプします

**関数オブジェクト.help** または  
**Help(関数オブジェクト)** とタイプすると、  
関数を文字列としてダンプします。

<pre>
> Foo.help

  function Foo(value) { // @arg Number: the value.
                        // @help: Foo
      this._value = value;
  }
</pre>

引数・型・戻り値などの情報を  
素早く確認できます。


## 検索用のリンクを表示します

**Foo.help** とタイプすると、  
GitHub/wiki にある Foo.js の  
リファレンスページと、  
Google 検索用のURLを提示します。

<pre>
> Foo.help

  GitHub wiki page:
      <a href="https://github.com/uupaa/Foo.js/wiki/Foo#wiki-foo">https://github.com/uupaa/Foo.js/wiki/Foo#wiki-foo</a>
  Google.search( Foo ):
      <a href="http://www.google.com/search?lr=lang_ja&ie=UTF-8&oe=UTF-8&q=Foo">http://www.google.com/search?lr=lang_ja&ie=UTF-8&oe=UTF-8&q=Foo</a>
</pre>



## いまいち使い方が分からない<br />ネイティブ API のことも<br />すぐに調べられます

**Array.prototype.every.help**とタイプすると  
[Array#every](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/every) を解説した MDN のページと  
Google で検索するためのURLを提示します。

<pre>
> Array.prototype.every.help

  function every() { [native code] }

  MDN.search( Array.prototype.every ):
      <a href="http://www.google.com/search?btnI=I%27m+Feeling+Lucky&lr=lang_ja&ie=UTF-8&oe=UTF-8&q=MDN%20Array.prototype.every">http://www.google.com/search?q=MDN%20Array.prototype.every</a>
  Google.search( Array.prototype.every ):
      <a href="http://www.google.com/search?lr=lang_ja&ie=UTF-8&oe=UTF-8&q=Array.prototype.every">http://www.google.com/search?q=Array.prototype.every</a>
</pre>


## 一般的なキーワードも検索できます

**Help("調べたいキーワード")** で  
一般的なキーワードで検索も可能です。

<pre>
> Help("助けてドラえもん")

Google.search( 助けてドラえもん ):
    <a href="http://www.google.com/search?lr=lang_ja&ie=UTF-8&oe=UTF-8&q=%E5%8A%A9%E3%81%91%E3%81%A6%E3%83%89%E3%83%A9%E3%81%88%E3%82%82%E3%82%93">http://www.google.com/search?q=%E5%8A%A9%E3%81%91%E3%81%A6%E3%83%89%E3%83%A9%E3%81%88%E3%82%82%E3%82%93</a>
</pre>








# ドキュメントを分離する

## なぜ?

- **どこからでも**ドキュメントを**見れる状態にしたい**
    - モバイルブラウザで見たい
- コードに手を入れずに**ドキュメントだけを更新したい**
    - 後からドキュメントを書きたい
    - 5〜10分の断片化された時間でドキュメントを更新したい

## JsDocだとダメなの? なぜ分けるの?

- コードとドキュメントの**編集履歴を分けたい**
    - コードとドキュメントを別々に書きたい
    - **後からドキュメントを書きたい**
- コードの見通しを悪化させたくない
    - 説明を増やすとコードの見通しが簡単に悪化する
    - 脳内バッファを沢山消費する長いコードがつらい。  
      <strike>楽天メソッドつらい</strike>
- ググれないドキュメントは存在しないも同然
    - [JsDoc][] で生成し、社内に配置するパターンがツライ
    - **ググれない物は利用されない**の法則で、無意識に敬遠してしまう
    - 土日や移動中に見れないと**ちょっと試そうという気にならない**


## どうやって分離するの?

- 設置場所やドキュメントの書式を決めてしまう
    - **ソースコードは GitHub** に、 **ドキュメントは GitHub/wiki** に
    - **ドキュメントの書式は Markdown** 一択で
    - 履歴は git や GitHub の機能を利用する
- コードとリポジトリを連携させる
    - コードに**リポジトリのURLを埋め込む**。[Help.js][] から参照可能にする
- コードにキーワードを埋め込む
    - 関数やメソッドに @[help 属性][] を**キーワードとして埋め込む**
    - 関数の**内側に、引数の型や戻り値の情報を埋め込む**

## 実際の分離作業はどんな感じなの?

- GitHub/wiki に新しくページを作成
    - 後ほどドキュメントを記述
- コードにリポジトリのURLを埋め込む
- 各 function の内側に  
  @help や @arg, @ret などの [属性][] を埋め込む

```js
+   Class.repository = "https://github.com/.../Class";

    // --- interface -------------------------------------------
-   function Class(value) {
+   function Class(value) { // @help: Class
    }

    // --- implement -------------------------------------------
-   function Class_method() {
+   function Class_method() { // @help: Foo#value
    }
```

<!-- ----------------------------------------------------- -->

# さらに詳しく知りたい方は…

----

##

[Help.js][] のドキュメントをご覧ください。

----

Help.js は、WebModule の一部です。  
こちらのドキュメントも  
合わせて参照してください。

- [WebModule][]
- [WebModuleワークフロー][]
- [WebModuleコードパターン][]




[npm]: https://www.npmjs.org/
[GitHub]: https://github.com/
[Markdown]: http://ja.wikipedia.org/wiki/Markdown
[ClosureCompiler]: https://code.google.com/p/closure-compiler/
[JSHint]: http://www.jshint.com/
[Plato]: https://github.com/es-analysis/plato

[WebModule]: https://github.com/uupaa/WebModule/wiki/WebModule
[WebModuleワークフロー]: https://github.com/uupaa/WebModule/wiki/WebModuleWorkflow
[WebModuleコードパターン]: https://github.com/uupaa/WebModule/wiki/WebModuleCodePattern


[AMD]: https://www.google.co.jp/search?q=AMD+module
[JavaDoc]: http://en.wikipedia.org/wiki/Javadoc
[JSDoc]: http://usejsdoc.org/

[Help.js]: https://github.com/uupaa/Help.js
[Help 属性]: https://github.com/uupaa/Help.js/wiki/AddHelp#attribute
[属性]: https://github.com/uupaa/Help.js/wiki/AddHelp#attribute
[Test.js]: https://github.com/uupaa/Test.jsh
[Task.js]: https://github.com/uupaa/Task.js
[Plato.js]: https://github.com/uupaa/Plato.js
[Minify.js]: https://github.com/uupaa/Minify.js


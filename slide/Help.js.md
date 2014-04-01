% Help.js
% Online Reference
% @uupaa - 2014-04-01

<!-- ----------------------------------------------------- -->

<!-- ----------------------------------------------------- -->

# Help.js は

----

##

**ブラウザと連携して動作する**  
まったく新しい  
**オンラインリファレンス機能**を  
提供します

# Help.js には

## 2つの目的があります


<br />

1. ソースコードと**ドキュメントを分離**します

    - ドキュメントが死蔵されず  
      更新/拡充されるサイクルを目指します


2. DevTools コンソールで機能する  
   **Help コマンド**を提供します



# ドキュメントの分離は

## 

モジュールの作者が  
ドキュメントを  
![](../../assets/img/cloud.png) **いつでもどこからでも**  
書きやすくし、  

----

ユーザが  
ドキュメントを  
![](../../assets/img/cloud.png) **いつでもどこからでも**  
読めるようにするものです


# ドキュメントを分離するために

## ( 1 ). リファレンスは Web に置きます

<br />
GitHub にリポジトリと  
wiki ページを作成します

<hr />

社外に置けるものは  
**社外に置きます**


## ( 2 ). ソースコードに<br />キーワードを埋め込みます

- リポジトリのURLと @[help 属性][] をコードに埋め込みます

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

## ( 3 ). ブラウザからリファレンスを<br />引けるようにしました

<br />
Help コマンドを使うことで  
リファレンスページに素早くたどり着けます




# Help コマンドは

## 関数の内容をダンプします

<br />

**Foo.help** で、  
Fooクラスのコンストラクタをダンプします

<pre>
> Foo.help

  function Foo(value) { // @arg Number: the value.
                        // @help: Foo
      this._value = value;
  }
</pre>

引数・型・戻り値などの情報を  
**クイックに確認**できます


## リンクを提示します

<br />

Foo.js の**リファレンスページ**と  
**リポジトリの URL** を提示します。

Web 全体から検索するための  
**Google 検索用の URL** も提示します

<pre>
> Foo.help

  Reference:
      <a href="https://github.com/uupaa/Foo.js/wiki/Foo#wiki-foo">https://github.com/uupaa/Foo.js/wiki/Foo#wiki-foo</a>
  Repository:
      <a href="https://github.com/uupaa/Foo.js/">https://github.com/uupaa/Foo.js/</a>
  Google.search( Foo ):
      <a href="http://www.google.com/search?lr=lang_ja&ie=UTF-8&oe=UTF-8&q=Foo">http://www.google.com/search?lr=lang_ja&ie=UTF-8&oe=UTF-8&q=Foo</a>
</pre>


## ネイティブ API を調べられます

<br />

**Array.prototype.every.help** とすると  
[Array#every](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/every) を解説した **MDN のリンク**と  
**Google 検索用の URL** を提示します

<pre>
> Array.prototype.every.help

  function every() { [native code] }

  MDN.search( Array.prototype.every ):
      <a href="http://www.google.com/search?btnI=I%27m+Feeling+Lucky&lr=lang_ja&ie=UTF-8&oe=UTF-8&q=MDN%20Array.prototype.every">http://www.google.com/search?q=MDN%20Array.prototype.every</a>
  Google.search( Array.prototype.every ):
      <a href="http://www.google.com/search?lr=lang_ja&ie=UTF-8&oe=UTF-8&q=Array.prototype.every">http://www.google.com/search?q=Array.prototype.every</a>
</pre>


## コンテキスト依存の検索ができます

**Help("キーワード")** で  
global や window オブジェクト以下から  
キーワードと一致する関数や  
プロパティを検索し  
リンクを提示します。

キーワードが見つからない場合は  
**Google 検索用の URL** を提示します

<pre>
> Help("Array.isHoge")

Google.search( Array.isHoge ):
    <a href="http://www.google.com/search?lr=lang_ja&ie=UTF-8&oe=UTF-8&q=Array.isHoge">http://www.google.com/search?lr=lang_ja&ie=UTF-8&oe=UTF-8&q=Array.isHoge</a>
</pre>



<!-- ----------------------------------------------------- -->

# さらに詳しく知りたい方は…

----

##

[Help.js][] のドキュメントをご覧ください

----

Help.js は [WebModule][] で書かれています

<br />
こちらのドキュメントも  
合わせて参照してください

- [WebModule][]
- [WebModuleワークフロー][]
- [WebModuleコードパターン][]

##

このスライドにも  
Help.js が組み込まれています

----

<small>
Command + Option + I や、  
コンテキストメニューの 要素の検証 から DevTools を開き、  
以下のコマンドを試してみてください
</small>

```sh
> Array.prototype.reduce.help

> Object.freeze.help

> Help("Task.flatten")

> Help.help

```



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


% Task.js
% A very simple way to wait for asynchronius processes.
% @uupaa - 2014-08-14 (rev 3)

<!-- ----------------------------------------------------- -->

<!-- ----------------------------------------------------- -->

# JavaScript, Async, Idiom

##

非同期プログラミングを支援する  
ライブラリやイディオムには、  
Deferred, Promises, Async/Await  
などがありますが…  
<br />
**[Task.js]** も、  
非同期プログラミングを  
強力に支援するライブラリの1つです

##

このようなコードを毎回書いていませんか?

- Webページの読み込み完了を待ちつつ
- サーバからのレスポンスを待ちつつ
- アセットをダウンロードしつつ
- アニメーションカーソルを表示

```js
var progress = 0, tasks = 3; // 非同期処理は合計で3つ

var cursor = new WaitCursor().show();       // アニメーションカーソルを表示
window.addEventListener("load", done);      // ページの読み込み完了を待つ
(new Session()).login({ callback: done });  // サーバからのレスポンスを待つ
(new Asset()).download({ callback: done }); // アセットのダウンロードを待つ

function done() {
    if (++progress >= tasks) { // 3つの非同期処理が終わったら
        cursor.hide();         // カーソルを非表示に
    }
}
```

##

Task.js を使うと、  
元のコードの原型を維持したまま、  
非同期処理をコンパクトに構造化できます

```js
var task = new Task(3, function() { // 3つの非同期処理の完了を待つ
                cursor.hide(); // 処理完了でカーソルを非表示に
           });

var cursor = new WaitCursor().show();                // アニメーションカーソルを表示
window.addEventListener("load", task.passfn());      // ページの読み込み完了を待つ
(new Session()).login({ callback: task.passfn() });  // サーバからのレスポンスを待つ
(new Asset()).download({ callback: task.passfn() }); // アセットのダウンロードを待つ
```

<!-- ----------------------------------------------------- -->

# 非同期処理へのNeedsとWants

## 複数の非同期処理の完了を待ちたい

- アニメーション**しながら**ダウンロード完了を待ちたい
- いくつかの非同期処理を**グルーピング**し、  
  それらの終了を待ってから処理を進めたい
- 毎回同じようなコードを書いては捨てている
- 同期/非同期が混在した場合に、  
  一方はループで、  
  一方はコールバックの連鎖で制御している。  
  場当たり的だし、  
  できれば同期/非同期を**意識せずに扱いたい**

## シンプルで枯れた実装がほしい

- Deferred や Promises を  
  JavaScript に詳しくない人や、  
  非プログラマーに**説明**するのは**骨が折れる**
- 前提となる知識が沢山必要で、  
  いざ使ってみたら**罠が沢山**あるようだと困る

## 運用で困らないようにしたい

- 特定の環境に依存したり、  
  頻繁に更新される  
  **重厚な**ライブラリには**依存**したくない(できない)

## デバッグのしやすさも大事

- **原因を素早く特定**したい
    - どの非同期処理で詰まっているのか  
      簡単に分かるようになっていないとイライラする
- 実行中の同期/非同期関数を**モニタリング**したい
    - 他の人が担当している部分の動作を、  
      **可視化**(トレース/モニタリング)できないと  
      大規模開発では使えない
    - 切羽詰まった時に、他人が書いた  
      大量のコードを読み解く余裕なんてない

## 仕様変更にも強い実装にしたい

- UIアニメーションや、  
  ゲームのアニメーションの流れや順番は、  
  クオリティアップの段階で頻繁に修正が入るが、  
  それらを**仕様変更に強い形でデータ化**  
  (スクリプト化)できないか
- アニメーションの順番を変えたいだけなのに、  
  コードをガバっと変更する感じの実装はつらい

##

Task.js は、このような  
**Needs** と **Wants** を  
満たすように設計しています

<hr />
では  
Task.js の特徴と機能を見て行きましょう



<!-- ----------------------------------------------------- -->

# Task.js の基本

##

1. ユーザの同期/非同期処理を**ユーザータスク**と呼びます
2. task = new Task(2, callback)で**待機を開始**します
    - **task.pass()**を2回呼ぶと**待機成功**で**待機を終了**します
    - **task.miss()**を1回呼ぶと**待機失敗**で**待機を終了**します
3. 待機終了で callback( **error** ) が呼ばれます  
   error は待機成功で null、待機失敗で ErrorObject です

```js
var task = new Task(2, callback); // 同期+非同期の2つのユーザタスクの完了を待つ

userTask(); // ユーザタスクを同期実行
setTimeout(userTask, 1000); // ユーザタスクを非同期で実行

function userTask() {
    Math.random() >= 0.8 ? task.pass() : task.miss(); // 80% の確率で pass
}
function callback(error) {
    console.log("finished");
}
```

## もういちど

必要な知識はこの3つだけ  
シンプルです

1. **new Task**(**ユーザタスク数**, **callback**) で待機開始
2. 待機成功で **pass()** を、  
   待機失敗で **miss()** を呼ぶ
3. 待機終了で **callback( error )** が呼ばれる  
   **error** が **null** なら待機成功

#

次のページからは、  
Task.js をさらに便利に使いこなす方法を  
紹介していきます

<!-- ----------------------------------------------------- -->

# Task.js を便利に使いこなす

## Buffer API

- Task には一時的にデータを格納するための  
  Buffer があります
- 格納したデータは待機終了後に  
  callback(, **buffer**)から取り出せます

|                           |                 |
|---------------------------|-----------------|
| バッファに貯める          | task.push(), task.set() |
| バッファから取り出す      | task.buffer(), callback(, buffer) |
| 型を変換する              | Task.flatten(), Task.arraynize(), <br />Task.objectize() |

<!-- ----------------------------------------------------- -->

# Buffer に貯める/取り出す

##

- Buffer の実体は、Array です
- **task.push(value)** で buffer.push(value) を行います
- **task.set(key,value)** で buffer[key] = value を行います
- **task.buffer()** で Buffer に直接アクセスできます
- 待機終了後に callback(, **buffer**) からもアクセスできます

```js
function callback(error, buffer) {
    console.log(buffer[0]);   // -> "value1"
    console.log(buffer.key2); // -> "value2"
}

var task = new Task(1, callback);

task.push("value1"); // buffer に "value1" を追加する
task.set("key2", "value2"); // buffer に { "key2": "value2" } をセット(上書き)する
task.pass();
```

## Shared Buffer

- 後述する Junction を使い、階層構造をもった Task は、  
  **Buffer を共有**した状態になります
- task1.push("value1") は  
  junction.push("value1") と同じ結果になります

```js
function callback(error, buffer) { // sharedBuffer: ["junction", "value1", "value2"]
    console.log(buffer.length); // -> 3
}

var junction = new Task(2, callback).push("junction");
var task1 = new Task(1, junction).push("value1"); // junction.push("value1") と同じ結果に
var task2 = new Task(1, junction).push("value2"); // junction.push("value2") と同じ結果に

task1.pass();
task2.pass();
```


<!-- ----------------------------------------------------- -->

# 型を変換する

## Task.flatten()

- **Task.flatten(source)** は配列の次元数を -1 した新しい配列を返します
- 2次元配列は1次元配列に展開され、3次元配列は2次元配列に展開されます
- 多次元配列を含んだ source の配列を展開するための汎用関数としても利用できます

```js
var source = [
        [1,2],
        [3,4],
      [ [5,6] ]
    ];
// 3次元配列を2次元配列に展開
var complexArray = Task.flatten(source); // -> [1,2,3,4,[5,6]]
// 2次元配列さらに展開し、フラットな配列に
var flattenArray = Task.flatten(complexArray); // -> [1,2,3,4,5,6]
```

## Task.arraynize()

- **Task.arraynize(source)**は、数字の添字を持つ値をコピーした、新しい配列返します
- 数字の添字を持たないプロパティは**コピーしません**
  task.set("key", "value") で設定した  
  { "key": "value" } は捨てられます
- Array + Object な source を Array としてクローンする(フィルタリングする)汎用関数としても利用できます

```js
var source = [1,2,3];

source["key"] = "value"; // 配列にプロパティを追加

Task.arraynize(source);  // -> [1, 2, 3], 追加した { key, value } は捨てられています
```

## Task.objectize()

- **Task.objectize(source)**は、Object.keys(source) で見つかる要素を全てコピーした、新しいObjectを返します
- task.set("key", "value") で設定した  
  { "key": "value" } はコピーされます
- Array + Object な source を Object としてクローンする(Object に再構築する)汎用関数としても利用できます

```js
var source = [1,2,3];

source["key"] = "value"; // 配列にプロパティを追加
Object.keys(source);     // -> ["0", "1", "2", "key"]

Task.objectize(source);  // -> { 0: 1, 1: 2, 2: 3, key: "value" }
```

<!-- ----------------------------------------------------- -->
# Task.js を便利に使いこなす

## Debug API

|                     |                 |
|---------------------|-----------------|
| タスク一覧をダンプ  | Task.dump()     |
| タスク一覧をクリア  | Task.clear()    |

# タスクの一覧をダンプする

## Task.dump()

- **Task.dump()** は、  
  実行中のタスクの一覧(スナップショット)を返します
- タスク名と内部の状態を素早く把握できます

```js
var task1 = new Task(1, function(){});
var task2 = new Task(1, function(){});
var task3 = new Task(1, function(){});

Task.dump();
{
    "anonymous@1": { junction: false, taskCount: 1, missableCount: 0, missedCount: 0, passedCount: 0, state: "" }
    "anonymous@2": { junction: false, taskCount: 1, missableCount: 0, missedCount: 0, passedCount: 0, state: "" }
    "anonymous@3": { junction: false, taskCount: 1, missableCount: 0, missedCount: 0, passedCount: 0, state: "" }
}
```

<script>
function task_dump() {
    Task.clear();
    var task1 = new Task(1, function(){});
    var task2 = new Task(1, function(){});
    var task3 = new Task(1, function(){});
    alert(JSON.stringify(Task.dump(), null, 2));
}
</script>

<button style="font:normal 24pt Impact" onclick="task_dump()">run Task.dump()</button>

## Task.dump(タスク名による絞込)

- new Task(,, **{ name: taskName }**) を指定すると、  
  **Task.dump(taskName)** で絞り込めます

```js
var task1 = new Task(1, callback, { name: "Foo" });
var task2 = new Task(1, callback, { name: "Foo" });
var task3 = new Task(1, callback, { name: "Bar" });

Task.dump("Foo");
{
    "Foo@1": { junction: false, taskCount: 1, missableCount: 0,
               missedCount: 0, passedCount: 0, state: "" },
    "Foo@2": { junction: false, taskCount: 1, missableCount: 0,
               missedCount: 0, passedCount: 0, state: "" }
}
```

<script>
function task_dump_test() {
    Task.clear();
    var task1 = new Task(1, null, { name: "Foo" });
    var task2 = new Task(1, null, { name: "Foo" });
    var task3 = new Task(1, null, { name: "Bar" });

    alert(JSON.stringify(Task.dump("Foo"), null, 2));
}
</script>

<button style="font:normal 24pt Impact" onclick="task_dump_test()">run Task.dump("Foo")</button>

# タスクの一覧をクリアする

## Task.clear()

- **Task.clear()** は実行中のタスクの一覧(スナップショット)をクリアします
    - Task.dump() で使用する情報のみをクリアします  
      動作中のタスクには影響を与えません
- この関数はデバッグ/テスト用です。  
  通常利用で明示的に呼ぶ必要はありません

```js
Task.clear(); // この行以前の Task のスナップショットを削除

var task = new Task(1, function() {}, { name: "debug" });

Task.dump();
{
    "debug@1": { junction: false, taskCount: 1, missableCount: 0,
                 passedCount: 0, missedCount: 0, state: "" }
}
```






<!-- ----------------------------------------------------- -->
# Task.js を便利に使いこなす


## State API

|                     |                 |
|---------------------|-----------------|
| タスクの強制終了    | task.exit()     |
| 状態取得, 終了判定  | task.state(), <br />task.isFinished() |
| エラーメッセージ    | task.message()  |


<!-- ----------------------------------------------------- -->

# task.exit()

```js
function callback(error) { }

var task = new Task(100, callback).missable(100);

task.exit(); // 強制的に待機終了にする -> callback(new Error(...))
```

##

- **task.exit()** を使うと、
  ユーザのタスク数や missable の状態に関わらず、強制的に待機失敗で終了します


<!-- ----------------------------------------------------- -->

# task.state(), task.isFinished()

- **state()** は Task の状態を文字列で返します
- **isFinished()** は待機終了で true を返します

```js
var task = new Task(1);
task.isFinished(); // -> false
task.state();      // -> ""
task.pass();       // 待機成功で終了
task.isFinished(); // -> true
task.state();      // -> "pass"
```

| 状態           | task.state() | task.isFinished() |
|----------------|--------------|-------------------|
| 待機中         | ""           | false             |
| 待機成功で終了 | "pass"       | true              |
| 待機失敗で終了 | "miss"       | true              |
| 待機失敗で終了 | "exit"       | true              |

<!-- ----------------------------------------------------- -->

# task.message()

- **task.message( message:Error|String )** でエラーメッセージを設定できます
    - 設定したメッセージは、  
      callback( error ) の error.message から取得できます
- ユーザタスクで発生した例外は  
  ユーザタスク側で適切にハンドリングし  
  **task.miss()** を呼んでください

```js
var task = new Task(1, function(error) {
                console.log(error.message); // -> "O_o"
            });

try {
    throw new Error("O_o"); // -> 例外発生
    task.pass(); // ここには到達しない
} catch (err) { // err.message は "O_o"
    task.message( err ).miss(); // task.message("O_o") を設定
}
```



<!-- ----------------------------------------------------- -->
# Task.js を便利に使いこなす

## Utility API

|                  |                 |
|------------------|-----------------|
| pass と miss を呼び分ける | task.done()     |
| pass または miss を実行する<br />関数を取得する | task.passfn(), <br/>task.missfn() |
| 失敗を許容する   | task.missable() |
| もっと待機する   | task.extend()   |

<!-- ----------------------------------------------------- -->

# task.done(error)

- **task.done** はコンビニエントメソッドです
    - **task.pass** と **task.miss** を呼び分けているコードを短く書けます
    - **task.done( error )** は **task.message(error).miss()** と同じ結果になります
    - **task.done( null  )** は **task.pass()** と同じ結果になります 

```js
var error = Math.random() >= 0.5 ? new Error("message")
                                 : null;
// このようなありがちなエラーを判定するコードは
if (error) { // Error Object
    task.message( error ).miss();
} else {
    task.pass();
}
```

```js
// task.done を使うと 一行で書けます
task.done( error );
```

<!-- ----------------------------------------------------- -->
# task.passfn(), task.missfn()

## pass または miss を実行する<br />関数を取得する

- **task.passfn()** で task.pass() を実行する関数を取得できます
- **task.missfn()** で task.miss() を実行する関数を取得できます

```js
var task = new Task(1);

// このようなコードは
setTimeout(function() { task.pass(); }, 1000);
```

```js
// passfn を使ってこのようにも書けます
setTimeout(task.passfn(), 1000);
```


<!-- ----------------------------------------------------- -->
# task.missable()

## 失敗を許容する(織り込んでおく)

- **task.missable(**m**)** で失敗可能な回数を設定できます
    - 初期値は m = 0 です(失敗を許しません)
    - m = 0 で task.miss() を一度でも呼ぶと待機失敗になります

```js
function callback(error) { console.log(error.message); }

var task = new Task(1, callback, { name: "MissableTask" });

task.missable(2); // 2回までの失敗を許容する(3回失敗したら終了する)
task.miss(); // ユーザタスク失敗(1回目の失敗なので継続する)
task.miss(); // ユーザタスク失敗(2回目の失敗なので継続する)
task.miss(); // ユーザタスク失敗(3回目の失敗なので待機失敗で終了する) -> callback(Error)
```


##

- task.missable を使うと  
  簡単に「**こんなこともあろうかと**」を実装できます

```js
// 例: CDN1 からのダウンロードが失敗した場合に CDN2 でリカバリー
var urls = ["http://cdn1.example.com/image.png",
            "http://cdn2.example.com/image.png"];

download( urls, new Task(urls.length, callback).missable(1) );

function download(urls, task) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() { task.pass(); };
    xhr.onerror = function() {
        // CDN1 miss ▶ 失敗が許容されている?(タスク継続中?) ▶ CDN2 でリカバリー
        if ( !task.miss().isFinished() ) {
            download(urls, task);
        }
    };
    xhr.open("GET", urls.shift(), true);
    xhr.send()
}
function callback(error) { console.log(error.message); }
```





<!-- ----------------------------------------------------- -->

# task.extend()

- 動的に待機数(taskCount)を +1 するには、  
  **task.extend(1)** とします
- 次々にユーザタスクが増えるケースで使います

![](./assets/img/task.extend.png)

```js
function callback(error) { }

var taskCount = 1;
var task = new Task(taskCount, callback);

task.extend(1); // taskCount += 1;
task.pass();    // ユーザタスク成功(taskCount は2なので待機する)
task.pass();    // ユーザタスク成功(taskCount は2なので待機成功で終了する)
                //      -> callback(null)
```

<!-- ----------------------------------------------------- -->
# Task.js を便利に使いこなす

## Junction Tree / Task runner API

|                  |                 |
|------------------|-----------------|
| Task を連結する  | Junction        |
| 並列/直列動作    | Task.run()      |

<!-- ----------------------------------------------------- -->

# Junction

## 

- Task を集約する Task を **Junction(合流点)** と呼びます
- Junction に Junction を重ねる事で  
  階層構造( **Junction Tree** )を作る事も可能です
- 下位の Junction/Task で **状態変化** が起きると、上位の Junction にも **通知** されます。
  さらに上位の Junction がある場合は **次々に伝播** (バブルアップ)します

<div style="background: url(./assets/img/junction.png) right top no-repeat">
<div style="max-width: 600px; min-height:220px">
```js
function callback(error) {
    console.log("finished");
}

var junction = new Task(2, callback);

var task1 = new Task(1, junction);
var task2 = new Task(1, junction);

task1.pass(); // →junction にも状態変化が通知される
task2.pass(); // →junction にも状態変化が通知される
              // →junction の待機も終了する
```
</div>
</div>


##

- task1.pass() で task1 と junction の状態が変化します
- task2.pass() で task2 と junction の状態が変化します
- task2.pass() のタイミングで junction の待機も終了し、callback が呼ばれます

<div style="background: url(./assets/img/junction.png) right top no-repeat">
<div style="max-width: 600px; min-height:220px">
```js
function callback(error) {
    console.log("finished");
}

var junction = new Task(2, callback);

var task1 = new Task(1, junction);
var task2 = new Task(1, junction);

task1.pass(); // →junction にも状態変化が通知される
task2.pass(); // →junction にも状態変化が通知される
              // →junction の待機も終了する
```
</div>
</div>


## Junction Tree

- Junction を使うことで Task の階層構造をコンパクトに記述できます

<div style="background: url(./assets/img/nested.junction.png) right top no-repeat">
<div style="max-width: 525px; min-height:320px">
```js
function callback(error) {
    console.log("finished");
}

lv1_junction     = new Task(1, callback);
  lv2_junction   = new Task(1, lv1_junction);
    lv3_junction = new Task(2, lv2_junction);
      lv4_task1  = new Task(1, lv3_junction);
      lv4_task2  = new Task(1, lv3_junction);

lv4_task1.pass();
lv4_task2.pass();
```
</div>
</div>

<!-- ----------------------------------------------------- -->

# Task.run


## 

- **Task.run** は ユーザタスクの前後関係を定義し  
  実行する機能(ユーザタスク・ランナー)です
- ユーザタスク名を **`>`** と **`+`** でつなぐ事で、  
  ユーザタスクの前後の流れ(直列/並列動作)を定義します
- Task.run から起動されるユーザタスクの第一引数には  
  **Task** のインスタンスが渡されます

```js
function callback(error, buffer) {
}

Task.run("task_a > task_b + task_c > task_d", {
    task_a: function(task) { task.pass(); },
    task_b: function(task) { task.pass(); },
    task_c: function(task) { task.pass(); },
    task_d: function(task) { task.pass(); }
}, callback);
```


## Task.run + Junction

- Task の上下関係を定義する **Junction** と  
  ユーザタスクの前後関係を定義する Task.run を  
  組み合わせて利用することも可能です

```js
var taskMap = {
    a: function(task) { task.pass(); },
    b: function(task) { task.pass(); },
    c: function(task) { task.pass(); },
    d: function(task) { task.pass(); },
};

var junction = new Task(2, callback); // (a > b) + (c + d) が終わったら callback

Task.run("a > b", taskMap, junction); // a を実行後に b を実行
Task.run("c + d", taskMap, junction); // c と d を並列実行
```


## ユーザタスクの並列化

- ユーザタスク を **`+`** でつなぐと、  
  それらは並列に実行します

```js

Task.run("task_a + task_b", {
    task_a: function(task) { task.pass(); },
    task_b: function(task) { task.pass(); },
}, callback);
```



## ユーザタスクの直列化

- ユーザタスクを **`>`** でつなぐと、  
  それらは直列(順番)に実行します

```js
Task.run("task_a > task_b", {
    task_a: function(task) { task.pass(); },
    task_b: function(task) { task.pass(); },
}, callback);
```


## sleepタスク

- タスク名の代わりにms単位の数字を埋め込むと、  
  指定した時間分だけ待機する  
  **何もしない** タスクを内部で生成します
- 時間稼ぎができます
- 上記の例では、task_a 実行後に **1000ms** 待機し、  
  その後に task_b を実行します

```js
Task.run("task_a > 1000 > task_b", {
    task_a: function(task) { task.pass(); },
    task_b: function(task) { task.pass(); },
}, callback);
```



## 直列化したタスクの省略記法

- 第一引数を省略し、第二引数にユーザタスクの配列を指定すると、直列タスクとして順番に実行します

```js
function task_a(task) { task.pass(); }
function task_b(task) { task.pass(); }
function task_c(task) { task.pass(); }

// このように順番に実行するだけのユーザタスクは...
Task.run("task_a > task_b > task_c", {
    task_a: task_a,
    task_b: task_b,
    task_c: task_c,
}, callback);

// シンプルに書くことができます
Task.run("", [task_a, task_b, task_c], callback);
```



## 直列/並列/sleepを組み合わせる

- **`a > b + c + 1000 > d`** は、ユーザタスク a 〜 d を以下の順番で実行します
    1. a を実行します
    2. a の正常終了で、b と c を並列に実行します
    3. b と c が正常終了しており sleep(1000) が終わっているなら d を実行します
    4. d が正常終了すると、callback を呼び出します

```js
Task.run("a > b + c + 1000 > d", {
    a: function(task) { task.pass(); },
    b: function(task) { task.pass(); },
    c: function(task) { task.pass(); },
    d: function(task) { task.pass(); }
}, callback);
```




## ユーザタスクに引数を渡す

- Task.run から起動されるユーザタスク(task_a 〜 task_d)に引数を渡すには、Task.run の第四引数(options)に **arg** を設定します

```js
var arg = { a: 1, b: 2, c : 3, d: 4 }; // ユーザタスクに渡す値

Task.run("task_a > task_b + task_c > task_d", {
    task_a: function(task, arg) { console.log(arg.a); task.pass(); },
                           ///                /////
    task_b: function(task, arg) { console.log(arg.b); task.pass(); },
    task_c: function(task, arg) { console.log(arg.c); task.pass(); },
    task_d: function(task, arg) { console.log(arg.d); task.pass(); },
}, function(error, buffer) {
    if (error) {
        console.log("ng");
    } else {
        console.log("ok");
    }
}, { arg: arg });
     ////////////////////////
```



## 直列化したユーザタスクの失敗

- **直列化**したユーザタスクが **途中で失敗** すると後続のユーザタスクは **実行しません**
- task_a が失敗した場合は、後続の task_b は実行しません

```js
Task.run("task_a > task_b", {
    task_a: function(task) { task.miss(); },
    task_b: function(task) { task.pass(); }, // task_b は実行されません
}, callback);
```



## 並列化したユーザタスクの失敗

- **並列化**したユーザタスクの **一部が失敗しても** 、  
  同じグループに属するユーザタスクは **中断しません**
- task_c が途中で失敗した場合でも、task_d と task_e は中断しません

```js
Task.run("task_c + task_d + task_e", {
    task_c: function(task) {
        setTimeout(function() { task.miss() }, 1000); // 1000ms 後に失敗
    },
    task_d: function(task) { task.pass(); }, // task_c が中断しても task_d は中断しません
    task_e: function(task) { task.pass(); }, // task_c が中断しても task_e は中断しません
}, callback);
```


## バリデーション

- 第一引数で指定したタスク名が存在しない場合や、  
  引数を受け取らないユーザタスクの存在を検出するとエラーになります

```js
Task.run("task_a + task_b + task_c", { // task_a, task_b, task_c が存在しない ▶ エラー

    bad_argument: function(/* task */) {} // 引数を受け取らないユーザタスク ▶ エラー

}, function() {});
```

```js
> TypeError: Task.run(taskRoute, taskMap)
```


## まとめ

- Task.run を使うと、  
  非同期処理をデータ化(文字列化)ができます
- 仕様変更が入りやすいアニメーションなどの非同期処理を Task.run で組んでおくと、
  将来の仕様変更に対して一定の強度を持たせることができます


<!-- ----------------------------------------------------- -->
# Task.js を便利に使いこなす

## Task runner API

|                  |                 |
|------------------|-----------------|
| 非同期ループ     | Task.loop()     |

<!-- ----------------------------------------------------- -->

# 非同期ループ

- Task.loop(source, tick, callback) は非同期ループ機能を提供します
    - tick の内部で task.pass() を実行するとループが進行し、  
      task.miss() を実行するとループが中断します

```js
var source = { a: 1, b: 2 }; // source には Object または Array を指定できます

Task.loop(source, tick, callback);

function tick(task, key, source) { // key は "a", "b" になります
    console.log(key, source[key]); // -> a 1
                                   // -> b 2
    task.pass();
}
function callback(error, buffer) {
    console.log("finished");
}
```







<!-- ----------------------------------------------------- -->

# JavaScript vs Promise vs Task.js

## 

非同期の4つのユーザタスク **A, B, C, D** を、  
以下の条件で実装する例です

- 条件
    - A, B のグループと
      C, D のグループに分ける
    - 2つのグループの完了を待つ
- 環境
    - JavaScript
    - jQuery.Deferred
    - DOM Promise
    - Task.js ( Junction )
    - Task.js ( Junction + Task.run )


## JavaScript Version

```js
function waitForAsyncProcesses(finishedCallback) {
    var remainTaskGroupCount1 = [A, B].length; // 2
    var remainTaskGroupCount2 = [C, D].length; // 2
    var remainJunctionTaskCount = 2;

    function A() { setTimeout(doneTaskGroup1, 10);  }
    function B() { setTimeout(doneTaskGroup1, 100); }
    function C() { setTimeout(doneTaskGroup2, 20);  }
    function D() { setTimeout(doneTaskGroup2, 200); }

    function doneTaskGroup1() {
        if (--remainTaskGroupCount1 <= 0) { junction(); }
    }
    function doneTaskGroup2() {
        if (--remainTaskGroupCount2 <= 0) { junction(); }
    }
    function junction() {
        if (--remainJunctionTaskCount <= 0) { finishedCallback(); }
    }
    A(); B(); C(); D();
}
waitForAsyncProcesses(function(error) { console.log("finished"); });
```

## jQuery.Deferred Version

```js
function waitForAsyncProcesses(finishedCallback) {
    var promises1 = [A(), B()]; // 2
    var promises2 = [C(), D()]; // 2

    function A() {
        var dfd = jQuery.Deferred();
        setTimeout(function() { dfd.resolve(); }, 10);
        return dfd.promise();
    }
    function B() {
        var dfd = jQuery.Deferred();
        setTimeout(function() { dfd.resolve(); }, 100);
        return dfd.promise();
    }
    function C() {
        var dfd = jQuery.Deferred();
        setTimeout(function() { dfd.resolve(); }, 20);
        return dfd.promise();
    }
    function D() {
        var dfd = jQuery.Deferred();
        setTimeout(function() { dfd.resolve(); }, 200);
        return dfd.promise();
    }

    jQuery.when(
        jQuery.when.apply(null, promises1), // task group1
        jQuery.when.apply(null, promises2)  // task group2
    ).done(function() {
        finishedCallback()
    });
}
waitForAsyncProcesses(function(error) { console.log("finished"); });
```

## DOM Promise Version

```js
function waitForAsyncProcesses(finishedCallback) {
    function A() {
        return new Promise(function(resolve, reject) { setTimeout(resolve, 10);  });
    }
    function B() {
        return new Promise(function(resolve, reject) { setTimeout(resolve, 100); });
    }
    function C() {
        return new Promise(function(resolve, reject) { setTimeout(resolve, 20);  });
    }
    function D() {
        return new Promise(function(resolve, reject) { setTimeout(resolve, 200); });
    }
    Promise.all([
        Promise.all([A(), B()]),
        Promise.all([C(), D()])
    ]).then(function() {
        finishedCallback(null);
    }).catch(function(error) {
        finishedCallback(error);
    });
}
waitForAsyncProcesses(function(error) { console.log("finished"); })
```

## Task.js ( Junction ) Version

```js
function waitForAsyncProcesses(finishedCallback) {
    var taskMap = {
            A: function(task) { setTimeout(task.passfn(), 10);  },
            B: function(task) { setTimeout(task.passfn(), 100); },
            C: function(task) { setTimeout(task.passfn(), 20);  },
            D: function(task) { setTimeout(task.passfn(), 200); },
        };
    var junction = new Task(2, finishedCallback);
    var taskGroup1 = new Task(2, junction);
    var taskGroup2 = new Task(2, junction);

    taskMap.A(taskGroup1);
    taskMap.B(taskGroup1);
    taskMap.C(taskGroup2);
    taskMap.D(taskGroup2);
}
waitForAsyncProcesses(function(error) { console.log("finished"); });
```


## Task.js ( Junction + Task.run ) Version

```js
function waitForAsyncProcesses(finishedCallback) {
    var taskMap = {
            A: function(task) { setTimeout(task.passfn(), 10);  },
            B: function(task) { setTimeout(task.passfn(), 100); },
            C: function(task) { setTimeout(task.passfn(), 20);  },
            D: function(task) { setTimeout(task.passfn(), 200); },
        };
    var junction = new Task(2, finishedCallback);

    Task.run("A + B", taskMap, junction);
    Task.run("C + D", taskMap, junction);
}

waitForAsyncProcesses(function(error) { console.log("finished"); });
```


<!-- ----------------------------------------------------- -->
# Try it

##

github

```sh
https://github.com/uupaa/Task.js
```

npm

```sh
$ npm install uupaa.task.js
```

##

Node.js

```js
var Task = require("uupaa.task.js");

var task = new Task(1, ...);
```

Browser

```js
<script src="uupaa.task.js"></script>

<script>
var task = new Task(1, ...);
</script>
```

WebWorkers

```js
importScripts("uupaa.task.js");

var task = new Task(1, ...);
```

## in this slide

DevTools

```js
new Task(1, function() { console.log("Hello Task.js"); }).pass();
```

![](./assets/img/try.png)

<!-- ----------------------------------------------------- -->

# まとめ



<!-- ----------------------------------------------------- -->

# Task.js の特徴

- **どこでも動作**します
    - Browser, WebWorkers, Node.js で動作します
    - 複雑なトリックや環境に依存していません
- **小さく、軽く、簡単に導入**できます
    - Closure Compiler の ADVANCED MODE に対応しています
    - 構造がシンプルで、ドキュメントもあります
    - 実績があり枯れています。チームで導入できます
    - 既存の構造やユーザのタスクを**大きく改変せずに導入できます**
- **デバッグ機能**が備わっています
    - 動作中のTaskの一覧と内部の状態をダンプできます
- タスクの**上下/前後関係を明示**できます
    - 他のライブラリよりも**スッキリとしたコードになります**

#

(ε・◇・)з o O ( Task.js オススメです

[Task.js]: https://github.com/uupaa/Task.js
[Flow.js]: http://www.slideshare.net/uupaa/flowjs


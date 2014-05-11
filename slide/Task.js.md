% Task.js
% A very simple way to wait for asynchronius processes.
% @uupaa - 2014-02-14 (rev 2)

<!-- ----------------------------------------------------- -->

<!-- ----------------------------------------------------- -->

# JavaScript, Async, Idiom

## JavaScript は非同期処理の塊


- XHR
- onload
- setTimeout
- postMessage
- addEventListener
- DOMContentLoaded


## 

非同期プログラミングを  
支援するライブラリやイディオムは、  
Deferred, Promises, async, await,  
DOM Promise など沢山がありますが…

## 

ここで紹介する **[Task.js]** も、非同期プログラミングを支援するライブラリです

<hr />
( Task.js は **[Flow.js]**[] の改良版です )

## 

Task.js は、どこでも動きます。

<br />
ブラウザのサポート状況を気にしたり、  
Polyfillライブラリの存在に左右されるような  
不安定な状況から開放されます
<br />

- 環境依存なコードがある? ▶ ありません
- 複雑なトリックに依存してる? ▶ していません
- Browser, WebWorkers, Node.js で動く? ▶ 動きます


## 
Task.js を導入すると、  
非同期処理で悩む必要がなくなり、  
ロジックの実装に集中できるようになります

- 今後もずっと使える? ▶ 使えます
- チームで使える? ▶ 使えます(導入も簡単です)
- 導入実績ある? ▶ あります
- 枯れてる? ▶ 枯れてます



<!-- ----------------------------------------------------- -->

# 非同期処理へのNeedsとWants

## 複数の非同期処理の完了を待ちたい

- ダウンロードの完了を待ちつつアニメーションしたい
- いくつかの非同期処理をグルーピングし、
  それらの終了を待ちたい事がよくある
- 同期/非同期が混在すると、場当たり的に、
  一方はループで、一方はコールバックの連鎖で制御している
- 同期/非同期を意識せずに扱いたい
- 毎回同じようなコードを書いて捨てている気がする

## シンプルで枯れた実装がほしい

- Deferred や Promises を  
  JavaScript に詳しくない人や、  
  非プログラマーに説明するのは骨が折れる

## 運用で困らないようにしたい

- 特定の環境に依存したり、頻繁に更新される重厚なライブラリには依存したくない(できない)

## デバッグのしやすさも大事

- 非同期処理に問題があることは分かったが、  
  **どの非同期処理で止まっているかが分からないと、  
  非常に困る**、原因を素早く特定したい
- 実行中の同期/非同期関数をモニタリングしたい

## 仕様変更にも強い実装にしたい

- UIアニメーションや、  
  ゲームのアニメーションの流れや順番は、  
  クオリティアップの段階で頻繁に修正が入るが、  
  それらを仕様変更に強い形でデータ化  
  またはコード化できないか
- アニメーションの順番を変えたいだけなのに、  
  コードをガバっと変更する感じの実装はつらい

##

Task.js はこれら全ての  
**Needs** と **Wants** を満たしてくれます

<hr />
では、Task.js の機能を見て行きましょう


<!-- ----------------------------------------------------- -->

# Task.js の基本

##

 1. Task.js では、ユーザが用意する同期/非同期処理を  
  **ユーザータスク** と呼びます
 2. var task = new Task(**2**, **callback**) は、  
  **task.pass()** が2回呼ばれるまで**待機**します

```js
var task = new Task(2, callback); // 2つのユーザタスクの完了を待つ

userTask() ? task.pass() : task.miss(); // 同期ユーザタスク

setTimeout(function() {
    userTask() ? task.pass() : task.miss(); // 非同期ユーザタスク
}, 1000);

function userTask() { return Math.random() >= 0.8; } // 80%の確率でtrueを返す

function callback(error) {
    console.log("finished");
}
```


## 

 3. **task.pass()** を2回呼ぶと **待機成功** で終了します
 4. **task.miss()** を1回呼ぶと **待機失敗** で終了します
 5. 待機終了で callback が呼ばれます
 6. callback( **error** ) の error は待機成功で null,  
    待機失敗で Error オブジェクトになります

```js
var task = new Task(2, callback); // 2つのユーザタスクの完了を待つ

userTask() ? task.pass() : task.miss(); // 同期ユーザタスク

setTimeout(function() {
    userTask() ? task.pass() : task.miss(); // 非同期ユーザタスク
}, 1000);

function userTask() { return Math.random() >= 0.8; } // 80%の確率でtrueを返す

function callback(error) {
    console.log("finished");
}
```


## まとめ

 1. **new Task**(**ユーザタスクの数**, **callback**) で待機開始
 2. 成功で **task.pass()** を、失敗で **task.miss()** を呼ぶ
 3. 待機終了で **callback** が呼ばれる  
    **error** が **null** で**成功**

<hr />

Task.js を使うために必要となる知識は  
この3つだけです

<hr />

次のページからは、  
さらに便利な使い方を紹介していきます

<!-- ----------------------------------------------------- -->

# Task.js を便利に使う

## 

| 用法             | Task API        |
|------------------|-----------------|
| バッファに貯める   | task.push(), task.set() |
| バッファから取り出す | task.buffer(), callback(, buffer) |
| データを変換する | Task.flatten(), Task.arraynize(), <br />Task.objectize() |
| デバッグする     | Task.dump(), Task.drop() |
| 強制終了する     | task.exit() |
| 状態を取得,終了を判定する | task.state(), task.isFinished() |
| エラーハンドリング | task.message(), task.done(error) |

## 

| 用法             | Task API        |
|------------------|-----------------|
| 失敗を許容する   | task.missable() |
| もっと待機する   | task.extend()   |
| Task を連結する  | Junction        |
| 並列/直列動作    | Task.run()      |
| 非同期ループ     | Task.loop()     |


<!-- ----------------------------------------------------- -->

# バッファに貯める/取り出す

## buffer

各Taskのインスタンスは  
**バッファ**と呼ばれる配列を持っています

<br />
バッファにはサーバから取得したリソースや、  
計算途中の値などを入れておき、  
待機終了後に取り出して利用します


## task.buffer(), callback(, buffer), task.push(), task.set()

- **task.buffer()** で直接バッファにアクセスできます  
- 待機終了後は callback(, **buffer**) からアクセスできます
- **task.push(value)** は buffer.push(value) を行います
- **task.set(key,value)** は buffer[key] = value を行います

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

```js
function callback(error, buffer) { // sharedBuffer: ["junction", "value1", "value2"]
    console.log(buffer.length); // -> 3
}

var junction = new Task(2, callback).push("junction");
var task1    = new Task(1, junction);
var task2    = new Task(1, junction);

task1.push("value1").pass();
task2.push("value2").pass();
```

- 後述する Junction を使い、階層構造をもった Task は、  
  お互いの **buffer を共有した状態** になります
- task1.push("value1") は junction.push("value1") と **同じ結果** になり  
  task2.push("value2") も junction.push("value2") と **同じ結果** になります

<!-- ----------------------------------------------------- -->

# データ変換

## Task.flatten()

```js
var array = [ [1,2], [3,4] ];

Task.flatten(source); // -> [1, 2, 3, 4]
```

- **Task.flatten(source)**を使うと、配列の次元数を -1 することができます
- 2次元配列は1次元配列に展開され、3次元配列は2次元配列に展開されます
- 多次元配列を含んだ source の値を展開する汎用関数として利用できます


```js
// 3次元配列を展開
Task.flatten([ [1,2], [3,4], [ [5,6] ] ]); // -> [ 1, 2, 3, 4, [5, 6] ]

// 2次元配列を展開
Task.flatten([  1,2,   3,4,    [5,6]   ]); // -> [ 1, 2, 3, 4,  5, 6  ]
```

## Task.arraynize()

```js
var source = [1,2,3];
source["key"] = "value"; // 配列にプロパティを追加

Task.arraynize(source);  // -> [1, 2, 3]
```

- **Task.arraynize(source)**は、新しい配列を作り source の値をコピーします
- **数字の添字を持たないプロパティはコピーしません**  
  **task.set("key", "value")** で設定した  
  **{ "key": "value" }** は **捨てられます**
- Array + Object な source を Array としてクローンする(フィルタリングする)汎用関数として利用できます

## Task.objectize()

```js
var source = [1,2,3];
source["key"] = "value"; // 配列にプロパティを追加
Object.keys(source);     // -> ["0", "1", "2", "key"]

Task.objectize(source);  // -> { 0: 1, 1: 2, 2: 3, key: "value" }


```

- **Task.objectize(source)**は、新しい Object を作り Object.keys(source) で見つかる要素を全てコピーして返します
- **task.set("key", "value")** で設定した  
  **{ "key": "value" }** も **コピーします**
- Array + Object な source を Object としてクローンする(Object に再構築する)汎用関数として利用できます





<!-- ----------------------------------------------------- -->
# デバッグする

## Task.dump()

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
    Task.drop();
    var task1 = new Task(1, function(){});
    var task2 = new Task(1, function(){});
    var task3 = new Task(1, function(){});
    alert(JSON.stringify(Task.dump(), null, 2));
}
</script>

<button style="font:normal 24pt Impact" onclick="task_dump()">run Task.dump()</button>

- **Task.dump()** は Task のスナップショットを返します
- 実行中の Task 名と、内部の状態を把握できます

## Task.dump(タスク名による絞込)

```js
var task = new Task(1, callback, { name: "TEST" });

Task.dump("TEST");
{
    "TEST@166": { junction: false, taskCount: 1, missableCount: 0,
                  missedCount: 0, passedCount: 0, state: "" }
}
```

- Task の第三引数で Task 名を指定し、**Task.dump(taskName)** で絞り込めます


## Task.drop()

```js
Task.drop(); // この行以前の Task のスナップショットを削除

var task = new Task(1, function() {}, { name: "debug" });

Task.dump();
{
    "debug@1": { junction: false, taskCount: 1, missableCount: 0,
                 passedCount: 0, missedCount: 0, state: "" }
}
```

- **Task.drop()** は、  
  Task.dump() 用の情報をリセット(削除)します  
- この関数はデバッグ/テスト用です。  
  通常利用で明示的に呼ぶ必要はありません


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

```js
var task = new Task(1);

task.isFinished(); // -> false
task.state();      // -> ""
task.pass();       // 待機終了
task.isFinished(); // -> true
task.state();      // -> "pass"
```

##

- **task.state()** は Task の状態を文字列で返します
- **task.isFinished()** は Task の待機終了で true を返します

| task.state() | task.isFinished() | 状態    |
|--------------|-------------------|---------|
| ""           | flase             | 待機中  |
| "pass"       | true              | 待機成功で終了 |
| "miss"       | true              | 待機失敗で終了 |
| "exit"       | true              | 待機失敗で終了 |

<!-- ----------------------------------------------------- -->

# task.message(), task.done(error)

## Error Handling

```js
var task = new Task(1, function(error) {
    if (error) { console.log(error.message); } // -> "O_o"
});

function userTask(task) {
    try {
        throw new Error("O_o"); // 例外発生!
        task.pass(); // ここには到達しない
    } catch (error) {
        task.message(error.message).miss(); // task.message("O_o") を設定
    }
}
userTask(task);
```

- エラーのハンドリングはユーザタスク側で行い、  
  **task.miss()** を呼んでください
- **task.message( "メッセージ" )**.**miss()** とすると、  
  callback( **new Error("メッセージ")** ) として伝達します

## 

- **task.done** は、**task.pass()** と **task.miss()** のコンビニエントメソッドです。
  **task.pass()** または **task.miss()** を呼び分けている処理をシンプルに記述できます
- **task.done(Errorオブジェクト)** は **task.message(error.message).miss()** として動作し、
  **task.done(...)** は **task.pass()** として動作します

```js
// このようなありがちなコードを
if (error) { // Error Object
    task.message(error.message).miss();
} else {
    task.pass();
}
```

```js
// 短く記述できます
task.done(error);
```

<!-- ----------------------------------------------------- -->
# task.missable()

## 失敗を許容する(織り込んでおく)

```js
function callback(error) { console.log(error.message); }

var task = new Task(1, callback, { name: "MissableTask" });

task.missable(2); // 2回までの失敗を許容する(3回失敗したら終了する)
task.miss(); // ユーザタスク失敗(1回目の失敗なので継続する)
task.miss(); // ユーザタスク失敗(2回目の失敗なので継続する)
task.miss(); // ユーザタスク失敗(3回目の失敗なので待機失敗で終了する) -> callback(Error)
```

- 成功すべきユーザタスクが1つあり、  
  2回までの失敗を許す場合は、  
  new Task(1).**missable(2)** とします
- task.missable(2) は3回失敗すると待機失敗で終了します
- task 生成時の初期値は task.missble(0) です
- task.missable(0) の状態で **task.miss()** を一度でも呼ぶと待機失敗で終了します

## 

```js
// CDN1 からダウンロードできない場合に
// CDN2 を利用してリカバリを試みる
function callback(error) { console.log(error.message); }
var urls = ["http://cdn1.example.com/image.png",
            "http://cdn2.example.com/image.png"];

download( urls, new Task(urls.length, callback).missable(1) );

function download(urls, task) {
    var xhr = new XMLHttpRequest();

    xhr.onload = function() { task.pass(); };
    xhr.onerror = function() {
        // CDN1 失敗 ▶ タスク継続中? ▶ ダウンロードを続行
        if ( !task.miss().isFinished() ) {
            download(urls, task);
        }
    };
    xhr.open("GET", urls.shift(), true);
    xhr.send()
}
```

- task.missable を使うと「**こんなこともあろうかと**」を  
  とても簡単に実装できます




<!-- ----------------------------------------------------- -->

# task.extend()

```js
function callback(error) { }

var taskCount = 1;
var task = new Task(taskCount, callback);

task.extend(1); // taskCount += 1;
task.pass();    // ユーザタスク成功(taskCount は2なので待機する)
task.pass();    // ユーザタスク成功(taskCount は2なので待機成功で終了する)
                //      -> callback(null)
```

- 動的に待機数(taskCount)を +1 するには、  
  **task.extend(1)** とします
- 次々にユーザタスクが増えるケースで使います

![](./assets/img/task.extend.png)




<!-- ----------------------------------------------------- -->

# Junction

## 

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

- Task を集約する Task を **Junction(合流点)** と呼びます
- Junction に Junction を重ねる事で  
  階層構造( **Junction Tree** )を作る事も可能です
- 下位の Junction/Task で **状態変化** が起きると、上位の Junction にも **通知** されます。
  さらに上位の Junction がある場合は **次々に伝播** (バブルアップ)します

## 

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

- task1.pass() で task1 と junction の状態が変化します
- task2.pass() で task2 と junction の状態が変化します
- task2.pass() のタイミングで junction の待機も終了し、callback が呼ばれます

## Junction Tree

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

- Junction を使うことで Task の階層構造をコンパクトに記述できます



<!-- ----------------------------------------------------- -->

# Task.run


## 

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

- **Task.run** は ユーザタスクの前後関係を定義し  
  実行する機能(ユーザタスク・ランナー)です
- ユーザタスク名を **`>`** と **`+`** でつなぐ事で、  
  ユーザタスクの前後の流れ(直列/並列動作)を定義します
- Task.run から起動されるユーザタスクの第一引数には  
  **Task** のインスタンスが渡されます

## Task.run + Junction

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

- Task の上下関係を定義する **Junction** と  
  ユーザタスクの前後関係を定義する Task.run を  
  組み合わせて利用することも可能です



## ユーザタスクの並列化

```js

Task.run("task_a + task_b", {
    task_a: function(task) { task.pass(); },
    task_b: function(task) { task.pass(); },
}, callback);
```

- ユーザタスク を **`+`** でつなぐと、  
  それらは並列に実行します


## ユーザタスクの直列化

```js
Task.run("task_a > task_b", {
    task_a: function(task) { task.pass(); },
    task_b: function(task) { task.pass(); },
}, callback);
```

- ユーザタスクを **`>`** でつなぐと、  
  それらは直列(順番)に実行します

## sleepタスク

```js
Task.run("task_a > 1000 > task_b", {
    task_a: function(task) { task.pass(); },
    task_b: function(task) { task.pass(); },
}, callback);
```

- タスク名の代わりにms単位の数字を埋め込むと、  
  指定した時間分だけ待機する  
  **何もしない** タスクを内部で生成します
- 時間稼ぎができます
- 上記の例では、task_a 実行後に **1000ms** 待機し、  
  その後に task_b を実行します


## 直列化したタスクの省略記法

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

- 第一引数を省略し、第二引数にユーザタスクの配列を指定すると、直列タスクとして順番に実行します


## 直列/並列/sleepを組み合わせる

```js
Task.run("a > b + c + 1000 > d", {
    a: function(task) { task.pass(); },
    b: function(task) { task.pass(); },
    c: function(task) { task.pass(); },
    d: function(task) { task.pass(); }
}, callback);
```

- **`a > b + c + 1000 > d`** は、ユーザタスク a 〜 d を以下の順番で実行します
    1. a を実行します
    2. a の正常終了で、b と c を並列に実行します
    3. b と c が正常終了しており sleep(1000) が終わっているなら d を実行します
    4. d が正常終了すると、callback を呼び出します



## ユーザタスクに引数を渡す

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

- Task.run から起動されるユーザタスク(task_a 〜 task_d)に引数を渡すには、Task.run の第四引数(options)に **arg** を設定します


## 直列化したユーザタスクの失敗

```js
Task.run("task_a > task_b", {
    task_a: function(task) { task.miss(); },
    task_b: function(task) { task.pass(); }, // task_b は実行されません
}, callback);
```

- **直列化**したユーザタスクが **途中で失敗** すると後続のユーザタスクは **実行しません**
- task_a が失敗した場合は、後続の task_b は実行しません


## 並列化したユーザタスクの失敗

```js
Task.run("task_c + task_d + task_e", {
    task_c: function(task) {
        setTimeout(function() { task.miss() }, 1000); // 1000ms 後に失敗
    },
    task_d: function(task) { task.pass(); }, // task_c が中断しても task_d は中断しません
    task_e: function(task) { task.pass(); }, // task_c が中断しても task_e は中断しません
}, callback);
```

- **並列化**したユーザタスクの **一部が失敗しても** 、  
  同じグループに属するユーザタスクは **中断しません**
- task_c が途中で失敗した場合でも、task_d と task_e は中断しません

## バリデーション

```js
Task.run("task_a + task_b + task_c", { // task_a, task_b, task_c が存在しない ▶ エラー

    bad_argument: function(/* task */) {} // 引数を受け取らないユーザタスク ▶ エラー

}, function() {});
```

```js
> TypeError: Task.run(taskRoute, taskMap)
```

- 第一引数で指定したタスク名が存在しない場合や、  
  引数を受け取らないユーザタスクの存在を検出するとエラーになります

## まとめ

- Task.run を使うと、  
  非同期処理をデータ化(文字列化)ができます
- 仕様変更が入りやすいアニメーションなどの非同期処理を Task.run で組んでおくと、
  将来の仕様変更に対して一定の強度を持たせることができます

<!-- ----------------------------------------------------- -->

# 非同期ループ

```js
var source = { a: 1, b: 2 };

Task.loop(source, function tick(task, key, source) {
    console.log(key, source[key]);
    task.pass();
}, function callback(error, buffer) {
    console.log("finished");
});

> a 1
> b 2
> finished
```

- Task.loop は非同期ループ機能を提供します
- source には Object または Array を指定できます
- key には Object.keys(source) が返す [key, ...] が順番に与えられます
- tick の内部で task.pass() を実行するとループが進行し、  
  task.miss() を実行するとループが中断します













<!-- ----------------------------------------------------- -->

# JavaScript vs Promise vs Task.js

## 

「非同期のユーザタスク **A, B, C, D** を、  
**A, B のグループ** と **C, D のグループ** に分け、  
**2つのグループの完了を待つ**」処理を、  
それぞれの方法で実装してみます

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

    function A() { setTimeout(function() { doneTaskGroup1(); }, 10);  }
    function B() { setTimeout(function() { doneTaskGroup1(); }, 100); }
    function C() { setTimeout(function() { doneTaskGroup2(); }, 20);  }
    function D() { setTimeout(function() { doneTaskGroup2(); }, 200); }

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
            A: function(task) { setTimeout(function() { task.pass(); }, 10);  },
            B: function(task) { setTimeout(function() { task.pass(); }, 100); },
            C: function(task) { setTimeout(function() { task.pass(); }, 20);  },
            D: function(task) { setTimeout(function() { task.pass(); }, 200); },
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

(ε・◇・)з o O ( **スッキリ**

## Task.js ( Junction + Task.run ) Version

```js
function waitForAsyncProcesses(finishedCallback) {
    var taskMap = {
            A: function(task) { setTimeout(function() { task.pass(); }, 10);  },
            B: function(task) { setTimeout(function() { task.pass(); }, 100); },
            C: function(task) { setTimeout(function() { task.pass(); }, 20);  },
            D: function(task) { setTimeout(function() { task.pass(); }, 200); },
        };
    var junction = new Task(2, finishedCallback);

    Task.run("A + B", taskMap, junction);
    Task.run("C + D", taskMap, junction);
}

waitForAsyncProcesses(function(error) { console.log("finished"); });
```

(ε・◇・)з o O ( **超スッキリ**

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

## 


Task.js は以下の特徴を備えています

- **様々な環境で動作** します
- 構造が **シンプル** で応用が効きます
- 既存の構造やユーザのタスクを  
  **大きく改変しなくても導入可能** です
- Junction で **上下関係を定義** し、  
  Task.run で **前後関係を定義** できます
- Junction と Task.run を組み合わせて  
  **スッキリ** としたコードが書けます

## 

(ε・◇・)з o O ( Task.js マジ オススメ

[Task.js]: https://github.com/uupaa/Task.js
[Flow.js]: http://www.slideshare.net/uupaa/flowjs


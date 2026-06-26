screens.json 仕様書（現行版）
基本構造

screens.json は画面(Screen)の配列です。
[
  {
    "id": "start01"
  },

  {
    "id": "task01"
  }
]

各オブジェクトが1画面を表します。

全要素入りサンプル
{
  "id": "task01",

  "type": "task",

  "defaultWeight": 1,

  "showScreenTime": true,

  "counter": {
    "type": "countdown",
    "start": 30,
    "interval": 1
  },

  "text": "30秒間深呼吸してください",

  "buttons": [
    {
      "label": "完了",

      "visibleCondition": {
        "type": "counter",
        "operator": "<=",
        "value": 0
      },

      "transition": {
        "type": "fixed",
        "target": "rest01"
      }
    },

    {
      "label": "中断",

      "visibleCondition": {
        "type": "time",
        "operator": ">=",
        "value": 5
      },

      "transition": {
        "type": "fixed",
        "target": "end01"
      }
    }
  ],

  "autoTransition": {
    "condition": {
      "type": "time",
      "operator": ">=",
      "value": 60
    },

    "transition": {
      "type": "random",

      "pool": [
        "task",
        "rest"
      ],

      "weights": {
        "task03": 5,
        "else": 1
      }
    }
  }
}

画面共通設定
id
  画面ID
  "id": "task01"
  全画面で重複禁止。

type
  画面カテゴリ
  画面をいくつかのグループに纏める

defaultWeight
  ランダム抽選時の基本重
  省略時
  "defaultWeight": 1
  扱い。

showScreenTime
  画面上部の滞在時間表示

counter
  画面中央のカウンター設定
  counterの種類
    "counter": {
      "type": "none"
    },
    "counter": {
      "type": "countdown",
      "start": 10,
      "interval": 1
    }
    "counter": {
      "type": "countup",
      "interval": 1
    }
    "counter": {
      "type": "elapsed"
    }
    "counter": {
      "type": "timer",
      "duration": 300
    }

text
  画面中央下、課題文表示


遷移ボタンの種類
"nextButton": {
  "visibleCondition": "immediate",
  "label": "次へ"
}
"nextButton": {
  "visibleCondition": "counter",
  "operator": ">=",
  "value": 10,
  "label": "次へ"
}
"nextButton": {
  "visibleCondition": "time",
  "operator": ">=",
  "value": 30,
  "label": "次へ"
}
"nextButton": {
  "visibleCondition": "hidden"
}



自動遷移の種類（自動遷移無しは無記入）
"autoTransition": {
  "condition": "time",
  "operator": ">=",
  "value": 30
}
"autoTransition": {
  "condition": "counter",
  "operator": "<=",
  "value": 0
}




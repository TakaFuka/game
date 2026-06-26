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
      "start": 10,
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



{
  "variables": {
    "stress": 0,
    "success": 0,
    "level": 1
  },

  "screens": [
    {
        "id": "start01",
        "type": "start",
        "defaultWeight": 1,
        "showScreenTime": false,
        "counter": {
            "type": "none"
        },
        "text": "開始画面 {gameElapsed}",
        "buttons": [
            {
                "label": "countupTest",
                "visibleCondition": {
                    "type": "immediate"
                },
                "transition": {
                    "type": "fixed",
                    "target": "countupTest"
                }
            },
            {
                "label": "ランダム",
                "visibleCondition": {
                    "type": "immediate"
                },
                "transition": {
                    "type": "random",
                    "pool": ["task"],
                    
                    "weights": {
                        "countupTest": 5,
                        "else": -1
                    }
                }
            }
        ]
    },
    {
        "id": "countupTest",
        "type": "task",
        "defaultWeight": 1,
        "showScreenTime": true,

        "variableChanges":[
            {
            "name":"stress",
            "value":"[1,2][Math.floor(Math.random() * 2)]"
            },
            {
            "name":"success",
            "value":"success+1"
            }
        ],
        "counter": {
            "type": "countup",
            "start": "2",
            "interval": "stress"
        },
        "text": "CountUpテスト（5以上でボタン表示） {gameElapsed}",
        "buttons": [
            {
                "label": "次へ",
                "visibleCondition": {
                    "type": "value",
                    "variable":"counterValue",
                    "operator": ">=",
                    "value": 5
                },
                "transition": {
                    "type": "fixed",
                    "target": "countdownTest",
                    "variableChanges":[
                      {
                        "name":"stress",
                        "value":"stress+screenElapsed"
                      }
                    ]
                }
            },
            {
                "label": "スタートに戻る",
                "visibleCondition": {
                    "type": "immediate"
                },
                "transition": {
                    "type": "fixed",
                    "target": "start01"
                }
            }
        ]
    },
    {
        "id": "countdownTest",
        "type": "task",
        "defaultWeight": 0,
        "showScreenTime": true,
        "counter": {
            "type": "countdown",
            "start": "stress",
            "interval": "stress"
        },
        "text": "CountDownテスト（0以下でボタン表示）{gameElapsed}",
        "buttons": [
            {
                "label": "次へ",
                "visibleCondition": {
                    "type": "value",
                    "variable":"counterValue",
                    "operator": "<=",
                    "value": 0
                },
                "transition": {
                    "type": "fixed",
                    "target": "elapsedTest"
                }
            },
            {
                "label": "スタートに戻る",
                "visibleCondition": {
                    "type": "immediate"
                },
                "transition": {
                    "type": "fixed",
                    "target": "start01"
                }
            }
        ]
    },
    {
        "id": "elapsedTest",
        "type": "task",
        "defaultWeight": 0,
        "showScreenTime": true,
        "counter": {
            "type": "elapsed"
        },
        "text": "Elapsedテスト（3秒経過でボタン表示）{gameElapsed}",
        "buttons": [
            {
                "label": "次へ",
                "visibleCondition": {
                    "type": "value",
                    "variable":"screenElapsed",
                    "operator": ">=",
                    "value": 3
                },
                "transition": {
                    "type": "fixed",
                    "target": "timerTest"
                }
            },
            {
                "label": "スタートに戻る",
                "visibleCondition": {
                    "type": "immediate"
                },
                "transition": {
                    "type": "fixed",
                    "target": "start01"
                }
            }
        ]
    },
    {
        "id": "timerTest",
        "type": "task",
        "defaultWeight": 0,
        "showScreenTime": true,
        "counter": {
            "type": "timer",
            "duration": 5
        },
        "text": "Timerテスト（残り0秒で自動遷移）{gameElapsed}",
        "autoTransition": {
            "condition": {
                "type": "value",
                "variable":"counterValue",
                "operator": "<=",
                "value": 0
            },
            "transition": {
                "type": "fixed",
                "target": "autoTimeTest"
            }
        },
        "buttons": [
            {
                "label": "スタートに戻る",
                "visibleCondition": {
                    "type": "immediate"
                },
                "transition": {
                    "type": "fixed",
                    "target": "start01"
                }
            }
        ]
    },
    {
        "id": "autoTimeTest",
        "type": "rest",
        "defaultWeight": 1,
        "showScreenTime": true,
        "counter": {
            "type": "none"
        },
        "text": "5秒後に自動遷移{gameElapsed}",
        "autoTransition": {
            "condition": {
                "type": "value",
                "variable":"screenElapsed",
                "operator": ">=",
                "value": 5
            },
            "transition": {
                "type": "fixed",
                "target": "end01"
            }
        },
        "buttons": [
            {
                "label": "countupTest",
                "visibleCondition": {
                    "type": "immediate"
                },
                "transition": {
                    "type": "fixed",
                    "target": "countupTest"
                }
            },
            {
                "label": "スタートに戻る",
                "visibleCondition": {
                    "type": "immediate"
                },
                "transition": {
                    "type": "fixed",
                    "target": "start01"
                }
            }
        ]
    },
    {
        "id": "end01",
        "type": "end",
        "defaultWeight": 1,
        "showScreenTime": true,
        "counter": {
            "type": "none"
        },
        "text": "全テスト終了{gameElapsed}",
        "buttons": [
            {
                "label": "最初に戻る",
                "visibleCondition": {
                    "type": "immediate"
                },
                "transition": {
                    "type": "fixed",
                    "target": "start01"
                }
            }
        ]
    }
  ]
}

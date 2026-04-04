# FamilyApp 開発者ツール

## todoist_to_json.py

Todoist からエクスポートした CSV を、FamilyApp のリストインポート用 JSON に変換するスクリプト。

### 使い方

```bash
python3 tools/todoist_to_json.py <input.csv> <output.json> [オプション]
```

### オプション

| オプション | 説明 | デフォルト |
|---|---|---|
| `--no-section-name NAME` | section なしタスクのカテゴリ名 | `移動メモ` |
| `--skip-indent2` | INDENT=2 のサブタスクをスキップ | 含める |

### 例

```bash
# 基本的な変換
python3 tools/todoist_to_json.py 帰省.csv todoist_import.json

# カテゴリ名を指定してサブタスクを除外
python3 tools/todoist_to_json.py 帰省.csv output.json --no-section-name "その他" --skip-indent2
```

### 出力 JSON 形式

```json
{
  "categories": [
    { "name": "カテゴリ名", "order": 0 }
  ],
  "items": [
    { "name": "アイテム名", "category": "カテゴリ名", "isDone": false, "order": 0 }
  ]
}
```

### インポート手順

1. アプリのリストページで対象リストを開く
2. 「読込」ボタンをタップ
3. 生成した JSON ファイルを選択
4. カテゴリが自動作成され、アイテムがインポートされる

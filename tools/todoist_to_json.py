#!/usr/bin/env python3
"""
Todoist CSV → FamilyApp list JSON 変換スクリプト

使い方:
    python3 tools/todoist_to_json.py <input.csv> <output.json> [--no-section-name <カテゴリ名>]

オプション:
    --no-section-name  sectionなしタスクのカテゴリ名 (デフォルト: "移動メモ")
    --indent-all       INDENT=2 のサブタスクも含める (デフォルト: 含める)
    --skip-indent2     INDENT=2 のサブタスクをスキップする

出力 JSON 形式:
    {
      "categories": [{"name": "カテゴリ名", "order": 0}, ...],
      "items": [{"name": "アイテム名", "category": "カテゴリ名", "isDone": false, "order": 0}, ...]
    }
"""

import argparse
import csv
import json
import sys


def convert(input_path: str, output_path: str, no_section_name: str = "移動メモ", skip_indent2: bool = False) -> None:
    categories_seen: list[str] = []
    items: list[dict] = []
    cur_section = no_section_name

    with open(input_path, encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            t = row.get("TYPE", "").strip()
            content = row.get("CONTENT", "").strip()
            indent_str = row.get("INDENT", "").strip()
            indent = int(indent_str) if indent_str.isdigit() else 1

            if t == "section" and content:
                cur_section = content
                if content not in categories_seen:
                    categories_seen.append(content)

            elif t == "task" and content:
                if skip_indent2 and indent >= 2:
                    continue
                # 最初のsectionなし部分のカテゴリを追加
                if cur_section not in categories_seen:
                    categories_seen.append(cur_section)
                items.append({
                    "name": content,
                    "category": cur_section,
                })

    # 並べ直し: sectionが出現した順を維持し、items内にorderを付与
    categories = [{"name": name, "order": i} for i, name in enumerate(categories_seen)]

    cat_order_count: dict[str, int] = {cat["name"]: 0 for cat in categories}
    out_items = []
    for item in items:
        cat = item["category"]
        out_items.append({
            "name": item["name"],
            "category": cat,
            "isDone": False,
            "order": cat_order_count[cat],
        })
        cat_order_count[cat] += 1

    data = {"categories": categories, "items": out_items}

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    # サマリー表示
    print(f"変換完了: {len(categories)}カテゴリ、{len(out_items)}件")
    for cat in categories:
        count = sum(1 for it in out_items if it["category"] == cat["name"])
        print(f"  [{cat['order']}] {cat['name']}: {count}件")
    print(f"\n出力ファイル: {output_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Todoist CSV → FamilyApp list JSON 変換")
    parser.add_argument("input_csv", help="Todoist CSVファイルのパス")
    parser.add_argument("output_json", help="出力するJSONファイルのパス")
    parser.add_argument(
        "--no-section-name",
        default="移動メモ",
        metavar="NAME",
        help="sectionなしタスクのカテゴリ名 (デフォルト: 移動メモ)",
    )
    parser.add_argument(
        "--skip-indent2",
        action="store_true",
        help="INDENT=2 のサブタスクをスキップする",
    )
    args = parser.parse_args()

    convert(
        input_path=args.input_csv,
        output_path=args.output_json,
        no_section_name=args.no_section_name,
        skip_indent2=args.skip_indent2,
    )


if __name__ == "__main__":
    main()

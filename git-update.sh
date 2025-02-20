#!/bin/bash

# ✅ בדיקה אם נמצאים בריפוזיטורי של Git
if ! git rev-parse --is-inside-work-tree &> /dev/null; then
  echo "❌ שגיאה: אתה לא בתוך ריפוזיטורי של Git!"
  exit 1
fi

# ✅ בדיקת האם יש שינויים לביצוע
if [[ -z $(git status --porcelain) ]]; then
  echo "✅ המאגר כבר מעודכן, אין שינויים לבצע."
  exit 0
fi

echo "🔄 הוספת כל השינויים..."
git add .

# ✅ בקשת תיאור commit
echo "🔍 הכנס תיאור לעדכון (או לחץ Enter לברירת מחדל):"
read commit_message

# ✅ אם לא הוזן תיאור, הגדרת ברירת מחדל
if [[ -z "$commit_message" ]]; then
  commit_message="🔄 עדכון אוטומטי ללא תיאור"
fi

# ✅ ביצוע commit עם הודעה
git commit -m "$commit_message"

# ✅ דחיפת השינויים ל-Git
if git push origin main; then
  echo "🚀 ✅ השינויים הועלו בהצלחה ל-Git!"
else
  echo "❌ שגיאה! העדכון נכשל. בדוק את החיבור שלך ל-Git."
fi

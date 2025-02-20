#!/bin/bash
echo "⏳ Adding all changes..."
git add .
echo "🔍 Enter commit message:"
read commit_message
git commit -m "$commit_message"
git push origin main
echo "✅ Code updated successfully!"

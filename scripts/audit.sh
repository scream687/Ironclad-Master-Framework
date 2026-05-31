#!/bin/bash

# Ironclad Audit Script
# Purpose: Enforce elite engineering standards and anti-slop patterns.

echo "🛡️ Starting Ironclad Audit..."

EXIT_CODE=0

# 1. Check for console.log (Anti-Slop)
echo "🔍 Checking for unauthorized logs..."
LOGS=$(grep -r "console.log" src/ docs/ scripts/ 2>/dev/null | grep -v "node_modules" | grep -v ".ai-core" | grep -v "scripts/audit.sh")
if [ ! -z "$LOGS" ]; then
  echo "❌ Found console.log in the following files:"
  echo "$LOGS"
  EXIT_CODE=1
else
  echo "✅ No unauthorized logs found."
fi

# 2. Check for // TODO (Phase Completion)
echo "🔍 Checking for incomplete SPARC cycles (TODOs)..."
TODOS=$(grep -r "// TODO" . 2>/dev/null | grep -v "node_modules" | grep -v ".ai-core" | grep -v ".husky" | grep -v "README.md" | grep -v "scripts/audit.sh")
if [ ! -z "$TODOS" ]; then
  echo "❌ Found TODO markers (SPARC cycle incomplete):"
  echo "$TODOS"
  EXIT_CODE=1
else
  echo "✅ All SPARC cycles complete."
fi

# 3. Verify Directory Structure
echo "🔍 Verifying directory integrity..."
REQUIRED_DIRS=(".ai-core/rules" ".ai-core/skills" "plans" "docs" "scripts")
for dir in "${REQUIRED_DIRS[@]}"; do
  if [ ! -d "$dir" ]; then
    echo "❌ Missing mandatory directory: $dir"
    EXIT_CODE=1
  fi
done
echo "✅ Directory structure verified."

# 4. Check for Mandatory Rule Files
echo "🔍 Verifying rule file synchronization..."
REQUIRED_RULES=(".clinerules" ".cursorrules" ".windsurfrules" "CLAUDE.md" "GEMINI.md" "SKILL_ROUTER.md")
for file in "${REQUIRED_RULES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ Missing mandatory rule file: $file"
    EXIT_CODE=1
  fi
done
echo "✅ Rule files verified."

if [ $EXIT_CODE -eq 0 ]; then
  echo "✨ Ironclad Audit: SUCCESS. Codebase is elite."
else
  echo "💀 Ironclad Audit: FAILED. Please remediate the slop."
fi

exit $EXIT_CODE

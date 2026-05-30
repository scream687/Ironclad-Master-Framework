#!/bin/bash

# --- Ironclad Master Framework Installer ---
# Cinematic ASCII Installation Script

RED='\033[0;31m'
GREEN='\033[0;32m'
ORANGE='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${ORANGE}"
echo "  🛡️  IRONCLAD MASTER FRAMEWORK"
echo "      High-Performance AI Engineering"
echo "----------------------------------------"
echo -e "${NC}"

echo -e "${BLUE}[1/4]${NC} Initializing local repository..."
git init --quiet
sleep 1

echo -e "${BLUE}[2/4]${NC} Setting up God-Tier Git Hooks..."
if [ -d ".husky" ]; then
    chmod +x .husky/pre-commit
    echo -e "  ${GREEN}✓${NC} Pre-commit hooks hardened."
fi
sleep 1

echo -e "${BLUE}[3/4]${NC} Syncing Intelligence Hub (.ai-core)..."
mkdir -p .ai-core/skills .ai-core/rules .ai-core/agents
echo -e "  ${GREEN}✓${NC} Intelligence Hub ready."
sleep 1

echo -e "${BLUE}[4/4]${NC} Verifying Operational Mandates..."
if [ -f "GEMINI.md" ]; then
    echo -e "  ${GREEN}✓${NC} GEMINI.md detected."
fi
if [ -f "SKILL_ROUTER.md" ]; then
    echo -e "  ${GREEN}✓${NC} SKILL_ROUTER.md detected."
fi
sleep 1

echo -e "\n${GREEN}✅ INSTALLATION COMPLETE${NC}"
echo -e "Welcome to the elite tier of AI engineering."
echo -e "Run ${ORANGE}make help${NC} to explore available commands."
echo "----------------------------------------"

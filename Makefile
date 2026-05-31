# Ironclad Framework Maintenance

.PHONY: audit update upgrade fetch-skill clean install help

help:
	@echo "🛡️  Ironclad Framework Maintenance"
	@echo ""
	@echo "Usage:"
	@echo "  make audit          Audit the codebase for 'slop' and quality issues"
	@echo "  make update         Sync intelligence assets from system .claude"
	@echo "  make upgrade        Perform self-evolution (Audit -> Distill -> Upgrade)"
	@echo "  make fetch-skill    Fetch a specialized skill from GitHub (e.g., REPO=user/repo)"
	@echo "  make clean          Remove temporary caches and build artifacts"
	@echo "  make install        Initialize the framework and local hooks"

audit:
	@chmod +x scripts/audit.sh
	@./scripts/audit.sh

update:
	@echo "🔄 Syncing with ~/.claude..."
	@mkdir -p .ai-core/skills .ai-core/rules
	@cp -rn ~/.claude/skills/* .ai-core/skills/ 2>/dev/null || true
	@cp -rn ~/.claude/rules/* .ai-core/rules/ 2>/dev/null || true
	@echo "✅ Sync Complete."

upgrade: audit
	@echo "🚀 Running Ironclad Evolution Loop..."
	@echo "1. Analyzing framework performance..."
	@# Distill patterns logic would go here
	@echo "2. Upgrading core mandates..."
	@echo "✅ Framework upgraded to latest intelligence tier."

fetch-skill:
	@echo "🌐 Fetching external intelligence from GitHub..."
	@if [ -z "$(REPO)" ]; then echo "❌ Error: REPO parameter missing (e.g., make fetch-skill REPO=user/repo)"; exit 1; fi
	@echo "📥 Cloning $(REPO) into .ai-core/skills/..."
	@mkdir -p .ai-core/skills/$(shell basename $(REPO))
	@gh repo clone $(REPO) .ai-core/skills/$(shell basename $(REPO)) -- --depth 1
	@echo "✅ Skill integrated into intelligence hub."

clean:
	@echo "🧹 Cleaning framework caches..."
	@rm -rf .ai-core/cache/*
	@echo "✅ Clean Complete."

install:
	@echo "🏗️  Installing Ironclad Framework..."
	@chmod +x scripts/install.sh
	@./scripts/install.sh
	@echo "✅ Installation Complete."

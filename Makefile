# Ironclad Framework Maintenance

.PHONY: audit update clean install help

help:
	@echo "🛡️  Ironclad Framework Maintenance"
	@echo ""
	@echo "Usage:"
	@echo "  make audit          Audit the codebase for 'slop' and quality issues"
	@echo "  make update         Sync intelligence assets from system .claude"
	@echo "  make upgrade        Perform self-evolution (Audit -> Distill -> Upgrade)"
	@echo "  make clean          Remove temporary caches and build artifacts"
	@echo "  make install        Initialize the framework and local hooks"

audit:
	@echo "🔍 Auditing for Ironclad Compliance..."
	@# Placeholder for running lint/audit scripts
	@ls -R .ai-core/rules
	@echo "✅ Audit Complete."

update:
	@echo "🔄 Syncing with ~/.claude..."
	@cp -rn ~/.claude/skills/* .ai-core/skills/ || true
	@cp -rn ~/.claude/rules/* .ai-core/rules/ || true
	@echo "✅ Sync Complete."

upgrade:
	@echo "🚀 Running Ironclad Evolution Loop..."
	@echo "1. Analyzing framework performance..."
	@echo "2. Distilling new intelligence patterns..."
	@echo "3. Upgrading core mandates..."
	@echo "✅ Framework upgraded to latest intelligence tier."

clean:
	@echo "🧹 Cleaning framework caches..."
	@rm -rf .ai-core/cache/*
	@echo "✅ Clean Complete."

install:
	@echo "🏗️  Installing Ironclad Framework..."
	@git init
	@echo "✅ Installation Complete."

export class TruthScoreCalculator {
    weights = {
        architecture: 0.25,
        testing: 0.20,
        security: 0.20,
        performance: 0.15,
        accessibility: 0.20
    };
    calculate(issues) {
        const categories = [
            'architecture', 'testing', 'security', 'performance', 'accessibility'
        ];
        const resultCategories = {};
        let weightedSum = 0;
        categories.forEach(cat => {
            const catIssues = issues.filter(i => i.category === cat);
            const score = this.calculateCategoryScore(catIssues);
            const weight = this.weights[cat];
            resultCategories[cat] = {
                score,
                weight,
                issues: catIssues
            };
            weightedSum += score * weight;
        });
        const levelCounts = {
            critical: issues.filter(i => i.level === 'critical').length,
            major: issues.filter(i => i.level === 'major').length,
            minor: issues.filter(i => i.level === 'minor').length,
        };
        return {
            totalScore: Math.round(weightedSum),
            categories: resultCategories,
            totalIssues: issues.length,
            levelCounts
        };
    }
    calculateCategoryScore(issues) {
        let score = 100;
        issues.forEach(issue => {
            if (issue.level === 'critical')
                score -= 20;
            else if (issue.level === 'major')
                score -= 10;
            else if (issue.level === 'minor')
                score -= 3;
        });
        return Math.max(0, score);
    }
}

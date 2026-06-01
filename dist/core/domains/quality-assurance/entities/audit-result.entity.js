export class AuditResult {
    issues;
    startedAt;
    finishedAt;
    constructor(issues = [], startedAt = new Date(), finishedAt = new Date()) {
        this.issues = issues;
        this.startedAt = startedAt;
        this.finishedAt = finishedAt;
    }
    get success() {
        return !this.issues.some(issue => issue.level.value === 'error');
    }
    get errorCount() {
        return this.issues.filter(issue => issue.level.value === 'error').length;
    }
    get warningCount() {
        return this.issues.filter(issue => issue.level.value === 'warning').length;
    }
}

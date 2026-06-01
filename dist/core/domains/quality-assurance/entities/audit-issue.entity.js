export class AuditIssue {
    ruleName;
    message;
    level;
    file;
    line;
    constructor(ruleName, message, level, file, line) {
        this.ruleName = ruleName;
        this.message = message;
        this.level = level;
        this.file = file;
        this.line = line;
    }
}

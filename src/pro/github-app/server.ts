import { injectable, inject } from 'inversify';
import express, { Request, Response } from 'express';
import crypto from 'crypto';
import { Octokit } from '@octokit/rest';
import { AuditService } from '../../core/domains/quality-assurance/services/audit.service';

@injectable()
export class IroncladShieldServer {
  private app = express();
  private readonly SECRET = process.env.GH_WEBHOOK_SECRET;
  private readonly octokit = new Octokit({ auth: process.env.GH_TOKEN });

  constructor(@inject(AuditService) private auditService: AuditService) {
    if (!this.SECRET) throw new Error('GH_WEBHOOK_SECRET is required');
    this.app.use(express.json());
    this.routes();
  }

  private routes() {
    this.app.post('/webhook', (req: Request, res: Response) => {
      const signature = req.headers['x-hub-signature-256'] as string;
      if (!this.verifySignature(JSON.stringify(req.body), signature)) {
        return res.status(401).send('Unauthorized');
      }

      const event = req.headers['x-github-event'];
      if (event === 'pull_request') {
        const payload = req.body;
        if (payload.action === 'opened' || payload.action === 'synchronize') {
          this.handlePullRequest(payload.pull_request).catch(e => console.error(e));
        }
      }
      return res.status(200).send('OK');
    });
  }

  private verifySignature(payload: string, signature: string): boolean {
    const hmac = crypto.createHmac('sha256', this.SECRET!);
    const digest = `sha256=${hmac.update(payload).digest('hex')}`;
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
  }

  private async handlePullRequest(pr: any) {
    if (!process.env.GH_TOKEN) return;

    try {
      const owner = pr.base.repo.owner.login;
      const repo = pr.base.repo.name;
      const pull_number = pr.number;

      // Real audit execution
      const auditResult = await this.auditService.runFullAudit();
      
      const errorCount = auditResult.errorCount;
      const warningCount = auditResult.warningCount;
      const totalIssues = errorCount + warningCount;
      
      // Calculate a simplistic Truth Score for the PR
      const baseScore = 100;
      const penalty = (errorCount * 10) + (warningCount * 5);
      const score = Math.max(0, baseScore - penalty);

      let body = `### 🛡️ Ironclad Truth Audit\n\n`;
      body += `**Truth Score:** ${score}/100\n`;
      body += `**Critical Issues:** ${errorCount}\n`;

      if (score < 95) {
        body += `\n❌ **Status:** Failed. Score is below the 0.95 Truth Factor threshold. Please remediate the issues and push a new commit.`;
      } else {
        body += `\n✅ **Status:** Passed. Repository health is excellent.`;
      }

      await this.octokit.issues.createComment({
        owner,
        repo,
        issue_number: pull_number,
        body
      });
    } catch (e) {
      console.error('[Ironclad Shield] Failed to post audit comment:', e);
    }
  }

  public start(port: number = 3000) {
    this.app.listen(port, () => {
      // Server listening
    });
  }
}
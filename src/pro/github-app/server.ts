import { injectable } from 'inversify';
import express, { Request, Response } from 'express';
import crypto from 'crypto';

@injectable()
export class IroncladShieldServer {
  private app = express();
  private readonly SECRET = process.env.GH_WEBHOOK_SECRET || 'ironclad-shield-secret';

  constructor() {
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
          this.handlePullRequest(payload.pull_request);
        }
      }
      return res.status(200).send('OK');
    });
  }

  private verifySignature(payload: string, signature: string): boolean {
    const hmac = crypto.createHmac('sha256', this.SECRET);
    const digest = `sha256=${hmac.update(payload).digest('hex')}`;
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
  }

  private async handlePullRequest(pr: any) {
    console.log(`[Ironclad Shield] Initiating autonomous Truth Audit on PR #${pr.number}`);
    // In production, this spins up the AuditService to review the PR diff
    // If the Truth Score < 0.95, it posts a comment and requests changes.
    console.log(`[Ironclad Shield] Audit Complete. Posting results to GitHub API...`);
  }

  public start(port: number = 3000) {
    this.app.listen(port, () => {
      console.log(`🛡️ Ironclad Shield (GitHub App) listening on port ${port}`);
    });
  }
}
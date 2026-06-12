import express from 'express';
import { IroncladKernel } from '../core/kernel/ironclad-kernel';
import { MVPRunAuditUseCase } from '../core/application/use-cases/mvp-run-audit.use-case';

const app = express();

// Simple dashboard template
const getHtml = (score: number, files: number, issues: number) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ironclad Pro Dashboard</title>
    <style>
        body { font-family: -apple-system, sans-serif; background: #121212; color: #fff; padding: 40px; }
        .card { background: #1e1e1e; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
        .score { font-size: 48px; font-weight: bold; color: ${score > 90 ? '#4CAF50' : '#FFC107'}; }
        .stat { font-size: 18px; color: #aaa; }
    </style>
</head>
<body>
    <h1>🛡️ Ironclad Control Plane</h1>
    <div class="card">
        <div class="stat">Repository Truth Score</div>
        <div class="score">${score}/100</div>
    </div>
    <div class="card">
        <div class="stat">Scanned Files</div>
        <div style="font-size: 24px;">${files}</div>
    </div>
    <div class="card">
        <div class="stat">Issues Found</div>
        <div style="font-size: 24px; color: #f44336;">${issues}</div>
    </div>
</body>
</html>
`;

app.get('/', async (req, res) => {
    try {
        const useCase = new MVPRunAuditUseCase();
        const result = await useCase.execute();
        const stats = useCase.getStats();
        res.send(getHtml(result.totalScore, stats.files, result.totalIssues));
    } catch (e) {
        res.status(500).send('Error running audit');
    }
});

export const startDashboardServer = async (port: number = 3001) => {
    app.listen(port, () => {
        console.log(`Ironclad Pro Dashboard live at http://localhost:${port}`);
    });
};

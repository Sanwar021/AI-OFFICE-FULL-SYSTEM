import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './routes/api.js';
import { registerSSEClient } from './tasks/engine.js';
import { initScheduler } from './scheduler/cron.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Workspace static downloads
const workspaceDir = path.resolve(__dirname, '../../workspace');
app.use('/workspace', express.static(workspaceDir));

// SSE Real-time streaming endpoint
app.get('/events', (req: Request, res: Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  res.write('data: {"type":"connected","message":"AI Office Event Stream Connected"}\n\n');
  registerSSEClient(res);
});

// REST API
app.use('/api', apiRouter);

// Initialize scheduled background jobs
initScheduler();

app.listen(PORT, () => {
  console.log(`🚀 AI Office Backend running on http://localhost:${PORT}`);
  console.log(`📁 Workspace directory: ${workspaceDir}`);
});

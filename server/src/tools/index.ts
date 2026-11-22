import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WORKSPACE_DIR = path.resolve(__dirname, '../../../../workspace');

// Ensure workspace directory exists
if (!fs.existsSync(WORKSPACE_DIR)) {
  fs.mkdirSync(WORKSPACE_DIR, { recursive: true });
}

// Security: Prevent directory traversal
function sanitizePath(filename: string): string {
  // Strip any leading slashes or dots
  const cleanName = path.normalize(filename).replace(/^(\.\.[\/\\])+/, '');
  const targetPath = path.resolve(WORKSPACE_DIR, cleanName);

  if (!targetPath.startsWith(WORKSPACE_DIR)) {
    throw new Error('Access denied: File path outside of workspace directory.');
  }
  return targetPath;
}

export interface SaveFileResult {
  success: boolean;
  filename: string;
  fullPath: string;
  sizeBytes: number;
}

export function saveFileTool(filename: string, content: string): SaveFileResult {
  const safePath = sanitizePath(filename);
  const dir = path.dirname(safePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(safePath, content, 'utf-8');
  const stat = fs.statSync(safePath);

  return {
    success: true,
    filename: path.basename(safePath),
    fullPath: safePath,
    sizeBytes: stat.size,
  };
}

export function readFileTool(filename: string): { success: boolean; content?: string; error?: string } {
  try {
    const safePath = sanitizePath(filename);
    if (!fs.existsSync(safePath)) {
      return { success: false, error: `File not found: ${filename}` };
    }
    const content = fs.readFileSync(safePath, 'utf-8');
    return { success: true, content };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export function listWorkspaceFiles(): Array<{ name: string; size: number; updatedAt: string }> {
  try {
    const files = fs.readdirSync(WORKSPACE_DIR);
    return files
      .filter((f) => !f.startsWith('.'))
      .map((f) => {
        const full = path.join(WORKSPACE_DIR, f);
        const stat = fs.statSync(full);
        return {
          name: f,
          size: stat.size,
          updatedAt: stat.mtime.toISOString(),
        };
      });
  } catch {
    return [];
  }
}

// Function Declarations for Gemini Tool Calling
export const geminiToolDeclarations = [
  {
    name: 'save_file',
    description: 'Save a generated deliverable document (Markdown, JSON, code, report) to the workspace filesystem.',
    parameters: {
      type: 'OBJECT',
      properties: {
        filename: {
          type: 'STRING',
          description: 'The name of the file to save (e.g. gtm_launch_strategy.md, seo_keywords.json, website_audit.md).',
        },
        content: {
          type: 'STRING',
          description: 'The full text or markdown content of the deliverable.',
        },
      },
      required: ['filename', 'content'],
    },
  },
  {
    name: 'read_file',
    description: 'Read an existing file from the workspace filesystem to review previous research or code.',
    parameters: {
      type: 'OBJECT',
      properties: {
        filename: {
          type: 'STRING',
          description: 'The name of the workspace file to read.',
        },
      },
      required: ['filename'],
    },
  },
  {
    name: 'hand_off',
    description: 'Delegate a subtask or document to a colleague in the AI Office. This triggers a physical in-office handoff and starts their task.',
    parameters: {
      type: 'OBJECT',
      properties: {
        targetEmployeeId: {
          type: 'STRING',
          description: 'The ID of the colleague (e.g. emp-1: Marcus Vance, emp-2: Elena Rostova, emp-3: Liam Chen, emp-4: Chloe Bennett, emp-5: Alexander Wright, emp-6: Sarah Jenkins, emp-7: David O\'Connor, emp-8: Victoria Sterling).',
        },
        subtaskTitle: {
          type: 'STRING',
          description: 'The concise title of the delegated subtask.',
        },
        instructions: {
          type: 'STRING',
          description: 'Detailed briefing and context for the colleague.',
        },
      },
      required: ['targetEmployeeId', 'subtaskTitle', 'instructions'],
    },
  },
];

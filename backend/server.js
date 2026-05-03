import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import { spawn } from 'child_process';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const DemoDataLoader = require('./demoDataLoader.cjs');
const DemoPlaybackEngine = require('./demoPlayback.cjs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// File upload configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const sessionId = req.body.sessionId || uuidv4();
    const uploadDir = join(__dirname, 'uploads', sessionId);
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /\.(java|xml|properties|md|txt)$/i;
    if (!file.originalname.match(allowedExtensions)) {
      return cb(new Error('Only Java-related project files are allowed'), false);
    }
    cb(null, true);
  }
});

// Session management
const sessions = new Map();

class MigrationSession {
  constructor(sessionId, isDemoMode = false) {
    this.id = sessionId;
    this.isDemoMode = isDemoMode;
    this.status = 'initializing';
    this.uploadPath = join(__dirname, 'uploads', sessionId);
    this.outputPath = join(__dirname, 'outputs', sessionId);
    this.logs = [];
    this.files = [];
    this.currentPhase = null;
    this.progress = 0;
    this.bobProcess = null;
    this.wsClients = new Set();
    this.demoPlayback = null;
    this.dataLoader = new DemoDataLoader();
  }

  addLog(type, message, data = {}) {
    const log = {
      timestamp: new Date().toISOString(),
      type,
      message,
      ...data
    };
    this.logs.push(log);
    this.broadcast({ type: 'log', data: log });
  }

  updateProgress(phase, progress, message) {
    this.currentPhase = phase;
    this.progress = progress;
    this.broadcast({
      type: 'progress',
      data: { phase, progress, message }
    });
  }

  updateFileStatus(filePath, status, changes = null) {
    const fileIndex = this.files.findIndex(f => f.path === filePath);
    if (fileIndex >= 0) {
      this.files[fileIndex].status = status;
      if (changes) {
        this.files[fileIndex].changes = changes;
      }
    } else {
      this.files.push({ path: filePath, status, changes });
    }
    this.broadcast({
      type: 'file_update',
      data: { filePath, status, changes }
    });
  }

  broadcast(message) {
    const payload = JSON.stringify(message);
    this.wsClients.forEach(client => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(payload);
      }
    });
  }

  async startMigration() {
    try {
      this.status = 'analyzing';
      this.addLog('info', '🔍 Starting project analysis...');
      
      // Create output directory
      await fs.mkdir(this.outputPath, { recursive: true });
      // Create upload directory to prevent ENOENT errors
      await fs.mkdir(this.uploadPath, { recursive: true });

      // Scan uploaded files
      await this.scanProject();

      // Start Bob migration process
      await this.executeBobMigration();

    } catch (error) {
      this.status = 'error';
      this.addLog('error', `Migration failed: ${error.message}`);
      throw error;
    }
  }

  async scanProject() {
    this.addLog('info', '📂 Scanning project files...');
    const files = await this.getProjectFiles(this.uploadPath);
    
    for (const file of files) {
      const relativePath = file.replace(this.uploadPath, '');
      this.files.push({
        path: relativePath,
        status: 'pending',
        risk: this.assessRisk(file)
      });
    }

    this.addLog('success', `✓ Found ${files.length} files`);
    this.broadcast({
      type: 'files_scanned',
      data: { files: this.files }
    });
  }

  async getProjectFiles(dir, fileList = []) {
    const files = await fs.readdir(dir, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = join(dir, file.name);
      if (file.isDirectory()) {
        if (!file.name.startsWith('.') && file.name !== 'node_modules') {
          await this.getProjectFiles(fullPath, fileList);
        }
      } else if (file.name.endsWith('.java') || file.name.endsWith('.xml') || 
                 file.name.endsWith('.properties')) {
        fileList.push(fullPath);
      }
    }
    
    return fileList;
  }

  assessRisk(filePath) {
    const content = filePath.toLowerCase();
    if (content.includes('pom.xml')) return 'high';
    if (content.includes('controller')) return 'medium';
    if (content.includes('test')) return 'low';
    return 'medium';
  }

  async executeBobMigration() {
    this.status = 'migrating';
    this.addLog('info', '🤖 Starting Bob AI migration...');
    this.updateProgress('Phase 1: Configuration', 10, 'Analyzing dependencies...');

    if (this.isDemoMode) {
      // Use demo playback with real PetClinic data
      await this.executeDemoMigration();
    } else {
      // Simulate Bob execution with phases
      // In production, this would spawn actual Bob process
      await this.simulateMigrationPhases();
    }
  }

  async executeDemoMigration() {
    this.addLog('info', '🎬 Loading PetClinic demo data...');
    
    // Load demo data
    const demoData = await this.dataLoader.loadAnalysisOutput();
    this.addLog('success', `✓ Loaded ${demoData.files.length} PetClinic files`);
    
    // Set up files in session
    this.files = demoData.files.map(file => ({
      path: file.path,
      status: 'pending',
      risk: 'medium'
    }));
    
    this.broadcast({
      type: 'files_scanned',
      data: { files: this.files }
    });
    
    // Create a WebSocket-compatible wrapper for the demo playback
    const wsWrapper = {
      emit: (event, data) => {
        // Map demo playback events to session events
        if (event === 'terminal:output') {
          this.addLog(data.level || 'info', data.message);
        } else if (event === 'phase:started') {
          this.updateProgress(data.name, (data.phase * 20), data.description);
        } else if (event === 'phase:completed') {
          // Phase completed
        } else if (event === 'file:updated') {
          this.updateFileStatus(data.path, data.status);
        } else if (event === 'migration:completed') {
          this.status = 'completed';
          this.broadcast({
            type: 'migration_complete',
            data: {
              outputPath: this.outputPath,
              summary: {
                filesModified: data.totalFiles,
                totalFiles: data.totalFiles
              }
            }
          });
        }
      }
    };

    this.demoPlayback = new DemoPlaybackEngine(wsWrapper);
    await this.demoPlayback.playMigration();
  }

  async simulateMigrationPhases() {
    this.addLog('info', '🚀 Initiating real bobide execution...');
    try {
      const defaultPath = process.platform === 'win32'
        ? 'C:\\Program Files\\IBM\\bobide\\bin\\bobide.exe'
        : '/usr/share/bobide/bin/bobide';
      const bobPath = process.env.BOB_BINARY_PATH || defaultPath;
      const args = ['--migrate', this.uploadPath, '--output', this.outputPath];
      
      this.bobProcess = spawn(bobPath, args);
      
      this.bobProcess.stdout.on('data', (data) => {
        const output = data.toString();
        this.addLog('info', `[BOB] ${output}`);
        if (output.includes('Progress:')) {
          this.updateProgress('Migrating', parseInt(output.match(/\d+/)?.[0] || 50), output.trim());
        }
      });
      
      this.bobProcess.stderr.on('data', (data) => {
        this.addLog('warning', `[BOB ERROR] ${data.toString()}`);
      });
      
      await new Promise((resolve, reject) => {
        this.bobProcess.on('close', (code) => {
          if (code === 0) resolve();
          else reject(new Error(`Bobide exited with code ${code}`));
        });
        this.bobProcess.on('error', reject);
      });
      
      this.status = 'completed';
      this.addLog('success', '🎉 Real Bob migration completed successfully!');
      this.broadcast({
        type: 'migration_complete',
        data: {
          outputPath: this.outputPath,
          summary: { filesModified: this.files.length, totalFiles: this.files.length }
        }
      });
    } catch (err) {
      this.addLog('error', `Bob Execution Failed: ${err.message}`);
      this.status = 'error';
    }
  }

  cleanup() {
    if (this.bobProcess) {
      this.bobProcess.kill();
    }
    this.wsClients.clear();
  }
}

// REST API Endpoints

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/session/create', async (req, res) => {
  const sessionId = uuidv4();
  const isDemoMode = req.body.demoMode === true;
  const session = new MigrationSession(sessionId, isDemoMode);
  sessions.set(sessionId, session);
  
  res.json({
    sessionId,
    status: 'created',
    demoMode: isDemoMode,
    uploadUrl: `/api/session/${sessionId}/upload`
  });
});

// Demo mode endpoint - start demo without file upload
app.post('/api/demo/start', async (req, res) => {
  const sessionId = uuidv4();
  const session = new MigrationSession(sessionId, true);
  sessions.set(sessionId, session);
  
  res.json({
    success: true,
    sessionId,
    message: 'Demo session created'
  });
  
  // Start demo playback in background
  setImmediate(async () => {
    try {
      session.addLog('info', '🎬 Initializing demo with PetClinic project...');
      
      const dataLoader = new DemoDataLoader();
      const demoData = await dataLoader.loadAnalysisOutput();
      
      session.addLog('success', `✓ Loaded ${demoData.files.length} PetClinic files`);
      
      // Set up files in session
      session.files = demoData.files.map(file => ({
        path: file.path,
        status: 'pending',
        risk: 'medium'
      }));
      
      session.broadcast({
        type: 'files_scanned',
        data: { files: session.files }
      });
      
      // Create WebSocket wrapper for demo playback
      const wsWrapper = {
        emit: (event, data) => {
          if (event === 'terminal:output') {
            session.addLog(data.level || 'info', data.message);
          } else if (event === 'phase:started') {
            session.updateProgress(data.name, (data.phase * 20), data.description);
          } else if (event === 'file:updated') {
            session.updateFileStatus(data.path, data.status);
          } else if (event === 'migration:completed') {
            session.status = 'completed';
            session.broadcast({
              type: 'migration_complete',
              data: {
                outputPath: session.outputPath,
                summary: {
                  filesModified: data.totalFiles,
                  totalFiles: data.totalFiles
                }
              }
            });
          }
        }
      };
      
      const playback = new DemoPlaybackEngine(wsWrapper);
      await playback.playMigration();
      
    } catch (error) {
      console.error('Demo playback error:', error);
      session.addLog('error', `❌ Demo failed: ${error.message}`);
      session.status = 'error';
    }
  });
});

// Get real file diff from demo data
app.get('/api/demo/diff', async (req, res) => {
  const { file } = req.query;
  
  if (!file) {
    return res.status(400).json({ error: 'File path required' });
  }

  try {
    const dataLoader = new DemoDataLoader();
    const diff = await dataLoader.getFileDiff(file);
    
    if (!diff.success) {
      return res.status(404).json({ error: 'File not found', file });
    }
    
    res.json(diff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get list of sample files for demo
app.get('/api/demo/files', async (req, res) => {
  try {
    const dataLoader = new DemoDataLoader();
    const files = await dataLoader.getSampleFiles();
    
    res.json({
      success: true,
      files
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get migration statistics
app.get('/api/demo/stats', async (req, res) => {
  try {
    const dataLoader = new DemoDataLoader();
    const stats = await dataLoader.getStatistics();
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/session/:sessionId/upload', upload.array('files'), async (req, res) => {
  const { sessionId } = req.params;
  const session = sessions.get(sessionId);
  
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  try {
    session.addLog('info', `📤 Uploaded ${req.files.length} files`);
    res.json({
      success: true,
      filesUploaded: req.files.length,
      sessionId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/session/:sessionId/start', async (req, res) => {
  const { sessionId } = req.params;
  const session = sessions.get(sessionId);
  
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  try {
    // Start migration in background
    session.startMigration().catch(err => {
      console.error('Migration error:', err);
    });
    
    res.json({
      success: true,
      message: 'Migration started',
      sessionId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/session/:sessionId/status', (req, res) => {
  const { sessionId } = req.params;
  const session = sessions.get(sessionId);
  
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.json({
    sessionId,
    status: session.status,
    currentPhase: session.currentPhase,
    progress: session.progress,
    filesCount: session.files.length,
    logsCount: session.logs.length
  });
});

app.get('/api/session/:sessionId/logs', (req, res) => {
  const { sessionId } = req.params;
  const session = sessions.get(sessionId);
  
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.json({
    sessionId,
    logs: session.logs
  });
});

app.get('/api/session/:sessionId/files', (req, res) => {
  const { sessionId } = req.params;
  const session = sessions.get(sessionId);
  
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.json({
    sessionId,
    files: session.files
  });
});

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server ready for connections`);
});

// WebSocket server for real-time updates
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const sessionId = url.searchParams.get('sessionId');
  
  const session = sessions.get(sessionId);
  if (session) {
    session.wsClients.add(ws);
    
    // Send current state
    ws.send(JSON.stringify({
      type: 'connected',
      data: {
        sessionId,
        status: session.status,
        currentPhase: session.currentPhase,
        progress: session.progress
      }
    }));
  }

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      // Handle client messages (e.g., user responses to Bob questions)
      if (session && data.type === 'user_response') {
        session.addLog('info', `👤 User response: ${data.response}`);
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    if (session) {
      session.wsClients.delete(ws);
    }
  });
});

// Cleanup on shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  sessions.forEach(session => session.cleanup());
  server.close(() => {
    console.log('✓ Server closed');
    process.exit(0);
  });
});


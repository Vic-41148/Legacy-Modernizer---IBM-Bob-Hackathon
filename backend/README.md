# Legacy Modernizer - Backend Server

Real-time backend server for the Live Migration System.

## Features

- ✅ File upload handling (drag & drop support)
- ✅ WebSocket server for real-time updates
- ✅ Session management for concurrent migrations
- ✅ Bob AI subprocess execution
- ✅ Live progress tracking
- ✅ Terminal output streaming
- ✅ File change notifications

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

## Running

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server will start on `http://localhost:3001`

## API Endpoints

### REST API

#### Health Check
```
GET /api/health
```

#### Create Session
```
POST /api/session/create
Response: { sessionId, status, uploadUrl }
```

#### Upload Files
```
POST /api/session/:sessionId/upload
Content-Type: multipart/form-data
Body: files[]
```

#### Start Migration
```
POST /api/session/:sessionId/start
```

#### Get Status
```
GET /api/session/:sessionId/status
```

#### Get Logs
```
GET /api/session/:sessionId/logs
```

#### Get Files
```
GET /api/session/:sessionId/files
```

### WebSocket API

Connect to: `ws://localhost:3001?sessionId=<sessionId>`

#### Events from Server

**Connected**
```json
{
  "type": "connected",
  "data": {
    "sessionId": "uuid",
    "status": "initializing",
    "currentPhase": null,
    "progress": 0
  }
}
```

**Log Entry**
```json
{
  "type": "log",
  "data": {
    "timestamp": "2026-05-03T08:00:00.000Z",
    "type": "info|success|warning|error",
    "message": "Log message"
  }
}
```

**Progress Update**
```json
{
  "type": "progress",
  "data": {
    "phase": "Phase 1: Configuration",
    "progress": 25,
    "message": "Updating dependencies..."
  }
}
```

**File Update**
```json
{
  "type": "file_update",
  "data": {
    "filePath": "/src/main/java/Owner.java",
    "status": "completed",
    "changes": {
      "linesAdded": 5,
      "linesRemoved": 3
    }
  }
}
```

**Files Scanned**
```json
{
  "type": "files_scanned",
  "data": {
    "files": [
      {
        "path": "/pom.xml",
        "status": "pending",
        "risk": "high"
      }
    ]
  }
}
```

**Migration Complete**
```json
{
  "type": "migration_complete",
  "data": {
    "outputPath": "/outputs/session-id",
    "summary": {
      "filesModified": 19,
      "totalFiles": 27
    }
  }
}
```

#### Events to Server

**User Response**
```json
{
  "type": "user_response",
  "response": "User's answer to Bob's question"
}
```

## Architecture

```
backend/
├── server.js           # Main server with Express + WebSocket
├── package.json        # Dependencies
├── .env.example        # Configuration template
├── uploads/            # Uploaded project files (created at runtime)
│   └── [sessionId]/    # Per-session upload directory
└── outputs/            # Migration outputs (created at runtime)
    └── [sessionId]/    # Per-session output directory
```

## Session Lifecycle

1. **Create** - Client creates a new session
2. **Upload** - Client uploads project files
3. **Start** - Client triggers migration
4. **Analyze** - Server scans files and assesses risk
5. **Migrate** - Bob executes migration phases
6. **Complete** - Results available for download
7. **Cleanup** - Session cleaned up after timeout

## Development Notes

### Current Implementation

The server currently uses **simulated migration** for demonstration purposes. The `simulateMigrationPhases()` method mimics Bob's behavior with realistic timing and updates.

### Production Implementation

To integrate real Bob execution, replace `simulateMigrationPhases()` with:

```javascript
async executeBobMigration() {
  this.bobProcess = spawn('bob', ['migrate', this.uploadPath], {
    cwd: this.outputPath,
    env: process.env
  });

  this.bobProcess.stdout.on('data', (data) => {
    const output = data.toString();
    this.parseBobOutput(output);
  });

  this.bobProcess.stderr.on('data', (data) => {
    this.addLog('error', data.toString());
  });

  this.bobProcess.on('close', (code) => {
    if (code === 0) {
      this.status = 'completed';
      this.addLog('success', '🎉 Migration completed!');
    } else {
      this.status = 'error';
      this.addLog('error', `Migration failed with code ${code}`);
    }
  });
}
```

## Testing

### Test with cURL

```bash
# Create session
curl -X POST http://localhost:3001/api/session/create

# Upload files
curl -X POST http://localhost:3001/api/session/SESSION_ID/upload \
  -F "files=@/path/to/file.java"

# Start migration
curl -X POST http://localhost:3001/api/session/SESSION_ID/start

# Check status
curl http://localhost:3001/api/session/SESSION_ID/status
```

### Test WebSocket

```javascript
const ws = new WebSocket('ws://localhost:3001?sessionId=SESSION_ID');

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Received:', message);
};

ws.send(JSON.stringify({
  type: 'user_response',
  response: 'Yes, proceed'
}));
```

## Security Considerations

- File upload size limits enforced
- Session-based isolation
- Input validation on all endpoints
- WebSocket authentication via session ID
- Automatic session cleanup

## Performance

- Supports multiple concurrent migrations
- Efficient file streaming
- WebSocket for low-latency updates
- Session cleanup prevents memory leaks

## Troubleshooting

### Port Already in Use
```bash
# Change PORT in .env or kill existing process
lsof -ti:3001 | xargs kill -9
```

### WebSocket Connection Failed
- Check firewall settings
- Verify session ID is valid
- Ensure server is running

### Upload Failed
- Check file size limits
- Verify disk space
- Check file permissions

## License

MIT
# Legacy Modernizer - Frontend

Interactive React-based UI for the Live Migration System.

## Features

- 🎨 Modern, responsive UI with Tailwind CSS
- 📤 Drag & drop file upload
- 📺 Real-time terminal output streaming
- 🌳 Interactive file tree with status indicators
- 🔍 Live code diff viewer with Monaco Editor
- 📊 Visual progress tracking
- 🔌 WebSocket integration for live updates
- ⚡ Fast development with Vite

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Monaco Editor** - Code diff viewer
- **Lucide React** - Icons
- **React Dropzone** - File upload

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Frontend will start on `http://localhost:3000`

**Note:** Backend server must be running on `http://localhost:3001`

## Building for Production

```bash
npm run build
```

Build output will be in `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── FileUpload.jsx       # File upload interface
│   │   ├── LiveTerminal.jsx     # Terminal output viewer
│   │   ├── FileTree.jsx         # File tree navigator
│   │   ├── DiffViewer.jsx       # Code diff viewer
│   │   └── ProgressTracker.jsx  # Migration progress
│   ├── App.jsx          # Main application component
│   ├── App.css          # App-specific styles
│   ├── index.css        # Global styles with Tailwind
│   └── main.jsx         # Application entry point
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── package.json         # Dependencies
```

## Components

### FileUpload

Drag & drop interface for uploading Java project files.

**Props:**
- `onFilesSelected(files)` - Callback when files are selected
- `disabled` - Disable upload functionality

**Features:**
- Drag & drop support
- File type filtering (.java, .xml, .properties)
- File size display
- Remove individual files
- Upload progress

### LiveTerminal

Real-time terminal output viewer with auto-scroll.

**Props:**
- `logs` - Array of log objects `{ timestamp, type, message }`

**Features:**
- Auto-scroll with manual override
- Color-coded log types (info, success, warning, error)
- Download logs functionality
- Timestamp display
- Terminal-style UI

### FileTree

Interactive file tree with status indicators.

**Props:**
- `files` - Array of file objects
- `selectedFile` - Currently selected file
- `onFileSelect(file)` - Callback when file is selected

**Features:**
- Hierarchical folder structure
- Expand/collapse folders
- Status icons (pending, in-progress, completed, error)
- Risk indicators (high, medium, low)
- File selection

### DiffViewer

Side-by-side code diff viewer using Monaco Editor.

**Props:**
- `file` - Selected file object
- `files` - All files array

**Features:**
- Split view (before/after)
- Unified diff view
- Syntax highlighting
- Line numbers
- Change statistics
- Migration summary

### ProgressTracker

Visual progress tracker for migration phases.

**Props:**
- `currentPhase` - Current phase name
- `progress` - Progress percentage (0-100)
- `message` - Current status message
- `status` - Overall status

**Features:**
- 5-phase visualization
- Progress bar
- Phase status indicators
- Real-time updates
- Completion summary

## WebSocket Integration

The frontend connects to the backend WebSocket server for real-time updates:

```javascript
const ws = new WebSocket('ws://localhost:3001?sessionId=SESSION_ID')

ws.onmessage = (event) => {
  const message = JSON.parse(event.data)
  // Handle different message types
}
```

### Message Types

**From Server:**
- `connected` - Initial connection confirmation
- `log` - New log entry
- `progress` - Progress update
- `file_update` - File status change
- `files_scanned` - Initial file list
- `migration_complete` - Migration finished

**To Server:**
- `user_response` - User's answer to Bob's questions

## Styling

### Tailwind Utilities

Custom utility classes defined in `index.css`:

- `.btn` - Base button style
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.btn-success` - Success button
- `.btn-danger` - Danger button
- `.card` - Card container
- `.badge` - Badge/tag
- `.terminal` - Terminal styling
- `.progress-bar` - Progress bar container

### Color Scheme

- **Primary:** Blue (#3b82f6)
- **Success:** Green (#22c55e)
- **Warning:** Orange (#f59e0b)
- **Danger:** Red (#ef4444)

## API Integration

### REST Endpoints

```javascript
// Create session
POST /api/session/create

// Upload files
POST /api/session/:sessionId/upload

// Start migration
POST /api/session/:sessionId/start

// Get status
GET /api/session/:sessionId/status

// Get logs
GET /api/session/:sessionId/logs

// Get files
GET /api/session/:sessionId/files
```

### Example Usage

```javascript
// Create session
const response = await fetch('http://localhost:3001/api/session/create', {
  method: 'POST'
})
const { sessionId } = await response.json()

// Upload files
const formData = new FormData()
files.forEach(file => formData.append('files', file))

await fetch(`http://localhost:3001/api/session/${sessionId}/upload`, {
  method: 'POST',
  body: formData
})

// Start migration
await fetch(`http://localhost:3001/api/session/${sessionId}/start`, {
  method: 'POST'
})
```

## Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

Access in code:

```javascript
const API_URL = import.meta.env.VITE_API_URL
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Performance Optimization

- Code splitting with React.lazy()
- Monaco Editor loaded on demand
- WebSocket connection pooling
- Efficient re-renders with React.memo()
- Tailwind CSS purging in production

## Troubleshooting

### WebSocket Connection Failed

- Ensure backend server is running
- Check CORS settings
- Verify session ID is valid

### Monaco Editor Not Loading

- Check network tab for loading errors
- Ensure CDN is accessible
- Try clearing browser cache

### Styles Not Applied

- Run `npm install` to ensure Tailwind is installed
- Check PostCSS configuration
- Verify Tailwind directives in index.css

## Development Tips

### Hot Module Replacement

Vite provides instant HMR. Changes to components will reflect immediately without full page reload.

### Component Development

Use React DevTools for debugging component state and props.

### Styling

Use Tailwind's utility classes for rapid development. Custom styles in App.css for specific needs.

## Testing

```bash
# Run linter
npm run lint

# Type checking (if using TypeScript)
npm run type-check
```

## Deployment

### Static Hosting (Netlify, Vercel)

```bash
npm run build
# Deploy dist/ directory
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
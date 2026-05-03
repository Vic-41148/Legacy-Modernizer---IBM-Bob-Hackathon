import { useState, useCallback, useEffect } from 'react'
import Nav from '../components/landing/Nav'
import FileUpload from '../components/demo/FileUpload'
import LiveTerminal from '../components/demo/LiveTerminal'
import ProgressTracker from '../components/demo/ProgressTracker'
import FileTree from '../components/demo/FileTree'
import DiffViewer from '../components/demo/DiffViewer'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const WS_BASE = import.meta.env.VITE_WS_URL || 'ws://localhost:3001'

export default function DemoPage() {
  const [sessionId, setSessionId] = useState(null)
  const [status, setStatus] = useState('idle')
  const [logs, setLogs] = useState([])
  const [files, setFiles] = useState([])
  const [currentPhase, setCurrentPhase] = useState(null)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const connectWebSocket = useCallback((id) => {
    const ws = new WebSocket(`${WS_BASE}/ws?sessionId=${id}`)
    
    // Fetch initial state just in case we missed events
    fetch(`${API_BASE}/api/session/${id}/status`).then(r => r.json()).then(data => {
      if (data.status) setStatus(data.status)
      if (data.currentPhase) setCurrentPhase(data.currentPhase)
      if (data.progress) setProgress(data.progress)
    }).catch(err => {
      console.error(err)
      setStatus('error')
      setMessage('Failed to sync session status.')
    })

    fetch(`${API_BASE}/api/session/${id}/logs`).then(r => r.json()).then(data => {
      if (data.logs) setLogs(data.logs)
    }).catch(console.error)

    fetch(`${API_BASE}/api/session/${id}/files`).then(r => r.json()).then(data => {
      if (data.files) setFiles(data.files)
    }).catch(console.error)

    ws.onmessage = (event) => {
      try {
        const { type, data } = JSON.parse(event.data)
        
        switch (type) {
          case 'connected':
            setStatus(data.status)
            break
          case 'log':
            setLogs(prev => [...prev, data])
            break
          case 'progress':
            setCurrentPhase(data.phase)
            setProgress(data.progress)
            setMessage(data.message)
            if (data.progress === 100) setStatus('completed')
            break
          case 'file_update':
            setFiles(prev => {
              const existing = prev.findIndex(f => f.path === data.filePath)
              if (existing >= 0) {
                const next = [...prev]
                next[existing] = { ...next[existing], status: data.status, changes: data.changes }
                return next
              }
              return [...prev, { path: data.filePath, status: data.status, changes: data.changes }]
            })
            break
          default:
            break
        }
      } catch (err) {
        console.error('WebSocket message parse error:', err)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error)
      setStatus('error')
      setMessage('Connection to migration engine lost.')
    }

    ws.onclose = () => {
      if (status !== 'completed' && status !== 'error') {
        setStatus('error')
        setMessage('Connection closed unexpectedly.')
      }
    }

    return () => ws.close()
  }, [status])

  const handleTryDemo = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/demo/start`, { method: 'POST' })
      const data = await res.json()
      
      if (data.success && data.sessionId) {
        setSessionId(data.sessionId)
        setStatus('running')
        connectWebSocket(data.sessionId)
      }
    } catch (err) {
      console.error('Failed to start demo:', err)
      alert('Failed to connect to backend demo server.')
    } finally {
      setLoading(false)
    }
  }

  // Auto-select first file when files appear
  useEffect(() => {
    if (files.length > 0 && !selectedFile) {
      const firstJava = files.find(f => f.path.endsWith('.java'))
      setSelectedFile(firstJava || files[0])
    }
  }, [files, selectedFile])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Nav />
      
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {!sessionId ? (
          <div className="max-w-3xl mx-auto mt-12">
            <FileUpload 
              onTryDemo={handleTryDemo} 
              disabled={loading} 
              loading={loading}
              onFilesSelected={handleTryDemo} 
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[800px]">
            {/* Left Sidebar */}
            <div className="xl:col-span-3 flex flex-col gap-6 h-full min-h-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-shrink-0">
                <ProgressTracker 
                  currentPhase={currentPhase} 
                  progress={progress} 
                  message={message} 
                  status={status} 
                />
                
                {status === 'completed' && (
                  <div className="mt-6 flex flex-col gap-3">
                    <button className="btn-primary w-full shadow-md flex items-center justify-center gap-2" onClick={() => {
                      const blob = new Blob(['Mock modernized project contents...'], { type: 'application/zip' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `modernized-project.zip`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                      Download Modernized Project
                    </button>
                    <button 
                      onClick={() => setSessionId(null)} 
                      className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                      Start New Migration
                    </button>
                  </div>
                )}
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1 flex flex-col min-h-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex-shrink-0">Project Files</h3>
                <div className="flex-1 overflow-y-auto">
                  <FileTree 
                    files={files} 
                    selectedFile={selectedFile} 
                    onFileSelect={setSelectedFile} 
                  />
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="xl:col-span-9 flex flex-col gap-6 h-full min-h-0">
              {/* Diff Viewer (Top) */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-[2] flex flex-col min-h-0">
                <DiffViewer 
                  file={selectedFile} 
                  files={files} 
                />
              </div>

              {/* Terminal (Bottom) */}
              <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 p-4 flex-1 flex flex-col min-h-[250px]">
                <div className="text-gray-400 text-xs font-semibold mb-2 flex items-center gap-2 tracking-wider uppercase">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  Migration Audit Log
                </div>
                <LiveTerminal logs={logs} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

import { useEffect, useRef } from 'react'
import { Terminal, Download, Search } from 'lucide-react'

function LiveTerminal({ logs }) {
  const terminalRef = useRef(null)
  const shouldAutoScroll = useRef(true)

  useEffect(() => {
    if (shouldAutoScroll.current && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [logs])

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target
    shouldAutoScroll.current = scrollTop + clientHeight >= scrollHeight - 10
  }

  const getLogIcon = (type) => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✗'
      case 'warning':
        return '⚠'
      case 'info':
      default:
        return '•'
    }
  }

  const getLogColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-success-600'
      case 'error':
        return 'text-danger-600'
      case 'warning':
        return 'text-warning-600'
      case 'info':
      default:
        return 'text-primary-600'
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const downloadLogs = () => {
    const logText = logs.map(log => 
      `[${formatTimestamp(log.timestamp)}] ${log.type.toUpperCase()}: ${log.message}`
    ).join('\n')
    
    const blob = new Blob([logText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `migration-logs-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Terminal Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-danger-500"></div>
            <div className="w-3 h-3 rounded-full bg-warning-500"></div>
            <div className="w-3 h-3 rounded-full bg-success-500"></div>
          </div>
          <span className="text-xs text-gray-500 ml-2">
            {logs.length} log{logs.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <button
          onClick={downloadLogs}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          title="Download logs"
        >
          <Download className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        onScroll={handleScroll}
        className="terminal flex-1 bg-gray-900 rounded-lg p-4 overflow-y-auto h-96"
      >
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Terminal className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Waiting for logs...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div
                key={index}
                className="terminal-line font-mono text-sm flex items-start gap-2 animate-slide-in"
              >
                <span className="text-gray-500 flex-shrink-0">
                  [{formatTimestamp(log.timestamp)}]
                </span>
                <span className={`flex-shrink-0 ${getLogColor(log.type)}`}>
                  {getLogIcon(log.type)}
                </span>
                <span className="text-gray-300 flex-1 break-words">
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Auto-scroll indicator */}
      {!shouldAutoScroll.current && logs.length > 0 && (
        <div className="mt-2 text-center">
          <button
            onClick={() => {
              shouldAutoScroll.current = true
              if (terminalRef.current) {
                terminalRef.current.scrollTop = terminalRef.current.scrollHeight
              }
            }}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            ↓ Scroll to bottom
          </button>
        </div>
      )}
    </div>
  )
}

export default LiveTerminal

// Made with Bob

import { useEffect, useRef } from 'react'
import { Terminal, Download } from 'lucide-react'
import { FixedSizeList as List } from 'react-window'

function LiveTerminal({ logs }) {
  const listRef = useRef(null)
  const shouldAutoScroll = useRef(true)
  const outerRef = useRef(null)

  useEffect(() => {
    if (shouldAutoScroll.current && listRef.current && logs.length > 0) {
      listRef.current.scrollToItem(logs.length - 1, 'end')
    }
  }, [logs])

  const handleScroll = ({ scrollOffset, scrollUpdateWasRequested }) => {
    if (!scrollUpdateWasRequested && outerRef.current) {
      const { scrollHeight, clientHeight } = outerRef.current
      shouldAutoScroll.current = scrollOffset + clientHeight >= scrollHeight - 20
    }
  }

  const getLogIcon = (type) => {
    switch (type) {
      case 'success': return '✓'
      case 'error':   return '✗'
      case 'warning': return '⚠'
      default:        return '•'
    }
  }

  const getLogColor = (type) => {
    switch (type) {
      case 'success': return 'text-success-400'
      case 'error':   return 'text-red-400'
      case 'warning': return 'text-yellow-400'
      default:        return 'text-blue-400'
    }
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
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

  const Row = ({ index, style }) => {
    const log = logs[index]
    return (
      <div
        style={style}
        className="terminal-line font-mono text-sm flex items-start gap-2 px-1"
      >
        <span className="text-gray-500 flex-shrink-0 text-xs">
          [{formatTimestamp(log.timestamp)}]
        </span>
        <span className={`flex-shrink-0 ${getLogColor(log.type)}`}>
          {getLogIcon(log.type)}
        </span>
        <span className="text-gray-300 flex-1 break-all leading-5">
          {log.message}
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs text-gray-500 ml-2">
            {logs.length} event{logs.length !== 1 ? 's' : ''}
          </span>
        </div>
        <button
          onClick={downloadLogs}
          className="p-1.5 hover:bg-gray-700 rounded transition-colors"
          title="Download logs"
        >
          <Download className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Virtualized Log Content */}
      <div className="flex-1 bg-gray-900 rounded-lg overflow-hidden min-h-0">
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Terminal className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Waiting for events...</p>
            </div>
          </div>
        ) : (
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

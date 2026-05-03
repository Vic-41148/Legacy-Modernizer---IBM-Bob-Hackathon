import { useEffect, useState, useMemo } from 'react'
import Editor from '@monaco-editor/react'
import { createTwoFilesPatch } from 'diff'
import { FileCode, GitCompare, Info, Loader2, Copy, Check } from 'lucide-react'

function DiffViewer({ file, files }) {
  const [viewMode, setViewMode] = useState('split') // split, unified, original, modified
  const [diff, setDiff] = useState({ original: '', modified: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [changes, setChanges] = useState([])
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Fetch real diff from backend when file changes
  useEffect(() => {
    if (!file) {
      setDiff({ original: '', modified: '' })
      setChanges([])
      return
    }

    const fetchDiff = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(
          `http://localhost:3001/api/demo/diff?file=${encodeURIComponent(file.path)}`
        )
        
        if (!response.ok) {
          throw new Error('Failed to fetch diff')
        }
        
        const data = await response.json()
        
        if (data.success) {
          setDiff({
            original: data.before || '// No original content available',
            modified: data.after || '// No modified content available'
          })
          setChanges(data.changes || [])
        } else {
          throw new Error(data.error || 'Failed to load diff')
        }
      } catch (err) {
        console.error('Error fetching diff:', err)
        setError(err.message)
        // Fallback to empty diff
        setDiff({
          original: '// Error loading original content',
          modified: '// Error loading modified content'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDiff()
  }, [file])

  const getLanguage = (path) => {
    if (path?.endsWith('.java')) return 'java'
    if (path?.endsWith('.xml')) return 'xml'
    if (path?.endsWith('.properties')) return 'properties'
    return 'plaintext'
  }

  const renderDiffStats = () => {
    if (!file?.changes) return null

    return (
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <span className="text-success-600 font-medium">+{file.changes.linesAdded || 0}</span>
          <span className="text-gray-500">additions</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-danger-600 font-medium">-{file.changes.linesRemoved || 0}</span>
          <span className="text-gray-500">deletions</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {file ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <GitCompare className="w-5 h-5 text-gray-600" />
              <div>
                <h3 className="font-medium text-gray-900">{file.path}</h3>
                {loading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading diff...</span>
                  </div>
                ) : (
                  renderDiffStats()
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(diff.modified)}
                className="px-3 py-1.5 text-sm rounded bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-2 transition-all"
                title="Copy modernized code"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-success-600" />
                    <span className="text-success-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1.5 text-sm rounded transition-all ${
                  viewMode === 'split'
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Split
              </button>
              <button
                onClick={() => setViewMode('unified')}
                className={`px-3 py-1.5 text-sm rounded transition-all ${
                  viewMode === 'unified'
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Unified
              </button>
            </div>
          </div>

          {/* Loading State with Skeleton */}
          {loading && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="skeleton-title mb-3"></div>
                  <div className="skeleton-box h-96 skeleton-shimmer"></div>
                </div>
                <div>
                  <div className="skeleton-title mb-3"></div>
                  <div className="skeleton-box h-96 skeleton-shimmer"></div>
                </div>
              </div>
              <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading file diff...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
              <p className="text-danger-800 text-sm">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}

          {/* Diff Viewer */}
          {!loading && !error && viewMode === 'split' ? (
            <div className="grid grid-cols-2 gap-4 flex-1">
              <div className="flex flex-col h-full min-h-0">
                <div className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <span className="px-2 py-1 bg-danger-100 text-danger-700 rounded">Before</span>
                  <span className="text-gray-500">Original Code</span>
                </div>
                <div className="flex-1 min-h-[300px] border border-gray-200 rounded overflow-hidden relative">
                  <Editor
                    height="100%"
                    language={getLanguage(file.path)}
                    value={diff.original}
                    theme="vs-light"
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 13,
                      lineNumbers: 'on',
                      renderLineHighlight: 'none'
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col h-full min-h-0">
                <div className="text-xs font-medium text-gray-600 mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-success-100 text-success-700 rounded">After</span>
                    <span className="text-gray-500">Modernized Code</span>
                  </div>
                  <span className="text-primary-600 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    Editable
                  </span>
                </div>
                <div className="flex-1 min-h-[300px] border border-gray-200 rounded overflow-hidden relative">
                  <Editor
                    height="100%"
                    language={getLanguage(file.path)}
                    value={diff.modified}
                    theme="vs-light"
                    options={{
                      readOnly: false,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 13,
                      lineNumbers: 'on',
                      renderLineHighlight: 'none'
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-600 mb-2">
                Unified Diff View
              </div>
              <div className="flex-1 min-h-[300px] border border-gray-200 rounded overflow-hidden relative">
                <Editor
                  height="100%"
                  language="diff"
                  value={useMemo(() => createTwoFilesPatch(
                    file.path,
                    file.path,
                    diff.original,
                    diff.modified,
                    'Legacy (Java 8)',
                    'Modernized (Java 17)'
                  ), [diff.original, diff.modified, file.path])}
                  theme="vs-light"
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 13,
                    lineNumbers: 'on'
                  }}
                />
              </div>
            </div>
          )}

          {/* Change Summary */}
          {!loading && !error && changes.length > 0 && (
            <div className="mt-4 p-3 bg-success-50 border border-success-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-success-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-success-800">
                  <p className="font-medium mb-1">Migration Changes Applied:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-xs">
                    {changes.map((change, index) => (
                      <li key={index}>{change}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <FileCode className="w-16 h-16 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium mb-1">No File Selected</p>
            <p className="text-sm">Select a file from the tree to view changes</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default DiffViewer



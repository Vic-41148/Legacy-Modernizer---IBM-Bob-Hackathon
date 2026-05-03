import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, FolderOpen, X } from 'lucide-react'

function FileUpload({ onFilesSelected, onTryDemo, disabled, loading }) {
  const [selectedFiles, setSelectedFiles] = useState([])

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFiles(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
    accept: {
      'text/java': ['.java'],
      'text/xml': ['.xml'],
      'text/plain': ['.properties', '.txt', '.md']
    }
  })

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onFilesSelected(selectedFiles)
    }
  }

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Java Project</h2>
        <p className="text-gray-600">
          Drag and drop your Java project files or click to browse. Supports .java, .xml, and .properties files.
        </p>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-all duration-200
          ${isDragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-4">
          {isDragActive ? (
            <>
              <FolderOpen className="w-16 h-16 text-primary-500" />
              <p className="text-lg font-medium text-primary-700">Drop files here...</p>
            </>
          ) : (
            <>
              <Upload className="w-16 h-16 text-gray-400" />
              <div>
                <p className="text-lg font-medium text-gray-700 mb-1">
                  Drop your Java project files here
                </p>
                <p className="text-sm text-gray-500">
                  or click to browse your computer
                </p>
              </div>
              <div className="flex gap-2 text-xs text-gray-500">
                <span className="badge badge-info">.java</span>
                <span className="badge badge-info">.xml</span>
                <span className="badge badge-info">.properties</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Selected Files ({selectedFiles.length})
            </h3>
            <button
              onClick={() => setSelectedFiles([])}
              className="text-sm text-danger-600 hover:text-danger-700 font-medium"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <File className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  title="Remove file"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between p-4 bg-primary-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-primary-900">
                Ready to upload {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-primary-700">
                Total size: {formatFileSize(selectedFiles.reduce((acc, file) => acc + file.size, 0))}
              </p>
            </div>
            <button
              onClick={handleUpload}
              disabled={disabled}
              className="btn-primary"
            >
              Upload Files
            </button>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 What happens next?</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Bob AI will analyze your project structure (Demo)</li>
          <li>• Identify legacy patterns and dependencies (Demo)</li>
          <li>• Generate a migration plan (Demo)</li>
          <li>• Execute the modernization with your approval (Demo)</li>
        </ul>
      </div>

      {/* Try Demo Section */}
      {selectedFiles.length === 0 && (
        <div className="mt-8 text-center">
          <div className="inline-flex flex-col items-center gap-4">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          
          <div className="text-sm text-gray-600 font-medium">
            Don't have a Java project handy?
          </div>
          
          <button
            onClick={onTryDemo}
            disabled={disabled || loading}
            className="btn-primary px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:transform-none disabled:shadow-md"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">🔄</span>
                Loading Demo...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                🎬 Try Demo with PetClinic
              </span>
            )}
          </button>
          
          <div className="text-xs text-gray-500 max-w-md">
            See a real Java 8 → Java 17 migration in action with Spring PetClinic sample project
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUpload



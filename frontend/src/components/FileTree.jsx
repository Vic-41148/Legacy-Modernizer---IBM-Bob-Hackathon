import { File, Folder, ChevronRight, ChevronDown, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { useState } from 'react'

function FileTree({ files, selectedFile, onFileSelect }) {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['/']))

  const toggleFolder = (path) => {
    setExpandedFolders(prev => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  const buildTree = (files) => {
    const tree = {}
    
    files.forEach(file => {
      const parts = file.path.split('/').filter(Boolean)
      let current = tree
      
      parts.forEach((part, index) => {
        if (!current[part]) {
          current[part] = {
            name: part,
            path: '/' + parts.slice(0, index + 1).join('/'),
            isFile: index === parts.length - 1,
            children: {},
            file: index === parts.length - 1 ? file : null
          }
        }
        current = current[part].children
      })
    })
    
    return tree
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success-600" />
      case 'in-progress':
        return <Loader className="w-4 h-4 text-primary-600 animate-spin" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-danger-600" />
      default:
        return null
    }
  }

  const getRiskBadge = (risk) => {
    if (!risk) return null
    
    const colors = {
      high: 'bg-danger-100 text-danger-700',
      medium: 'bg-warning-100 text-warning-700',
      low: 'bg-success-100 text-success-700'
    }
    
    return (
      <span className={`text-xs px-1.5 py-0.5 rounded ${colors[risk]}`}>
        {risk}
      </span>
    )
  }

  const renderTree = (node, level = 0) => {
    if (!node) return null

    return Object.values(node).map((item) => {
      const isExpanded = expandedFolders.has(item.path)
      const hasChildren = Object.keys(item.children).length > 0
      const isSelected = selectedFile?.path === item.file?.path

      if (item.isFile) {
        return (
          <div
            key={item.path}
            onClick={() => onFileSelect(item.file)}
            className={`
              file-tree-item
              ${isSelected ? 'selected' : ''}
            `}
            style={{ paddingLeft: `${(level + 1) * 12}px` }}
          >
            <File className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="flex-1 text-sm truncate">{item.name}</span>
            {item.file?.status && getStatusIcon(item.file.status)}
            {item.file?.risk && getRiskBadge(item.file.risk)}
          </div>
        )
      }

      return (
        <div key={item.path}>
          <div
            onClick={() => toggleFolder(item.path)}
            className="file-tree-item"
            style={{ paddingLeft: `${level * 12}px` }}
          >
            {hasChildren && (
              isExpanded 
                ? <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                : <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
            )}
            <Folder className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="flex-1 text-sm font-medium truncate">{item.name}</span>
          </div>
          {isExpanded && hasChildren && (
            <div>
              {renderTree(item.children, level + 1)}
            </div>
          )}
        </div>
      )
    })
  }

  const tree = buildTree(files)

  return (
    <div className="overflow-y-auto max-h-96">
      {files.length === 0 ? (
        <div className="text-center py-8 text-gray-500 animate-fade-in">
          <Folder className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No files yet</p>
          <p className="text-xs mt-1">Files will appear here during migration</p>
        </div>
      ) : (
        <div className="space-y-0.5 animate-fade-in">
          {renderTree(tree)}
        </div>
      )}
    </div>
  )
}

export default FileTree

// Made with Bob

import { CheckCircle, Circle, Loader } from 'lucide-react'

function ProgressTracker({ currentPhase, progress, message, status }) {
  const phases = [
    { name: 'Phase 1: Configuration', key: 'phase1' },
    { name: 'Phase 2: Model Layer', key: 'phase2' },
    { name: 'Phase 3: Controllers', key: 'phase3' },
    { name: 'Phase 4: Tests', key: 'phase4' },
    { name: 'Phase 5: Validation', key: 'phase5' }
  ]

  const getPhaseStatus = (phase, index) => {
    if (status === 'completed' || progress === 100) return 'completed'
    
    const phaseProgress = (index + 1) * 20;
    const previousProgress = index * 20;

    if (progress > previousProgress && progress <= phaseProgress) {
      if (progress === phaseProgress && status !== 'completed') {
         // Wait, if it hit 20% exactly, it's either in-progress or done depending on if next phase started. 
         // Since backend jumps by 20, let's treat it as in-progress until next phase
         return 'in-progress'
      }
      return 'in-progress'
    } else if (progress > phaseProgress) {
      return 'completed'
    }
    return 'pending'
  }

  const getPhaseIcon = (phase, index) => {
    const status = getPhaseStatus(phase, index)
    
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-success-600" />
      case 'in-progress':
        return <Loader className="w-6 h-6 text-primary-600 animate-spin" />
      default:
        return <Circle className="w-6 h-6 text-gray-300" />
    }
  }

  const getPhaseColor = (phase, index) => {
    const status = getPhaseStatus(phase, index)
    
    switch (status) {
      case 'completed':
        return 'text-success-700 bg-success-50 border-success-200'
      case 'in-progress':
        return 'text-primary-700 bg-primary-50 border-primary-200'
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="card">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900">Migration Progress</h2>
          <span className="text-2xl font-bold text-primary-600">{progress}%</span>
        </div>
        
        {/* Progress Bar */}
        <div className="progress-bar">
          <div 
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {message && (
          <p className="mt-2 text-sm text-gray-600">{message}</p>
        )}
      </div>

      {/* Phase Steps */}
      <div className="space-y-3">
        {phases.map((phase, index) => {
          const phaseStatus = getPhaseStatus(phase, index)
          const isActive = phaseStatus === 'in-progress'
          
          return (
            <div
              key={phase.key}
              className={`
                flex items-center gap-4 p-4 rounded-lg border-2 transition-all
                ${getPhaseColor(phase, index)}
                ${isActive ? 'ring-2 ring-primary-400 ring-offset-2' : ''}
              `}
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                {getPhaseIcon(phase, index)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">
                    {phase.name}
                  </h3>
                  {phaseStatus === 'completed' && (
                    <span className="badge badge-success text-xs">✓ Done</span>
                  )}
                  {phaseStatus === 'in-progress' && (
                    <span className="badge badge-info text-xs animate-pulse">In Progress</span>
                  )}
                </div>
                
                {isActive && message && (
                  <p className="text-xs text-gray-600 mt-1">{message}</p>
                )}
              </div>

              {/* Connector Line */}
              {index < phases.length - 1 && (
                <div className="absolute left-8 top-full h-3 w-0.5 bg-gray-200" 
                     style={{ marginTop: '-0.75rem' }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Status Summary */}
      {status === 'completed' && (
        <div className="mt-6 p-4 bg-success-50 border-2 border-success-200 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-success-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-success-900">All Phases Completed!</p>
              <p className="text-sm text-success-700">Your application has been successfully modernized.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProgressTracker



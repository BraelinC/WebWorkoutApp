import { X, Play, Edit3, Calendar, TrendingUp } from 'lucide-react';
import { WorkoutTemplate, WorkoutSession } from '../App';

interface WorkoutPreviewModalProps {
  template: WorkoutTemplate;
  lastSession: WorkoutSession | null;
  onClose: () => void;
  onStartWorkout: () => void;
  onEditTemplate: () => void;
}

export function WorkoutPreviewModal({ 
  template, 
  lastSession, 
  onClose, 
  onStartWorkout,
  onEditTemplate 
}: WorkoutPreviewModalProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-t-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 text-xl">{template.name}</h2>
            <p className="text-gray-500 text-sm">{template.exercises.length} exercises planned</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Last Workout Stats */}
          {lastSession && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 mb-6 border border-indigo-100">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <h3 className="text-indigo-900">Last Workout</h3>
              </div>
              <div className="flex items-center gap-2 text-indigo-700 text-sm mb-3">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(lastSession.date)}</span>
              </div>
              <div className="space-y-2">
                {lastSession.exercises.map((exercise) => {
                  const completedSets = exercise.sets.filter(s => s.completed);
                  const bestSet = completedSets.reduce((best, set) => {
                    if (!best || (set.weight && (!best.weight || set.weight > best.weight))) return set;
                    return best;
                  }, completedSets[0]);

                  return (
                    <div key={exercise.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{exercise.name}</span>
                      <span className="text-indigo-600">
                        {completedSets.length} × {bestSet?.reps || 0}
                        {bestSet?.weight ? ` @ ${bestSet.weight}lbs` : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Planned Exercises */}
          <div className="mb-6">
            <h3 className="text-gray-900 mb-3">Today's Plan</h3>
            <div className="space-y-3">
              {template.exercises.map((exercise, index) => (
                <div key={exercise.id} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex gap-3">
                    <img 
                      src={exercise.imageUrl} 
                      alt={exercise.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="text-indigo-500 text-xs mb-1">Exercise {index + 1}</div>
                      <h4 className="text-gray-900 mb-1">{exercise.name}</h4>
                      <div className="text-gray-600 text-sm">
                        {exercise.sets.length} sets × {exercise.sets[0]?.reps || 0} reps
                        {exercise.sets[0]?.weight && ` @ ${exercise.sets[0].weight}lbs`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onStartWorkout}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <Play className="w-5 h-5" />
              Start Workout
            </button>
            
            <button
              onClick={onEditTemplate}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 py-4 rounded-xl transition-colors flex items-center justify-center gap-2 border-2 border-gray-200"
            >
              <Edit3 className="w-5 h-5" />
              Edit Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

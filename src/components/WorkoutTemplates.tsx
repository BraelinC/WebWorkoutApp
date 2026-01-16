import { Dumbbell, ChevronRight, Calendar, Trophy } from 'lucide-react';
import { WorkoutTemplate, WorkoutSession } from '../App';

interface WorkoutTemplatesProps {
  templates: WorkoutTemplate[];
  sessions: WorkoutSession[];
  onSelectTemplate: (template: WorkoutTemplate) => void;
}

export function WorkoutTemplates({ templates, sessions, onSelectTemplate }: WorkoutTemplatesProps) {
  const getTemplateIcon = (name: string) => {
    const icons: { [key: string]: string } = {
      'Push': '💪',
      'Pull': '🏋️',
      'Legs': '🦵',
      'Back': '🔙',
      'Chest Day': '🏆',
    };
    return icons[name] || '💪';
  };

  const getRecentSessions = () => {
    return sessions.slice(0, 3);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-500 to-purple-600 pb-8">
      {/* Header */}
      <div className="px-6 pt-12 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <Dumbbell className="w-8 h-8 text-white" />
          <h1 className="text-white text-3xl">Workouts</h1>
        </div>
        <p className="text-indigo-100">Choose a template to get started</p>
      </div>

      <div className="px-4 space-y-6">
        {/* Recent Sessions */}
        {sessions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3 px-2">
              <Trophy className="w-5 h-5 text-yellow-300" />
              <h2 className="text-white">Recent Sessions</h2>
            </div>
            <div className="space-y-2">
              {getRecentSessions().map((session) => (
                <div key={session.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white mb-1">{session.name}</h3>
                      <div className="flex items-center gap-2 text-indigo-100 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(session.date)}</span>
                      </div>
                    </div>
                    <div className="text-white text-sm">
                      {session.exercises.reduce((total, ex) => total + ex.sets.filter(s => s.completed).length, 0)} sets
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Templates */}
        <div>
          <h2 className="text-white mb-3 px-2">Templates</h2>
          <div className="space-y-3">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className="w-full bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all active:scale-98"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{getTemplateIcon(template.name)}</div>
                    <div className="text-left">
                      <h3 className="text-gray-900 mb-1">{template.name}</h3>
                      <p className="text-gray-500 text-sm">
                        {template.exercises.length === 0 
                          ? 'No exercises yet' 
                          : `${template.exercises.length} exercise${template.exercises.length !== 1 ? 's' : ''}`
                        }
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

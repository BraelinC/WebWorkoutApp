import { useState, useEffect } from 'react';
import { WorkoutTemplates } from './components/WorkoutTemplates';
import { WorkoutPreviewModal } from './components/WorkoutPreviewModal';
import { TemplateDetail } from './components/TemplateDetail';
import { ActiveWorkout } from './components/ActiveWorkout';

export interface Exercise {
  id: string;
  name: string;
  imageUrl: string;
  sets: Set[];
}

export interface Set {
  id: string;
  reps: number;
  weight?: number;
  completed: boolean;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface WorkoutSession {
  id: string;
  templateId: string;
  name: string;
  date: string;
  exercises: Exercise[];
}

const initialTemplates: WorkoutTemplate[] = [
  { 
    id: '1', 
    name: 'Push', 
    exercises: [
      {
        id: 'p1',
        name: 'Bench Press',
        imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop',
        sets: [
          { id: '1', reps: 10, weight: 135, completed: false },
          { id: '2', reps: 8, weight: 155, completed: false },
          { id: '3', reps: 6, weight: 185, completed: false },
        ]
      },
      {
        id: 'p2',
        name: 'Overhead Press',
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop',
        sets: [
          { id: '1', reps: 10, weight: 95, completed: false },
          { id: '2', reps: 8, weight: 105, completed: false },
          { id: '3', reps: 6, weight: 115, completed: false },
        ]
      }
    ] 
  },
  { 
    id: '2', 
    name: 'Pull', 
    exercises: [
      {
        id: 'pl1',
        name: 'Deadlift',
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=400&fit=crop',
        sets: [
          { id: '1', reps: 8, weight: 225, completed: false },
          { id: '2', reps: 6, weight: 275, completed: false },
          { id: '3', reps: 4, weight: 315, completed: false },
        ]
      },
      {
        id: 'pl2',
        name: 'Barbell Row',
        imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=400&fit=crop',
        sets: [
          { id: '1', reps: 10, weight: 135, completed: false },
          { id: '2', reps: 8, weight: 155, completed: false },
          { id: '3', reps: 6, weight: 175, completed: false },
        ]
      }
    ] 
  },
  { 
    id: '3', 
    name: 'Legs', 
    exercises: [
      {
        id: 'l1',
        name: 'Squat',
        imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=400&fit=crop',
        sets: [
          { id: '1', reps: 10, weight: 185, completed: false },
          { id: '2', reps: 8, weight: 225, completed: false },
          { id: '3', reps: 6, weight: 275, completed: false },
        ]
      },
      {
        id: 'l2',
        name: 'Leg Press',
        imageUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400&h=400&fit=crop',
        sets: [
          { id: '1', reps: 12, weight: 270, completed: false },
          { id: '2', reps: 10, weight: 360, completed: false },
          { id: '3', reps: 8, weight: 450, completed: false },
        ]
      }
    ] 
  },
  { 
    id: '4', 
    name: 'Back', 
    exercises: [
      {
        id: 'b1',
        name: 'Pull-ups',
        imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&h=400&fit=crop',
        sets: [
          { id: '1', reps: 10, completed: false },
          { id: '2', reps: 8, completed: false },
          { id: '3', reps: 6, completed: false },
        ]
      },
      {
        id: 'b2',
        name: 'Lat Pulldown',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
        sets: [
          { id: '1', reps: 12, weight: 120, completed: false },
          { id: '2', reps: 10, weight: 140, completed: false },
          { id: '3', reps: 8, weight: 160, completed: false },
        ]
      }
    ] 
  },
  { 
    id: '5', 
    name: 'Chest Day', 
    exercises: [
      {
        id: 'c1',
        name: 'Flat Bench Press',
        imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop',
        sets: [
          { id: '1', reps: 10, weight: 135, completed: false },
          { id: '2', reps: 8, weight: 185, completed: false },
          { id: '3', reps: 6, weight: 205, completed: false },
        ]
      },
      {
        id: 'c2',
        name: 'Incline Dumbbell Press',
        imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=400&fit=crop',
        sets: [
          { id: '1', reps: 10, weight: 60, completed: false },
          { id: '2', reps: 8, weight: 70, completed: false },
          { id: '3', reps: 6, weight: 80, completed: false },
        ]
      }
    ] 
  },
];

function App() {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>(initialTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<WorkoutTemplate | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplate | null>(null);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);

  // Load templates from localStorage on mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem('workoutTemplates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
  }, []);

  // Save templates to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('workoutTemplates', JSON.stringify(templates));
  }, [templates]);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('workoutSessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('workoutSessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  const handleSelectTemplate = (template: WorkoutTemplate) => {
    setSelectedTemplate(template);
    setShowPreviewModal(true);
  };

  const handleUpdateTemplate = (template: WorkoutTemplate) => {
    setTemplates(templates.map(t => t.id === template.id ? template : t));
    setEditingTemplate(template);
  };

  const handleStartSession = (template: WorkoutTemplate) => {
    const session: WorkoutSession = {
      id: Date.now().toString(),
      templateId: template.id,
      name: template.name,
      date: new Date().toISOString(),
      exercises: template.exercises.map(exercise => ({
        ...exercise,
        sets: exercise.sets.map(set => ({ ...set, completed: false, reps: set.reps || 0 }))
      }))
    };
    setActiveSession(session);
    setShowPreviewModal(false);
    setSelectedTemplate(null);
    setEditingTemplate(null);
  };

  const handleEndSession = (session: WorkoutSession) => {
    setSessions([session, ...sessions]);
    setActiveSession(null);
  };

  const getLastSessionForTemplate = (templateId: string): WorkoutSession | null => {
    const templateSessions = sessions.filter(s => s.templateId === templateId);
    return templateSessions.length > 0 ? templateSessions[0] : null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {activeSession ? (
        <ActiveWorkout 
          session={activeSession} 
          onEndSession={handleEndSession}
          onCancel={() => setActiveSession(null)}
        />
      ) : editingTemplate ? (
        <TemplateDetail
          template={editingTemplate}
          onBack={() => setEditingTemplate(null)}
          onUpdateTemplate={handleUpdateTemplate}
          onStartSession={handleStartSession}
        />
      ) : (
        <>
          <WorkoutTemplates 
            templates={templates}
            sessions={sessions}
            onSelectTemplate={handleSelectTemplate}
          />
          
          {showPreviewModal && selectedTemplate && (
            <WorkoutPreviewModal
              template={selectedTemplate}
              lastSession={getLastSessionForTemplate(selectedTemplate.id)}
              onClose={() => {
                setShowPreviewModal(false);
                setSelectedTemplate(null);
              }}
              onStartWorkout={() => handleStartSession(selectedTemplate)}
              onEditTemplate={() => {
                setShowPreviewModal(false);
                setEditingTemplate(selectedTemplate);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;

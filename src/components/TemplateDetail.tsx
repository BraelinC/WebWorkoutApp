import { useState, useRef } from 'react';
import { ArrowLeft, Plus, Camera, Trash2, Play } from 'lucide-react';
import { WorkoutTemplate, Exercise, Set } from '../App';

interface TemplateDetailProps {
  template: WorkoutTemplate;
  onBack: () => void;
  onUpdateTemplate: (template: WorkoutTemplate) => void;
  onStartSession: (template: WorkoutTemplate) => void;
}

export function TemplateDetail({ template, onBack, onUpdateTemplate, onStartSession }: TemplateDetailProps) {
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseImage, setExerciseImage] = useState('');
  const [numSets, setNumSets] = useState(3);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setExerciseImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddExercise = () => {
    if (exerciseName && exerciseImage) {
      const sets: Set[] = Array.from({ length: numSets }, (_, i) => ({
        id: (i + 1).toString(),
        reps: 0,
        completed: false
      }));

      const newExercise: Exercise = {
        id: Date.now().toString(),
        name: exerciseName,
        imageUrl: exerciseImage,
        sets,
      };
      
      const updatedTemplate = {
        ...template,
        exercises: [...template.exercises, newExercise]
      };
      
      onUpdateTemplate(updatedTemplate);
      setExerciseName('');
      setExerciseImage('');
      setNumSets(3);
      setShowAddExercise(false);
    }
  };

  const handleRemoveExercise = (exerciseId: string) => {
    const updatedTemplate = {
      ...template,
      exercises: template.exercises.filter(e => e.id !== exerciseId)
    };
    onUpdateTemplate(updatedTemplate);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-gray-900">{template.name}</h1>
            <p className="text-gray-500 text-sm">
              {template.exercises.length} exercise{template.exercises.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Exercises List */}
      <div className="p-4">
        {template.exercises.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">No exercises yet</h3>
            <p className="text-gray-500 text-sm mb-4">Add exercises with photos to track your equipment</p>
            <button
              onClick={() => setShowAddExercise(true)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-xl transition-colors"
            >
              Add First Exercise
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {template.exercises.map((exercise, index) => (
              <div key={exercise.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex gap-3">
                  <img 
                    src={exercise.imageUrl} 
                    alt={exercise.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="text-indigo-500 text-sm mb-1">Exercise {index + 1}</div>
                    <h3 className="text-gray-900 mb-1">{exercise.name}</h3>
                    <p className="text-gray-500 text-sm">{exercise.sets.length} sets</p>
                  </div>
                  <button
                    onClick={() => handleRemoveExercise(exercise.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors h-fit"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Exercise Modal */}
      {showAddExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-gray-900">Add Exercise</h2>
              <button 
                onClick={() => {
                  setShowAddExercise(false);
                  setExerciseName('');
                  setExerciseImage('');
                  setNumSets(3);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <input
                type="text"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                placeholder="Exercise name (e.g., Bench Press)"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
              />

              <div className="mb-4">
                <label className="block text-gray-700 mb-2 text-sm">Number of Sets</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={numSets}
                  onChange={(e) => setNumSets(parseInt(e.target.value) || 3)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />

              {exerciseImage ? (
                <div className="mb-4 relative">
                  <img 
                    src={exerciseImage} 
                    alt="Exercise preview" 
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => setExerciseImage('')}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl p-12 flex flex-col items-center justify-center hover:border-indigo-500 transition-colors mb-4"
                >
                  <Camera className="w-12 h-12 text-gray-400 mb-3" />
                  <span className="text-gray-600">Take or upload photo</span>
                  <span className="text-gray-400 text-sm mt-1">Track the same equipment each time</span>
                </button>
              )}

              <button
                onClick={handleAddExercise}
                disabled={!exerciseName || !exerciseImage}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-4 rounded-xl transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add Exercise
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 space-y-2">
        {template.exercises.length > 0 && (
          <button
            onClick={() => onStartSession(template)}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            Start Workout
          </button>
        )}
        
        <button
          onClick={() => setShowAddExercise(true)}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Exercise
        </button>
      </div>
    </div>
  );
}
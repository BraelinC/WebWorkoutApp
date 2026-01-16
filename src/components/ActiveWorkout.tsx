import { useState } from 'react';
import { ArrowLeft, Check, Plus, Minus } from 'lucide-react';
import { WorkoutSession, Exercise, Set } from '../App';

interface ActiveWorkoutProps {
  session: WorkoutSession;
  onEndSession: (session: WorkoutSession) => void;
  onCancel: () => void;
}

export function ActiveWorkout({ session, onEndSession, onCancel }: ActiveWorkoutProps) {
  const [currentSession, setCurrentSession] = useState<WorkoutSession>(session);

  const handleToggleSet = (exerciseId: string, setId: string) => {
    setCurrentSession({
      ...currentSession,
      exercises: currentSession.exercises.map(exercise => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            sets: exercise.sets.map(set => 
              set.id === setId ? { ...set, completed: !set.completed } : set
            )
          };
        }
        return exercise;
      })
    });
  };

  const handleUpdateReps = (exerciseId: string, setId: string, reps: number) => {
    setCurrentSession({
      ...currentSession,
      exercises: currentSession.exercises.map(exercise => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            sets: exercise.sets.map(set => 
              set.id === setId ? { ...set, reps: Math.max(0, reps) } : set
            )
          };
        }
        return exercise;
      })
    });
  };

  const handleAddSet = (exerciseId: string) => {
    setCurrentSession({
      ...currentSession,
      exercises: currentSession.exercises.map(exercise => {
        if (exercise.id === exerciseId) {
          const newSet: Set = {
            id: Date.now().toString(),
            reps: 0,
            completed: false
          };
          return {
            ...exercise,
            sets: [...exercise.sets, newSet]
          };
        }
        return exercise;
      })
    });
  };

  const getTotalCompletedSets = () => {
    return currentSession.exercises.reduce((total, exercise) => {
      return total + exercise.sets.filter(set => set.completed).length;
    }, 0);
  };

  const getTotalSets = () => {
    return currentSession.exercises.reduce((total, exercise) => {
      return total + exercise.sets.length;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-6 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white text-xl">{currentSession.name}</h1>
            <p className="text-green-100 text-sm">
              {getTotalCompletedSets()} / {getTotalSets()} sets completed
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-white h-full transition-all duration-300 rounded-full"
            style={{ width: `${getTotalSets() > 0 ? (getTotalCompletedSets() / getTotalSets()) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Exercises */}
      <div className="p-4 space-y-4">
        {currentSession.exercises.map((exercise, exerciseIndex) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            exerciseNumber={exerciseIndex + 1}
            onToggleSet={handleToggleSet}
            onUpdateReps={handleUpdateReps}
            onAddSet={handleAddSet}
          />
        ))}
      </div>

      {/* Complete Workout Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button
          onClick={() => onEndSession(currentSession)}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg"
        >
          <Check className="w-5 h-5" />
          Complete Workout
        </button>
      </div>
    </div>
  );
}

interface ExerciseCardProps {
  exercise: Exercise;
  exerciseNumber: number;
  onToggleSet: (exerciseId: string, setId: string) => void;
  onUpdateReps: (exerciseId: string, setId: string, reps: number) => void;
  onAddSet: (exerciseId: string) => void;
}

function ExerciseCard({ exercise, exerciseNumber, onToggleSet, onUpdateReps, onAddSet }: ExerciseCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md">
      {/* Exercise Header */}
      <div className="flex gap-3 mb-4">
        <img 
          src={exercise.imageUrl} 
          alt={exercise.name}
          className="w-24 h-24 rounded-xl object-cover shadow-sm"
        />
        <div className="flex-1">
          <div className="text-indigo-500 text-sm mb-1">Exercise {exerciseNumber}</div>
          <h3 className="text-gray-900 mb-1">{exercise.name}</h3>
          <p className="text-gray-500 text-sm">
            {exercise.sets.filter(set => set.completed).length} / {exercise.sets.length} sets completed
          </p>
        </div>
      </div>

      {/* Sets */}
      <div className="space-y-2 mb-3">
        {exercise.sets.map((set, setIndex) => (
          <div 
            key={set.id}
            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
              set.completed 
                ? 'bg-green-50 border-green-500' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <button
              onClick={() => onToggleSet(exercise.id, set.id)}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                set.completed
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300 hover:border-green-500'
              }`}
            >
              {set.completed && <Check className="w-4 h-4 text-white" />}
            </button>

            <div className="text-gray-700 min-w-[50px] text-sm">Set {setIndex + 1}</div>

            <div className="flex items-center gap-2 flex-1 justify-end">
              <button
                onClick={() => onUpdateReps(exercise.id, set.id, set.reps - 1)}
                className="w-9 h-9 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors active:scale-95"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>

              <div className="min-w-[70px] text-center">
                <span className="text-gray-900 text-lg">{set.reps}</span>
                <span className="text-gray-500 text-sm ml-1">reps</span>
              </div>

              <button
                onClick={() => onUpdateReps(exercise.id, set.id, set.reps + 1)}
                className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center hover:bg-indigo-600 transition-colors active:scale-95 shadow-sm"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Set Button */}
      <button
        onClick={() => onAddSet(exercise.id)}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 text-sm hover:border-indigo-500 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Set
      </button>
    </div>
  );
}

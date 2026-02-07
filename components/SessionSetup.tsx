
import React from 'react';
import { Topic } from '../types';
import { QUESTION_COUNT_OPTIONS } from '../constants';

interface SessionSetupProps {
  topic: Topic;
  onBack: () => void;
  onStart: (count: number) => void;
  isLoading: boolean;
  error: string | null;
}

export const SessionSetup: React.FC<SessionSetupProps> = ({ topic, onBack, onStart, isLoading, error }) => {
  return (
    <div className="max-w-lg mx-auto fade-in">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Go Back
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="bg-indigo-600 p-8 text-white">
          <div className="text-4xl mb-2">{topic.icon}</div>
          <h2 className="text-2xl font-bold">{topic.name}</h2>
          <p className="text-indigo-100 mt-1">Configure your practice session</p>
        </div>
        
        <div className="p-8">
          <label className="block text-slate-700 dark:text-slate-300 font-bold mb-4">How many questions would you like?</label>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {QUESTION_COUNT_OPTIONS.map((count) => (
              <button
                key={count}
                onClick={() => onStart(count)}
                disabled={isLoading}
                className="py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {count} Questions
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/30 transition-colors">
            <div className="text-amber-500 dark:text-amber-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </div>
            <p className="text-amber-800 dark:text-amber-300 text-sm">Selecting 50+ questions might take slightly longer to generate.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
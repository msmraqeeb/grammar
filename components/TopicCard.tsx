
import React from 'react';
import { Topic } from '../types';

interface TopicCardProps {
  topic: Topic;
  onClick: () => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="group bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all text-left flex flex-col h-full"
    >
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{topic.icon}</div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{topic.name}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm flex-1 leading-relaxed">{topic.description}</p>
      <div className="mt-4 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
        Start Practice
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </div>
    </button>
  );
};
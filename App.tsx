
import React, { useState, useEffect } from 'react';
import { Topic, SessionStatus, QuizSession } from './types';
import { TOPICS } from './constants';
import { fetchQuestions } from './geminiService';
import { TopicCard } from './components/TopicCard';
import { PracticeSession } from './components/PracticeSession';
import { SessionSetup } from './components/SessionSetup';

export default function App() {
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('grammar_dark_mode') === 'true';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('grammar_dark_mode', String(isDarkMode));
  }, [isDarkMode]);

  const startSetup = (topic: Topic) => {
    setSelectedTopic(topic);
    setStatus('setup');
  };

  const startSession = async (count: number) => {
    if (!selectedTopic) return;
    setStatus('loading');
    setError(null);
    try {
      const questions = await fetchQuestions(selectedTopic.name, count);
      setSession({
        topic: selectedTopic,
        count: count,
        currentQuestionIndex: 0,
        correctCount: 0,
        wrongCount: 0,
        questions: questions,
        isAnswered: false,
        selectedOption: null,
      });
      setStatus('active');
    } catch (err) {
      setError("Failed to generate questions. Please try again.");
      setStatus('setup');
    }
  };

  const handleBackToHome = () => {
    setStatus('idle');
    setSession(null);
    setSelectedTopic(null);
  };

  const handleFinish = () => {
    setStatus('finished');
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={handleBackToHome}
          >
            <div className="bg-indigo-600 text-white p-2 rounded-lg group-hover:bg-indigo-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">GrammarMaster<span className="text-indigo-600">Pro</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
            <div className="hidden sm:block text-sm font-medium text-slate-500 dark:text-slate-400">
              Learn English with AI
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        {status === 'idle' && (
          <div className="fade-in">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Welcome, Scholar!</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Choose a grammar topic to start your practice session.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {TOPICS.map((topic) => (
                <TopicCard 
                  key={topic.id} 
                  topic={topic} 
                  onClick={() => startSetup(topic)} 
                />
              ))}
            </div>
          </div>
        )}

        {status === 'setup' && selectedTopic && (
          <SessionSetup 
            topic={selectedTopic} 
            onBack={handleBackToHome} 
            onStart={startSession}
            isLoading={false}
            error={error}
          />
        )}

        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center min-h-[400px] fade-in">
            <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Generating Your Quiz...</h3>
            <p className="text-slate-500 dark:text-slate-400 text-center max-w-md">Our AI is hand-crafting unique grammar questions based on your chosen topic. This usually takes 5-10 seconds.</p>
          </div>
        )}

        {status === 'active' && session && (
          <PracticeSession 
            session={session} 
            setSession={setSession} 
            onFinish={handleFinish} 
          />
        )}

        {status === 'finished' && session && (
          <div className="max-w-2xl mx-auto fade-in">
             <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 text-center border border-slate-100 dark:border-slate-800 transition-colors">
                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Session Complete!</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Excellent work! You've completed the {session.topic.name} practice.</p>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl transition-colors">
                    <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total</div>
                    <div className="text-3xl font-bold text-slate-800 dark:text-white">{session.count}</div>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl transition-colors">
                    <div className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-1">Correct</div>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">{session.correctCount}</div>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl transition-colors">
                    <div className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">Wrong</div>
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400">{session.wrongCount}</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleBackToHome}
                    className="flex-1 py-3 px-6 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl transition-all"
                  >
                    Back to Topics
                  </button>
                  <button 
                    onClick={() => startSetup(session.topic)}
                    className="flex-1 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
                  >
                    Restart Quiz
                  </button>
                </div>
             </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 transition-colors">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 dark:text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} GrammarMaster Pro. Powered by Gemini AI.
        </div>
      </footer>
    </div>
  );
}
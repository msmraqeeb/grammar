
import React, { useMemo, useState, useEffect } from 'react';
import { QuizSession } from '../types';
import { GrammarAudio } from '../audioUtils';

interface PracticeSessionProps {
  session: QuizSession;
  setSession: React.Dispatch<React.SetStateAction<QuizSession | null>>;
  onFinish: () => void;
}

export const PracticeSession: React.FC<PracticeSessionProps> = ({ session, setSession, onFinish }) => {
  const [showHint, setShowHint] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('grammar_muted') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('grammar_muted', String(isMuted));
  }, [isMuted]);

  const currentQuestion = useMemo(() => {
    return session.questions[session.currentQuestionIndex];
  }, [session.questions, session.currentQuestionIndex]);

  const handleOptionSelect = (index: number) => {
    if (session.isAnswered) return;

    const isCorrect = index === currentQuestion.correctAnswerIndex;
    
    if (!isMuted) {
      if (isCorrect) {
        GrammarAudio.playSuccess();
      } else {
        GrammarAudio.playError();
      }
    }

    setSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        isAnswered: true,
        selectedOption: index,
        correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
        wrongCount: !isCorrect ? prev.wrongCount + 1 : prev.wrongCount,
      };
    });
  };

  const handleNext = () => {
    setShowHint(false);
    if (session.currentQuestionIndex + 1 >= session.count) {
      onFinish();
    } else {
      setSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          isAnswered: false,
          selectedOption: null,
        };
      });
    }
  };

  const progress = ((session.currentQuestionIndex + 1) / session.count) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Stats Bar */}
      <div className="flex justify-between items-center mb-6 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{session.correctCount}</span>
          </div>
          <div className="flex items-center gap-1.5 border-r pr-4 border-slate-200 dark:border-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{session.wrongCount}</span>
          </div>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2V15H6L11 19V5Z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2V15H6L11 19V5Z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
            )}
          </button>
        </div>
        <div className="text-slate-500 dark:text-slate-400 font-bold">
          Q{session.currentQuestionIndex + 1} of {session.count}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full mb-10 overflow-hidden">
        <div 
          className="h-full bg-indigo-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 p-8 mb-8 fade-in relative overflow-hidden transition-colors">
        <div className="flex justify-between items-start gap-4 mb-6">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white leading-snug">
            {currentQuestion.question}
          </h3>
          {!session.isAnswered && (
            <button 
              onClick={() => setShowHint(!showHint)}
              className={`flex-shrink-0 p-2 rounded-lg transition-all ${showHint ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 shadow-inner' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'}`}
              title="Show Hint"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/></svg>
            </button>
          )}
        </div>

        {showHint && !session.isAnswered && (
          <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/40 rounded-xl text-amber-800 dark:text-amber-200 text-sm italic fade-in animate-pulse shadow-sm">
            <span className="font-bold not-italic mr-1">Hint:</span> {currentQuestion.hint}
          </div>
        )}

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            let bgColor = "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20";
            let textColor = "text-slate-700 dark:text-slate-200";
            let borderColor = "border-slate-100 dark:border-slate-800";

            if (session.isAnswered) {
              if (idx === currentQuestion.correctAnswerIndex) {
                bgColor = "bg-green-50 dark:bg-green-900/20";
                borderColor = "border-green-500 dark:border-green-600";
                textColor = "text-green-800 dark:text-green-300";
              } else if (idx === session.selectedOption && idx !== currentQuestion.correctAnswerIndex) {
                bgColor = "bg-red-50 dark:bg-red-900/20";
                borderColor = "border-red-500 dark:border-red-600";
                textColor = "text-red-800 dark:text-red-300";
              } else {
                bgColor = "bg-slate-50 dark:bg-slate-800 opacity-60";
                borderColor = "border-slate-100 dark:border-slate-800";
              }
            }

            return (
              <button
                key={idx}
                disabled={session.isAnswered}
                onClick={() => handleOptionSelect(idx)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${bgColor} ${borderColor} ${textColor} font-medium relative group`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  session.isAnswered && idx === currentQuestion.correctAnswerIndex ? 'bg-green-600 dark:bg-green-500 text-white' : 
                  session.isAnswered && idx === session.selectedOption ? 'bg-red-600 dark:bg-red-500 text-white' : 
                  'bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-300 group-hover:border-indigo-400 dark:group-hover:border-indigo-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                {option}
                
                {session.isAnswered && idx === currentQuestion.correctAnswerIndex && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 ml-auto text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                )}
                {session.isAnswered && idx === session.selectedOption && idx !== currentQuestion.correctAnswerIndex && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 ml-auto text-red-600 dark:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback & Explanation */}
      {session.isAnswered && (
        <div className="fade-in space-y-6">
          <div className="text-center py-4">
             {session.selectedOption === currentQuestion.correctAnswerIndex ? (
               <div className="text-3xl font-black text-green-600 dark:text-green-400 tracking-wide animate-bounce">
                 CORRECT!
               </div>
             ) : (
               <div className="text-3xl font-black text-red-600 dark:text-red-400 tracking-wide animate-pulse">
                 WRONG
               </div>
             )}
          </div>

          <div className="bg-white dark:bg-slate-900 border-l-4 border-l-indigo-500 rounded-r-xl p-6 shadow-sm transition-colors">
             <h4 className="font-bold text-indigo-700 dark:text-indigo-400 mb-2 flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
               Explanation
             </h4>
             <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
               {currentQuestion.explanation}
             </p>
          </div>

          <button
            onClick={handleNext}
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none transition-all text-xl"
          >
            {session.currentQuestionIndex + 1 === session.count ? 'View Results' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
};
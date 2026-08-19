import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

interface QuizViewProps {
  questions: QuizQuestion[];
}

export function QuizView({ questions }: QuizViewProps) {
  const { t } = useTranslation();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!questions || questions.length === 0) return null;

  const q = questions[currentIdx];
  const isCorrect = selectedOpt === q.answer;

  const handleSubmit = () => {
    if (selectedOpt !== null) setIsSubmitted(true);
  };

  const handleNext = () => {
    setIsSubmitted(false);
    setSelectedOpt(null);
    setCurrentIdx(p => (p + 1) % questions.length);
  };

  return (
    <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-3xl mx-auto w-full shadow-lg overflow-y-auto">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold text-slate-100">Test & Evaluation</h2>
        <span className="text-sm font-mono text-cyan-400 font-medium bg-cyan-900/30 px-3 py-1 rounded-full">
          Question {currentIdx + 1} of {questions.length}
        </span>
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="text-lg font-medium text-slate-200 leading-relaxed">{q.question}</h3>
        
        <div className="flex flex-col gap-3">
          {q.options.map((opt, idx) => {
            const isSelected = selectedOpt === idx;
            let btnClass = "text-left px-5 py-4 rounded-lg border transition-all ";
            
            if (!isSubmitted) {
              btnClass += isSelected 
                ? "bg-cyan-900/40 border-cyan-500 text-cyan-100 shadow-[0_0_10px_rgba(6,182,212,0.2)]" 
                : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600 hover:bg-slate-900";
            } else {
              if (idx === q.answer) {
                btnClass += "bg-emerald-900/40 border-emerald-500 text-emerald-100";
              } else if (isSelected) {
                btnClass += "bg-rose-900/40 border-rose-500 text-rose-100";
              } else {
                btnClass += "bg-slate-950 border-slate-800 text-slate-600 opacity-50";
              }
            }

            return (
              <button 
                key={idx}
                disabled={isSubmitted}
                onClick={() => setSelectedOpt(idx)}
                className={btnClass}
              >
                <span className="font-mono mr-3 text-sm opacity-50">{idx + 1}.</span> {opt}
              </button>
            );
          })}
        </div>

        {!isSubmitted ? (
          <button 
            disabled={selectedOpt === null}
            onClick={handleSubmit}
            className="mt-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Submit Answer
          </button>
        ) : (
          <div className={`mt-4 p-5 rounded-lg border ${isCorrect ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-rose-900/20 border-rose-500/30'}`}>
            <div className="flex items-center gap-2 mb-3">
              {isCorrect ? <CheckCircle2 className="text-emerald-400" /> : <XCircle className="text-rose-400" />}
              <span className={`font-bold text-lg ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isCorrect ? "Correct!" : "Incorrect"}
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{q.explanation}</p>
            
            <button 
              onClick={handleNext}
              className="mt-5 w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {currentIdx === questions.length - 1 ? "Retake Test" : "Next Question"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

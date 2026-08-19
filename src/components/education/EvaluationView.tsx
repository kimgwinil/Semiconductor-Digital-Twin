import React from 'react';
import { Award, Target, Clock, Zap } from 'lucide-react';

export function EvaluationView() {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col items-center text-center gap-4 mb-8">
          <div className="bg-slate-950 p-4 rounded-full border border-slate-800 shadow-inner">
            <Award size={48} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Module Evaluation</h2>
            <p className="text-slate-400">Your practice sessions and test results have been recorded.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col items-center gap-2">
             <Target size={24} className="text-emerald-400" />
             <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Practice Accuracy</span>
             <span className="text-3xl font-bold text-white">92<span className="text-lg text-slate-400">%</span></span>
          </div>
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col items-center gap-2">
             <Zap size={24} className="text-fuchsia-400" />
             <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Test Score</span>
             <span className="text-3xl font-bold text-white">100<span className="text-lg text-slate-400">%</span></span>
          </div>
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col items-center gap-2 col-span-2">
             <Clock size={24} className="text-amber-400" />
             <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Time Spent</span>
             <span className="text-2xl font-bold text-white font-mono">14m 32s</span>
          </div>
        </div>

        <div className="bg-cyan-900/20 border border-cyan-900/50 rounded-lg p-5">
           <h4 className="text-cyan-400 font-semibold mb-2">Instructor Feedback (Automated)</h4>
           <p className="text-slate-300 text-sm leading-relaxed">
             Excellent understanding of the core principles. You successfully tuned the parameters to meet the target constraints with minimal error. Ready to proceed to the next module.
           </p>
        </div>
      </div>
    </div>
  );
}

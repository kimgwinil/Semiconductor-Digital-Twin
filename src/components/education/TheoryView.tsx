import React from 'react';

interface TheoryViewProps {
  data: {
    title: string;
    content: string[];
  };
}

export function TheoryView({ data }: TheoryViewProps) {
  if (!data) return null;
  return (
    <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-4xl mx-auto w-full shadow-lg overflow-y-auto">
      <h2 className="text-2xl font-bold text-slate-100 mb-6 pb-4 border-b border-slate-800">
        {data.title}
      </h2>
      <div className="flex flex-col gap-4 text-slate-300 leading-relaxed text-lg">
        {data.content.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { Cpu } from 'lucide-react';

export function Registration() {
  const { t } = useTranslation();
  const { loginUser } = useAppContext();
  
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    department: '',
    studentId: '',
    course: '',
    role: 'STUDENT' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.studentId) return; // Simple validation
    
    loginUser({
      id: crypto.randomUUID(),
      ...formData
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_50%)]"></div>
      
      <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="bg-cyan-500/20 p-4 rounded-full">
            <Cpu size={40} className="text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-white text-center">
            {t('app_title')}
          </h2>
          <p className="text-slate-400 font-medium">{t('login.title')}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">{t('login.name')} *</label>
            <input 
              required
              type="text" 
              className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              value={formData.name}
              onChange={e => setFormData(p => ({...p, name: e.target.value}))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">{t('login.organization')}</label>
              <input 
                type="text" 
                className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-all"
                value={formData.organization}
                onChange={e => setFormData(p => ({...p, organization: e.target.value}))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">{t('login.department')}</label>
              <input 
                type="text" 
                className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-all"
                value={formData.department}
                onChange={e => setFormData(p => ({...p, department: e.target.value}))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">{t('login.studentId')} *</label>
              <input 
                required
                type="text" 
                className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-all"
                value={formData.studentId}
                onChange={e => setFormData(p => ({...p, studentId: e.target.value}))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">{t('login.course')}</label>
              <input 
                type="text" 
                className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-all"
                value={formData.course}
                onChange={e => setFormData(p => ({...p, course: e.target.value}))}
              />
            </div>
          </div>

          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input 
                type="radio" 
                name="role" 
                value="STUDENT" 
                checked={formData.role === 'STUDENT'}
                onChange={() => setFormData(p => ({...p, role: 'STUDENT'}))}
                className="text-cyan-500 bg-slate-950 border-slate-700 focus:ring-cyan-500 focus:ring-offset-slate-900"
              />
              <span className="text-sm">{t('login.role_student')}</span>
            </label>
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input 
                type="radio" 
                name="role" 
                value="INSTRUCTOR" 
                checked={formData.role === 'INSTRUCTOR'}
                onChange={() => setFormData(p => ({...p, role: 'INSTRUCTOR'}))}
                className="text-cyan-500 bg-slate-950 border-slate-700 focus:ring-cyan-500 focus:ring-offset-slate-900"
              />
              <span className="text-sm">{t('login.role_instructor')}</span>
            </label>
          </div>

          <button 
            type="submit"
            className="mt-6 w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2"
          >
            {t('login.start_btn')}
          </button>
        </form>
      </div>
    </div>
  );
}

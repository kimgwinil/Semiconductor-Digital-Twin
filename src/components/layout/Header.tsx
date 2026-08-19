import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { Globe, Clock, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';

export function Header() {
  const { t, i18n } = useTranslation();
  const { state } = useAppContext();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ko' ? 'en' : 'ko');
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-6 text-slate-200">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-cyan-400">Semiconductor Digital Twin</h1>
      </div>
      
      <div className="flex items-center gap-6">
        {/* Language Toggle */}
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
        >
          <Globe size={18} />
          <span className="text-sm font-medium">{i18n.language === 'ko' ? '한국어' : 'English'}</span>
        </button>

        {/* Local Time */}
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Clock size={18} />
          <span>{format(time, 'yyyy-MM-dd HH:mm:ss')}</span>
        </div>

        {/* User Info */}
        {state.user && (
          <div className="flex items-center gap-2 border-l border-slate-700 pl-6">
            <div className="bg-cyan-900/50 p-1.5 rounded-full text-cyan-400">
              <UserIcon size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-200">{state.user.name}</span>
              <span className="text-xs text-slate-500">{state.user.role}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

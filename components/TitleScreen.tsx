
import React, { useState } from 'react';

interface Props {
  onStart: () => void;
}

type AuthMode = 'welcome' | 'login' | 'register';

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  id: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, value, onChange, placeholder, id }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-[10px] uppercase text-yellow-600 font-bold">
      {label}
    </label>
    <input
      id={id}
      type={type}
      required
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-slate-950 border-2 border-slate-800 p-3 text-sm text-yellow-100 focus:border-yellow-600 outline-none transition-colors rounded"
    />
  </div>
);

const TitleScreen: React.FC<Props> = ({ onStart }) => {
  const [mode, setMode] = useState<AuthMode>('welcome');
  const [formData, setFormData] = useState({ user: '', password: '', email: '', terms: false });

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    onStart();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-slate-950 text-white p-8 relative overflow-hidden">
      {/* Background Animated Dust */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-black"></div>
      
      <div className="z-10 text-center mb-12 animate-pulse">
        <h1 className="text-9xl font-black mb-1 text-slate-100 tracking-[0.25em] drop-shadow-[0_8px_0_rgba(100,116,139,1)]">GROOPA</h1>
        <div className="flex justify-center items-center gap-4">
            <div className="h-[1px] w-20 bg-slate-800"></div>
            <a href="https://groopa.online" target="_blank" className="text-slate-500 text-xs tracking-[0.5em] hover:text-yellow-500 transition-colors">GROOPA.ONLINE</a>
            <div className="h-[1px] w-20 bg-slate-800"></div>
        </div>
      </div>

      <div className="z-10 w-full max-w-sm bg-slate-900 border-x-4 border-slate-800 shadow-[0_0_80px_rgba(161,0,255,0.15)] relative">
        {/* Thematic spikes/corners */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-900 border-4 border-slate-800 rotate-45"></div>

        <div className="bg-slate-900 border-y-4 border-slate-800 p-8 space-y-8">
          {mode === 'welcome' && (
            <div className="space-y-4 py-4">
              <p className="text-center text-slate-500 text-xs uppercase tracking-widest mb-8">Forging legends since pixel one</p>
              <button 
                onClick={() => setMode('login')}
                className="w-full py-4 bg-slate-100 hover:bg-white text-black font-black rounded shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                LOGIN
              </button>
              <button 
                onClick={() => setMode('register')}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black rounded border border-slate-700 transition-all active:translate-y-1"
              >
                CREATE ACCOUNT
              </button>
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleAction} className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-center text-slate-100 font-bold text-sm tracking-widest uppercase mb-6">Secured Access</h2>
              <InputField 
                id="login-user"
                label="Identity" 
                type="text" 
                value={formData.user} 
                onChange={(e) => setFormData({...formData, user: e.target.value})}
                placeholder="Username"
              />
              <InputField 
                id="login-pass"
                label="Access Key" 
                type="password" 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
              />
              <div className="pt-6 flex flex-col gap-4">
                <button type="submit" className="w-full py-4 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded shadow-[0_0_20px_rgba(161,0,255,0.4)] transition-all">
                  INITIALIZE
                </button>
                <button type="button" onClick={() => setMode('welcome')} className="text-[10px] text-slate-600 hover:text-slate-400 uppercase tracking-tighter text-center">
                  Abort Mission
                </button>
              </div>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleAction} className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-center text-slate-100 font-bold text-sm tracking-widest uppercase mb-6">New Recruit</h2>
              <InputField 
                id="reg-user"
                label="New Identity" 
                type="text" 
                value={formData.user} 
                onChange={(e) => setFormData({...formData, user: e.target.value})}
                placeholder="3-12 characters"
              />
              <InputField 
                id="reg-email"
                label="Communication Link" 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="email@link.com"
              />
              <InputField 
                id="reg-pass"
                label="Secret Key" 
                type="password" 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
              />
              <div className="flex items-center gap-3 py-2 bg-slate-950/50 p-3 rounded">
                <input 
                  type="checkbox" 
                  id="terms" 
                  required 
                  checked={formData.terms} 
                  onChange={(e) => setFormData({...formData, terms: e.target.checked})}
                  className="w-5 h-5 accent-purple-600 bg-black cursor-pointer"
                />
                <label htmlFor="terms" className="text-[9px] text-slate-500 leading-tight cursor-pointer">I consent to the Groopa protocols and terms of service</label>
              </div>
              <div className="pt-4 flex flex-col gap-4">
                <button type="submit" className="w-full py-4 bg-slate-100 hover:bg-white text-black font-bold rounded transition-all">
                  REGISTER UNIT
                </button>
                <button type="button" onClick={() => setMode('welcome')} className="text-[10px] text-slate-600 hover:text-slate-400 uppercase text-center">
                  Back to Gateway
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="mt-16 flex gap-12 text-[10px] text-slate-700 uppercase font-bold tracking-[0.4em]">
        <div className="flex items-center gap-2"><span className="w-2 h-2 bg-slate-800 rounded-full"></span> WASD MOVE</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 bg-slate-800 rounded-full"></span> SPACE ATTACK</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 bg-slate-800 rounded-full"></span> V INV</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 bg-slate-800 rounded-full"></span> C CHAR</div>
      </div>
    </div>
  );
};

export default TitleScreen;

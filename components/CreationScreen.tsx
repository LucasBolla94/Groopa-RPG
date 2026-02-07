
import React, { useState, useEffect, useRef } from 'react';
import { ClassType } from '../types';
import { getEntitySprite } from '../game/sprites';

interface Props {
  onCreate: (name: string, type: ClassType) => void;
}

const CharacterPreview: React.FC<{ type: ClassType }> = ({ type }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let frame = 0;
    let animId: number;
    
    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;

      // Draw shadow
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, canvas.height - 20, 40, 15, 0, 0, Math.PI * 2);
      ctx.fill();

      const animFrame = Math.floor(Date.now() / 400) % 2;
      // Fixed: getEntitySprite expects 3-4 arguments, removed extra 5th argument.
      const sprite = getEntitySprite(type, 'down', animFrame, false);
      
      // Scale up 6x
      const size = 192; 
      ctx.drawImage(sprite, (canvas.width - size) / 2, (canvas.height - size) / 2, size, size);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [type]);

  return (
    <div className="relative w-full h-full flex items-center justify-center group">
      {/* Background Glow */}
      <div className={`absolute w-48 h-48 rounded-full blur-[80px] opacity-30 transition-colors duration-1000 ${
        type === ClassType.WARRIOR ? 'bg-blue-500' : type === ClassType.MAGE ? 'bg-purple-600' : 'bg-green-500'
      }`}></div>
      <canvas ref={canvasRef} width={300} height={300} className="relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
    </div>
  );
};

const CreationScreen: React.FC<Props> = ({ onCreate }) => {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<ClassType>(ClassType.WARRIOR);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.length >= 3 && name.length <= 16) {
      onCreate(name, selectedClass);
    }
  };

  const classInfo = {
    [ClassType.WARRIOR]: {
      title: "VANGUARD JUGGERNAUT",
      desc: "Impenetrable defense and crushing physical might. The Warrior excels in the thick of battle, absorbing damage that would fell others.",
      color: "text-blue-400",
      border: "border-blue-900",
      bg: "bg-blue-950/20"
    },
    [ClassType.MAGE]: {
      title: "ARCANE ARCHON",
      desc: "Wielder of primal forces. The Mage commands reality itself, unleashing devastating magical barrages from afar at the cost of physical frailty.",
      color: "text-purple-400",
      border: "border-purple-900",
      bg: "bg-purple-950/20"
    },
    [ClassType.ELF]: {
      title: "SYLVAN STALKER",
      desc: "Graceful and deadly. The Elf utilizes superior speed and precision to pick off targets before they even realize they are in danger.",
      color: "text-green-400",
      border: "border-green-900",
      bg: "bg-green-950/20"
    }
  };

  const info = classInfo[selectedClass];

  return (
    <div className="flex w-full h-full bg-slate-950 text-white overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
      </div>

      {/* Left Panel: Selection */}
      <div className="w-1/2 flex flex-col items-center justify-center p-12 z-20 bg-slate-900/40 backdrop-blur-sm border-r border-white/5">
        <div className="w-full max-w-md space-y-12">
          <header className="space-y-2">
            <h2 className="text-5xl font-black tracking-tighter text-slate-100">CHARACTER <span className="text-yellow-600">FORGE</span></h2>
            <p className="text-slate-500 uppercase tracking-[0.3em] text-[10px]">Prepare your vessel for the Groopa realm</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Identify Your Avatar</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-4 bg-black/40 border-2 border-slate-800 rounded-lg focus:border-yellow-600 focus:outline-none transition-all text-xl font-bold tracking-wider placeholder:text-slate-800"
                placeholder="NAME..."
                maxLength={16}
                required
                autoFocus
              />
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Choose Your Path</label>
              <div className="grid grid-cols-3 gap-4">
                {Object.values(ClassType).map(ct => (
                  <button
                    key={ct}
                    type="button"
                    onClick={() => setSelectedClass(ct)}
                    className={`relative py-6 px-2 rounded-lg font-black border-2 transition-all overflow-hidden group ${
                      selectedClass === ct 
                        ? 'border-yellow-600 bg-yellow-600/10 text-yellow-500 scale-105 shadow-[0_0_30px_rgba(202,138,4,0.2)]' 
                        : 'bg-black/40 border-slate-800 text-slate-600 grayscale hover:grayscale-0 hover:border-slate-600'
                    }`}
                  >
                    <span className="relative z-10 text-xs tracking-widest uppercase">{ct}</span>
                    {selectedClass === ct && <div className="absolute inset-0 bg-yellow-600/5 animate-pulse"></div>}
                  </button>
                ))}
              </div>
            </div>

            <div className={`p-6 rounded-lg border-2 transition-all duration-500 ${info.border} ${info.bg} space-y-3`}>
                <h4 className={`text-sm font-black tracking-widest ${info.color}`}>{info.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed italic">{info.desc}</p>
            </div>

            <button 
              type="submit"
              disabled={name.length < 3}
              className="group relative w-full py-6 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed text-black font-black rounded-lg shadow-2xl transition-all active:scale-95 overflow-hidden"
            >
              <div className="relative z-10 tracking-[0.4em] uppercase text-sm">EMBARK JOURNEY</div>
              <div className="absolute top-0 -left-full w-full h-full bg-white/20 skew-x-[-45deg] group-hover:left-[150%] transition-all duration-700 ease-in-out"></div>
            </button>
          </form>
        </div>
      </div>

      {/* Right Panel: Massive Preview */}
      <div className="w-1/2 h-full flex items-center justify-center relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10"></div>
        
        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '64px 64px'}}></div>

        <div className="z-10 w-full h-full transform scale-125 hover:scale-150 transition-transform duration-[2000ms] ease-out">
          <CharacterPreview type={selectedClass} />
        </div>

        {/* Floating Stat Bars (Decorative) */}
        <div className="absolute bottom-12 right-12 z-20 space-y-4 w-64 pointer-events-none opacity-40">
           <div className="space-y-1">
             <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500"><span>Spirit Resonance</span></div>
             <div className="h-1 w-full bg-slate-900"><div className="h-full bg-yellow-600 w-[70%]"></div></div>
           </div>
           <div className="space-y-1">
             <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500"><span>Void Capacity</span></div>
             <div className="h-1 w-full bg-slate-900"><div className="h-full bg-slate-600 w-[40%]"></div></div>
           </div>
        </div>
      </div>

      {/* Thematic corners */}
      <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-white/10 pointer-events-none"></div>
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-white/10 pointer-events-none"></div>
    </div>
  );
};

export default CreationScreen;

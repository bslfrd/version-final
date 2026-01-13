
import React, { useState, useEffect, useCallback } from 'react';
import { DrawingCanvas } from './components/DrawingCanvas';
import { AboutModal } from './components/AboutModal';
import { Confetti } from './components/Confetti';
import { AppMode, Point, Stroke, Difficulty } from './types';
import { CHALLENGE_SHAPES, calculateSimilarity } from './utils';
import { 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Trash2, 
  Info, 
  Brain,
  Play,
  Trophy,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Settings2,
  PenTool,
  Eraser,
  Circle,
  Download,
  ChevronRight,
  X,
  Star
} from 'lucide-react';

const COLORS = [
  '#1c1917', // stone-900
  '#ef4444', // red-500
  '#3b82f6', // blue-500
  '#22c55e', // green-500
];

const WIDTHS = [
  { label: 'Fin', value: 2 },
  { label: 'Moyen', value: 5 },
  { label: 'Épais', value: 10 },
];

type ChallengeState = 'IDLE' | 'PREVIEW' | 'DRAWING' | 'RESULT';
type Tool = 'PEN' | 'ERASER';

const App: React.FC = () => {
  const [showLaunchScreen, setShowLaunchScreen] = useState<boolean>(true);
  const [mode, setMode] = useState<AppMode>(AppMode.NORMAL);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [tool, setTool] = useState<Tool>('PEN');
  const [color, setColor] = useState<string>(COLORS[0]);
  const [strokeWidth, setStrokeWidth] = useState<number>(WIDTHS[1].value);
  const [showAbout, setShowAbout] = useState<boolean>(false);
  const [showModePanel, setShowModePanel] = useState<boolean>(false);
  
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [triggerClear, setTriggerClear] = useState<number>(0);
  const [triggerUndo, setTriggerUndo] = useState<number>(0);
  const [triggerExport, setTriggerExport] = useState<number>(0);

  const [challengeState, setChallengeState] = useState<ChallengeState>('IDLE');
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);
  const [lastShapeName, setLastShapeName] = useState<string | null>(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [userStrokes, setUserStrokes] = useState<Stroke[]>([]);
  const [previewTimer, setPreviewTimer] = useState(3);

  const threshold = difficulty === Difficulty.EASY ? 60 : difficulty === Difficulty.MEDIUM ? 75 : 85;

  const handlePlay = () => {
    setShowLaunchScreen(false);
    setMode(AppMode.NORMAL);
    setTriggerClear(n => n + 1);
  };

  const startChallenge = useCallback(() => {
    const availableShapes = CHALLENGE_SHAPES.filter(
      s => s.difficulty === difficulty && s.name !== lastShapeName
    );
    
    const finalSelection = availableShapes.length > 0 
      ? availableShapes 
      : CHALLENGE_SHAPES.filter(s => s.difficulty === difficulty);

    const randomIdx = Math.floor(Math.random() * finalSelection.length);
    const pickedShape = finalSelection[randomIdx];
    const globalIdx = CHALLENGE_SHAPES.findIndex(s => s.name === pickedShape.name);
    
    setLastShapeName(pickedShape.name);
    setCurrentShapeIndex(globalIdx);
    setChallengeState('PREVIEW');
    setTriggerClear(n => n + 1);
    
    const time = difficulty === Difficulty.EASY ? 6 : difficulty === Difficulty.MEDIUM ? 4 : 3;
    setPreviewTimer(time);
    setUserStrokes([]);
  }, [difficulty, lastShapeName]);

  const finishChallenge = () => {
    const shape = CHALLENGE_SHAPES[currentShapeIndex];
    const flatPoints: Point[] = userStrokes.flatMap(s => s.points);
    let score = calculateSimilarity(flatPoints, shape.points);
    
    let penalty = 0;
    const lastStroke = userStrokes[userStrokes.length - 1];
    
    if (lastStroke) {
      if (shape.targetColor && lastStroke.color !== shape.targetColor) penalty += 15;
      if (shape.targetWidth && lastStroke.width !== shape.targetWidth) penalty += 15;
    } else {
      penalty = 100;
    }

    setCurrentScore(Math.max(0, score - penalty));
    setChallengeState('RESULT');
  };

  useEffect(() => {
    if (mode === AppMode.CHALLENGE && challengeState === 'PREVIEW') {
      if (previewTimer > 0) {
        const timer = setTimeout(() => setPreviewTimer(t => t - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setChallengeState('DRAWING');
      }
    }
  }, [mode, challengeState, previewTimer]);

  const selectMode = (newMode: AppMode) => {
    setMode(newMode);
    setShowModePanel(false);
    setChallengeState('IDLE');
    setTriggerClear(n => n + 1);
  };

  const hasWon = currentScore >= threshold;
  const currentChallenge = CHALLENGE_SHAPES[currentShapeIndex];

  if (showLaunchScreen) {
    return (
      <div className="fixed inset-0 bg-stone-100 flex flex-col items-center justify-center p-8 z-[100] overflow-y-auto">
        <div className="max-w-md w-full text-center space-y-12 animate-in fade-in zoom-in duration-700">
          <header>
            <h1 className="text-6xl font-serif font-bold text-stone-900 tracking-tight">Silence.</h1>
            <p className="text-xs text-stone-400 font-black tracking-[0.5em] uppercase mt-3">L'Art du Trait Retenu</p>
          </header>

          <div className="space-y-4 text-left">
            {[
              { m: 'Mode Libre', d: 'Dessinez naturellement, le trait suit votre doigt.', icon: Eye },
              { m: 'Mode Silence', d: 'Le trait n\'apparaît qu\'une fois le doigt levé.', icon: EyeOff },
              { m: 'Jeu Aveugle', d: 'Mémorisez une forme et redessinez-la de mémoire.', icon: Sparkles },
            ].map((item) => (
              <div key={item.m} className="flex items-center gap-5 p-5 rounded-3xl bg-white/60 border border-stone-200 shadow-sm">
                <div className="p-3 bg-stone-900 text-white rounded-2xl shrink-0"><item.icon size={20} /></div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm tracking-tight">{item.m}</h3>
                  <p className="text-[11px] text-stone-500 leading-tight mt-0.5">{item.d}</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={handlePlay}
            className="w-full py-6 bg-stone-900 text-white rounded-[2.5rem] font-bold text-xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
          >
            <Play fill="currentColor" size={24} /> Entrer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-stone-100 flex flex-col overflow-hidden">
      
      {/* En-tête Dynamique */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-30 pointer-events-none pt-[calc(1.5rem+env(safe-area-inset-top))]">
        <div className="pointer-events-auto flex flex-col gap-2">
          <div className="bg-white/70 backdrop-blur-md px-5 py-3 rounded-2xl border border-stone-200 shadow-sm">
            <h1 className="text-xl font-serif font-bold text-stone-900 leading-none">Silence.</h1>
            <p className="text-[9px] text-stone-400 font-black tracking-widest uppercase mt-1">{mode}</p>
          </div>

          {/* Score Challenge Célébré */}
          {challengeState === 'RESULT' && (
            <div className={`px-5 py-4 rounded-3xl shadow-2xl border transition-all duration-700 animate-in slide-in-from-left-4 pointer-events-auto ${hasWon ? 'bg-amber-400 border-amber-300 text-stone-900 scale-110 shadow-amber-200/50' : 'bg-stone-900 text-white border-white/10'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl flex items-center justify-center ${hasWon ? 'bg-stone-900 text-amber-400 animate-bounce' : 'bg-white/10 text-stone-400'}`}>
                  {hasWon ? <Trophy size={24} /> : <RefreshCw size={24} />}
                </div>
                <div>
                  <div className="text-3xl font-serif font-bold leading-none">{currentScore}%</div>
                  <div className={`text-[9px] font-black uppercase tracking-widest mt-1 opacity-60 ${hasWon ? 'text-stone-800' : 'text-stone-400'}`}>
                    {hasWon ? 'Harmonie Atteinte' : 'Précision'}
                  </div>
                </div>
                {hasWon && <Star className="text-stone-900 ml-1 fill-stone-900 animate-pulse" size={18} />}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 pointer-events-auto">
          <button 
            onClick={() => setShowAbout(true)}
            className="p-4 bg-white/50 backdrop-blur-md rounded-2xl border border-stone-200 shadow-sm text-stone-600 hover:text-stone-900 transition-colors"
          >
            <Info size={20} />
          </button>
          <button 
            onClick={() => setShowModePanel(!showModePanel)}
            className="p-4 bg-white/50 backdrop-blur-md rounded-2xl border border-stone-200 shadow-sm text-stone-600 hover:text-stone-900 transition-colors"
          >
            <Settings2 size={20} />
          </button>
        </div>
      </header>

      {/* Zone de Dessin */}
      <main className="flex-1 relative overflow-hidden">
        <DrawingCanvas 
          mode={mode}
          color={tool === 'ERASER' ? '#f5f5f4' : color}
          strokeWidth={strokeWidth}
          onUndoAvailabilityChange={setCanUndo}
          triggerClear={triggerClear}
          triggerUndo={triggerUndo}
          triggerExport={triggerExport}
          referenceShape={mode === AppMode.CHALLENGE && challengeState !== 'IDLE' ? CHALLENGE_SHAPES[currentShapeIndex].points : null}
          showReference={mode === AppMode.CHALLENGE && (challengeState === 'PREVIEW' || challengeState === 'RESULT')}
          onStrokesChange={setUserStrokes}
        />

        {/* Confettis lors de la victoire */}
        {mode === AppMode.CHALLENGE && challengeState === 'RESULT' && hasWon && <Confetti />}

        {/* Rappel d'outil challenge */}
        {mode === AppMode.CHALLENGE && challengeState === 'DRAWING' && (currentChallenge.targetColor || currentChallenge.targetWidth) && (
          <div className="absolute top-36 left-1/2 -translate-x-1/2 z-[45] pointer-events-none animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-4 px-5 py-3 bg-white/80 backdrop-blur-md shadow-xl rounded-2xl border border-stone-100">
              <span className="text-[9px] font-black uppercase tracking-widest text-stone-400">Requis :</span>
              <div className="flex gap-3 items-center">
                {currentChallenge.targetColor && <div className="w-5 h-5 rounded-full border border-stone-200" style={{ backgroundColor: currentChallenge.targetColor }} />}
                {currentChallenge.targetWidth && <Circle size={currentChallenge.targetWidth === 2 ? 8 : 14} fill="currentColor" className="text-stone-900" />}
              </div>
            </div>
          </div>
        )}

        {/* Menu Initial Challenge */}
        {mode === AppMode.CHALLENGE && challengeState === 'IDLE' && (
           <div className="absolute inset-0 flex items-center justify-center bg-stone-100/40 backdrop-blur-sm z-10 p-6 pointer-events-auto">
              <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl text-center max-w-sm w-full border border-stone-100 animate-in zoom-in-95 duration-500">
                <Brain size={42} className="mx-auto mb-4 text-stone-900" />
                <h3 className="text-2xl font-serif font-bold text-stone-900 mb-6 tracking-tight">Défi Aveugle</h3>
                <div className="flex bg-stone-100 p-1.5 rounded-[2rem] mb-8 gap-1">
                   {[Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD].map(d => (
                     <button
                       key={d}
                       onClick={() => setDifficulty(d)}
                       className={`flex-1 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${difficulty === d ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400 hover:text-stone-600'}`}
                     >
                       {d}
                     </button>
                   ))}
                </div>
                <button 
                  onClick={startChallenge}
                  className="w-full py-5 bg-stone-900 text-white rounded-3xl font-bold flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.03] transition-transform"
                >
                  <Play size={18} fill="currentColor" /> Lancer
                </button>
              </div>
           </div>
        )}

        {/* Prévisualisation Timer */}
        {challengeState === 'PREVIEW' && (
           <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 text-center">
              <div className="text-[10rem] font-serif font-bold text-stone-900 opacity-20 animate-pulse leading-none">{previewTimer}</div>
              <div className="mt-4 text-stone-500 font-serif text-3xl font-bold uppercase tracking-widest">{currentChallenge.name}</div>
           </div>
        )}

        {/* Bouton de validation pendant le dessin */}
        {challengeState === 'DRAWING' && userStrokes.length > 0 && (
           <div className="absolute bottom-40 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
              <button 
                onClick={finishChallenge} 
                className="px-14 py-5 bg-stone-900 text-white rounded-full font-bold shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-10"
              >
                Vérifier <ArrowRight size={20} />
              </button>
           </div>
        )}
      </main>

      {/* Barre d'Outils (Footer) */}
      <footer className="p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] z-40 bg-stone-100/80 backdrop-blur-sm pointer-events-none">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex items-center justify-between gap-4">
            
            <div className="flex-grow bg-white/95 rounded-[2.5rem] shadow-xl border border-stone-200 p-2 flex items-center justify-between pointer-events-auto overflow-hidden">
              
              {challengeState !== 'RESULT' ? (
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                  <div className="flex bg-stone-100 rounded-2xl p-1 gap-1 shrink-0">
                    <button onClick={() => setTool('PEN')} className={`p-4 rounded-xl transition-all ${tool === 'PEN' ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400'}`}><PenTool size={18} /></button>
                    <button onClick={() => setTool('ERASER')} className={`p-4 rounded-xl transition-all ${tool === 'ERASER' ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400'}`}><Eraser size={18} /></button>
                  </div>
                  
                  <div className="flex gap-2 px-3 border-r border-stone-100 shrink-0">
                    {COLORS.map(c => (
                      <button key={c} onClick={() => { setColor(c); setTool('PEN'); }} className={`w-7 h-7 rounded-full border-2 transition-all ${color === c && tool === 'PEN' ? 'scale-110 border-stone-900' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                    ))}
                  </div>

                  <div className="flex gap-1 px-2 items-center shrink-0">
                    {WIDTHS.map(w => (
                      <button 
                        key={w.value} 
                        onClick={() => setStrokeWidth(w.value)}
                        className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all ${strokeWidth === w.value ? 'bg-stone-100 text-stone-900' : 'text-stone-300'}`}
                      >
                        <Circle size={4 + (w.value * 0.7)} fill="currentColor" />
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 pr-2 ml-auto">
                    <button onClick={() => setTriggerExport(n => n + 1)} className="p-3 text-stone-300 hover:text-stone-900 transition-colors" title="Exporter"><Download size={20} /></button>
                    <button onClick={() => setTriggerUndo(n => n + 1)} disabled={!canUndo} className="p-3 text-stone-300 hover:text-stone-900 disabled:opacity-10" title="Annuler"><RotateCcw size={20} /></button>
                    <button onClick={() => setTriggerClear(n => n + 1)} className="p-3 text-red-100 hover:text-red-500" title="Effacer"><Trash2 size={20} /></button>
                  </div>
                </div>
              ) : (
                /* Mode RÉSULTAT avec option Exporter */
                <div className="flex-1 flex items-center justify-between px-4 py-2 animate-in fade-in slide-in-from-bottom-2">
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase text-stone-400 tracking-widest">Défi Terminé</span>
                      <span className="text-xs font-bold text-stone-900">{currentChallenge.name}</span>
                   </div>
                   <div className="flex gap-2 items-center">
                     <button 
                        onClick={() => setTriggerExport(n => n + 1)} 
                        className="p-3 text-stone-400 hover:text-stone-900 transition-colors mr-2"
                        title="Sauvegarder mon trait"
                      >
                        <Download size={20} />
                     </button>
                     <button 
                       onClick={() => setChallengeState('IDLE')}
                       className="px-5 py-3 bg-stone-100 text-stone-500 rounded-2xl font-bold text-xs"
                     >
                       Quitter
                     </button>
                     <button 
                       onClick={startChallenge}
                       className={`px-8 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all ${hasWon ? 'bg-amber-400 text-stone-900 hover:bg-amber-300' : 'bg-stone-900 text-white'}`}
                     >
                       Nouveau Défi <ChevronRight size={16} />
                     </button>
                   </div>
                </div>
              )}
            </div>

            <button onClick={() => setShowModePanel(true)} className="h-16 w-16 shrink-0 bg-stone-900 text-white rounded-full shadow-xl flex items-center justify-center pointer-events-auto active:scale-90 transition-transform"><Settings2 size={24} /></button>
          </div>
        </div>
      </footer>

      {/* Drawer Mode de Jeu */}
      <div className={`fixed inset-0 z-[60] flex items-end justify-center transition-all ${showModePanel ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setShowModePanel(false)} />
        <div className={`relative bg-white w-full max-w-lg rounded-t-[4rem] p-12 pb-[calc(3rem+env(safe-area-inset-bottom))] shadow-2xl transition-transform duration-500 ease-in-out ${showModePanel ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="w-16 h-1.5 bg-stone-100 rounded-full mx-auto mb-10" />
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: AppMode.NORMAL, label: 'Libre', icon: Eye },
              { id: AppMode.SILENCE, label: 'Silence', icon: EyeOff },
              { id: AppMode.CHALLENGE, label: 'Défi', icon: Sparkles },
            ].map(m => (
              <button 
                key={m.id}
                onClick={() => selectMode(m.id)}
                className={`flex flex-col items-center gap-4 p-4 rounded-[2.5rem] border transition-all ${mode === m.id ? 'bg-stone-900 text-white border-stone-900 shadow-xl' : 'bg-stone-50 text-stone-600 border-stone-100'}`}
              >
                <m.icon size={24} />
                <span className="text-[11px] font-bold uppercase tracking-widest">{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  );
};

export default App;

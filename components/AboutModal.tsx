import React from 'react';
import { X, EyeOff, Wind, Zap, Hash, Sparkles, Eye, Brain } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh] border border-stone-100">
        <div className="p-8 pb-0 flex justify-between items-start">
          <div className="flex flex-col">
            <h2 className="text-3xl font-serif font-bold text-stone-900 leading-tight">Silence.</h2>
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">Rituel du Trait</p>
          </div>
          <button onClick={onClose} className="p-2 -mr-2 text-stone-300 hover:text-stone-800 transition-colors">
            <X size={28} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-10">
          
          <section>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-4">Philosophie</h3>
            <p className="text-lg text-stone-700 font-serif leading-relaxed">
              La maîtrise spatiale commence lorsque vous cessez de vous fier à vos yeux pour faire confiance à votre main.
            </p>
          </section>

          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-4">Les Modes</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="bg-stone-50 p-3 rounded-2xl shrink-0 text-stone-600 border border-stone-100">
                  <Eye size={22} />
                </div>
                <div>
                  <span className="block font-bold text-stone-900">Mode Libre</span>
                  <span className="text-xs text-stone-500 leading-relaxed">Dessin standard. Les lignes apparaissent instantanément sous votre toucher.</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-stone-50 p-3 rounded-2xl shrink-0 text-stone-600 border border-stone-100">
                  <EyeOff size={22} />
                </div>
                <div>
                  <span className="block font-bold text-stone-900">Mode Silence</span>
                  <span className="text-xs text-stone-500 leading-relaxed">Le trait est masqué pendant le dessin. Il ne se révèle qu'une fois le doigt levé.</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-stone-50 p-3 rounded-2xl shrink-0 text-stone-600 border border-stone-100">
                  <Sparkles size={22} />
                </div>
                <div>
                  <span className="block font-bold text-stone-900">Jeu Aveugle</span>
                  <span className="text-xs text-stone-500 leading-relaxed">Mémorisez une forme, redessinez-la de mémoire. Atteignez l'Harmonie pour maîtriser le trait.</span>
                </div>
              </li>
            </ul>
          </section>

        </div>

        <div className="p-8 pt-0 mt-auto">
           <button 
             onClick={onClose}
             className="w-full py-5 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-all shadow-xl shadow-stone-200"
           >
             Entrer dans le Silence
           </button>
        </div>
      </div>
    </div>
  );
};
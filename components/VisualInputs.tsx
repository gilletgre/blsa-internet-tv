import React from 'react';
import { Check } from 'lucide-react';

// --- Visual Option Card (Light Mode - Expanded) ---
interface OptionCardProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  accentColor?: string;
}

export const OptionCard: React.FC<OptionCardProps> = ({ 
  selected, onClick, title, description, icon, accentColor = "bg-brand-500" 
}) => {
  const activeBorder = selected ? 'border-brand-500 ring-2 ring-brand-500 ring-opacity-50' : 'border-slate-200 hover:border-slate-300';
  const activeBg = selected ? 'bg-brand-50/50' : 'bg-white hover:bg-slate-50';

  return (
    <div 
      onClick={onClick}
      className={`relative group cursor-pointer rounded-3xl p-8 border-2 transition-all duration-300 ease-out overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1
        ${activeBg} ${activeBorder}
      `}
    >
      <div className="flex items-start justify-between gap-6 relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            {icon && (
              <div className={`p-3 rounded-2xl transition-colors ${selected ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:shadow-md group-hover:text-brand-500'}`}>
                {icon}
              </div>
            )}
            <h3 className={`font-bold text-2xl ${selected ? 'text-brand-900' : 'text-slate-800'}`}>{title}</h3>
          </div>
          {description && <p className="text-base text-slate-500 leading-relaxed font-medium">{description}</p>}
        </div>
        
        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0
          ${selected ? 'border-brand-500 bg-brand-500' : 'border-slate-200 group-hover:border-slate-300'}
        `}>
          {selected && <Check size={18} className="text-white" strokeWidth={3} />}
        </div>
      </div>
    </div>
  );
};

// --- Modern Toggle Switch (Light Mode - Expanded) ---
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label }) => (
  <div 
    className={`flex items-center justify-between p-6 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md ${checked ? 'bg-brand-50 border-brand-200' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
    onClick={() => onChange(!checked)}
  >
    <span className={`font-bold text-lg ${checked ? 'text-brand-800' : 'text-slate-700'}`}>{label}</span>
    <div className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${checked ? 'bg-brand-500' : 'bg-slate-200'}`}>
      <div className={`bg-white w-6 h-6 rounded-full shadow-sm transform transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
    </div>
  </div>
);

// --- Styled Text Input (Light Mode - Expanded) ---
interface VisualInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export const VisualInput: React.FC<VisualInputProps> = ({ label, icon, className, ...props }) => (
  <div className="group w-full">
    <label className="block text-xs uppercase tracking-widest font-bold text-slate-400 mb-2.5 ml-1 group-focus-within:text-brand-600 transition-colors">{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors">{icon}</div>}
      <input
        className={`w-full ${icon ? 'pl-14' : 'pl-6'} pr-6 py-4 rounded-2xl bg-white border-2 border-slate-200 text-slate-800 font-medium placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all shadow-sm group-hover:border-slate-300 ${className}`}
        {...props}
      />
    </div>
  </div>
);
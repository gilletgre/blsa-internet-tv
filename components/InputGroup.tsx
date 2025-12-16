import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className, ...props }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
    <div className="relative">
      <input
        className={`w-full px-4 py-2.5 bg-white border ${error ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-primary-400 focus:ring-primary-100'} rounded-xl text-slate-800 focus:outline-none focus:ring-4 transition-all duration-200 ${props.disabled ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : ''} ${className}`}
        {...props}
      />
      {icon && <div className="absolute right-3 top-2.5 text-slate-400 pointer-events-none">{icon}</div>}
    </div>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

export const Select: React.FC<SelectProps> = ({ label, options, ...props }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
    <div className="relative">
      <select
        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 focus:outline-none appearance-none transition-all duration-200"
        {...props}
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="absolute right-4 top-3.5 pointer-events-none">
        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  </div>
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  onAiAssist?: () => void;
  isAiLoading?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({ label, onAiAssist, isAiLoading, ...props }) => (
  <div className="w-full">
    <div className="flex justify-between items-center mb-1.5">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      {onAiAssist && (
        <button 
          type="button"
          onClick={onAiAssist}
          disabled={isAiLoading || props.disabled}
          className="text-xs flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50 transition-colors"
        >
           {isAiLoading ? (
             <span className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full" />
           ) : (
             <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
           )}
           Refine with AI
        </button>
      )}
    </div>
    <textarea
      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 focus:outline-none transition-all duration-200 min-h-[100px]"
      {...props}
    />
  </div>
);
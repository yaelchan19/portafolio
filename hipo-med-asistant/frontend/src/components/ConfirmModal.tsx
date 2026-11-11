import React from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { surfaceLight, textPrimary, textMuted, accentBorder } from '../theme/colors';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const icons = {
    danger: <X className="text-rose-400" size={32} />,
    warning: <AlertTriangle className="text-amber-400" size={32} />,
    info: <Info className="text-sky-400" size={32} />,
    success: <CheckCircle className="text-emerald-400" size={32} />
  };

  const colors = {
    danger: 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20',
    warning: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20',
    info: 'bg-sky-500 hover:bg-sky-600 shadow-sky-500/20',
    success: 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`relative w-full max-w-md overflow-hidden rounded-[2.5rem] border ${accentBorder} ${surfaceLight} shadow-2xl animate-in zoom-in-95 duration-300`}>
        <div className="p-8">
          <div className="flex flex-col items-center text-center">
            {/* Icon Circle */}
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white/5 border border-white/10 shadow-inner">
              {icons[type]}
            </div>
            
            <h3 className={`mb-2 text-2xl font-black tracking-tight ${textPrimary} uppercase`}>
              {title}
            </h3>
            
            <p className={`mb-8 text-sm font-medium leading-relaxed ${textMuted}`}>
              {message}
            </p>
            
            <div className="flex w-full gap-4">
              <button
                onClick={onClose}
                className="flex-1 rounded-2xl border border-white/5 bg-white/5 py-4 text-xs font-black uppercase tracking-widest text-slate-400 transition hover:bg-white/10 active:scale-95"
              >
                {cancelText}
              </button>
              
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 rounded-2xl py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg transition active:scale-95 ${colors[type]}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative corner accent */}
        <div className="absolute -right-4 -top-4 h-16 w-16 bg-white/5 blur-2xl rounded-full" />
        <div className="absolute -left-4 -bottom-4 h-16 w-16 bg-white/5 blur-2xl rounded-full" />
      </div>
    </div>
  );
};

export default ConfirmModal;

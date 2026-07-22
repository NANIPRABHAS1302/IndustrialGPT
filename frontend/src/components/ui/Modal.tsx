import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

type ModalProps = {
  open: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
};

export function Modal({ open, title, children, onClose, className }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
      <div className={cn('w-full max-w-lg rounded-2xl border border-slate-800/80 bg-slate-900/95 p-5 shadow-glow', className)}>
        <div className="flex items-center justify-between">
          {title ? <h3 className="text-lg font-semibold text-slate-100">{title}</h3> : <div />}
          <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800/70 hover:text-slate-100" onClick={onClose} aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

import { ReactNode } from 'react';
import { Modal } from '@/components/ui/Modal';

type DialogProps = {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
};

export function Dialog({ open, title, description, children, onClose }: DialogProps) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      {description ? <p className="mb-4 text-sm text-slate-400">{description}</p> : null}
      {children}
    </Modal>
  );
}

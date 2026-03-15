import styles from './Modal.module.scss';
import Button from '../Button/Button';
import { X } from 'lucide-react';

type ModalProps = {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({ title, open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className={styles.backdrop} onMouseDown={onClose}>
      <div
        className={styles.modal}
        onMouseDown={(e) => e.stopPropagation()}
        role='dialog'
        aria-modal='true'
        aria-label={title}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <Button
            variant='outline'
            color='neutral'
            size='md'
            onClick={onClose}
            className={styles.closeBtn}
          >
            <X size={16} />
          </Button>
        </div>

        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}

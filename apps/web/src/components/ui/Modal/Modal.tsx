// import { useEffect } from 'react';
import styles from './Modal.module.scss';

// export function Modal({
//   title,
//   open,
//   onClose,
//   children,
// }: {
//   title: string;
//   open: boolean;
//   onClose: () => void;
//   children: React.ReactNode;
// }) {
//   useEffect(() => {
//     if (!open) return;

//     function onKey(e: KeyboardEvent) {
//       if (e.key === 'Escape') onClose();
//     }
//     window.addEventListener('keydown', onKey);
//     return () => window.removeEventListener('keydown', onKey);
//   }, [open, onClose]);

//   if (!open) return null;

//   return (
//     <div className={styles.backdrop} onMouseDown={onClose}>
//       <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
//         <div className={styles.header}>
//           <h3 className={styles.title}>{title}</h3>
//           <button className={styles.close} onClick={onClose}>
//             Close
//           </button>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// }

type ModalProps = {
  title: string;
  open: boolean;
  onClose: () => void;
  // onSave?: () => void;
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
          <button type='button' onClick={onClose} className={styles.closeBtn}>
            ✕
          </button>
        </div>

        <div className={styles.body}>{children}</div>

        {/* <div className={styles.footer}>
          <button type='button' onClick={onClose}>
            Cancel
          </button>
          <button type='button' onClick={onSave}>
            Save
          </button>
        </div> */}
      </div>
    </div>
  );
}

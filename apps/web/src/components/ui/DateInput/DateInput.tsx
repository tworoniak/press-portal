import {
  forwardRef,
  useId,
  useRef,
  type InputHTMLAttributes,
  type MouseEvent,
} from 'react';
import { Calendar } from 'lucide-react';
import styles from './DateInput.module.scss';

type DateInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string;
  error?: string;
};

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ id, label, error, className = '', disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const innerRef = useRef<HTMLInputElement | null>(null);

    const setRefs = (node: HTMLInputElement | null) => {
      innerRef.current = node;

      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const handleIconClick = (e: MouseEvent<SVGSVGElement>) => {
      e.preventDefault();

      if (disabled) return;

      innerRef.current?.focus();

      if ('showPicker' in HTMLInputElement.prototype) {
        innerRef.current?.showPicker();
      }
    };

    return (
      <div className={styles.field}>
        {label ? (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        ) : null}

        <div
          className={`${styles.inputWrapper} ${error ? styles.hasError : ''} ${
            disabled ? styles.isDisabled : ''
          }`}
        >
          <input
            id={inputId}
            ref={setRefs}
            type='date'
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={`${styles.input} ${className}`}
            {...props}
          />

          <Calendar
            size={18}
            className={styles.calendarIcon}
            onClick={handleIconClick}
            aria-hidden='true'
          />
        </div>

        {error ? (
          <p id={`${inputId}-error`} className={styles.error}>
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

DateInput.displayName = 'DateInput';

export default DateInput;

import type { ChangeEvent } from 'react';

type Option<T extends string> = {
  value: T;
  label: string;
};

type SelectFieldProps<T extends string> = {
  label?: string;
  value: T;
  options: readonly Option<T>[];
  onChange: (value: T) => void;
  id?: string;
  name?: string;
  disabled?: boolean;
};

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  id,
  name,
  disabled,
}: SelectFieldProps<T>) {
  const selectId = id ?? name;

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    // safe because options are controlled
    onChange(e.target.value as T);
  }

  return (
    <label style={{ display: 'grid', gap: 6 }}>
      {label ? (
        <span style={{ fontSize: 12, opacity: 0.75 }}>{label}</span>
      ) : null}
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={handleChange}
        disabled={disabled}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

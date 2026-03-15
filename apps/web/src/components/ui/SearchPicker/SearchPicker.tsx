import { useMemo } from 'react';

import Button from '../Button/Button';

import styles from './SearchPicker.module.scss';

type IdName = { id: string; name: string };

type SearchPickerProps<TItem> = {
  label: string;
  placeholder?: string;

  // input state
  query: string;
  onQueryChange: (v: string) => void;

  // selected state
  selected: IdName | null;
  onSelectedChange: (v: IdName | null) => void;

  // query results
  items: TItem[] | undefined;
  isLoading?: boolean;
  isError?: boolean;
  emptyText?: string;

  // how to display results
  getKey: (item: TItem) => string;
  getName: (item: TItem) => string;
  renderMeta?: (item: TItem) => React.ReactNode;

  // optional creation
  canCreate?: boolean; // default: true
  createLabel?: (name: string) => string;
  onCreate?: (name: string) => Promise<IdName>;
  isCreating?: boolean;
  autoFocus?: boolean;

  // behavior
  minChars?: number; // default 2
};

export function SearchPicker<TItem>({
  label,
  placeholder,

  query,
  onQueryChange,

  selected,
  onSelectedChange,

  items,
  isLoading = false,
  isError = false,
  emptyText = 'No matches.',

  getKey,
  getName,
  renderMeta,

  canCreate = true,
  createLabel,
  onCreate,
  isCreating = false,
  autoFocus = false,

  minChars = 2,
}: SearchPickerProps<TItem>) {
  const q = query.trim();
  const showDropdown = !selected && q.length >= minChars;

  const safeItems = useMemo(() => items ?? [], [items]);

  const showCreate =
    canCreate &&
    !!onCreate &&
    q.length >= minChars &&
    !isLoading &&
    !isError &&
    safeItems.length === 0;

  return (
    <label className={styles.wrap}>
      <span className={styles.label}>{label}</span>

      {selected ? (
        <div className={styles.selectedRow}>
          <div className={styles.selectedName}>{selected.name}</div>
          <Button
            className={styles.clearBtn}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelectedChange(null);
              onQueryChange('');
            }}
          >
            Clear
          </Button>
          <button
            type='button'
            className={styles.clearBtn}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelectedChange(null);
              onQueryChange('');
            }}
          >
            Clear
          </button>
        </div>
      ) : (
        <>
          <input
            className={styles.input}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={placeholder}
            autoFocus={autoFocus}
          />

          {showDropdown ? (
            <div
              className={styles.dropdown}
              onMouseDown={(e) => e.preventDefault()} // prevents blur weirdness
            >
              {isLoading ? (
                <div className={styles.state}>Searching…</div>
              ) : null}
              {isError ? (
                <div className={styles.state}>Failed to load.</div>
              ) : null}

              {!isLoading && !isError ? (
                <>
                  {safeItems.slice(0, 8).map((it) => {
                    const id = getKey(it);
                    const name = getName(it);
                    return (
                      <Button
                        variant='contained'
                        color='primary'
                        size='lg'
                        key={id}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onSelectedChange({ id, name });
                          onQueryChange(''); // optional: clear the input after select
                        }}
                      >
                        <div className={styles.optionName}>{name}</div>
                        {renderMeta ? (
                          <div className={styles.optionMeta}>
                            {renderMeta(it)}
                          </div>
                        ) : null}
                      </Button>
                    );
                  })}

                  {safeItems.length === 0 ? (
                    <div className={styles.state}>{emptyText}</div>
                  ) : null}

                  {showCreate ? (
                    <Button
                      variant='contained'
                      color='primary'
                      size='lg'
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const created = await onCreate(q);
                        onSelectedChange(created);
                        onQueryChange('');
                      }}
                      disabled={isCreating}
                    >
                      {isCreating
                        ? 'Creating…'
                        : createLabel
                          ? createLabel(q)
                          : `Create "${q}"`}
                    </Button>
                  ) : null}
                </>
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </label>
  );
}

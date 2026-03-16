import { useEffect, useRef, useState } from 'react';
import Button from '../../ui/Button/Button';
import Avatar from '../../ui/Avatar/Avatar';
import styles from './AccountMenu.module.scss';

import { LogOut } from 'lucide-react';

type AccountMenuProps = {
  name?: string | null;
  email?: string | null;
};

export default function AccountMenu({
  name = 'Thomas Woroniak',
  email,
}: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem('pp_token');
    window.location.href = '/login';
  }

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type='button'
        className={styles.trigger}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup='menu'
        aria-label='Open account menu'
      >
        <Avatar name={name} size='lg' />
      </button>

      {open ? (
        <div className={styles.menu} role='menu'>
          <div className={styles.menuHeader}>
            <Avatar name={name} size='md' />
            <div className={styles.menuIdentity}>
              <div className={styles.menuName}>{name}</div>
              {email ? <div className={styles.menuEmail}>{email}</div> : null}
            </div>
          </div>

          <div className={styles.menuSection}>
            <button type='button' className={styles.menuItem} role='menuitem'>
              Account
            </button>
            <button type='button' className={styles.menuItem} role='menuitem'>
              Settings
            </button>
            <button type='button' className={styles.menuItem} role='menuitem'>
              What’s new
            </button>
          </div>

          <div className={styles.menuFooter}>
            <Button
              variant='outline'
              color='primary'
              size='md'
              onClick={handleLogout}
            >
              Logout
              <LogOut size={14} />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

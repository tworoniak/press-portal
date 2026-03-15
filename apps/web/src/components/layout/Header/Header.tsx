import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Button from '../../ui/Button/Button';

import styles from './Header.module.scss';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', end: true },
  { to: '/contacts', label: 'Contacts' },
  { to: '/bands', label: 'Bands' },
  { to: '/festivals', label: 'Festivals' },
];

const Header = () => {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link to='/' className={styles.logo}>
          <span className={styles.logoText}>PressPilot</span>
        </Link>

        <nav className={styles.nav} aria-label='Primary navigation'>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
              onMouseEnter={() => setHoveredPath(item.to)}
              onMouseLeave={() =>
                setHoveredPath((current) =>
                  current === item.to ? null : current,
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className={styles.navLabel}>{item.label}</span>

                  <span className={styles.underlineWrap}>
                    <AnimatePresence>
                      {hoveredPath === item.to && !isActive && (
                        <motion.span
                          layoutId='hover-underline'
                          className={styles.underline}
                          initial={{ opacity: 0, scaleX: 0.85 }}
                          animate={{ opacity: 0.7, scaleX: 1 }}
                          exit={{ opacity: 0, scaleX: 0.85 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </AnimatePresence>

                    {isActive && (
                      <motion.span
                        layoutId='active-underline'
                        className={styles.underline}
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 35,
                        }}
                      />
                    )}
                  </span>
                </>
              )}
            </NavLink>
          ))}

          <Button
            variant='outline'
            color='primary'
            size='lg'
            onClick={() => {
              localStorage.removeItem('pp_token');
              window.location.href = '/login';
            }}
          >
            Logout
          </Button>
          {/* <button
            type='button'
            className={styles.logoutButton}
            onClick={() => {
              localStorage.removeItem('pp_token');
              window.location.href = '/login';
            }}
          >
            Logout
          </button> */}
        </nav>
      </div>
    </header>
  );
};

export default Header;

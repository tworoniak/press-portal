// import { useState } from 'react';
// import { Link, NavLink } from 'react-router-dom';
// import { AnimatePresence, motion } from 'framer-motion';
// import { Menu, X } from 'lucide-react';

// import Button from '../../ui/Button/Button';

// import styles from './Header.module.scss';

// const navItems = [
//   { to: '/dashboard', label: 'Dashboard', end: true },
//   { to: '/contacts', label: 'Contacts' },
//   { to: '/bands', label: 'Bands' },
//   { to: '/festivals', label: 'Festivals' },
// ];

// const Header = () => {
//   const [hoveredPath, setHoveredPath] = useState<string | null>(null);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   function handleLogout() {
//     localStorage.removeItem('pp_token');
//     window.location.href = '/login';
//   }

//   function closeMobileMenu() {
//     setMobileOpen(false);
//   }

//   return (
//     <header className={styles.header}>
//       <div className={styles.headerInner}>
//         <Link to='/' className={styles.logo} onClick={closeMobileMenu}>
//           <span className={styles.logoText}>PressPilot</span>
//         </Link>

//         {/* Desktop nav */}
//         <nav className={styles.nav} aria-label='Primary navigation'>
//           {navItems.map((item) => (
//             <NavLink
//               key={item.to}
//               to={item.to}
//               end={item.end}
//               className={({ isActive }) =>
//                 `${styles.navLink} ${isActive ? styles.active : ''}`
//               }
//               onMouseEnter={() => setHoveredPath(item.to)}
//               onMouseLeave={() =>
//                 setHoveredPath((current) =>
//                   current === item.to ? null : current,
//                 )
//               }
//             >
//               {({ isActive }) => (
//                 <>
//                   <span className={styles.navLabel}>{item.label}</span>

//                   <span className={styles.underlineWrap}>
//                     <AnimatePresence>
//                       {hoveredPath === item.to && !isActive && (
//                         <motion.span
//                           layoutId='hover-underline'
//                           className={styles.underline}
//                           initial={{ opacity: 0, scaleX: 0.85 }}
//                           animate={{ opacity: 0.7, scaleX: 1 }}
//                           exit={{ opacity: 0, scaleX: 0.85 }}
//                           transition={{ duration: 0.2 }}
//                         />
//                       )}
//                     </AnimatePresence>

//                     {isActive && (
//                       <motion.span
//                         layoutId='active-underline'
//                         className={styles.underline}
//                         transition={{
//                           type: 'spring',
//                           stiffness: 500,
//                           damping: 35,
//                         }}
//                       />
//                     )}
//                   </span>
//                 </>
//               )}
//             </NavLink>
//           ))}

//           <Button
//             variant='outline'
//             color='primary'
//             size='lg'
//             onClick={handleLogout}
//           >
//             Logout
//           </Button>
//         </nav>

//         {/* Mobile toggle */}
//         <button
//           type='button'
//           className={styles.mobileMenuButton}
//           onClick={() => setMobileOpen((prev) => !prev)}
//           aria-expanded={mobileOpen}
//           aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
//         >
//           {mobileOpen ? <X size={20} /> : <Menu size={20} />}
//         </button>
//       </div>

//       {/* Mobile nav */}
//       <AnimatePresence>
//         {mobileOpen && (
//           <motion.div
//             className={styles.mobileNav}
//             initial={{ opacity: 0, y: -8 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -8 }}
//             transition={{ duration: 0.18 }}
//           >
//             <nav
//               className={styles.mobileNavInner}
//               aria-label='Mobile navigation'
//             >
//               {navItems.map((item) => (
//                 <NavLink
//                   key={item.to}
//                   to={item.to}
//                   end={item.end}
//                   className={({ isActive }) =>
//                     `${styles.mobileNavLink} ${isActive ? styles.mobileActive : ''}`
//                   }
//                   onClick={closeMobileMenu}
//                 >
//                   {item.label}
//                 </NavLink>
//               ))}

//               <Button
//                 variant='outline'
//                 color='primary'
//                 size='lg'
//                 onClick={handleLogout}
//               >
//                 Logout
//               </Button>
//             </nav>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </header>
//   );
// };

// export default Header;

import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

import Button from '../../ui/Button/Button';
import AccountMenu from '../AccountMenu/AccountMenu';

import styles from './Header.module.scss';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', end: true },
  { to: '/contacts', label: 'Contacts' },
  { to: '/bands', label: 'Bands' },
  { to: '/festivals', label: 'Festivals' },
];

const Header = () => {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem('pp_token');
    window.location.href = '/login';
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link to='/' className={styles.logo} onClick={closeMobileMenu}>
          <span className={styles.logoText}>PressPilot</span>
        </Link>

        <div className={styles.rightSide}>
          {/* Desktop nav */}
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
          </nav>

          <div className={styles.desktopAccount}>
            <AccountMenu
              name='Thomas Woroniak'
              email='thomas@antiheromagazine.com'
            />
          </div>

          {/* Mobile toggle */}
          <button
            type='button'
            className={styles.mobileMenuButton}
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileNav}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <nav
              className={styles.mobileNavInner}
              aria-label='Mobile navigation'
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `${styles.mobileNavLink} ${isActive ? styles.mobileActive : ''}`
                  }
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </NavLink>
              ))}

              <Button
                variant='outline'
                color='primary'
                size='lg'
                onClick={handleLogout}
              >
                Logout
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

import { forwardRef } from 'react';
import styles from './Footer.module.scss';

const Footer = forwardRef<HTMLElement>((_, ref) => {
  return (
    <footer ref={ref} className={styles.footer}>
      <div className={styles.footerInner}>
        <p>
          PressPilot{' '}
          <span className={styles.mobileHidden}>
            — Organize your press contacts. Simplify your outreach.
          </span>
        </p>
        <p>&copy; {new Date().getFullYear()} Woroniak.dev</p>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;

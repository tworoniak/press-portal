import { forwardRef } from 'react';
// import { Music } from 'lucide-react';
import styles from './Footer.module.scss';

const Footer = forwardRef<HTMLElement>((_, ref) => {
  return (
    <footer ref={ref} className={styles.footer}>
      <div className={styles.footerInner}>
        <p>
          {/* <Music color='rgba(255, 255, 255, 0.65)' size={12} /> */}
          PressPilot
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

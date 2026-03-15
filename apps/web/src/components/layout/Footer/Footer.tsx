import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>
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
};

export default Footer;

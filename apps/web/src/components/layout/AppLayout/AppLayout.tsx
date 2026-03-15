import { useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import ScrollToTopButton from '../../../components/ui/ScrollToTop/ScrollToTopButton';
// import useBodyClassOnIntersect from '../../../hooks/useBodyClassOnIntersect';

import styles from './AppLayout.module.scss';

export default function AppLayout() {
  const footerRef = useRef<HTMLElement | null>(null);

  return (
    <>
      <Header />

      <main className={styles.main}>
        <Outlet />
      </main>

      <Footer ref={footerRef} />
      <ScrollToTopButton footerRef={footerRef} />
    </>
  );
}

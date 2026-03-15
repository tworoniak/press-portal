import type { RefObject } from 'react';
import styles from './ScrollToTopButton.module.scss';
import { useScrollPosition } from '../../../hooks/useScrollPosition';
import { useElementInView } from '../../../hooks/useElementInView';
import { ArrowUp } from 'lucide-react';

type ScrollToTopButtonProps = {
  footerRef?: RefObject<HTMLElement | null>;
};

const ScrollToTopButton = ({ footerRef }: ScrollToTopButtonProps) => {
  const isVisible = useScrollPosition(300);
  const isFooterVisible = useElementInView(footerRef);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={[
        styles.scrollToTop,
        isVisible ? styles.show : '',
        isFooterVisible ? styles.footerVisible : '',
      ].join(' ')}
      aria-label='Scroll to top'
    >
      <ArrowUp size={24} />
    </button>
  );
};

export default ScrollToTopButton;

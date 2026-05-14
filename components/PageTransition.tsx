'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [animClass, setAnimClass] = useState('animate-page-enter');
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      setAnimClass('');
      // Force reflow then re-add animation
      requestAnimationFrame(() => {
        setDisplayChildren(children);
        setAnimClass('animate-page-enter');
      });
    } else {
      setDisplayChildren(children);
    }
  }, [pathname, children]);

  return <div className={animClass}>{displayChildren}</div>;
}

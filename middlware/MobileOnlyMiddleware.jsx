import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function MobileOnlyMiddleware({ children }) {
  const router = useRouter();

  useEffect(() => {
    if (/^not-supported/i.test(router.asPath)) return;

    const mediaQuery = window.matchMedia('(max-width: 768px)');
    if (!mediaQuery.matches) {
      router.push('/not-supported');
    }
  }, [router.asPath]);

  return children;
}

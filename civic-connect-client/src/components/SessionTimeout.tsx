'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const TIMEOUT_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

export default function SessionTimeout() {
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timer);
      const token = Cookies.get('token');
      if (token) {
        timer = setTimeout(() => {
          Cookies.remove('token');
          alert('Your session has timed out after 10 minutes of inactivity. Please log in again.');
          router.push('/auth/login?reason=expired');
        }, TIMEOUT_DURATION);
      }
    };

    // Activity event listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [router]);

  return null;
}

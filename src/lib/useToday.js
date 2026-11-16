import { useEffect, useState } from 'react';
import { dayKey } from './dates';

// Re-renders the app when the date rolls over, which is what makes the checklist refresh daily.
export function useToday() {
  const [today, setToday] = useState(() => dayKey());
  useEffect(() => {
    const tick = () => setToday((prev) => {
      const now = dayKey();
      return now === prev ? prev : now;
    });
    const id = setInterval(tick, 30000);
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', tick);
    };
  }, []);
  return today;
}
